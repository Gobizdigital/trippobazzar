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
      visibility: isVisible ? "visible" : "hidden",
      transition: "opacity 300ms ease-in-out",
    }}
    className="fixed w-full sm:pl-[10%] sm:pr-[10%] md:pl-[20%] md:pr-[20%] pt-16 pb-12 p-4 font-poppins inset-0 z-50 flex items-center justify-center bg-transpernt backdrop-blur-sm bg-opacity-50"
  >
      <div
        style={style}
        className="bg-[#f8f8f8] md:pt-9  lg:pt-10  overflow-hidden rounded-lg w-full max-w-[52rem] shadow-lg "
      >
        <form onSubmit={handleSubmit}>
          <div className=" py-3 md:py-5 md:p-5">
            <div className="flex justify-between mb-8 px-4 items-center">
              <h2 className="text-xl uppercase font-bold ">Filters</h2>
              <IoCloseOutline
                onClick={onClose}
                className="w-5 h-5 cursor-pointer"
              />
            </div>
            <div className="flex overflow-y-auto max-h-[70vh] md:max-h-[70vh] flex-col md:flex-row pb-2 justify-between">
              <div className="flex-1 px-4 mr-2">
                <div className="pb-6 border-b-2">
                  <h3 className="font-medium mb-1">Duration</h3>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={filterProp.range}
                    onChange={(e) => handleChange(e, "range")}
                    className="custom-range"
                    style={{ background: sliderBackground }} // Inline style for dynamic background
                  />
                  <p className="text-gray-500">{filterProp.range} days</p>
                </div>
                <div className="mt-6 pb-6 border-b-2">
                  <h3 className="font-medium mb-4">Budget</h3>
                  <div className="flex flex-col gap-2">
                    {checkboxOptions.map((option, idx) => (
                      <div
                        className="flex items-center justify-between"
                        key={idx}
                      >
                        <label className="flex items-center gap-1">
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
                <div className="mt-6 pb-6 border-b-2">
                  <h3 className="font-medium mb-1">Customer Reviews</h3>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={filterProp.reviews}
                    onChange={(e) => handleChange(e, "reviews")}
                    className="custom-range-two"
                    style={{ background: getReviewBackground }} // Inline style for dynamic background
                  />
                  <div className="flex items-center gap-1">
                    <p className="m-0 text-lg">{filterProp.reviews} </p>
                    <FaStar className="text-yellow-300 mb-[2px]" />
                  </div>
                </div>
                <div className="mt-6 pb-6 border-b-2">
                  <h3 className="font-medium mb-4">Flight Inclusive</h3>
                  <div className="flex flex-wrap gap-4">
                    {flightInclusive.map((option) => (
                      <div className="flex items-center" key={option.value}>
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="sortBy" // Same name for sort radio buttons
                            value={option.value} // Value that corresponds to the sort option
                            checked={filterProp.sortBy === option.value} // Check if this option is selected
                            onChange={(e) => handleChange(e, "sort")} // Handle change event
                            className="custom-radio" // Add any custom styling you want
                          />
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pb-6 border-b-2 md:border-b-0 md:pb-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1">
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
                </div>
              </div>
              <div className="h-auto border md:block hidden"></div>{" "}
              <div className="flex-1 px-4 mr-2 md:ml-2">
                <div className="pb-6 mt-6 md:mt-0  border-b-2">
                  <h3 className="font-medium mb-4">
                    Select Preferences To Include
                  </h3>
                  <div className="flex flex-col gap-2">
                    {checkboxPreferences.map((option, idx) => (
                      <div
                        className="flex items-center justify-between"
                        key={idx}
                      >
                        <label className="flex items-center gap-1">
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
                <div className="mt-6 pb-6">
                  <h3 className="font-medium mb-4">Themes</h3>
                  <div className="flex flex-col gap-2">
                    {ThemePreferences.map((option, idx) => (
                      <div
                        className="flex items-center justify-between"
                        key={idx}
                      >
                        <label className="flex items-center gap-1">
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
            </div>
          </div>
          <div className="px-4 py-4  rounded-b-lg bg-white">
            <div className="md:px-4 pb-2 flex justify-between items-center">
              <div>
                <button
                  type="button"
                  onClick={resetButton}
                  className="text-med-green hover:text-[#03b58cc4]"
                >
                  Clear All
                </button>
              </div>
              <div>
                <button
                  type="submit"
                  className="text-med-green px-4 py-3 border hover:text-white hover:bg-med-green transition-colors ease-in-out duration-200 rounded-lg"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
