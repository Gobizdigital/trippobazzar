"use client";

import { useState, useEffect } from "react";
import { indianCitiesWithGST } from "./GSTSTATE";
import { useBooking } from "../../../context/BookingContext";
import { useSearch } from "../../../context/SearchContext";
import axios from "axios";
import { useWishlist } from "../../../context/WishListContext";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import {
  FileText,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from "lucide-react";

const GuestForm = () => {
  const { bookingDetails } = useBooking();
  const RAZOR_KEY = import.meta.env.VITE_RAZOR_KEY_ID;
  const { searchData } = useSearch();
  const [loading, setLoading] = useState(false);
  const { userDetails } = useWishlist();
  const navigate = useNavigate();
  const [currentGuestIndex, setCurrentGuestIndex] = useState(0);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isDomesticPackage, setIsDomesticPackage] = useState(false);

  // Initialize guest details state
  const [guestDetails, setGuestDetails] = useState({
    guests: Array.from({ length: searchData.guests }, () => ({
      fullName: "",
      dob: "",
      gender: "male",
      idType: "passport", // Default ID type
      passportNumber: "",
      aadharNumber: "",
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

  // Determine if package is domestic or international
  useEffect(() => {
    // Check if the package is domestic based on some property in bookingDetails
    // This is a placeholder - you need to replace with your actual logic
    const checkIfDomestic = () => {
      // Example: Check if the package has a domestic flag or based on destination
      if (bookingDetails.IsDomesticPackage) {
        return true;
      }
      return false;
    };

    const isDomestic = checkIfDomestic();
    setIsDomesticPackage(isDomestic);

    // If domestic, we only need one guest's details regardless of the number of guests
    if (isDomestic && guestDetails.guests.length > 1) {
      setGuestDetails((prev) => ({
        ...prev,
        guests: [prev.guests[0]], // Keep only the first guest
      }));
    }
  }, [bookingDetails]);

  const handleIdTypeChange = (type, guestIndex) => {
    setGuestDetails((prevState) => {
      const updatedGuests = [...prevState.guests];

      // Set the ID type
      updatedGuests[guestIndex] = {
        ...updatedGuests[guestIndex],
        idType: type,
      };

      // If Aadhar Card is selected, automatically set nationality to Indian
      if (type === "aadhar") {
        updatedGuests[guestIndex].nationality = "in";
      }

      return { ...prevState, guests: updatedGuests };
    });
  };

  const handleAddGuest = () => {
    // Only allow adding guests for international packages
    if (!isDomesticPackage) {
      setGuestDetails((prevState) => ({
        ...prevState,
        guests: [
          ...prevState.guests,
          {
            fullName: "",
            dob: "",
            gender: "male",
            idType: "passport",
            passportNumber: "",
            aadharNumber: "",
            issuingCountry: "",
            passportExpiry: "",
            nationality: "",
          },
        ],
      }));
      // Move to the newly added guest
      setCurrentGuestIndex(guestDetails.guests.length);
    }
  };

  const handleRemoveGuest = (index) => {
    // Only allow removing guests for international packages
    if (!isDomesticPackage && guestDetails.guests.length > searchData.guests) {
      setGuestDetails((prevState) => ({
        ...prevState,
        guests: prevState.guests.filter((_, i) => i !== index),
      }));

      // Adjust current index if needed
      if (currentGuestIndex >= guestDetails.guests.length - 1) {
        setCurrentGuestIndex(guestDetails.guests.length - 2);
      } else if (currentGuestIndex === index) {
        setCurrentGuestIndex(Math.max(0, currentGuestIndex - 1));
      }
    } else {
      console.log(
        `Cannot remove guest, the minimum allowed is ${
          isDomesticPackage ? 1 : searchData.guests
        }`
      );
    }
  };

  const handleChange = (e, guestIndex = null, field = null) => {
    const { name, value } = e.target;

    // Clear error for this field when user starts typing
    if (
      errors[name] ||
      (guestIndex !== null && errors[`guest_${guestIndex}_${field}`])
    ) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        if (guestIndex !== null) {
          delete newErrors[`guest_${guestIndex}_${field}`];
        } else {
          delete newErrors[name];
        }
        return newErrors;
      });
    }

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

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // For domestic packages, only validate the first guest
    const guestsToValidate = isDomesticPackage
      ? [guestDetails.guests[0]]
      : guestDetails.guests;

    // Validate guests
    guestsToValidate.forEach((guest, index) => {
      if (!guest.fullName.trim()) {
        newErrors[`guest_${index}_fullName`] = "Full name is required";
        isValid = false;
      }

      if (!guest.dob) {
        newErrors[`guest_${index}_dob`] = "Date of birth is required";
        isValid = false;
      } else {
        // Check if DOB is valid (not in the future)
        const dobDate = new Date(guest.dob);
        const today = new Date();
        if (dobDate > today) {
          newErrors[`guest_${index}_dob`] =
            "Date of birth cannot be in the future";
          isValid = false;
        }
      }

      // Validate ID based on selected type
      if (guest.idType === "passport") {
        if (!guest.passportNumber) {
          newErrors[`guest_${index}_passportNumber`] =
            "Passport number is required";
          isValid = false;
        }

        if (!guest.issuingCountry) {
          newErrors[`guest_${index}_issuingCountry`] =
            "Issuing country is required";
          isValid = false;
        }

        if (!guest.passportExpiry) {
          newErrors[`guest_${index}_passportExpiry`] =
            "Passport expiry date is required";
          isValid = false;
        } else {
          // Check if passport expiry is valid (not in the past)
          const expiryDate = new Date(guest.passportExpiry);
          const today = new Date();
          if (expiryDate < today) {
            newErrors[`guest_${index}_passportExpiry`] =
              "Passport expiry date cannot be in the past";
            isValid = false;
          }
        }
      } else if (guest.idType === "aadhar") {
        if (!guest.aadharNumber) {
          newErrors[`guest_${index}_aadharNumber`] =
            "Aadhar number is required";
          isValid = false;
        } else if (!/^\d{12}$/.test(guest.aadharNumber)) {
          newErrors[`guest_${index}_aadharNumber`] =
            "Aadhar number must be 12 digits";
          isValid = false;
        }
      }
    });

    // Validate contact details
    if (!guestDetails.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!/^\d{10}$/.test(guestDetails.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
      isValid = false;
    }

    if (!guestDetails.email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(guestDetails.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Modified GST validation logic
    // Only validate GST number format if a state is selected
    if (guestDetails.gst.state) {
      // If state is selected, GST number is required
      if (!guestDetails.gst.gstNumber) {
        newErrors["gst.gstNumber"] =
          "GST number is required when state is selected";
        isValid = false;
      } else if (
        !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(
          guestDetails.gst.gstNumber
        )
      ) {
        newErrors["gst.gstNumber"] = "Invalid GST number format";
        isValid = false;
      }

      // If state is selected, address is required
      if (!guestDetails.gst.address) {
        newErrors["gst.address"] = "Address is required when state is selected";
        isValid = false;
      }
    } else {
      // If no state is selected, but GST number or address is provided
      if (guestDetails.gst.gstNumber || guestDetails.gst.address) {
        newErrors["gst.state"] = "State is required for GST details";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
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
    setFormSubmitted(true);

    if (!validateForm()) {
      // Find the first guest with errors and navigate to them
      for (let i = 0; i < guestDetails.guests.length; i++) {
        const guestHasError = Object.keys(errors).some((key) =>
          key.startsWith(`guest_${i}_`)
        );
        if (guestHasError) {
          setCurrentGuestIndex(i);
          break;
        }
      }
      return;
    }

    try {
      setLoading(true); // Start loading

      // ✅ Secure API request (DOES NOT return totalPrice)
      const response = await axios.post(
        "https://trippo-bazzar-backend.vercel.app/api/package/verifyAmount",
        {
          ...bookingDetails,
          userId: userDetails._id,
        }
      );

      const { order } = response.data; // ✅ Only get order ID, not totalPrice

      // For domestic packages, we only use the first guest's details
      const guestsToSubmit = isDomesticPackage
        ? [guestDetails.guests[0]]
        : guestDetails.guests;

      const updatedFormData = {
        GuestDetails: guestsToSubmit.map((guest) => ({
          GuestName: guest.fullName || "",
          DOB: guest.dob || "",
          Gender: guest.gender || "male",
          PassportNumber:
            guest.idType === "passport" ? guest.passportNumber || "" : "",
          AadharNumber:
            guest.idType === "aadhar" ? guest.aadharNumber || "" : "",
          PassportIssuedCountry:
            guest.idType === "passport" ? guest.issuingCountry || "" : "",
          PassportDateOfExpiry:
            guest.idType === "passport" ? guest.passportExpiry || "" : "",
          IdType: guest.idType || "passport",
          Nationality: guest.nationality || "",
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
        CouponDetails: bookingDetails.coupon || null,
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
        IsDomesticPackage: bookingDetails.isDomesticPackage,
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
      key: RAZOR_KEY,
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
              couponId: bookingDetails.coupon?.id || null, //
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

  const handleNextGuest = () => {
    // Validate current guest before proceeding
    const currentGuest = guestDetails.guests[currentGuestIndex];
    const currentGuestErrors = {};

    if (!currentGuest.fullName.trim()) {
      currentGuestErrors[`guest_${currentGuestIndex}_fullName`] =
        "Full name is required";
    }

    if (!currentGuest.dob) {
      currentGuestErrors[`guest_${currentGuestIndex}_dob`] =
        "Date of birth is required";
    }

    if (Object.keys(currentGuestErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...currentGuestErrors }));
      return;
    }

    if (currentGuestIndex < guestDetails.guests.length - 1) {
      setCurrentGuestIndex(currentGuestIndex + 1);
    }
  };

  const handlePrevGuest = () => {
    if (currentGuestIndex > 0) {
      setCurrentGuestIndex(currentGuestIndex - 1);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-col md:flex-row h-full p-0 font-poppins">
      {/* Left Side - Progress Sidebar */}
      <div className="w-full hidden md:block md:w-[25%] md:h-[50vh] lg:h-[90vh] bg-login-image relative bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/40"></div>
        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="relative z-10 px-8">
            {/* Progress Steps */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-4 top-0 w-[2px] h-full bg-white/20 rounded-full"></div>

              {/* Steps */}
              <div className="space-y-16">
                {/* Step 1 */}
                <div className="flex items-center relative">
                  <div className="w-10 h-10 rounded-full bg-white shadow-lg shadow-white/20 flex items-center justify-center font-semibold z-10">
                    <span className="text-blue-700">1</span>
                  </div>
                  <div className="ml-6">
                    <p className="font-medium text-white tracking-wide">
                      STEP 1
                    </p>
                    <p className="text-sm text-white/80">Select Itinerary</p>
                  </div>
                  <div className="absolute left-4 top-10 h-16 w-[2px] bg-white/20 -z-0"></div>
                </div>

                {/* Step 2 */}
                <div className="flex items-center relative">
                  <div className="w-10 h-10 rounded-full bg-green-500 shadow-lg shadow-green-500/30 flex items-center justify-center font-semibold z-10">
                    <span className="text-white">2</span>
                  </div>
                  <div className="ml-6">
                    <p className="font-medium text-white tracking-wide">
                      STEP 2
                    </p>
                    <p className="text-sm text-white/80">Confirm Details</p>
                  </div>
                  <div className="absolute left-4 top-10 h-16 w-[2px] bg-white/20 -z-0"></div>
                </div>

                {/* Step 3 */}
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center font-semibold z-10">
                    <span className="text-white">3</span>
                  </div>
                  <div className="ml-6">
                    <p className="font-medium text-white tracking-wide">
                      STEP 3
                    </p>
                    <p className="text-sm text-white/80">Payment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info */}
            <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
              <h3 className="text-white font-medium mb-2">Trip Summary</h3>
              <p className="text-sm text-white/80">
                Complete your booking to secure your adventure!
              </p>
              {isDomesticPackage && (
                <div className="mt-2 bg-green-500/20 p-2 rounded border border-green-500/30">
                  <p className="text-white text-xs">
                    Domestic Package: Only primary guest details required
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-[75%] px-6 md:px-12 pt-3 rounded-bl-xl mb-5 pb-5 bg-white h-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Confirm Details</h2>

          {/* Package type indicator */}
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {isDomesticPackage ? "Domestic Package" : "International Package"}
          </div>

          {/* Only show guest navigation for international packages */}
          {!isDomesticPackage && (
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-500">
                Guest {currentGuestIndex + 1} of {guestDetails.guests.length}
              </div>
              <button
                type="button"
                onClick={handleAddGuest}
                className="bg-transparent text-green-600 border-[1.5px] text-sm gap-2 flex justify-center items-center border-black px-[12px] py-[1px] hover:scale-95 rounded-lg"
              >
                <Plus className="w-4 h-4" /> Add Guest
              </button>
            </div>
          )}
        </div>

        {/* Guest Pagination Controls - Only show for international packages */}
        {!isDomesticPackage && guestDetails.guests.length > 1 && (
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePrevGuest}
              disabled={currentGuestIndex === 0}
              className={`px-4 py-2 rounded flex items-center ${
                currentGuestIndex === 0
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </button>

            <div className="flex space-x-1">
              {guestDetails.guests.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentGuestIndex(idx)}
                  className={`w-8 h-8 rounded-full ${
                    currentGuestIndex === idx
                      ? "bg-green-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextGuest}
              disabled={currentGuestIndex === guestDetails.guests.length - 1}
              className={`px-4 py-2 rounded flex items-center ${
                currentGuestIndex === guestDetails.guests.length - 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`}
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        )}

        {/* Current Guest Form */}
        <div className="mb-8 text-sm">
          <div className="text-sm flex flex-col gap-1 font-normal text-gray-500 mb-5">
            <p>
              {isDomesticPackage
                ? "Primary Guest Details (for all travelers)"
                : `Guest Details ${currentGuestIndex + 1}`}
            </p>
            {!isDomesticPackage &&
              guestDetails.guests.length > searchData.guests && (
                <button
                  className="bg-transparent text-red-600 w-40 border-[1.5px] text-sm gap-2 flex justify-center items-center border-black px-[12px] py-[1px] hover:scale-95 rounded"
                  onClick={() => handleRemoveGuest(currentGuestIndex)}
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Remove Guest
                </button>
              )}
          </div>

          <form className="w-full">
            {/* Row 1 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/3">
                <input
                  type="text"
                  name="fullName"
                  value={guestDetails.guests[currentGuestIndex].fullName}
                  onChange={(e) =>
                    handleChange(e, currentGuestIndex, "fullName")
                  }
                  className={`w-full p-2 border-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                    errors[`guest_${currentGuestIndex}_fullName`]
                      ? "border-red-500"
                      : ""
                  }`}
                  placeholder="Full Name"
                />
                {errors[`guest_${currentGuestIndex}_fullName`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`guest_${currentGuestIndex}_fullName`]}
                  </p>
                )}
              </div>
              <div className="w-full sm:w-1/3">
                <input
                  type="date"
                  name="dob"
                  value={guestDetails.guests[currentGuestIndex].dob}
                  onChange={(e) => handleChange(e, currentGuestIndex, "dob")}
                  className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                    errors[`guest_${currentGuestIndex}_dob`]
                      ? "border-red-500"
                      : ""
                  }`}
                />
                {errors[`guest_${currentGuestIndex}_dob`] && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors[`guest_${currentGuestIndex}_dob`]}
                  </p>
                )}
              </div>
              <div className="w-full sm:w-1/3">
                <select
                  name="gender"
                  value={guestDetails.guests[currentGuestIndex].gender}
                  onChange={(e) => handleChange(e, currentGuestIndex, "gender")}
                  className="w-full p-2 text-gray-400 border-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* ID Type Selection */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">ID Type</p>
              <div className="flex space-x-4 mb-2">
                <button
                  type="button"
                  onClick={() =>
                    handleIdTypeChange("passport", currentGuestIndex)
                  }
                  className={`flex items-center px-4 py-2 rounded-lg text-sm ${
                    guestDetails.guests[currentGuestIndex].idType === "passport"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Passport
                </button>
                {isDomesticPackage && (
                  <button
                    type="button"
                    onClick={() =>
                      handleIdTypeChange("aadhar", currentGuestIndex)
                    }
                    className={`flex items-center px-4 py-2 rounded-lg text-sm ${
                      guestDetails.guests[currentGuestIndex].idType === "aadhar"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Aadhar Card
                  </button>
                )}
              </div>

              {guestDetails.guests[currentGuestIndex].idType === "aadhar" && (
                <div className="bg-green-50 border-l-4 border-green-500 p-2 text-sm text-green-700">
                  Nationality will be automatically set to Indian for Aadhar
                  Card holders.
                </div>
              )}
            </div>

            {/* Conditional ID Fields */}
            {guestDetails.guests[currentGuestIndex].idType === "passport" ? (
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    name="passportNumber"
                    value={
                      guestDetails.guests[currentGuestIndex].passportNumber
                    }
                    onChange={(e) =>
                      handleChange(e, currentGuestIndex, "passportNumber")
                    }
                    className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                      errors[`guest_${currentGuestIndex}_passportNumber`]
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Passport Number"
                  />
                  {errors[`guest_${currentGuestIndex}_passportNumber`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`guest_${currentGuestIndex}_passportNumber`]}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    name="issuingCountry"
                    value={
                      guestDetails.guests[currentGuestIndex].issuingCountry
                    }
                    onChange={(e) =>
                      handleChange(e, currentGuestIndex, "issuingCountry")
                    }
                    className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                      errors[`guest_${currentGuestIndex}_issuingCountry`]
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Issuing Country"
                  />
                  {errors[`guest_${currentGuestIndex}_issuingCountry`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`guest_${currentGuestIndex}_issuingCountry`]}
                    </p>
                  )}
                </div>
                <div className="w-full sm:w-1/3">
                  <input
                    type="date"
                    name="passportExpiry"
                    value={
                      guestDetails.guests[currentGuestIndex].passportExpiry
                    }
                    onChange={(e) =>
                      handleChange(e, currentGuestIndex, "passportExpiry")
                    }
                    className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                      errors[`guest_${currentGuestIndex}_passportExpiry`]
                        ? "border-red-500"
                        : ""
                    }`}
                    placeholder="Passport Expiry Date"
                  />
                  {errors[`guest_${currentGuestIndex}_passportExpiry`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`guest_${currentGuestIndex}_passportExpiry`]}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <div className="w-full sm:w-1/3">
                  <input
                    type="text"
                    name="aadharNumber"
                    value={guestDetails.guests[currentGuestIndex].aadharNumber}
                    onChange={(e) =>
                      handleChange(e, currentGuestIndex, "aadharNumber")
                    }
                    placeholder="Aadhar Card Number"
                    maxLength="12"
                    className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                      errors[`guest_${currentGuestIndex}_aadharNumber`]
                        ? "border-red-500"
                        : ""
                    }`}
                  />
                  {errors[`guest_${currentGuestIndex}_aadharNumber`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`guest_${currentGuestIndex}_aadharNumber`]}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Row 3 */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/3">
                <select
                  name="nationality"
                  value={guestDetails.guests[currentGuestIndex].nationality}
                  onChange={(e) =>
                    handleChange(e, currentGuestIndex, "nationality")
                  }
                  disabled={
                    guestDetails.guests[currentGuestIndex].idType === "aadhar"
                  }
                  className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                    guestDetails.guests[currentGuestIndex].idType === "aadhar"
                      ? "bg-gray-100"
                      : ""
                  }`}
                >
                  <option value="">Select Nationality</option>
                  <option value="us">United States</option>
                  <option value="in">India</option>
                  <option value="uk">United Kingdom</option>
                  <option value="ca">Canada</option>
                  <option value="au">Australia</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        <div className="bg-slate-300 w-full h-[1px]"></div>

        {/* Contact Details */}
        <h2 className="text-xl font-bold my-5">Contact Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div>
            <input
              type="tel"
              name="phone"
              value={guestDetails.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              placeholder="Enter your mobile number"
              className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                errors.phone ? "border-red-500" : ""
              }`}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={guestDetails.email}
              onChange={handleChange}
              placeholder="Email ID"
              className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                errors.email ? "border-red-500" : ""
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
        </div>

        <div className="bg-slate-300 w-full h-[1px] mt-5"></div>

        {/* GST Details */}
        <h2 className="text-xl font-bold my-5">GST Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
          <div>
            <select
              name="gst.state"
              value={guestDetails.gst.state}
              onChange={handleChange}
              className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                errors["gst.state"] ? "border-red-500" : ""
              }`}
            >
              <option value="">State</option>
              {indianCitiesWithGST.flatMap((item, idx) => (
                <option key={idx} value={item.state}>
                  {item.state}
                </option>
              ))}
            </select>
            {errors["gst.state"] && (
              <p className="text-red-500 text-xs mt-1">{errors["gst.state"]}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="gst.gstNumber"
              value={guestDetails.gst.gstNumber}
              onChange={handleChange}
              placeholder="GST Number"
              className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                errors["gst.gstNumber"] ? "border-red-500" : ""
              }`}
            />
            {errors["gst.gstNumber"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["gst.gstNumber"]}
              </p>
            )}
          </div>

          <div>
            <input
              type="text"
              name="gst.address"
              value={guestDetails.gst.address}
              onChange={handleChange}
              placeholder="Address"
              className={`w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px] ${
                errors["gst.address"] ? "border-red-500" : ""
              }`}
            />
            {errors["gst.address"] && (
              <p className="text-red-500 text-xs mt-1">
                {errors["gst.address"]}
              </p>
            )}
          </div>
        </div>

        <div className="bg-slate-300 w-full h-[1px] mt-5"></div>

        {/* Package Type Information */}
        {isDomesticPackage && (
          <div className="my-5 bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              Domestic Package Information
            </h3>
            <p className="text-sm text-blue-600">
              For domestic packages, we only require details of the primary
              guest. These details will be used for all travelers in your group.
            </p>
          </div>
        )}

        {!isDomesticPackage && (
          <div className="my-5 bg-amber-50 p-4 rounded-lg border border-amber-200">
            <h3 className="text-lg font-semibold text-amber-700 mb-2">
              International Package Information
            </h3>
            <p className="text-sm text-amber-600">
              For international packages, we require individual details for each
              traveler. Please ensure all passport information is accurate and
              matches official documents.
            </p>
          </div>
        )}

        <h2 className="text-xl text-green-600 flex justify-start gap-2 items-start font-bold my-5">
          Cancellation <span className="text-black">Policy</span>
        </h2>
        <button className="border-[.5px] text-[#27BFEA] text-[0.7rem] px-3 py-1 rounded-lg">
          Cancellation for your trip will be eligible till 24th March 2024
        </button>
        <p className="text-sm font-semibold my-3">
          You can cancel your {isDomesticPackage ? "domestic" : "international"}{" "}
          travel package up to {isDomesticPackage ? "7" : "10"} days before your
          scheduled departure date without incurring any fees.
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

        <h2 className="text-xl text-green-600 flex justify-start gap-2 items-start font-bold my-5">
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
            made between {isDomesticPackage ? "5" : "8"} days to{" "}
            {isDomesticPackage ? "7" : "10"} days before departure will be
            subject to a partial refund, with the exact amount depending on the
            timing of cancellation.
          </li>
          <li className="text-sm">
            <span className="font-semibold">Non-refundable:</span> Cancellations
            made after {isDomesticPackage ? "7" : "10"} days before departure
            are non-refundable.
          </li>
        </ol>
        <p className="text-sm text-green-600 mt-5">
          Please note that specific refund amounts and deadlines may vary
          depending on the terms of your individual package. For further details
          or assistance, please contact our dedicated support team.
        </p>

        <div className="bg-slate-300 w-full h-[1px]"></div>

        {/* Confirm and Proceed Button */}
        <div className="w-full bg-white mt-5 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white hover:scale-105 text-sm px-4 py-2 rounded-lg"
          >
            Confirm and Proceed
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestForm;
