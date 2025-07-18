"use client";

import { useEffect, useState } from "react";
import { useSearch } from "../../../context/SearchContext";
import { useWishlist } from "../../../context/WishListContext";
import CouponSvg from "../../../svgs/CouponSvg";
import Policies from "./Policies";
import HotelsPlan from "./HotelsPlan";
import CarosalImageModal from "../../../utils/CarosalImageModal";
import { useNavigate, useParams } from "react-router-dom";
import { useBooking } from "../../../context/BookingContext";
import { IoCheckmarkCircle } from "react-icons/io5";
import { AlertCircle, ChevronDown, Check, Phone } from "lucide-react";

function IternryDetails({ data }) {
  const { id: pkdid, country } = useParams();
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
  const [validationError, setValidationError] = useState("");
  const [isPricingPanelOpen, setIsPricingPanelOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const [selectedPackageType, setSelectedPackageType] = useState(null);

  const [additionalServices, setAdditionalServices] = useState({
    extraPerson: false,
    extraBed: false,
    cnb: false,
    cwb: false,
  });

  const pricingOptions =
    data?.pricing?.map((item, index) => ({
      id: index, // Add unique ID to each option
      label: `${item.packageType} (${item.guestCount} Guests)`,
      value: item.basePrice,
      guestCount: item.guestCount,
      perPerson: item.perPerson,
      packageType: item.packageType,
    })) || [];

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

    // Clear validation error when user selects a hotel
    setValidationError("");
  };

  const handleTabChange = (tab) => {
    setFadeState("fadeOut");
    setTimeout(() => {
      setActiveTab(tab);
      setFadeState("fadeIn");
    }, 100);
  };

  const calculateDiscountedPrice = () => {
    // Ensure selectedPricing is applied before adding extra charges
    let mainPrice = selectedPricing
      ? selectedPricing * searchData.guests
      : data?.price * searchData.guests;

    // Add extra bed and CNB charges only if selectedPricing is chosen
    if (selectedPricing) {
      const selectedPackage = data?.pricing?.find(
        (p) => p.basePrice === selectedPricing
      );

      const extraPersonCharge = additionalServices?.extraPerson
        ? selectedPackage?.extraPersonCharge || 0
        : 0;

      const extraBedCharge = additionalServices?.extraBed
        ? selectedPackage?.extraBedCharge || 0
        : 0;

      const cnbCharge = additionalServices?.cnb ? selectedPackage?.CNB || 0 : 0;

      const cwbCharge = additionalServices?.cwb ? selectedPackage?.CWB || 0 : 0;

      mainPrice += extraBedCharge + cnbCharge + cwbCharge + extraPersonCharge;
    }

    const totalCost = mainPrice;

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

  const handleToggle = (service) => {
    setAdditionalServices((prev) => ({
      ...(prev && typeof prev === "object" ? prev : {}),
      [service]: !prev?.[service],
    }));
  };

  const validateHotelSelection = () => {
    // Check if there are hotels in the data
    if (!data?.hotels || data.hotels.length === 0) {
      return true; // No hotels to select, so validation passes
    }

    // Get all unique locations from the data
    const allLocations = data.hotels.map((hotel) => hotel.location);

    // Get all selected locations
    const selectedLocations = selectedHotel.map((hotel) => hotel.location);

    // Check if a hotel is selected for each location
    const missingLocations = allLocations.filter(
      (location) => !selectedLocations.includes(location)
    );

    if (missingLocations.length > 0) {
      setValidationError(
        `Please select a hotel for ${missingLocations.join(", ")}`
      );

      // Switch to Hotel tab to show the error
      if (activeTab !== "Hotel") {
        handleTabChange("Hotel");
      }

      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate hotel selection before proceeding
    if (!validateHotelSelection()) {
      return;
    }

    const requestData = {
      selectedHotels: [...selectedHotel],
      Pack_id: pkdid,
      guests: searchData.guests,
      coupon: selectedCoupon,
      services: additionalServices ? additionalServices : null,
      selectedPricing: selectedPricing ? selectedPricing : null,
      IsDomesticPackage: country === "India" ? true : false,
    };

    setBookingDetails(requestData);
    navigate("/destination/confirmation-page");
  };

  const handleSelectPricing = (option) => {
    // Check if this is a different pricing option than currently selected
    const isDifferentPricing = selectedPackageId !== option.id;

    setSelectedPricing(option.value);
    setSelectedPackageId(option.id);
    setSelectedPricePerPerson(!!option.perPerson);
    setSelectedPackageType(option.packageType);
    setSearchData((prev) => ({
      ...prev,
      guests: option.guestCount || 1,
    }));
    setIsPricingPanelOpen(false);

    // Clear selected hotels if a different pricing option is selected
    if (isDifferentPricing) {
      setSelectedHotel([]);
      // Clear validation error as well since hotels are cleared
      setValidationError("");

      // Optional: Show a notification to user that hotels were cleared
      // You can uncomment this if you want to show an alert
      // if (selectedHotel.length > 0) {
      //   alert("Hotel selections have been cleared due to pricing change. Please reselect your hotels.")
      // }
    }
  };

  // Get unique guest counts
  const getUniqueGuestCounts = () => {
    const guestCounts = pricingOptions.map((option) => option.guestCount);
    return [...new Set(guestCounts)].sort((a, b) => a - b);
  };

  // Filter options by guest count
  const getFilteredOptions = (guestCount) => {
    return pricingOptions.filter((option) => option.guestCount === guestCount);
  };

  // Get selected pricing label
  const getSelectedPricingLabel = () => {
    if (!selectedPricing) return "Select Package";

    const option = pricingOptions.find((opt) => opt.id === selectedPackageId);
    if (!option) return "Select Package";

    return `${option.packageType} (${option.guestCount} Guests) - ₹${option.value}`;
  };

  // Handle click outside to close panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      const panel = document.getElementById("pricing-panel");
      const button = document.getElementById("pricing-button");

      if (
        isPricingPanelOpen &&
        panel &&
        !panel.contains(event.target) &&
        !button.contains(event.target)
      ) {
        setIsPricingPanelOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPricingPanelOpen]);

  useEffect(() => {
    setSelectedPricing(null);
    setSelectedPackageId(null);
    // Clear selected hotels when package ID changes (new package loaded)
    setSelectedHotel([]);
  }, [pkdid]);

  // Set pricing when `data` is available
  useEffect(() => {
    if (
      data &&
      data.pricing &&
      data.pricing.length > 0 &&
      selectedPricing === null
    ) {
      const defaultPricing = data.pricing[0]; // Select the first available pricing

      setSelectedPricing(defaultPricing.basePrice || 0);
      setSelectedPackageId(0); // First option has id 0
      setSelectedPricePerPerson(!!defaultPricing.perPerson);
      setSelectedPackageType(defaultPricing.packageType);
      setSearchData((prev) => ({
        ...prev,
        guests: defaultPricing.guestCount || 1,
      }));
    }
  }, [data]);

  return (
    <div className="w-full md:w-[90%] mx-auto bg-white flex flex-col lg:flex-row font-poppins">
      {/* Left Side */}
      <div className="w-full lg:w-4/5 p-4 ">
        {/* Navigation */}
        <nav className="flex w-full gap-4 em:gap-10 border-[.5px] px-4 em:px-0 scrollbar-hide overflow-x-auto rounded-lg justify-start em:justify-center py-4 whitespace-nowrap mb-4 text-center text-sm sm:text-base">
          {["Plan Details", "Hotel", "Policies"].map((tab, tabIdx) => (
            <li
              key={tabIdx}
              className={`cursor-pointer list-none ${
                activeTab === tab ? "text-green-500 font-semibold" : ""
              }`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
            </li>
          ))}
        </nav>

        {/* Dynamic Content */}
        <div
          className={
            fadeState === "fadeIn" ? "animate-fadeIn" : "animate-fadeOut"
          }
        >
          {activeTab === "Plan Details" && (
            <div className="space-y-6">
              {data?.dayDescription?.map((day, dayIdx) => (
                <div
                  className="border-[.5px] px-4 py-4 rounded-lg"
                  key={dayIdx}
                >
                  <h3 className="text-base md:text-lg leading-6 md:leading-7 font-bold">
                    {day.dayTitle}
                  </h3>
                  <div className="border-t mt-3 mb-4"></div>
                  <div>
                    {/* Grid for sm and above */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 mb-4 gap-2">
                      {day?.photos?.map((img, photoidx) => (
                        <div
                          key={`${img}-${photoidx}`}
                          className="aspect-video w-full overflow-hidden rounded-md"
                        >
                          <img
                            src={img || "/placeholder.svg"}
                            alt={`Day ${dayIdx + 1} img ${photoidx + 1}`}
                            className="w-full h-full object-cover rounded-md"
                            onError={(e) => {
                              e.target.src =
                                "/placeholder.svg?height=120&width=200";
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <span
                    className="sm:text-base text-sm"
                    dangerouslySetInnerHTML={{ __html: day?.dayDetails }}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === "Hotel" && (
            <>
              {validationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{validationError}</span>
                </div>
              )}
              <HotelsPlan
                handleHotelArray={handleHotelArray}
                selectedHotel={selectedHotel}
                data={data}
                openModal={openModal}
                selectedPackageType={selectedPackageType}
              />
            </>
          )}

          {activeTab === "Policies" && <Policies data={data?.policies} />}
        </div>
      </div>

      {/* Right Side */}
      <div className="w-full lg:w-1/3 p-4">
        <div className="lg:sticky top-[150px] z-20">
          <div className="space-y-4 mb-4">
            <div className="border p-6 rounded-3xl relative bg-white text-sm sm:text-base shadow-sm">
              <p className="font-semibold text-lg mb-2 mt-7">Payment Details</p>

              {/* Pricing Selection */}
              {data?.pricing && (
                <div className="mb-3 relative">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Select Pricing
                  </label>
                  <button
                    id="pricing-button"
                    onClick={() => setIsPricingPanelOpen(!isPricingPanelOpen)}
                    className="w-full border p-3 rounded-lg bg-white text-left flex justify-between items-center hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  >
                    <span className="text-gray-800 truncate">
                      {getSelectedPricingLabel()}
                    </span>
                    <ChevronDown
                      className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                        isPricingPanelOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Pricing Panel */}
                  {isPricingPanelOpen && (
                    <div
                      id="pricing-panel"
                      className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-[70vh] overflow-y-auto animate-fadeIn"
                    >
                      {getUniqueGuestCounts().map((guestCount) => (
                        <div
                          key={guestCount}
                          className="border-b last:border-b-0"
                        >
                          <div className="px-4 py-2 bg-gray-50 font-medium text-gray-700 sticky top-0 z-10">
                            {guestCount} Guests
                          </div>
                          {getFilteredOptions(guestCount).map((option) => (
                            <div
                              key={option.id}
                              onClick={() => handleSelectPricing(option)}
                              className={`px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between ${
                                selectedPackageId === option.id
                                  ? "bg-green-50"
                                  : ""
                              }`}
                            >
                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <span
                                    className={`${
                                      selectedPackageId === option.id
                                        ? "font-medium text-green-600"
                                        : "font-medium"
                                    }`}
                                  >
                                    {option.packageType}
                                  </span>
                                  <span className="text-green-600 font-semibold">
                                    ₹{option.value}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500">
                                  per person
                                </p>
                              </div>
                              {selectedPackageId === option.id && (
                                <div className="ml-2 flex-shrink-0">
                                  <Check className="h-5 w-5 text-green-600" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ))}
                      <div className="p-3 bg-gray-50 border-t sticky bottom-0">
                        <button
                          onClick={() => setIsPricingPanelOpen(false)}
                          className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Extra Bed & CNB Checkboxes */}
              {selectedPricing && (
                <div className="mt-4 space-y-2">
                  {data?.pricing?.find((p) => p.basePrice === selectedPricing)
                    ?.extraBedCharge > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalServices?.extraBed}
                        onChange={() => handleToggle("extraBed")}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="flex-1">
                        Extra Bed (+ ₹
                        {data?.pricing?.find(
                          (p) => p.basePrice === selectedPricing
                        )?.extraBedCharge || 0}
                        )
                      </span>
                      {additionalServices?.extraBed && (
                        <IoCheckmarkCircle className="text-green-500 text-lg" />
                      )}
                    </label>
                  )}

                  {data?.pricing?.find((p) => p.basePrice === selectedPricing)
                    ?.extraPersonCharge > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalServices?.extraPerson}
                        onChange={() => handleToggle("extraPerson")}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="flex-1">
                        Extra Person (+ ₹
                        {data?.pricing?.find(
                          (p) => p.basePrice === selectedPricing
                        )?.extraPersonCharge || 0}
                        )
                      </span>
                      {additionalServices?.extraPerson && (
                        <IoCheckmarkCircle className="text-green-500 text-lg" />
                      )}
                    </label>
                  )}

                  {data?.pricing?.find((p) => p.basePrice === selectedPricing)
                    ?.CNB > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalServices?.cnb}
                        onChange={() => handleToggle("cnb")}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="flex-1">
                        Child Without Bed (CNB) (+ ₹
                        {data?.pricing?.find(
                          (p) => p.basePrice === selectedPricing
                        )?.CNB || 0}
                        )
                      </span>
                      {additionalServices?.cnb && (
                        <IoCheckmarkCircle className="text-green-500 text-lg" />
                      )}
                    </label>
                  )}

                  {data?.pricing?.find((p) => p.basePrice === selectedPricing)
                    ?.CWB > 0 && (
                    <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors">
                      <input
                        type="checkbox"
                        checked={additionalServices?.cwb}
                        onChange={() => handleToggle("cwb")}
                        className="w-4 h-4 accent-green-600"
                      />
                      <span className="flex-1">
                        Child With Bed (CWB) (+ ₹
                        {data?.pricing?.find(
                          (p) => p.basePrice === selectedPricing
                        )?.CWB || 0}
                        )
                      </span>
                      {additionalServices?.cwb && (
                        <IoCheckmarkCircle className="text-green-500 text-lg" />
                      )}
                    </label>
                  )}
                </div>
              )}

              {/* Pricing Details */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500">
                  Base Price: ₹
                  <span className="line-through">
                    {selectedPricing
                      ? selectedPricing * searchData.guests * 1.25
                      : data?.price
                      ? data.price * searchData.guests * 1.25
                      : "N/A"}
                  </span>
                </p>

                <p className="text-green-600 font-semibold mt-1">
                  {selectedPricing || data?.price
                    ? searchData.guests === 1
                      ? `₹ ${calculateDiscountedPrice()} /- per person`
                      : `₹ ${calculateDiscountedPrice()} /- total pack price`
                    : "N/A"}
                </p>

                <p className="border rounded-xl mb-3 text-blue-500 flex justify-center items-center gap-4 py-1 text-xs mt-3 bg-white">
                  <span className="text-2xl">🎉</span> No Additional or Hidden
                  Costs!!!
                </p>

                <div className="border-b my-3 border-gray-200 w-full"></div>

                <p className="font-semibold gap-2 flex items-start justify-between">
                  <span>Total Payable:</span>{" "}
                  <span className="text-green-600">
                    ₹ {calculateDiscountedPrice()}
                  </span>
                </p>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-lg cursor-pointer text-white inline-flex items-center justify-center py-3 px-4 rounded-xl w-full hover:bg-green-700 transition-colors font-medium"
                >
                  Confirm and Book
                </button>

                <a
                  href="tel:8980527418"
                  className="bg-blue-600 text-lg cursor-pointer text-white inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl w-full hover:bg-blue-700 transition-colors font-medium"
                >
                  <Phone size={20} />
                  Contact Us
                </a>
              </div>

              {/* Hotel selection reminder */}
              {data?.hotels &&
                data.hotels.length > 0 &&
                selectedHotel.length < data.hotels.length && (
                  <p className="text-amber-600 text-sm mt-2 text-center">
                    Please select a hotel for each location before proceeding
                  </p>
                )}
            </div>
          </div>

          {/* Coupon Section */}
          <div className="bg-[#EDF7F9] rounded-3xl border-[.5px] w-full p-6 shadow-sm">
            <div className="flex flex-col border-gray-400 rounded-xl border-[.6px] px-4 py-3 sm:flex-row items-center gap-0 sm:gap-2 mb-4 bg-white">
              <input
                type="text"
                placeholder="Have a Coupon?"
                className="flex-1 w-full text-base bg-transparent rounded text-center sm:text-left focus:outline-none"
              />
              <button
                className={`text-green-500 ${
                  selectedCoupon.id ? "text-opacity-65" : "text-opacity-100"
                } px-0 text-base py-1 rounded hover:text-green-600 transition-colors`}
                disabled={selectedCoupon.id}
              >
                {selectedCoupon.id ? "Applied" : "Apply"}
              </button>
            </div>

            <p className="text-center text-gray-500 my-3">OR</p>
            <div className="max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
              {userDetails?.Coupons?.length > 0 ? (
                userDetails.Coupons.map((item) => {
                  return (
                    <div
                      key={item._id}
                      onClick={() => handleCoupon(item)}
                      className={`flex items-start cursor-pointer gap-3 bg-white mt-4 
                      ${
                        selectedCoupon.id === item._id
                          ? "border-green-600"
                          : "border-white"
                      } 
                      ${
                        selectedCoupon.id !== null &&
                        selectedCoupon.id !== item._id
                          ? "hover:border-[#e5e7eb]"
                          : "hover:border-green-600"
                      } 
                      border-[3px] p-2 rounded-xl transition-colors`}
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
                              className="text-red-500 text-sm rounded hover:text-red-600 transition-colors"
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
                <p className="text-center">No Coupons Available</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
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
