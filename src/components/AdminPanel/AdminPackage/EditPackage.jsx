"use client";

import { useEffect, useRef, useState } from "react";
import useFetch from "../../../../hooks/useFetch";

export default function EditPackage({
  initialData,
  updateById,
  id,
  setSelectedId,
  setEditPackage,
}) {
  const { data: hotelData, loading } = useFetch(
    `https://trippo-bazzar-backend.vercel.app/api/hotel`
  );

  const [data, setData] = useState(
    initialData || {
      title: "",
      description: "",
      price: 0,
      pricing: [],
      whatsIncluded: [],
      coupon: [],
      MainPhotos: [],
      dayDescription: [],
      specialInstruction: "",
      conditionOfTravel: "",
      thingsToMaintain: "",
      hotels: [],
      policies: "",
      termsAndConditions: "",
    }
  );
  console.log(data);
  // Validation state
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hotel search states
  const [newLocation, setNewLocation] = useState("");
  const [selectedHotelIdForDetails, setSelectedHotelIdForDetails] =
    useState("");
  const [selectedHotelIdForNewHotel, setSelectedHotelIdForNewHotel] =
    useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Active tab state for both mobile and desktop
  const [activeSection, setActiveSection] = useState("basic");

  const filteredHotels = hotelData?.filter((hotel) =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const packageData = ["Food", "Hotel", "Car", "Explore", "Travel", "Visa"];
  const textareasRef = useRef([]);

  // Validate form fields
  const validateForm = () => {
    const newErrors = {};

    if (!data.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!data.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Only validate pricing if both price and pricing array are empty
    if (
      data.price <= 0 &&
      (!Array.isArray(data.pricing) ||
        data.pricing.length === 0 ||
        data.pricing.every((item) => !item.basePrice || item.basePrice <= 0))
    ) {
      newErrors.pricing =
        "Either base price or at least one pricing option with base price is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const handlePricingChange = (index, e) => {
    const { name, value, type, checked } = e.target;

    if (!Array.isArray(data.pricing)) return;

    const updatedPricing = [...data.pricing];

    updatedPricing[index] = {
      ...updatedPricing[index],
      [name]: type === "checkbox" ? checked : value,
    };

    setData({ ...data, pricing: updatedPricing });

    // Clear pricing error if basePrice is added
    if (name === "basePrice" && value > 0 && errors.pricing) {
      setErrors({
        ...errors,
        pricing: null,
      });
    }
  };

  const addPricing = () => {
    setData({
      ...data,
      pricing: [
        ...(Array.isArray(data.pricing) ? data.pricing : []),
        {
          guestCount: "",
          packageType: "",
          basePrice: "",
          extraPersonCharge: "",
          extraBedCharge: "",
          CNB: "",
          CWB: "",
          perPerson: false,
        },
      ],
    });
  };

  const removePricing = (index) => {
    const updatedPricing = data.pricing.filter((_, i) => i !== index);
    setData({ ...data, pricing: updatedPricing });
  };

  const addNewHotel = () => {
    if (!newLocation || !selectedHotelIdForNewHotel) return;

    const selectedHotel = hotelData.find(
      (hotel) => hotel._id === selectedHotelIdForNewHotel
    );

    const newHotel = {
      location: newLocation,
      hotelDetails: [selectedHotel._id],
    };

    setData((prevData) => ({
      ...prevData,
      hotels: [...prevData.hotels, newHotel],
    }));

    setNewLocation("");
    setSearchQuery("");
    setSelectedHotelIdForNewHotel("");
  };

  const removeHotel = (hotelId) => {
    const updatedHotels = data.hotels.filter(
      (details) => details._id !== hotelId
    );

    setData((prevData) => ({
      ...prevData,
      hotels: updatedHotels,
    }));
  };

  const removeHotelDetail = (hotelIndex, hotelDetailIndex) => {
    if (!data?.hotels || !data.hotels[hotelIndex]?.hotelDetails) {
      return;
    }

    const updatedHotels = [...data.hotels];
    updatedHotels[hotelIndex].hotelDetails.splice(hotelDetailIndex, 1);

    setData((prevData) => ({
      ...prevData,
      hotels: updatedHotels,
    }));
  };

  const addHotelDetail = (hotelId) => {
    const selectedHotel = hotelData?.find(
      (hotel) => hotel._id === selectedHotelIdForDetails
    );

    if (selectedHotel) {
      const hotelIndex = data.hotels.findIndex(
        (hotel) => hotel._id === hotelId
      );

      if (hotelIndex !== -1) {
        const hotelAlreadyAdded = data.hotels[hotelIndex].hotelDetails.some(
          (detail) => detail === selectedHotel._id
        );

        if (!hotelAlreadyAdded) {
          const updatedHotels = [...data.hotels];
          updatedHotels[hotelIndex] = {
            ...data.hotels[hotelIndex],
            hotelDetails: [
              ...data.hotels[hotelIndex].hotelDetails,
              selectedHotel._id,
            ],
          };

          setData((prevData) => ({
            ...prevData,
            hotels: updatedHotels,
          }));
        }
      }
    }

    setSearchTerm("");
  };

  const saveState = async () => {
    setIsSubmitting(true);

    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorField = Object.keys(errors)[0];
      const element = document.querySelector(`[name="${firstErrorField}"]`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      setIsSubmitting(false);
      return;
    }

    try {
      await updateById(id, data);
      setSelectedId(null);
      setEditPackage(false);
    } catch (error) {
      console.log(error);
      alert("Error updating package. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArrayChange = (field, index, subField, value) => {
    setData((prevData) => {
      const updatedArray = [...prevData[field]];
      updatedArray[index][subField] = value;
      return { ...prevData, [field]: updatedArray };
    });
  };

  const handlePhotoChange = (dayIndex, photoIndex, value) => {
    setData((prevData) => {
      const updatedArray = [...prevData.dayDescription];
      if (value === "") {
        updatedArray[dayIndex].photos = updatedArray[dayIndex].photos.filter(
          (photo, index) => index !== photoIndex
        );
      } else {
        updatedArray[dayIndex].photos[photoIndex] = value;
      }

      return { ...prevData, dayDescription: updatedArray };
    });
  };

  const handleMainPhotoChange = (index, value) => {
    setData((prevData) => {
      const updatedPhotos = [...prevData.MainPhotos];
      updatedPhotos[index] = value;
      return { ...prevData, MainPhotos: updatedPhotos };
    });
  };

  const handleLocationChange = (index, value) => {
    setData((prevData) => {
      const updatedHotels = [...prevData.hotels];

      if (value === "") {
        updatedHotels.splice(index, 1);
      } else {
        updatedHotels[index] = { ...updatedHotels[index], location: value };
      }

      return { ...prevData, hotels: updatedHotels };
    });
  };

  // Toggle all "What's Included" items
  const toggleAllWhatsIncluded = () => {
    if (data.whatsIncluded.length === packageData.length) {
      // If all are selected, deselect all
      setData({ ...data, whatsIncluded: [] });
    } else {
      // Otherwise, select all
      setData({ ...data, whatsIncluded: [...packageData] });
    }
  };

  // Toggle a single "What's Included" item
  const toggleWhatsIncluded = (item) => {
    if (data.whatsIncluded.includes(item)) {
      // Remove item if already selected
      setData({
        ...data,
        whatsIncluded: data.whatsIncluded.filter((i) => i !== item),
      });
    } else {
      // Add item if not selected
      setData({
        ...data,
        whatsIncluded: [...data.whatsIncluded, item],
      });
    }
  };

  const handleAutoResize = () => {
    textareasRef.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    });
  };

  useEffect(() => {
    handleAutoResize();
  }, [data]);

  // Navigation tabs for both mobile and desktop
  const navigationTabs = [
    { id: "basic", label: "Basic Info", icon: "📋" },
    { id: "photos", label: "Photos", icon: "🖼️" },
    { id: "pricing", label: "Pricing", icon: "💰" },
    { id: "days", label: "Itinerary", icon: "🗓️" },
    { id: "included", label: "Included", icon: "✅" },
    { id: "hotels", label: "Hotels", icon: "🏨" },
    { id: "details", label: "Details", icon: "📝" },
  ];

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <div className="container mx-auto p-4 md:p-6 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Edit Package
          </h1>
          <button
            onClick={() => setEditPackage(false)}
            className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>

        {/* Tabbed Navigation - Both Mobile and Desktop */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-3 rounded-t-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? "bg-white text-emerald-600 border-t border-l border-r border-gray-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Basic Information Section */}
          {activeSection === "basic" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Basic Information
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.title ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                    placeholder="Enter package title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.description ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]`}
                    placeholder="Enter package description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      ₹
                    </span>
                    <input
                      type="number"
                      name="price"
                      value={data.price}
                      onChange={handleChange}
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Either base price or pricing options must be provided
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Main Photos Section */}
          {activeSection === "photos" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Main Photos
              </h2>

              <div className="space-y-4">
                {data?.MainPhotos?.map((photo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={photo}
                      onChange={(e) =>
                        handleMainPhotoChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter photo URL"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updatedPhotos = [...data.MainPhotos];
                        updatedPhotos.splice(index, 1);
                        setData((prevData) => ({
                          ...prevData,
                          MainPhotos: updatedPhotos,
                        }));
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setData((prevData) => ({
                      ...prevData,
                      MainPhotos: [...(prevData.MainPhotos || []), ""],
                    }));
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Photo
                </button>
              </div>
            </div>
          )}

          {/* What's Included Section */}
          {activeSection === "included" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                What's Included
              </h2>

              <div className="mb-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  {data.whatsIncluded?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      {item}
                      <button
                        className="ml-1 text-emerald-600 hover:text-emerald-800"
                        onClick={() => {
                          const updatedWhatsIncluded =
                            data.whatsIncluded.filter(
                              (packid) => packid !== item
                            );
                          setData({
                            ...data,
                            whatsIncluded: updatedWhatsIncluded,
                          });
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={toggleAllWhatsIncluded}
                    className="col-span-full px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors mb-2"
                  >
                    {data.whatsIncluded?.length === packageData.length
                      ? "Deselect All"
                      : "Select All"}
                  </button>

                  {packageData?.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleWhatsIncluded(item)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        data.whatsIncluded?.includes(item)
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Package Pricing Section */}
          {activeSection === "pricing" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Package Pricing
              </h2>

              {errors.pricing && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200">
                  {errors.pricing}
                </div>
              )}

              <div className="space-y-6">
                {data.pricing?.map((priceItem, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">
                        Pricing Option {index + 1}
                      </h3>
                      <button
                        onClick={() => removePricing(index)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Guest Count
                        </label>
                        <input
                          type="number"
                          name="guestCount"
                          placeholder="Number of guests"
                          value={priceItem.guestCount}
                          onChange={(e) => handlePricingChange(index, e)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Package Type
                        </label>
                        <select
                          name="packageType"
                          value={priceItem.packageType}
                          onChange={(e) => handlePricingChange(index, e)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                        >
                          <option value="">Select Package Type</option>
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Super Deluxe">Super Deluxe</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Royal">Royal</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Base Price
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="basePrice"
                            placeholder="0.00"
                            value={priceItem.basePrice}
                            onChange={(e) => handlePricingChange(index, e)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Extra Person Charge
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="extraPersonCharge"
                            placeholder="0.00"
                            value={priceItem.extraPersonCharge}
                            onChange={(e) => handlePricingChange(index, e)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Extra Bed Charge
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="extraBedCharge"
                            placeholder="0.00"
                            value={priceItem.extraBedCharge}
                            onChange={(e) => handlePricingChange(index, e)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNB Charge
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="CNB"
                            placeholder="0.00"
                            value={priceItem.CNB}
                            onChange={(e) => handlePricingChange(index, e)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CWB Charge
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            ₹
                          </span>
                          <input
                            type="number"
                            name="CWB"
                            placeholder="0.00"
                            value={priceItem.CWB}
                            onChange={(e) => handlePricingChange(index, e)}
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="perPerson"
                          checked={priceItem.perPerson || false}
                          onChange={(e) => handlePricingChange(index, e)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Per Person Pricing
                        </span>
                      </label>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addPricing}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Pricing Option
                </button>
              </div>
            </div>
          )}

          {/* Day Description Section */}
          {activeSection === "days" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Day Description
              </h2>

              <div className="space-y-6">
                {data.dayDescription?.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Day {dayIndex + 1}</h3>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedDayDescription =
                            data.dayDescription.filter(
                              (item) => item._id !== day._id
                            );
                          setData((prevData) => ({
                            ...prevData,
                            dayDescription: updatedDayDescription,
                          }));
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day Title
                        </label>
                        <input
                          type="text"
                          name={`dayTitle-${dayIndex}`}
                          value={day.dayTitle}
                          onChange={(e) =>
                            handleArrayChange(
                              "dayDescription",
                              dayIndex,
                              "dayTitle",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder={`Day ${dayIndex + 1} Title`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day Details
                        </label>
                        <textarea
                          name={`dayDetails-${dayIndex}`}
                          value={day.dayDetails}
                          onChange={(e) =>
                            handleArrayChange(
                              "dayDescription",
                              dayIndex,
                              "dayDetails",
                              e.target.value
                            )
                          }
                          ref={(el) => (textareasRef.current[dayIndex] = el)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px] resize-none"
                          placeholder={`Details for Day ${dayIndex + 1}`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photos
                        </label>
                        <div className="space-y-2">
                          {day.photos?.map((photo, photoIndex) => (
                            <div
                              key={photoIndex}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                value={photo}
                                onChange={(e) =>
                                  handlePhotoChange(
                                    dayIndex,
                                    photoIndex,
                                    e.target.value
                                  )
                                }
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                placeholder={`Photo URL ${photoIndex + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedData = [...data.dayDescription];
                                  updatedData[dayIndex].photos.splice(
                                    photoIndex,
                                    1
                                  );
                                  setData((prevData) => ({
                                    ...prevData,
                                    dayDescription: updatedData,
                                  }));
                                }}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updatedData = [...data.dayDescription];
                            if (!updatedData[dayIndex].photos) {
                              updatedData[dayIndex].photos = [];
                            }
                            updatedData[dayIndex].photos.push("");
                            setData((prevData) => ({
                              ...prevData,
                              dayDescription: updatedData,
                            }));
                          }}
                          className="flex items-center gap-2 px-4 py-2 mt-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Add Photo
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const newDay = {
                      dayTitle: "",
                      dayDetails: "",
                      photos: [""],
                    };
                    setData((prevData) => ({
                      ...prevData,
                      dayDescription: [
                        ...(prevData.dayDescription || []),
                        newDay,
                      ],
                    }));
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Add Another Day
                </button>
              </div>
            </div>
          )}

          {/* Additional Information Section */}
          {activeSection === "details" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Additional Information
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Instructions
                  </label>
                  <textarea
                    name="specialInstruction"
                    value={data.specialInstruction}
                    onChange={handleChange}
                    ref={(el) => textareasRef.current.push(el)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                    placeholder="Enter any special instructions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conditions of Travel
                  </label>
                  <textarea
                    name="conditionOfTravel"
                    value={data.conditionOfTravel}
                    onChange={handleChange}
                    ref={(el) => textareasRef.current.push(el)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                    placeholder="Enter conditions of travel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Things to Maintain
                  </label>
                  <textarea
                    name="thingsToMaintain"
                    value={data.thingsToMaintain}
                    onChange={handleChange}
                    ref={(el) => textareasRef.current.push(el)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                    placeholder="Enter things to maintain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policies
                  </label>
                  <textarea
                    name="policies"
                    value={data.policies}
                    onChange={handleChange}
                    ref={(el) => textareasRef.current.push(el)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                    placeholder="Enter policies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms and Conditions
                  </label>
                  <textarea
                    name="termsAndConditions"
                    value={data.termsAndConditions}
                    onChange={handleChange}
                    ref={(el) => textareasRef.current.push(el)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 min-h-[100px]"
                    placeholder="Enter terms and conditions"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hotels Section */}
          {activeSection === "hotels" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
                Hotels
              </h2>

              <div className="space-y-6">
                {data?.hotels?.map((hotel, hotelIndex) => (
                  <div
                    key={hotelIndex}
                    className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Location
                        </label>
                        <input
                          type="text"
                          value={hotel.location}
                          onChange={(e) =>
                            handleLocationChange(hotelIndex, e.target.value)
                          }
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter location"
                        />
                      </div>
                      <button
                        onClick={() => removeHotel(hotel._id)}
                        className="ml-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selected Hotels
                      </label>
                      {hotel?.hotelDetails?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {hotel.hotelDetails.map(
                            (detailId, hotelDetailIndex) => {
                              const hotelObj = hotelData?.find(
                                (hotel) => hotel._id === detailId._id
                              );

                              return (
                                <div
                                  key={hotelDetailIndex}
                                  className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-lg flex items-center gap-1"
                                >
                                  {hotelObj?.hotelName ||
                                    `Hotel ${hotelDetailIndex + 1}`}
                                  <button
                                    className="ml-1 text-emerald-600 hover:text-emerald-800"
                                    onClick={() =>
                                      removeHotelDetail(
                                        hotelIndex,
                                        hotelDetailIndex
                                      )
                                    }
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-4 w-4"
                                      viewBox="0 0 20 20"
                                      fill="currentColor"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No hotels selected
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Add Hotel
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search for a hotel"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          value={searchTerm}
                          onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setDropdownVisible(true);
                          }}
                          onFocus={() => setDropdownVisible(true)}
                        />

                        {dropdownVisible && searchTerm && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {hotelData
                              ?.filter((hotelOption) =>
                                hotelOption.hotelName
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase())
                              )
                              .map((filteredHotel) => (
                                <div
                                  key={filteredHotel._id}
                                  onClick={() => {
                                    setSelectedHotelIdForDetails(
                                      filteredHotel._id
                                    );
                                    setSearchTerm(filteredHotel.hotelName);
                                    setDropdownVisible(false);
                                  }}
                                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                >
                                  {filteredHotel.hotelName}
                                </div>
                              ))}

                            {hotelData?.filter((hotelOption) =>
                              hotelOption.hotelName
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase())
                            ).length === 0 && (
                              <div className="px-4 py-2 text-gray-500">
                                No results found
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          addHotelDetail(hotel._id);
                          setDropdownVisible(false);
                        }}
                        disabled={!selectedHotelIdForDetails}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          selectedHotelIdForDetails
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Add Selected Hotel
                      </button>
                    </div>
                  </div>
                ))}

                <div className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium mb-4">Add New Location</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location Name
                      </label>
                      <input
                        type="text"
                        value={newLocation}
                        onChange={(e) => setNewLocation(e.target.value)}
                        placeholder="Enter location name"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Hotel
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onFocus={() => setDropdownVisible(true)}
                          placeholder="Search for a hotel"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />

                        {dropdownVisible && searchQuery && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredHotels?.map((hotel) => (
                              <div
                                key={hotel._id}
                                onClick={() => {
                                  setSelectedHotelIdForNewHotel(hotel._id);
                                  setSearchQuery(hotel.hotelName);
                                  setDropdownVisible(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                {hotel.hotelName}
                              </div>
                            ))}

                            {filteredHotels?.length === 0 && (
                              <div className="px-4 py-2 text-gray-500">
                                No results found
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={addNewHotel}
                      disabled={!newLocation || !selectedHotelIdForNewHotel}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        newLocation && selectedHotelIdForNewHotel
                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Add New Location
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => setEditPackage(false)}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveState}
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isSubmitting
                ? "bg-emerald-400 text-white cursor-not-allowed"
                : "bg-emerald-500 text-white hover:bg-emerald-600"
            }`}
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
