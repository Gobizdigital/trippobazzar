import React, { useEffect, useState } from "react";
import { useSearch } from "../../../context/SearchContext";
import { useWishlist } from "../../../context/WishListContext";
import CouponSvg from "../../../svgs/CouponSvg";
import Policies from "./Policies";
import HotelsPlan from "./HotelsPlan";
import CarosalImageModal from "../../../utils/CarosalImageModal";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../../../context/BookingContext";
import { IoCheckmarkCircle } from "react-icons/io5";

function IternryDetails({ data }) {
  const { id: pkdid } = useParams();
  const {
    searchData,
    setSearchData,
    selectedPricing,
    setSelectedPricing,
    setSelectedPricePerPerson,
  } = useSearch();
  const { userDetails } = useWishlist();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Plan Details");
  const { setBookingDetails } = useBooking();
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

  const [additionalServices, setAdditionalServices] = useState({
    extraBed: false,
    cnb: false,
  });

  const pricingOptions =
    data?.pricing?.map((item) => ({
      label: `${item.packageType} (${item.guestCount} Guests)`,
      value: item.basePrice,
      guestCount: item.guestCount,
      perPerson: item.perPerson,
    })) || [];

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
  };

  const handleTabChange = (tab) => {
    setFadeState("fadeOut");
    setTimeout(() => {
      setActiveTab(tab);
      setFadeState("fadeIn");
    }, 100);
  };

  const calculateDiscountedPrice = () => {
    const totalHotelPrice = selectedHotel.reduce((total, hotel) => {
      return total + (hotel.hotelPrice || 0);
    }, 0);

    // Ensure selectedPricing is applied before adding extra charges
    let mainPrice = selectedPricing
      ? selectedPricing * searchData.guests
      : data?.price * searchData.guests;

    // Add extra bed and CNB charges only if selectedPricing is chosen
    if (selectedPricing) {
      const selectedPackage = data?.pricing?.find(
        (p) => p.basePrice === selectedPricing
      );

      const extraBedCharge = additionalServices?.extraBed
        ? selectedPackage?.extraBedCharge || 0
        : 0;

      const cnbCharge = additionalServices?.cnb ? selectedPackage?.CNB || 0 : 0;

      mainPrice += extraBedCharge + cnbCharge;
    }

    const totalCost = mainPrice + totalHotelPrice;

    // Apply discount if coupon is selected
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

  const handleToggle = (service) => {
    setAdditionalServices((prev) => ({
      ...(prev && typeof prev === "object" ? prev : {}), // Ensure prev is an object
      [service]: !prev?.[service], // Safely access prev[service]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestData = {
      selectedHotels: [...selectedHotel],
      Pack_id: pkdid,
      guests: searchData.guests,
      coupon: selectedCoupon,
      services: additionalServices ? additionalServices : null,
      selectedPricing: selectedPricing ? selectedPricing : null,
    };

    setBookingDetails(requestData);
    navigate("/destination/confirmation-page");
  };

  useEffect(() => {
    if (!data?.price && !selectedPricing && data?.pricing?.length > 0) {
      const defaultPricing = data.pricing[0]; // Select the first available pricing
  
      if (defaultPricing) {
        setSelectedPricing(defaultPricing.basePrice);
        setSelectedPricePerPerson(defaultPricing.perPerson ? true : false);
        setSearchData((prev) => ({
          ...prev,
          guests: defaultPricing.guestCount,
        }));
      }
    }
  }, [data?.price, data?.pricing, selectedPricing]);

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
                  <h3 className="text-base md:text-lg leading-6 md:leading-7 font-bold">
                    {day.dayTitle}
                  </h3>
                  <div className="border-t mt-3 mb-4"></div>
                  <div>
                    {/* Grid for sm and above */}
                    <div className="flex flex-wrap mb-4  gap-2">
                      {day?.photos?.map((img, photoidx) => (
                        <div
                          key={`${img}-${photoidx}`}
                          className="h-[120px] w-[180px]"
                        >
                          <img
                            src={img}
                            alt={`Day ${dayIdx + 1} img ${photoidx + 1}`}
                            className="rounded-md w-full h-full"
                          />
                        </div>
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
      <div className="w-full lg:w-1/3 p-4">
        <div className="lg:sticky top-[150px] z-20">
          <div className="space-y-4 mb-4">
            <div className="border p-6 rounded-3xl relative bg-white text-sm sm:text-base">
              <p className="font-semibold text-lg mb-2 mt-7">Payment Details</p>

              {/* Pricing Selection Dropdown */}
              {data?.pricing && (
                <div className="mb-3">
                  <label className="block text-gray-700 font-semibold">
                    Select Pricing
                  </label>
                  <select
                    className="w-full border p-2 rounded-lg"
                    value={selectedPricing !== null ? selectedPricing : ""}
                    onChange={(e) => {
                      const selectedValue = e.target.value
                        ? Number(e.target.value)
                        : null;

                      if (selectedValue === null) {
                        setSelectedPricePerPerson(false);
                        setSelectedPricing(null);
                        setAdditionalServices(null);
                        setSearchData((prev) => ({
                          ...prev,
                          guests: 1, // Default back to original guests
                        }));
                      } else {
                        const selectedOption = pricingOptions.find(
                          (option) => option.value === selectedValue
                        );

                        if (selectedOption) {
                          setSelectedPricePerPerson(
                            selectedOption.perPerson ? true : false
                          );
                          setSelectedPricing(selectedOption.value);
                          setSearchData((prev) => ({
                            ...prev,
                            guests: selectedOption.guestCount,
                          }));
                        }
                      }
                    }}
                  >
                    <option value="">Select Package</option>
                    {pricingOptions.map((option) => (
                      <option key={option.label} value={option.value}>
                        {option.label} - ₹{option.value} per person
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Extra Bed & CNB Checkboxes */}

              {selectedPricing && (
                <div className="mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={additionalServices?.extraBed}
                      onChange={() => handleToggle("extraBed")}
                      className="w-4 h-4"
                    />
                    Extra Bed (+ ₹
                    {data?.pricing?.find((p) => p.basePrice === selectedPricing)
                      ?.extraBedCharge || 0}
                    )
                    {additionalServices?.extraBed && (
                      <IoCheckmarkCircle className="text-green-500 text-lg" />
                    )}
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer mt-2">
                    <input
                      type="checkbox"
                      checked={additionalServices?.cnb}
                      onChange={() => handleToggle("cnb")}
                      className="w-4 h-4"
                    />
                    Child Without Bed (CNB) (+ ₹
                    {data?.pricing?.find((p) => p.basePrice === selectedPricing)
                      ?.CNB || 0}
                    )
                    {additionalServices?.cnb && (
                      <IoCheckmarkCircle className="text-green-500 text-lg" />
                    )}
                  </label>
                </div>
              )}

              {/* Pricing Details */}
              <p className="text-gray-500 mt-4">
                Base Price: ₹
                <span className="line-through">
                  {selectedPricing
                    ? selectedPricing * searchData.guests * 1.25
                    : data?.price
                    ? data.price * searchData.guests * 1.25
                    : "N/A"}
                </span>
              </p>

              <p className="text-med-green font-semibold">
                {selectedPricing || data?.price
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

              <p className="mb-4 cursor-pointer font-semibold gap-2 flex items-start justify-between">
                Total Payable: ₹ {calculateDiscountedPrice()}
              </p>

              <button
                onClick={handleSubmit}
                className="bg-med-green text-lg cursor-pointer text-white inline-flex py-3 px-4 rounded-xl"
              >
                Confirm and Book
              </button>
            </div>
          </div>
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
            <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
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
                          <p className={`text-green-500 text-sm rounded`}>
                            {selectedCoupon.id === item._id
                              ? "Applied!"
                              : "Apply"}
                          </p>
                          {selectedCoupon.id === item._id && (
                            <button
                              className="text-red-500 text-sm rounded"
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
            </div>
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
