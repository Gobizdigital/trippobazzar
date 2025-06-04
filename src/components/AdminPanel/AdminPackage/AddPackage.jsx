"use client";

import { useEffect, useRef, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const AddPackage = ({ addNew, setIsAddingPackage }) => {
  const { data: hotelData, loading } = useFetch(
    `https://trippo-bazzar-backend.vercel.app/api/hotel`
  );

  const [data, setData] = useState({
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
  });

  // Enhanced validation and notification states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Hotel search states - Updated to be location-specific
  const [newLocation, setNewLocation] = useState("");
  const [selectedHotelIdForNewHotel, setSelectedHotelIdForNewHotel] =
    useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Make dropdown states location-specific
  const [hotelSearchStates, setHotelSearchStates] = useState({});
  const [newLocationDropdownVisible, setNewLocationDropdownVisible] =
    useState(false);

  const [bulkHotelInput, setBulkHotelInput] = useState("");
  const [showBulkInput, setShowBulkInput] = useState(false);

  // Active tab state for both mobile and desktop
  const [activeSection, setActiveSection] = useState("basic");

  const filteredHotels = hotelData?.filter((hotel) =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const packageData = ["Food", "Hotel", "Car", "Explore", "Travel", "Visa"];
  const textareasRef = useRef([]);

  // Rich text editor modules/formats configuration
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "color",
    "background",
    "link",
  ];

  // Helper function to clear specific error
  const clearError = (fieldName) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Helper function to get hotel search state for a specific hotel index
  const getHotelSearchState = (hotelIndex) => {
    return (
      hotelSearchStates[hotelIndex] || {
        searchTerm: "",
        dropdownVisible: false,
        selectedHotelId: "",
      }
    );
  };

  // Helper function to update hotel search state for a specific hotel index
  const updateHotelSearchState = (hotelIndex, updates) => {
    setHotelSearchStates((prev) => ({
      ...prev,
      [hotelIndex]: {
        ...getHotelSearchState(hotelIndex),
        ...updates,
      },
    }));
  };

  // Enhanced validation function
  const validateForm = () => {
    const newErrors = {};

    // Basic Information Validation
    if (!data.title.trim()) {
      newErrors.title = "Package title is required";
    }

    if (!data.description.trim()) {
      newErrors.description = "Package description is required";
    }

    // Enhanced pricing validation - fixed logic
    if (data.price <= 0) {
      // If base price is 0 or negative, check if there are valid pricing options
      if (!Array.isArray(data.pricing) || data.pricing.length === 0) {
        newErrors.pricing =
          "Either base price or at least one pricing option with base price is required";
      } else {
        // Check if at least one pricing option has a valid base price
        const hasValidPricingOption = data.pricing.some(
          (item) => item.basePrice && Number(item.basePrice) > 0
        );
        if (!hasValidPricingOption) {
          newErrors.pricing =
            "At least one pricing option must have a base price greater than 0";
        }
      }
    }
    // If base price > 0, no need to check pricing options - it's valid

    // Day description validation - at least one day should have a title
    if (data.dayDescription && data.dayDescription.length > 0) {
      const hasValidDay = data.dayDescription.some(
        (day) => day.dayTitle && day.dayTitle.trim()
      );
      if (!hasValidDay) {
        newErrors.dayDescription = "At least one day must have a title";
      }
    }

    // Hotel validation - if hotels are added, they should have locations
    if (data.hotels && data.hotels.length > 0) {
      const hasInvalidHotel = data.hotels.some(
        (hotel) => !hotel.location || !hotel.location.trim()
      );
      if (hasInvalidHotel) {
        newErrors.hotels = "All hotel entries must have a location";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enhanced change handler with real-time validation
  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when field is edited and has valid content
    if (errors[name]) {
      if (name === "title" || name === "description") {
        if (value.trim()) {
          clearError(name);
        }
      } else {
        clearError(name);
      }
    }

    // Clear pricing error if base price becomes valid
    if (name === "price" && Number(value) > 0 && errors.pricing) {
      clearError("pricing");
    }
  };

  // Handle rich text editor changes
  const handleRichTextChange = (name, value) => {
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Clear error when field is edited
    if (errors[name]) {
      clearError(name);
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

    // Clear pricing error if basePrice is added and valid
    if (name === "basePrice" && Number(value) > 0 && errors.pricing) {
      clearError("pricing");
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
    setNewLocationDropdownVisible(false);

    // Clear hotels error if it exists
    if (errors.hotels) {
      clearError("hotels");
    }
  };

  const handleBulkHotelAdd = () => {
    if (!bulkHotelInput.trim()) return;

    try {
      // Parse the input - expecting format like: "Location: Hotel1, Hotel2; Location2: Hotel3, Hotel4"
      const locationGroups = bulkHotelInput
        .split(";")
        .filter((group) => group.trim());

      const newHotels = [...data.hotels];

      locationGroups.forEach((group) => {
        const [location, hotelsList] = group.split(":");

        if (!location || !hotelsList) return;

        const locationName = location.trim();
        const hotelNames = hotelsList
          .split(",")
          .map((h) => h.trim())
          .filter((h) => h);

        // Find matching hotels in the database
        const matchedHotels = hotelNames
          .map((name) => {
            const hotel = hotelData?.find(
              (h) => h.hotelName.toLowerCase() === name.toLowerCase()
            );
            return hotel?._id;
          })
          .filter((id) => id); // Filter out undefined IDs

        if (matchedHotels.length > 0) {
          newHotels.push({
            location: locationName,
            hotelDetails: matchedHotels,
          });
        }
      });

      setData((prevData) => ({
        ...prevData,
        hotels: newHotels,
      }));

      setBulkHotelInput("");
      setShowBulkInput(false);

      // Clear hotels error if it exists
      if (errors.hotels) {
        clearError("hotels");
      }
    } catch (error) {
      console.error("Error parsing bulk hotel input:", error);
      setErrorMessage(
        "There was an error processing your input. Please check the format and try again."
      );
      setShowErrorNotification(true);
    }
  };

  const removeHotel = (hotelIndex) => {
    const updatedHotels = data.hotels.filter(
      (_, index) => index !== hotelIndex
    );

    setData((prevData) => ({
      ...prevData,
      hotels: updatedHotels,
    }));

    // Clean up search state for removed hotel
    setHotelSearchStates((prev) => {
      const newStates = { ...prev };
      delete newStates[hotelIndex];
      // Reindex remaining states
      const reindexedStates = {};
      Object.keys(newStates).forEach((key) => {
        const index = Number.parseInt(key);
        if (index > hotelIndex) {
          reindexedStates[index - 1] = newStates[key];
        } else {
          reindexedStates[key] = newStates[key];
        }
      });
      return reindexedStates;
    });
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

  // Fixed addHotelDetail function - using the logic from EditPackage
  const addHotelDetail = (hotelIndex) => {
    const hotelSearchState = getHotelSearchState(hotelIndex);
    const selectedHotel = hotelData?.find(
      (hotel) => hotel._id === hotelSearchState.selectedHotelId
    );

    if (selectedHotel) {
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

    // Clear search state for this hotel
    updateHotelSearchState(hotelIndex, {
      searchTerm: "",
      dropdownVisible: false,
      selectedHotelId: "",
    });
  };

  // Enhanced save function with better error handling
  const saveState = async () => {
    setIsSubmitting(true);
    setShowErrorNotification(false);
    setShowSuccessNotification(false);

    if (!validateForm()) {
      // Scroll to the first error and show error notification
      const firstErrorField = Object.keys(errors)[0];
      const element =
        document.querySelector(`[name="${firstErrorField}"]`) ||
        document.querySelector(`[data-field="${firstErrorField}"]`);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      setErrorMessage("Please fix the highlighted errors before saving.");
      setShowErrorNotification(true);
      setIsSubmitting(false);
      return;
    }

    try {
      await addNew(data);

      // Show success notification
      setShowSuccessNotification(true);

      // Reset form after successful submission
      setTimeout(() => {
        setIsAddingPackage(false);
        setData({
          title: "",
          description: "",
          price: 0,
          whatsIncluded: [],
          coupon: [],
          MainPhotos: [],
          pricing: [],
          dayDescription: [],
          specialInstruction: "",
          conditionOfTravel: "",
          thingsToMaintain: "",
          hotels: [],
          policies: "",
          termsAndConditions: "",
        });
        setShowSuccessNotification(false);
      }, 2000);
    } catch (error) {
      console.log(error);
      setErrorMessage("Error creating package. Please try again.");
      setShowErrorNotification(true);
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

    // Clear day description error if title is added
    if (
      field === "dayDescription" &&
      subField === "dayTitle" &&
      value.trim() &&
      errors.dayDescription
    ) {
      clearError("dayDescription");
    }
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

    // Clear hotels error if location is added
    if (value.trim() && errors.hotels) {
      clearError("hotels");
    }
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

  // Auto-hide notifications
  useEffect(() => {
    if (showErrorNotification) {
      const timer = setTimeout(() => {
        setShowErrorNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showErrorNotification]);

  // Navigation tabs for both mobile and desktop with error indicators
  const navigationTabs = [
    {
      id: "basic",
      label: "Basic Info",
      icon: "📋",
      hasError: !!(errors.title || errors.description || errors.pricing),
    },
    { id: "photos", label: "Photos", icon: "🖼️", hasError: false },
    {
      id: "pricing",
      label: "Pricing",
      icon: "💰",
      hasError: !!errors.pricing,
    },
    {
      id: "days",
      label: "Itinerary",
      icon: "🗓️",
      hasError: !!errors.dayDescription,
    },
    { id: "included", label: "Included", icon: "✅", hasError: false },
    {
      id: "hotels",
      label: "Hotels",
      icon: "🏨",
      hasError: !!errors.hotels,
    },
    { id: "details", label: "Details", icon: "📝", hasError: false },
  ];

  // Check if form has any errors to disable save button - FIXED
  const hasErrors =
    Object.keys(errors).filter(
      (key) => errors[key] !== null && errors[key] !== undefined
    ).length > 0;

  console.log("Current errors:", errors);
  console.log("Has errors:", hasErrors);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2 animate-pulse">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span className="font-medium">Package added successfully!</span>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-2">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span className="font-medium">{errorMessage}</span>
          <button
            onClick={() => setShowErrorNotification(false)}
            className="ml-2 text-white hover:text-gray-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      )}

      <div className="container mx-auto max-w-6xl">
        {/* Tabbed Navigation - Both Mobile and Desktop with Error Indicators */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            {navigationTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`px-4 py-3 rounded-t-lg text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-colors relative ${
                  activeSection === tab.id
                    ? "bg-white text-blue-600 border-t border-l border-r border-gray-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="hidden sm:inline">{tab.icon}</span>
                {tab.label}
                {tab.hasError && (
                  <span
                    className="text-red-500 text-lg font-bold ml-1"
                    title="This section has errors"
                  >
                    !
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          {/* Basic Information Section */}
          {activeSection === "basic" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
                Basic Information
                {(errors.title || errors.description || errors.pricing) && (
                  <span
                    className="text-red-500 text-2xl ml-2"
                    title="This section has errors"
                  >
                    !
                  </span>
                )}
              </h2>

              <div className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Package Title
                    <span className="text-red-500 ml-1">*</span>
                    {errors.title && (
                      <span
                        className="text-red-500 text-lg ml-2"
                        title={errors.title}
                      >
                        !
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.title
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    placeholder="Enter package title"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <span className="text-red-500 mr-1">⚠</span>
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description - Regular textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Description
                    <span className="text-red-500 ml-1">*</span>
                    {errors.description && (
                      <span
                        className="text-red-500 text-lg ml-2"
                        title={errors.description}
                      >
                        !
                      </span>
                    )}
                  </label>
                  <textarea
                    name="description"
                    value={data.description}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.description
                        ? "border-red-500 bg-red-50"
                        : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]`}
                    placeholder="Enter package description"
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <span className="text-red-500 mr-1">⚠</span>
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                    Base Price
                    {errors.pricing && (
                      <span
                        className="text-red-500 text-lg ml-2"
                        title={errors.pricing}
                      >
                        !
                      </span>
                    )}
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
                      className={`w-full pl-8 pr-4 py-2 rounded-lg border ${
                        errors.pricing
                          ? "border-red-500 bg-red-50"
                          : "border-gray-300"
                      } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      placeholder="0.00"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Either base price or pricing options must be provided
                  </p>
                  {errors.pricing && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                      <span className="text-red-500 mr-1">⚠</span>
                      {errors.pricing}
                    </p>
                  )}
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
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex items-center gap-1"
                    >
                      {item}
                      <button
                        className="ml-1 text-blue-600 hover:text-blue-800"
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
                          ? "bg-blue-500 text-white"
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
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
                Package Pricing
                {errors.pricing && (
                  <span
                    className="text-red-500 text-2xl ml-2"
                    title="This section has errors"
                  >
                    !
                  </span>
                )}
              </h2>

              {errors.pricing && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center">
                  <span className="text-red-500 mr-2">⚠</span>
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">Select Package Type</option>
                          <option value="Budget">Budget</option>
                          <option value="Standard">Standard</option>
                          <option value="Deluxe">Deluxe</option>
                          <option value="Super Deluxe">Super Deluxe</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Premium">Premium</option>
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
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300"
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
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="w-full pl-8 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
                Day Description
                {errors.dayDescription && (
                  <span
                    className="text-red-500 text-2xl ml-2"
                    title="This section has errors"
                  >
                    !
                  </span>
                )}
              </h2>

              {errors.dayDescription && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center">
                  <span className="text-red-500 mr-2">⚠</span>
                  {errors.dayDescription}
                </div>
              )}

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
                              (_, index) => index !== dayIndex
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
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={`Day ${dayIndex + 1} Title`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Day Details
                        </label>
                        <ReactQuill
                          theme="snow"
                          value={day.dayDetails}
                          onChange={(content) =>
                            handleArrayChange(
                              "dayDescription",
                              dayIndex,
                              "dayDetails",
                              content
                            )
                          }
                          modules={quillModules}
                          formats={quillFormats}
                          className="bg-white rounded-lg"
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
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          className="flex items-center gap-2 px-4 py-2 mt-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
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
                  <ReactQuill
                    theme="snow"
                    value={data.specialInstruction}
                    onChange={(content) =>
                      handleRichTextChange("specialInstruction", content)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white rounded-lg"
                    placeholder="Enter any special instructions"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conditions of Travel
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={data.conditionOfTravel}
                    onChange={(content) =>
                      handleRichTextChange("conditionOfTravel", content)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white rounded-lg"
                    placeholder="Enter conditions of travel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Things to Maintain
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={data.thingsToMaintain}
                    onChange={(content) =>
                      handleRichTextChange("thingsToMaintain", content)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white rounded-lg"
                    placeholder="Enter things to maintain"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Policies
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={data.policies}
                    onChange={(content) =>
                      handleRichTextChange("policies", content)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white rounded-lg"
                    placeholder="Enter policies"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms and Conditions
                  </label>
                  <ReactQuill
                    theme="snow"
                    value={data.termsAndConditions}
                    onChange={(content) =>
                      handleRichTextChange("termsAndConditions", content)
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="bg-white rounded-lg"
                    placeholder="Enter terms and conditions"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Hotels Section - FIXED */}
          {activeSection === "hotels" && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2 flex items-center">
                Hotels
                {errors.hotels && (
                  <span
                    className="text-red-500 text-2xl ml-2"
                    title="This section has errors"
                  >
                    !
                  </span>
                )}
              </h2>

              {errors.hotels && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg border border-red-200 flex items-center">
                  <span className="text-red-500 mr-2">⚠</span>
                  {errors.hotels}
                </div>
              )}

              <div className="p-4 border border-gray-200 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Bulk Add Hotels</h3>
                  <button
                    onClick={() => setShowBulkInput(!showBulkInput)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {showBulkInput ? "Hide" : "Show"}
                  </button>
                </div>

                {showBulkInput && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Paste Hotels (Format: Location: Hotel1, Hotel2;
                        Location2: Hotel3, Hotel4)
                      </label>
                      <textarea
                        value={bulkHotelInput}
                        onChange={(e) => setBulkHotelInput(e.target.value)}
                        placeholder="Delhi: Taj Palace, Hyatt Regency; Mumbai: Oberoi, Trident"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Format: "Location: Hotel1, Hotel2; Location2: Hotel3,
                        Hotel4"
                        <br />
                        Note: Only hotels that match names in the database will
                        be added.
                      </p>
                    </div>

                    <button
                      onClick={handleBulkHotelAdd}
                      disabled={!bulkHotelInput.trim()}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        bulkHotelInput.trim()
                          ? "bg-blue-500 text-white hover:bg-blue-600"
                          : "bg-gray-200 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Add Bulk Hotels
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {data?.hotels?.map((hotel, hotelIndex) => {
                  const hotelSearchState = getHotelSearchState(hotelIndex);

                  return (
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter location"
                          />
                        </div>
                        <button
                          onClick={() => removeHotel(hotelIndex)}
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
                                  (hotel) => hotel._id === detailId
                                );

                                return (
                                  <div
                                    key={hotelDetailIndex}
                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg flex items-center gap-1"
                                  >
                                    {hotelObj?.hotelName ||
                                      `Hotel ${hotelDetailIndex + 1}`}
                                    <button
                                      className="ml-1 text-blue-600 hover:text-blue-800"
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={hotelSearchState.searchTerm}
                            onChange={(e) => {
                              updateHotelSearchState(hotelIndex, {
                                searchTerm: e.target.value,
                                dropdownVisible: true,
                              });
                            }}
                            onFocus={() => {
                              updateHotelSearchState(hotelIndex, {
                                dropdownVisible: true,
                              });
                            }}
                          />

                          {hotelSearchState.dropdownVisible &&
                            hotelSearchState.searchTerm && (
                              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {hotelData
                                  ?.filter((hotelOption) =>
                                    hotelOption.hotelName
                                      .toLowerCase()
                                      .includes(
                                        hotelSearchState.searchTerm.toLowerCase()
                                      )
                                  )
                                  .map((filteredHotel) => (
                                    <div
                                      key={filteredHotel._id}
                                      onClick={() => {
                                        updateHotelSearchState(hotelIndex, {
                                          selectedHotelId: filteredHotel._id,
                                          searchTerm: filteredHotel.hotelName,
                                          dropdownVisible: false,
                                        });
                                      }}
                                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                      {filteredHotel.hotelName}
                                    </div>
                                  ))}

                                {hotelData?.filter((hotelOption) =>
                                  hotelOption.hotelName
                                    .toLowerCase()
                                    .includes(
                                      hotelSearchState.searchTerm.toLowerCase()
                                    )
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
                            addHotelDetail(hotelIndex);
                          }}
                          disabled={!hotelSearchState.selectedHotelId}
                          className={`px-4 py-2 rounded-lg transition-colors ${
                            hotelSearchState.selectedHotelId
                              ? "bg-blue-500 text-white hover:bg-blue-600"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        >
                          Add Selected Hotel
                        </button>
                      </div>
                    </div>
                  );
                })}

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
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          onFocus={() => setNewLocationDropdownVisible(true)}
                          placeholder="Search for a hotel"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />

                        {newLocationDropdownVisible && searchQuery && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredHotels?.map((hotel) => (
                              <div
                                key={hotel._id}
                                onClick={() => {
                                  setSelectedHotelIdForNewHotel(hotel._id);
                                  setSearchQuery(hotel.hotelName);
                                  setNewLocationDropdownVisible(false);
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
                          ? "bg-blue-500 text-white hover:bg-blue-600"
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
            onClick={() => setIsAddingPackage(false)}
            className="px-6 py-3 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={saveState}
            disabled={isSubmitting || hasErrors}
            className={`px-6 py-3 rounded-lg transition-colors flex items-center justify-center ${
              isSubmitting || hasErrors
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </>
            ) : hasErrors ? (
              <>
                <span className="text-red-300 mr-2">!</span>
                Fix Errors to Save
              </>
            ) : (
              "Save Package"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
