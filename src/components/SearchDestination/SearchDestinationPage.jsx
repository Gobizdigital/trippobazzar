"use client";

import { useState, useRef, useEffect } from "react";
import FilterSvg from "../../../svgs/FilterSvg/index";
import DatePicker from "react-datepicker";
import FilterBox from "../FilterBox/FilterBox";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";
import useFetch from "../../../hooks/useFetch";

export default function SearchDestinationPage() {
  const [showModal, setShowModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const toggleModal = () => setShowModal(!showModal);
  const navigate = useNavigate();
  const { searchData, setSearchData } = useSearch();

  // Fetch continent data from API (same as DiscoverNewHorizon)
  const { data: apiData } = useFetch(
    `https://trippo-bazzar-backend.vercel.app/api/continent/fields/query?fields=ContinentName,Countries&onlyIndiaStates=false`,
    false
  );

  // Transform API data to flat destinations array (same logic as DiscoverNewHorizon)
  const transformToFlatDestinations = () => {
    if (!apiData) return [];

    const continents = apiData;
    const flatDestinations = [];

    // Iterate through all continents
    continents.forEach((continent) => {
      if (!continent.Countries || continent.Countries.length === 0) return;

      // Iterate through all countries in each continent
      continent.Countries.forEach((country) => {
        // Add the country itself as a destination
        flatDestinations.push({
          name: country.CountryName,
          region: continent.ContinentName,
          path: `/destination/${continent.ContinentName}/${country.CountryName}`,
          type: "country",
        });

        // Check if the country has states and add them
        if (country.States && country.States.length > 0) {
          country.States.forEach((state) => {
            flatDestinations.push({
              name: state.StateName,
              region: `${country.CountryName}, ${continent.ContinentName}`,
              path: `/destination/${continent.ContinentName}/${country.CountryName}/${state.StateName}`,
              type: "state",
              country: country.CountryName,
            });
          });
        }
      });
    });

    return flatDestinations;
  };

  const flatDestinations = transformToFlatDestinations();

  const incrementGuests = () => {
    setSearchData((prev) => ({
      ...prev,
      guests: prev.guests + 1,
    }));
  };

  const decrementGuests = () => {
    setSearchData((prev) => ({
      ...prev,
      guests: prev.guests > 1 ? prev.guests - 1 : 1,
    }));
  };

  // Filter destinations based on search input
  const filteredDestinations = flatDestinations.filter((destination) =>
    destination?.name
      ?.toLowerCase()
      .includes(searchData?.destination?.toLowerCase() || "")
  );

  // Single handleChange function
  const handleChange = (name, value) => {
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (name === "destination") {
      setSelectedIndex(-1); // Reset selection when typing
    }
  };

  const handleDestinationClick = (destination) => {
    navigate(destination.path);
    setDropdownVisible(false);
  };

  // Handle destination selection (both click and keyboard)
  const handleDestinationSelect = (destination) => {
    setSearchData((prev) => ({
      ...prev,
      destination: destination.name,
    }));
    handleDestinationClick(destination);
  };

  const handleSearch = () => {
    const selectedDestination = flatDestinations.find(
      (destination) =>
        destination.name.toLowerCase() === searchData.destination?.toLowerCase()
    );

    if (selectedDestination) {
      handleDestinationClick(selectedDestination);
    } else if (filteredDestinations.length > 0) {
      handleDestinationClick(filteredDestinations[0]);
    } else {
      navigate("/");
    }
  };

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!dropdownVisible || filteredDestinations.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredDestinations.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredDestinations.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredDestinations.length) {
          const selectedDestination = filteredDestinations[selectedIndex];
          handleDestinationSelect(selectedDestination);
        } else if (filteredDestinations.length > 0) {
          handleDestinationSelect(filteredDestinations[0]);
        }
        break;
      case "Escape":
        setDropdownVisible(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement = dropdownRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  // Show the dropdown when the input is focused
  const handleFocus = () => {
    setDropdownVisible(true);
    setSelectedIndex(-1);
  };

  // Hide the dropdown when the input loses focus
  const handleBlur = () => {
    setTimeout(() => {
      setDropdownVisible(false);
      setSelectedIndex(-1);
    }, 200);
  };

  return (
    <div className="bg-search-image font-poppins relative max-w-[1920px] mx-auto flex justify-center bg-cover bg-center h-[90%]">
      <div className="w-full h-full bg-gray-50 opacity-40 absolute inset-0"></div>
      <div className="flex flex-col py-20 w-[90%] mx-auto justify-center items-center">
        <div className="relative z-10">
          <p className="text-xl esm:text-2xl ew:text-3xl sm:text-6xl mb-20 text-center font-bold">
            Discover a new destination,
            <br />
            <span className="text-med-green">
              with every step of your journey!
            </span>
          </p>
        </div>

        <div className="max-w-[1720px] w-full h-auto p-4 md:p-16 bg-white shadow-lg rounded-lg relative z-10">
          {/* Starting Location and Destination Inputs */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
              <div className="flex items-center bg-[#f8f8f8] border rounded-md py-3 px-2 w-full hover:shadow-md transition-shadow duration-300">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter Destination"
                  className="w-full bg-transparent focus:outline-none"
                  value={searchData.destination || ""}
                  onChange={(e) => handleChange("destination", e.target.value)}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                />
              </div>

              {/* Enhanced Dropdown with keyboard navigation */}
              {dropdownVisible && searchData.destination && (
                <div className="absolute mt-2 w-full z-20 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-hidden">
                  {filteredDestinations.length > 0 ? (
                    <ul ref={dropdownRef} className="overflow-y-auto max-h-60">
                      {filteredDestinations.map((destination, index) => (
                        <li
                          key={`${destination.region}-${destination.name}-${
                            destination.type || "country"
                          }`}
                          onClick={() => handleDestinationSelect(destination)}
                          className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-200 ${
                            index === selectedIndex
                              ? "bg-[#02896F] text-white"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span
                                className={`font-medium ${
                                  index === selectedIndex
                                    ? "text-white"
                                    : "text-gray-900"
                                }`}
                              >
                                {destination.name}
                              </span>
                              {destination.type === "state" && (
                                <span
                                  className={`text-xs px-2 py-1 rounded-full ${
                                    index === selectedIndex
                                      ? "bg-white/20 text-white"
                                      : "bg-gray-200 text-gray-600"
                                  }`}
                                >
                                  State
                                </span>
                              )}
                            </div>
                            <span
                              className={`text-sm ${
                                index === selectedIndex
                                  ? "text-gray-200"
                                  : "text-gray-500"
                              }`}
                            >
                              {destination.region}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-center">
                      {!apiData ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#02896F]"></div>
                          <span>Loading destinations...</span>
                        </div>
                      ) : (
                        "No destinations found"
                      )}
                    </div>
                  )}

                  {/* Keyboard navigation hint */}
                  {filteredDestinations.length > 0 && (
                    <div className="px-4 py-2 bg-gray-50 border-t text-xs text-gray-500 flex items-center justify-between">
                      <span>Use ↑↓ to navigate</span>
                      <span>Press Enter to select</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="md:w-auto w-full flex justify-end">
              <div
                className="cursor-pointer hover:scale-110 transition-transform duration-300"
                onClick={toggleModal}
              >
                <FilterSvg />
              </div>
            </div>
          </div>

          {/* Date Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6 items-end">
            {/* Start Date */}
            <div className="flex flex-col">
              <p className="text-gray-500 font-medium mb-1">Start Date</p>
              <div className="flex items-center bg-gray-100 rounded-md p-2 h-12 hover:shadow-md transition-shadow duration-300">
                <DatePicker
                  placeholderText="E.g 2024-03-02"
                  selected={searchData.startDate}
                  onChange={(date) => handleChange("startDate", date)}
                  className="outline-2 p-2 w-full outline-med-green bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <p className="text-gray-500 font-medium mb-1">End Date</p>
              <div className="flex items-center bg-gray-100 rounded-md p-2 h-12 hover:shadow-md transition-shadow duration-300">
                <DatePicker
                  placeholderText="E.g 2024-03-02"
                  selected={searchData.endDate}
                  onChange={(date) => handleChange("endDate", date)}
                  className="outline-2 p-2 w-full outline-med-green bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer"
                  dateFormat="yyyy-MM-dd"
                  required
                />
              </div>
            </div>

            {/* Guests Selector */}
            <div className="flex flex-col">
              <p className="text-gray-500 mb-1 font-medium">Guests</p>
              <div className="flex items-center justify-around bg-gray-100 rounded-md p-2 h-12 hover:shadow-md transition-shadow duration-300">
                <button
                  onClick={decrementGuests}
                  className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full hover:scale-110 transition-transform duration-300"
                >
                  -
                </button>
                <p className="font-medium text-[#717A7C] text-lg">
                  {searchData.guests || 1} guest
                  {(searchData.guests || 1) > 1 ? "s" : ""}
                </p>
                <button
                  onClick={incrementGuests}
                  className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full hover:scale-110 transition-transform duration-300"
                >
                  +
                </button>
              </div>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="flex w-full text-center text-lg h-12 items-center justify-center font-medium px-4 py-2 bg-med-green text-white rounded-md hover:scale-95 hover:shadow-md transition-all duration-300"
            >
              <p>Search Packages</p>
            </button>
          </div>
        </div>
      </div>

      <FilterBox showModal={showModal} onClose={toggleModal} />
    </div>
  );
}
