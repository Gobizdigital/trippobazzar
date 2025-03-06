import React, { useEffect, useState } from "react";
import { indianCitiesWithGST } from "./GSTSTATE";
import { useBooking } from "../../../context/BookingContext";
import { useSearch } from "../../../context/SearchContext";
import axios from "axios";
import { useWishlist } from "../../../context/WishListContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";

const GuestForm = () => {
  const { bookingDetails } = useBooking();
  const { searchData } = useSearch();
  const [loading, setLoading] = useState(false);
  const { userDetails } = useWishlist();
  const navigate = useNavigate();

  const [guestDetails, setGuestDetails] = useState({
    guests: Array.from({ length: searchData.guests }, () => ({
      fullName: "",
      dob: "",
      gender: "male",
      passportNumber: "",
      issuingCountry: "",
      passportExpiry: "",
      nationality: "",
    })),
    phone: "",
    email: "",
    gst: {
      state: "",
      gstNumber: "",
      address: "",
    },
  });

  const handleAddGuest = () => {
    setGuestDetails((prevState) => ({
      ...prevState,
      guests: [
        ...prevState.guests,
        {
          fullName: "",
          dob: "",
          gender: "",
          passportNumber: "",
          issuingCountry: "",
          passportExpiry: "",
          nationality: "",
        },
      ],
    }));
  };
  const handleRemoveGuest = (index) => {
    if (guestDetails.guests.length > searchData.guests) {
      setGuestDetails((prevState) => ({
        ...prevState,
        guests: prevState.guests.filter((_, i) => i !== index),
      }));
    } else {
      console.log(
        `Cannot remove guest, the minimum allowed is ${searchData.guests}`
      );
    }
  };

  const handleChange = (e, guestIndex = null, field = null) => {
    const { name, value } = e.target;

    if (guestIndex !== null && field !== null) {
      setGuestDetails((prevState) => {
        const updatedGuests = [...prevState.guests];
        updatedGuests[guestIndex][field] = value;
        return { ...prevState, guests: updatedGuests };
      });
    } else if (name.includes("gst")) {
      // Handle GST nested fields
      const [section, key] = name.split(".");
      setGuestDetails((prevState) => ({
        ...prevState,
        [section]: {
          ...prevState[section],
          [key]: value,
        },
      }));
    } else if (name === "phone" || name === "email") {
      // Handle phone or email fields
      setGuestDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const loadScript = (src) => {
    return new Promise((resolve) => {
      // Check if the script is already loaded
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve(true); // Resolve immediately if script is already loaded
        return;
      }

      // Dynamically load the script
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true); // Start loading

      // ✅ Secure API request (DOES NOT return totalPrice)
      const response = await axios.post(
        "https://trippo-bazzar-backend.vercel.app/api/package/verifyAmount",
        { ...bookingDetails, userId: userDetails._id }
      );

      const { order } = response.data; // ✅ Only get order ID, not totalPrice

      const updatedFormData = {
        GuestDetails: guestDetails.guests.map((guest) => ({
          GuestName: guest.fullName || "",
          DOB: guest.dob || "",
          Gender: guest.gender || "male",
          PassportNumber: guest.passportNumber || "",
          PassportIssuedCountry: guest.issuingCountry || "",
          PassportDateOfExpiry: guest.passportExpiry || "",
        })),
        BookedHotels: bookingDetails.selectedHotels.map((hotel) => ({
          adults: hotel.adults || 1,
          children: hotel.children || 0,
          childrenAgeUnder5: hotel.childrenAgeUnder5 || false,
          extraBed: hotel.extraBed || false,
          hotelName: hotel.hotelName || "",
          rooms: hotel.rooms || 1,
          hotelPhotoUrl: hotel.hotelPhotoUrl || [],
          hotelPrice: hotel.hotelPrice || 0,
          hotelRating: hotel.hotelRating || 0,
          hotelLocation: hotel.hotelLocation || "",
        })),
        PackageBooked: bookingDetails.Pack_id,
        PackageStartDate: searchData.startDate,
        PackageEndDate: searchData.endDate,
        TotalGuests: searchData.guests,
        ContactNumber: guestDetails.phone,
        ContactEmail: guestDetails.email,
        GSTNumber: guestDetails.gst.gstNumber,
        GSTAddress: guestDetails.gst.address,
        GSTCity: guestDetails.gst.state,
        PackageBookedStatus: "Booked",
        PackageBookedPaymentStatus: "Unpaid",
        RazorPayPaymentId: "",
      };

      // ✅ Call Razorpay without passing totalPrice
      await initializeRazorpay(order, updatedFormData);
    } catch (error) {
      console.error("Error verifying amount:", error.message);
      setLoading(false); // Stop loading if error occurs

      if (error.response) {
        console.error("Server Error:", error.response.data.message);
      } else {
        console.error("Unexpected Error:", error.message);
      }
    }
  };

  const initializeRazorpay = async (order, updatedFormData) => {
    window.scrollTo(0, 0);
    setLoading(true); // Start loading

    const success = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );
    if (!success) {
      console.error("Failed to load Razorpay script");
      setLoading(false);
      return;
    }

    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      order_id: order.id, // ✅ Only send order ID
      handler: async (response) => {
        try {
          // ✅ Send payment verification request (DOES NOT send totalPrice)
          const verifyResponse = await axios.post(
            "https://trippo-bazzar-backend.vercel.app/api/package/verifyPayment",
            {
              order_id: response.razorpay_order_id,
              payment_id: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              userId: userDetails._id,
              bookingData: updatedFormData, // ✅ Send backend-verified data
            }
          );

          if (verifyResponse.status === 201) {
            console.log("Payment verified & booking created");

            setTimeout(() => {
              setLoading(false);
              navigate("/paymentconfirm");
            }, 3000);
          }
        } catch (error) {
          console.error("Payment verification failed:", error.message);
          setLoading(false);
          navigate("/paymentfailed");
        }
      },
      theme: { color: "#F37254" },
      modal: {
        ondismiss: () => {
          console.warn("Payment popup closed by user.");
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
            navigate("/paymentfailed");
          }, 3000);
        },
      },
    });

    rzp.open();
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full p-0 font-poppins">
      {/* Left Side - Image */}
      <div className="w-full hidden md:flex md:w-[25%] md:h-[50vh] lg:h-[90vh] bg-login-image relative items-center bg-cover bg-center">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <img
          className="absolute top-[50%] right-0"
          src="src/assets/Polygon 1.png"
        />
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-[75%] px-6 md:px-12 pt-3 rounded-bl-xl mb-5 pb-5 bg-white h-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Confirm Details</h2>
          <button
            type="button"
            onClick={handleAddGuest}
            className="bg-transparent text-med-green border-[1.5px] text-sm gap-2 flex justify-center items-center border-black px-[12px] py-[1px] hover:scale-95 rounded-lg"
          >
            <span className="text-xl text-black">+ </span>Add Guests
          </button>
        </div>

        {guestDetails.guests.map((guest, index) => (
          <div key={index} className="mb-8  text-sm">
            <div className="text-sm  flex flex-col  gap-1 font-normal text-gray-500 mb-5">
              <p>Guest Details {index + 1}</p>
              <button
                className="bg-transparent text-red-600 w-40 border-[1.5px] text-sm gap-2 flex justify-center items-center border-black px-[12px] py-[1px] hover:scale-95 rounded"
                onClick={() => handleRemoveGuest(index)}
              >
                Remove Guest
              </button>
            </div>

            <form className="w-full">
              {/* Row 1 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    name="fullName"
                    value={guest.fullName}
                    onChange={(e) => handleChange(e, index, "fullName")}
                    className="w-full p-2 border-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                    placeholder="Full Name"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="date"
                    name="dob"
                    value={guest.dob}
                    onChange={(e) => handleChange(e, index, "dob")}
                    className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <select
                    name="gender"
                    value={guest.gender} // Ensure guest.gender is available
                    onChange={(e) => handleChange(e, index, "gender")} // Correctly passing gender field to handleChange
                    className="w-full p-2 text-gray-400 border-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    name="passportNumber"
                    value={guest.passportNumber}
                    onChange={(e) => handleChange(e, index, "passportNumber")}
                    className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                    placeholder="Passport Number"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    name="issuingCountry"
                    value={guest.issuingCountry}
                    onChange={(e) => handleChange(e, index, "issuingCountry")}
                    className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                    placeholder="Issuing Country"
                  />
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="date"
                    name="passportExpiry"
                    value={guest.passportExpiry}
                    onChange={(e) => handleChange(e, index, "passportExpiry")}
                    className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                    placeholder="Passport Expiry Date"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/3">
                  <select
                    name="nationality"
                    value={guest.nationality}
                    onChange={(e) => handleChange(e, index, "nationality")}
                    className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                  >
                    <option value="us">United States</option>
                    <option value="in">India</option>
                    <option value="uk">United Kingdom</option>
                  </select>
                </div>
              </div>
            </form>
          </div>
        ))}

        <div className="bg-slate-300 w-full h-[1px]"></div>

        {/* Contact Details */}
        <h2 className="text-xl font-bold my-5">Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <input
            type="tel"
            name="phone"
            value={guestDetails.phone}
            onChange={handleChange}
            pattern="[0-9]{10}"
            placeholder="Enter your mobile number"
            className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
            required
          />

          <input
            type="email"
            name="email"
            value={guestDetails.email}
            onChange={handleChange}
            placeholder="Email ID"
            className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
            required
          />
        </div>

        <div className="bg-slate-300 w-full h-[1px] mt-5"></div>

        {/* GST Details */}
        <h2 className="text-xl font-bold my-5">GST Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <select
            name="gst.state"
            value={guestDetails.gst.state}
            onChange={handleChange}
            className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
          >
            <option value="">State</option>
            {indianCitiesWithGST.flatMap((item, idx) => (
              <option key={idx} value={item.state}>
                {item.state}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="gst.gstNumber"
            value={guestDetails.gst.gstNumber}
            onChange={handleChange}
            placeholder="GST Number"
            className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
            required
          />
          <input
            type="text"
            name="gst.address"
            value={guestDetails.gst.address}
            onChange={handleChange}
            placeholder="Address"
            className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
            required
          />
        </div>

        <div className="bg-slate-300 w-full h-[1px] mt-5"></div>

        <h2 className="text-xl text-med-green flex justify-start gap-2 items-start font-bold my-5">
          Cancellation <span className="text-black">Policy</span>
        </h2>
        <button className="border-[.5px] text-[#27BFEA] text-[0.7rem] px-3 py-1 rounded-lg">
          Cancellation for your trip will be eligible till 24th March 2024
        </button>
        <p className="text-sm font-semibold my-3">
          You can cancel your international travel package up to 10 days before
          your scheduled departure date without incurring any fees.
        </p>
        <ol className="list-disc grid grid-cols-1 gap-2">
          <li className="text-sm">
            We offer a range of cancellation options to suit your needs,
            including flexible and standard policies.
          </li>
          <li className="text-sm">
            Depending on the package and circumstances, you may have the choice
            to modify or cancel your booking with minimal hassle.
          </li>
          <li className="text-sm">
            Our cancellation policies are transparent and clearly outlined
            during the booking process.
          </li>
        </ol>

        <h2 className="text-xl text-med-green flex justify-start gap-2 items-start font-bold my-5">
          Refund <span className="text-black">Policy</span>
        </h2>
        <button className="border-[.5px] text-[#27BFEA] text-[0.7rem] px-3 py-1 rounded-lg">
          Full refund for your trip will be eligible till 9th March 2024
        </button>

        <ol className="list-disc grid grid-cols-1 gap-2 mt-5">
          <li className="text-sm">
            <span className="font-semibold">Full refund:</span> Cancellations
            made within 4 days of booking.
          </li>
          <li className="text-sm">
            <span className="font-semibold">Partial refund:</span> Cancellations
            made between 8 days to 10 days before departure will be subject to a
            partial refund, with the exact amount depending on the timing of
            cancellation.
          </li>
          <li className="text-sm">
            <span className="font-semibold">Non-refundable:</span> Cancellations
            made after 10 days before departure are non-refundable.
          </li>
        </ol>
        <p className="text-sm text-med-green mt-5">
          Please note that specific refund amounts and deadlines may vary
          depending on the terms of your individual package. For further details
          or assistance, please contact our dedicated support team.
        </p>

        <div className="bg-slate-300 w-full h-[1px]"></div>

        {/* Confirm and Proceed Button */}
        <div className="w-full bg-white mt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-med-green text-white hover:scale-105 text-sm px-4 py-2 rounded-lg"
          >
            Confirm and Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
