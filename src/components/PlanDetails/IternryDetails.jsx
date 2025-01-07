import React, { useEffect, useState } from "react";
import { useSearch } from "../../../context/SearchContext";
import { useWishlist } from "../../../context/WishListContext";
import { IoIosArrowDown } from "react-icons/io";
import CouponSvg from "../../../svgs/CouponSvg";
import Policies from "./Policies";
import HotelsPlan from "./HotelsPlan";
import CarosalImageModal from "../../../utils/CarosalImageModal";
import { useParams } from "react-router-dom";
import axios from "axios";

function IternryDetails({ data }) {
  const { id: pkdid } = useParams();
  const { searchData } = useSearch();
  const { userDetails } = useWishlist();
  const [activeTab, setActiveTab] = useState("Plan Details");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fadeState, setFadeState] = useState("fadeIn");
  const [imgmodal, setImgModal] = useState({
    isOpen: false,
    img: [],
  });
  const [selectedHotel, setSelectedHotel] = useState([]);
  const [customizeHotel, setCustomizeHotel] = useState({
    rooms: 1,
    adults: 1,
    children: 0,
    extraBed: false,
    childrenAgeUnder5: false,
  });
  const [selectedCoupon, setSelectedCoupon] = useState({
    id: "",
    discountPercentage: 0,
    maxDiscount: 0,
  });
  const [bookData, setBookData] = useState({
    selectedHotels: [],
    Pack_id: pkdid,
    guests: searchData.guests,
    coupon: "",
    BookingAmount: "",
  });

  const toggleDropdown = (id) => {
    if (selectedHotel.length > 0) {
      setIsDropdownOpen((prevId) => (prevId === id ? null : id));
    }
  };

  const handleCoupon = (coupon) => {
    setSelectedCoupon(
      (prevSelected) =>
        prevSelected.id === coupon.id
          ? { id: "", discountPercentage: 0, maxDiscount: 0 } // Reset if already selected
          : {
              id: coupon._id,
              discountPercentage: Number(coupon.discountPercentage),
              maxDiscount: Number(coupon.maxDiscount),
            } // Set new coupon
    );
  };

  const handleHotelArray = (hotel, hdetail) => {
    const isHotelSelected = selectedHotel.some(
      (item) => item._id === hdetail._id
    );

    const isLocationSelected = selectedHotel.some(
      (item) => item.location === hotel.location
    );

    if (isHotelSelected) {
      setSelectedHotel((prevSelected) =>
        prevSelected.filter((item) => item._id !== hdetail._id)
      );
    } else {
      if (!isLocationSelected) {
        setSelectedHotel((prevSelected) => [
          ...prevSelected,
          {
            ...hdetail,
            room: customizeHotel.rooms,
            adults: customizeHotel.adults,
            children: customizeHotel.children,
            extraBed: customizeHotel.extraBed,
            childrenAgeUnder5: customizeHotel.childrenAgeUnder5,
            location: hotel.location,
            hotelPrice: hdetail.hotelPrice * customizeHotel.rooms,
          },
        ]);
      } else {
        alert(`You can only select one hotel per location!`);
      }
    }
  };

  const handleHotelChangeInput = (e) => {
    e.stopPropagation();
    const { name, value } = e.target;

    setCustomizeHotel((prev) => ({
      ...prev,
      [name]: Math.max(name === "children" ? 0 : 1, value), // Ensure at least 0 for children and 1 for others
    }));
  };

  const handleRoomChange = (
    hdetail,
    newRoomCount,
    newAdultsCount,
    newChildrenCount,
    newExtraBed,
    newUnderAge5
  ) => {
    setSelectedHotel((prevSelected) =>
      prevSelected.map((item) =>
        item._id === hdetail._id
          ? {
              ...item,
              room: newRoomCount,
              adults: newAdultsCount,
              children: newChildrenCount,
              extraBed: newExtraBed,
              childrenAgeUnder5: newUnderAge5,
              hotelPrice: (() => {
                let price = hdetail.hotelPrice * newRoomCount;

                if (newAdultsCount > 1) {
                  price +=
                    (newAdultsCount - 1) *
                    hdetail.hotelPrice *
                    0.85 *
                    newRoomCount;
                }

                // Add price for children if newChildrenCount > 0
                if (newChildrenCount > 0) {
                  if (
                    newChildrenCount > 0 &&
                    !customizeHotel.childrenAgeUnder5 &&
                    !customizeHotel.extraBed
                  ) {
                    price += newChildrenCount * hdetail.hotelPrice * 0.5; // Charge for children
                  } else if (
                    newChildrenCount > 0 &&
                    !customizeHotel.childrenAgeUnder5 &&
                    customizeHotel.extraBed
                  ) {
                    price += newChildrenCount * hdetail.hotelPrice * 0.75;
                  } else {
                    console.log("Children under 5 are complimentary.");
                  }
                }

                return price;
              })(), // Calculate hotelPrice based on the conditions
            }
          : item
      )
    );
  };

  const handleApplyClick = (hdetail) => {
    handleRoomChange(
      hdetail,
      customizeHotel.rooms,
      customizeHotel.adults,
      customizeHotel.children,
      customizeHotel.extraBed,
      customizeHotel.childrenAgeUnder5
    );
    setIsDropdownOpen(null);
    // setCustomizeHotel({
    //   rooms: 1,
    //   adults: 1,
    //   children: 0,
    // });
  };

  const handleTabChange = (tab) => {
    setFadeState("fadeOut");
    setTimeout(() => {
      setActiveTab(tab);
      setFadeState("fadeIn");
    }, 100); // Matches the animation duration
  };

  const calculateDiscountedPrice = () => {
    // Calculate the total cost for the selected hotels
    const totalHotelPrice = selectedHotel.reduce((total, hotel) => {
      return total + (hotel.hotelPrice || 0); // Add hotelPrice of selected hotels, default to 0 if not available
    }, 0);

    // Include the main price calculation
    const mainPrice = data?.price * searchData.guests;

    // Add the total of selected hotel prices to the main price
    const totalCost = mainPrice + totalHotelPrice;

    // Apply coupon if available
    if (!selectedCoupon.id) return totalCost;

    const discount = Math.min(
      (totalCost * selectedCoupon.discountPercentage) / 100,
      selectedCoupon.maxDiscount
    );

    return totalCost - discount;
  };

  const openModal = (images) => {
    setImgModal((prev) => ({ ...prev, isOpen: true, img: images }));
  };
  const closeModal = () => {
    setImgModal((prev) => ({ ...prev, isOpen: false, img: [] }));
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
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
      // Prepare the data for API call
      const requestData = {
        selectedHotels: [...selectedHotel],
        Pack_id: pkdid,
        guests: searchData.guests,
        coupon: selectedCoupon,
      };
      console.log("this is requestdata", requestData);

      // Make the API call to verify the amount
      const response = await axios.post(
        "https://tripobazar-backend.vercel.app/api/package/verifyAmount",
        requestData
      );

      console.log(response.data);
      // Extract total price from response
      const { totalPrice } = response.data;
      const { order } = response.data;

      console.log("Verified Total Price:", totalPrice);

      // Update the bookData state with the verified total price
      setBookData((prev) => ({
        ...prev,
        selectedHotels: [...prev.selectedHotels, ...selectedHotel],
        guests: searchData.guests,
        coupon: selectedCoupon,
        BookingAmount: totalPrice, // Store the verified total price in the state
      }));

      const success = await loadScript(
        "https://checkout.razorpay.com/v1/checkout.js"
      );
      if (!success) {
        console.error("Failed to load Razorpay script");
        return;
      }

      const rzp = new window.Razorpay({
        key: import.meta.env.RAZOR_KEY_ID,
        amount: totalPrice * 100,
        order_id: order.id,
        handler: async (response) => {
          const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            response;

          const details = {
            order_id: razorpay_order_id,
            payment_id: razorpay_payment_id,
            signature: razorpay_signature,
          };

          try {
            const paymentResponse = await axios.post(
              "https://tripobazar-backend.vercel.app/api/package/verifyPayment",
              details
            );

            if (paymentResponse.status === 200) {
              console.log(
                "Payment verified successfully",
                paymentResponse.data.message
              );
              // Handle success, maybe update the UI or navigate to another page
            }
          } catch (error) {
            if (error.response) {
              console.error(
                "Payment verification failed:",
                error.response.data.message
              );
            } else {
              console.error(
                "An error occurred during payment verification",
                error.message
              );
            }
          }
        },
        theme: {
          color: "#F37254",
        },
      });

      rzp.open();
    } catch (error) {
      console.error("Error verifying amount:", error.message);

      // Handle error response
      if (error.response) {
        console.error("Server Error:", error.response.data.message);
      } else {
        console.error("Unexpected Error:", error.message);
      }
    }
  };

  useEffect(() => {}, [customizeHotel]);

  return (
    <div className="w-full md:w-[90%] mx-auto bg-white flex flex-col lg:flex-row font-poppins">
      {/* Left Side */}
      <div className="w-full lg:w-4/5 p-4 ">
        {/* Navigation */}
        <nav className="flex w-full gap-4 em:gap-10 border-[.5px] px-4 em:px-0 scrollbar-hide overflow-x-auto rounded-lg justify-start em:justify-center py-4 whitespace-nowrap  mb-4 text-center text-sm sm:text-base">
          {["Plan Details", "Hotel", "SightSeeing", "Policies"].map(
            (tab, tabIdx) => (
              <li
                key={tabIdx}
                className={`cursor-pointer  list-none  ${
                  activeTab === tab ? "text-green-500 font-semibold" : ""
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
              </li>
            )
          )}
        </nav>

        {/* Dynamic Content */}
        <div
          className={
            fadeState === "fadeIn" ? "animate-fadeIn" : "animate-fadeOut"
          }
        >
          {activeTab === "Plan Details" && (
            <div className="space-y-6   ">
              {data?.dayDescription?.map((day, dayIdx) => (
                <div
                  className="border-[.5px] px-4 py-4 rounded-lg"
                  key={dayIdx} // Use a unique field or fallback to the index
                >
                  <h3 className="text-base md:text-lg leading-6 md:leading-3 font-bold">
                    {day.dayTitle}
                  </h3>
                  <div className="border-t mt-3 mb-4"></div>
                  <div>
                    {/* Grid for sm and above */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 mb-4 gap-2">
                      {day?.photos?.map((img, photoidx) => (
                        <img
                          key={`${img}-${photoidx}`} // Combine img and index for uniqueness
                          src="/src/assets/oneContinent.png"
                          alt={`Day ${dayIdx + 1} img ${photoidx + 1}`}
                          className="rounded-md w-full"
                        />
                      ))}
                    </div>
                  </div>

                  {day?.dayDetails?.split("\n").map((line, idx) => (
                    <span className="sm:text-base text-sm " key={idx}>
                      {line}
                      <br />
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === "Hotel" && (
            <HotelsPlan
              customizeHotel={customizeHotel}
              handleDropdownClick={handleDropdownClick}
              toggleDropdown={toggleDropdown}
              openModal={openModal}
              handleHotelArray={handleHotelArray}
              selectedHotel={selectedHotel}
              data={data}
              setCustomizeHotel={setCustomizeHotel}
              isDropdownOpen={isDropdownOpen}
              handleApplyClick={handleApplyClick}
              handleHotelChangeInput={handleHotelChangeInput}
            />
          )}

          {activeTab === "SightSeeing" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[...Array(4)].map((_, index) => (
                <img
                  key={index}
                  src="/src/assets/oneContinent.png"
                  alt={`Hotel ${index + 1}`}
                  className="rounded-md sm:mr-4"
                />
              ))}
            </div>
          )}

          {activeTab === "Policies" && <Policies data={data?.policies} />}
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full  lg:w-1/3  p-4 space-y-4">
        {/* Payment Details */}
        <div className="border p-6 rounded-3xl relative text-sm sm:text-base">
          <p
            className={`absolute top-0 right-0 ${
              selectedCoupon.id ? "opacity-100" : "opacity-0"
            } bg-green-500 text-white px-4 py-3 rounded-bl-lg rounded-tr-lg`}
          >
            {userDetails?.Coupons.map((item) =>
              item._id === selectedCoupon.id ? item.discountPercentage : ""
            )}
            % OFF
          </p>
          <p className="font-semibold text-lg mt-7">Payment Details</p>
          <p className="line-through text-gray-400">
            {data?.price ? data.price * searchData.guests * 1.25 : "N/A"}
          </p>
          <p className="text-med-green font-semibold">
            {data?.price
              ? searchData.guests === 1
                ? `₹ ${calculateDiscountedPrice()} /- per person`
                : `₹ ${calculateDiscountedPrice()} /- total pack price`
              : "N/A"}
          </p>

          <p className="border rounded-xl mb-3 text-blue-500 flex justify-center items-center gap-4 py-1 text-[.7rem] mt-2">
            <span className="text-2xl">🎉</span> No Additional or Hidden
            Costs!!!
          </p>
          <div className="border-b mb-3 border-[#A4B6B9] w-full"></div>
          <p className="mb-3 cursor-pointer font-semibold gap-2 flex items-start justify-between">
            Total Payable: ₹ {calculateDiscountedPrice()}
            <span className="mt-[3px] text-lg">
              <IoIosArrowDown />
            </span>
          </p>
          <button
            onClick={handleSubmit}
            className="bg-med-green text-lg text-white w-full  py-4 rounded-xl"
          >
            Confirm and Book
          </button>
        </div>

        {/* Discount Section */}
        <div className="bg-[#EDF7F9] rounded-3xl border-[.5px] w-full p-6 ">
          <div className="flex flex-col border-gray-400 rounded-xl border-[.6px] px-4 py-3 sm:flex-row items-center gap-0 sm:gap-2 mb-4">
            <input
              type="text"
              placeholder="Have a Coupon?"
              className="flex-1 w-full text-base bg-transparent rounded text-center sm:text-left"
            />
            <button
              className={`text-green-500 ${
                selectedCoupon.id ? "text-opacity-65" : "text-opacity-100"
              } px-0 text-base py-1 rounded`}
              disabled={selectedCoupon}
            >
              {selectedCoupon.id ? "Applied" : "Apply"}
            </button>
          </div>

          <p className="text-center text-gray-500">OR</p>
          <div>
            {userDetails?.Coupons ? (
              userDetails.Coupons.map((item) => {
                return (
                  <div
                    key={item._id}
                    onClick={() => handleCoupon(item)}
                    className={`flex items-start cursor-pointer gap-3 bg-white mt-4 
                      ${
                        selectedCoupon.id === item._id
                          ? "border-med-green"
                          : "border-white"
                      } 
                      ${
                        selectedCoupon.id !== null &&
                        selectedCoupon.id !== item._id
                          ? "hover:border-[#e5e7eb]"
                          : "hover:border-med-green"
                      } 
                      border-[3px] p-2 rounded-xl`}
                  >
                    <CouponSvg />
                    <div className="w-full">
                      <p className="font-bold text-sm">{item.couponCode}</p>
                      <p className="text-xs mb-3 text-gray-500">
                        {item.couponDescription}
                      </p>

                      <div className="flex justify-between">
                        <p className={`text-green-500  text-sm  rounded `}>
                          {selectedCoupon.id === item._id
                            ? "Applied!"
                            : "Apply"}
                        </p>
                        {selectedCoupon.id === item._id && (
                          <button
                            className="text-red-500  text-sm  rounded"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent onClick
                              handleCoupon(item._id);
                            }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p>No Coupons Available</p>
            )}

            <div className="flex gap-2 mt-4"></div>
          </div>
        </div>
      </div>

      {imgmodal.isOpen && (
        <CarosalImageModal
          images={imgmodal.img}
          handleCloseModal={closeModal}
        />
      )}
    </div>
  );
}

export default IternryDetails;
