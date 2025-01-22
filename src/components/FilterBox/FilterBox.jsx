import { useEffect, useMemo, useState } from "react";
import { FaStar } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { useSearch } from "../../../context/SearchContext";

export default function FilterBox({ onClose, style, showModal }) {
  const [isVisible, setIsVisible] = useState(showModal);
  const { filterProp, setFilterProp } = useSearch();

  const checkboxOptions = [
    { name: "lessThan50000", label: "Less than ₹50,000" },
    { name: "between500000And1000000", label: "₹5,00,000 - ₹10,00,000" },
    { name: "between1000000And1500000", label: "₹10,00,000 - ₹15,00,000" },
    { name: "moreThan1500000", label: "More than ₹15,00,000" },
  ];

  const checkboxPreferences = [
    { name: "hotelstay", label: "Hotel stay" },
    { name: "meals", label: "Meals" },
    { name: "localtransport", label: "Local transport" },
    { name: "sightseeing", label: "Sightseeing" },
  ];

  const flightInclusive = [
    { value: "withoutflight", label: "Without Flight" },
    { value: "withflight", label: "With Flight" },
  ];

  const ThemePreferences = [
    { name: "architecture", label: "Architecture" },
    { name: "artsandentertainment", label: "Arts and Entertainment" },
    { name: "history", label: "History" },
    { name: "inventions", label: "Inventions" },
    { name: "religion", label: "Religion" },
    { name: "music", label: "Music" },
    { name: "sports", label: "Sports" },
  ];

  const handleChange = (event, type) => {
    const { name, value, checked } = event.target;
    setFilterProp((prevValues) => {
      switch (type) {
        case "checkbox":
          return {
            ...prevValues,
            checkboxes: {
              ...prevValues.checkboxes,
              [name]: checked,
            },
          };
        case "preferences":
          return {
            ...prevValues,
            selectPreferences: {
              ...prevValues.selectPreferences,
              [name]: checked,
            },
          };
        case "theme":
          return {
            ...prevValues,
            themePreferences: {
              ...prevValues.themePreferences,
              [name]: checked,
            },
          };
        case "range":
          return {
            ...prevValues,
            range: value,
          };
        case "sort":
          return {
            ...prevValues,
            sortBy: value,
          };
        case "visa":
          return {
            ...prevValues,
            visaIncluded: checked,
          };
        case "reviews":
          return {
            ...prevValues,
            reviews: value,
          };
        default:
          return prevValues;
      }
    });
  };
  const sliderBackground = useMemo(() => {
    const sliderValue = filterProp.range;
    const percentage = ((sliderValue - 0) / (10 - 0)) * 100;
    return `linear-gradient(90deg, #59cfd8 ${percentage}%, #ccc ${percentage}%)`;
  }, [filterProp.range]);
  const getReviewBackground = useMemo(() => {
    const ReviewValue = filterProp.reviews;
    const percentage = ((ReviewValue - 0) / (5 - 0)) * 100; // Adjust for your range min/max
    return `linear-gradient(to right, #03B58B ${percentage}%, #ddd ${percentage}%)`;
  }, [filterProp.reviews]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilterProp((prev) => ({ ...prev, ...filterProp }));
    onClose();
  };

  const resetButton = () => {
    setFilterProp({
      range: "0",
      checkboxes: {
        lessThan50000: false,
        between500000And1000000: false,
        between1000000And1500000: false,
        moreThan1500000: false,
      },
      reviews: "0",
      sortBy: "withoutflight",
      visaIncluded: false,
      selectPreferences: {
        hotelstay: false,
        meals: false,
        localtransport: false,
        sightseeing: false,
      },
      themePreferences: {
        architecture: false,
        artsandentertainment: false,
        history: false,
        inventions: false,
        religion: false,
        music: false,
        sports: false,
      },
    });
  };

  useEffect(() => {
    if (showModal) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [showModal]);

  return (
    <div
    style={{
      opacity: showModal ? 1 : 0,
      visibility: showModal ? "visible" : "hidden",
      transition: "opacity 300ms ease-in-out, visibility 300ms ease-in-out",
    }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-md"
  >
    <div
      className="bg-white rounded-lg w-full max-w-[52rem] pt-14  shadow-lg overflow-hidden"
      style={{
        maxHeight: "90vh", // Ensure the modal doesn't overflow the screen
        overflowY: "auto", // Enable scrolling for long content
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Modal Header */}
        <div className="py-4 px-4 flex justify-between items-center border-b">
          <h2 className="text-lg font-bold uppercase">Filters</h2>
          <IoCloseOutline
            onClick={onClose}
            className="w-6 h-6 cursor-pointer text-gray-600 hover:text-black"
          />
        </div>
  
        {/* Modal Body */}
        <div className="px-4 py-4 space-y-6">
          {/* Duration Section */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Duration</h3>
            <input
              type="range"
              min="0"
              max="10"
              value={filterProp.range}
              onChange={(e) => handleChange(e, "range")}
              className="custom-range w-full"
              style={{ background: sliderBackground }}
            />
            <p className="text-gray-500 mt-1">{filterProp.range} days</p>
          </div>
  
          {/* Budget Section */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-4">Budget</h3>
            <div className="flex flex-col gap-2">
              {checkboxOptions.map((option, idx) => (
                <div
                  className="flex items-center justify-between"
                  key={idx}
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      name={option.name}
                      checked={filterProp.checkboxes[option.name]}
                      onChange={(e) => handleChange(e, "checkbox")}
                    />
                    {option.label}
                  </label>
                  <p className="text-gray-500">(23)</p>
                </div>
              ))}
            </div>
          </div>
  
          {/* Customer Reviews Section */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-2">Customer Reviews</h3>
            <input
              type="range"
              min="0"
              max="5"
              value={filterProp.reviews}
              onChange={(e) => handleChange(e, "reviews")}
              className="custom-range w-full"
              style={{ background: getReviewBackground }}
            />
            <div className="flex items-center gap-1 mt-1">
              <p className="text-lg">{filterProp.reviews}</p>
              <FaStar className="text-yellow-300" />
            </div>
          </div>
  
          {/* Flight Inclusive Section */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-4">Flight Inclusive</h3>
            <div className="flex flex-wrap gap-4">
              {flightInclusive.map((option) => (
                <div className="flex items-center" key={option.value}>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="sortBy"
                      value={option.value}
                      checked={filterProp.sortBy === option.value}
                      onChange={(e) => handleChange(e, "sort")}
                      className="custom-radio"
                    />
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
  
          {/* Additional Options */}
          <div className="border-b pb-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="custom-checkbox"
                name="visa"
                checked={filterProp.visaIncluded}
                onChange={(e) => handleChange(e, "visa")}
              />
              Include packages with visa services
            </label>
          </div>
  
          {/* Preferences Section */}
          <div className="border-b pb-4">
            <h3 className="font-medium mb-4">Select Preferences To Include</h3>
            <div className="flex flex-col gap-2">
              {checkboxPreferences.map((option, idx) => (
                <div
                  className="flex items-center justify-between"
                  key={idx}
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      name={option.name}
                      checked={filterProp.selectPreferences[option.name]}
                      onChange={(e) => handleChange(e, "preferences")}
                    />
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
  
          {/* Themes Section */}
          <div className="pb-4">
            <h3 className="font-medium mb-4">Themes</h3>
            <div className="flex flex-col gap-2">
              {ThemePreferences.map((option, idx) => (
                <div
                  className="flex items-center justify-between"
                  key={idx}
                >
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="custom-checkbox"
                      name={option.name}
                      checked={filterProp.themePreferences[option.name]}
                      onChange={(e) => handleChange(e, "theme")}
                    />
                    {option.label}
                  </label>
                  <p className="text-gray-500">(23)</p>
                </div>
              ))}
            </div>
          </div>
        </div>
  
        {/* Modal Footer */}
        <div className="px-4 py-4 flex justify-between items-center bg-gray-100 border-t">
          <button
            type="button"
            onClick={resetButton}
            className="text-med-green hover:underline"
          >
            Clear All
          </button>
          <button
            type="submit"
            className="bg-med-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Apply Filter
          </button>
        </div>
      </form>
    </div>
  </div>
  
  
  );
}
