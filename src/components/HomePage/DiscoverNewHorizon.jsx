"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dalLekFull from "/bg-home.webp?url";
import dalLekSmall from "/bg-home-small.webp?url";
import discoverOne from "../../assets/home/Discover-1.svg";
import FilterSvg from "../../../svgs/FilterSvg/index";
import DatePicker from "react-datepicker";
import ExploreSvg from "../../../svgs/ExploreSvg";
import FilterBox from "../FilterBox/FilterBox";
import { useSearch } from "../../../context/SearchContext";
import useFetch from "../../../hooks/useFetch";

export default function DiscoverNewHorizon() {
  const navigate = useNavigate();
  const { setSearchData } = useSearch();
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  const [formState, setFormState] = useState({
    guests: 1,
    showModal: false,
    isFocused: false,
    searchQuery: "",
    startDate: null,
    endDate: null,
    startLocation: "Ahmedabad",
    selectedIndex: -1, // For keyboard navigation
  });

  // Fetch continent data from API
  const { data: apiData } = useFetch(
    `https://trippo-bazzar-backend.vercel.app/api/continent/fields/query?fields=ContinentName,Countries&onlyIndiaStates=false`,
    false
  );

  // Transform API data to flat destinations array
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

  // Filter destinations based on input
  const filteredDestinations = flatDestinations.filter((destination) =>
    destination.name.toLowerCase().includes(formState.searchQuery.toLowerCase())
  );

  // Keyboard navigation handler
  const handleKeyDown = (e) => {
    if (!formState.isFocused || filteredDestinations.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFormState((prev) => ({
          ...prev,
          selectedIndex:
            prev.selectedIndex < filteredDestinations.length - 1
              ? prev.selectedIndex + 1
              : 0,
        }));
        break;
      case "ArrowUp":
        e.preventDefault();
        setFormState((prev) => ({
          ...prev,
          selectedIndex:
            prev.selectedIndex > 0
              ? prev.selectedIndex - 1
              : filteredDestinations.length - 1,
        }));
        break;
      case "Enter":
        e.preventDefault();
        if (
          formState.selectedIndex >= 0 &&
          formState.selectedIndex < filteredDestinations.length
        ) {
          const selectedDestination =
            filteredDestinations[formState.selectedIndex];
          handleDestinationSelect(selectedDestination);
        } else if (filteredDestinations.length > 0) {
          handleDestinationSelect(filteredDestinations[0]);
        }
        break;
      case "Escape":
        setFormState((prev) => ({
          ...prev,
          isFocused: false,
          selectedIndex: -1,
        }));
        inputRef.current?.blur();
        break;
      default:
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (formState.selectedIndex >= 0 && dropdownRef.current) {
      const selectedElement =
        dropdownRef.current.children[formState.selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [formState.selectedIndex]);

  const handleClose = () => {
    setFormState({ ...formState, showModal: false });
  };

  // Handle clicking on a destination from the list
  const handleDestinationClick = (destination) => {
    navigate(destination.path);
  };

  // Handle destination selection (both click and keyboard)
  const handleDestinationSelect = (destination) => {
    handleDestinationClick(destination);
  };

  const handleSearch = () => {
    setSearchData({
      guests: formState.guests,
      startDate: formState.startDate,
      endDate: formState.endDate,
      startLocation: formState.startLocation,
      destination: formState.searchQuery,
    });

    const selectedDestination = flatDestinations.find(
      (destination) =>
        destination.name.toLowerCase() === formState.searchQuery.toLowerCase()
    );

    if (selectedDestination) {
      handleDestinationClick(selectedDestination);
    } else {
      navigate("/");
    }
  };

  const incrementGuests = () =>
    setFormState((prevState) => ({
      ...prevState,
      guests: prevState.guests + 1,
    }));

  const decrementGuests = () =>
    setFormState((prevState) => ({
      ...prevState,
      guests: prevState.guests > 1 ? prevState.guests - 1 : 1,
    }));

  const toggleModal = () =>
    setFormState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));

  const setSearchQuery = (query) =>
    setFormState((prevState) => ({
      ...prevState,
      searchQuery: query,
      selectedIndex: -1,
    }));

  const setStartLocationQuery = (location) => {
    setFormState((prevState) => ({
      ...prevState,
      startLocation: location,
    }));
  };

  const setStartDate = (date) =>
    setFormState((prevState) => ({ ...prevState, startDate: date }));

  const setEndDate = (date) =>
    setFormState((prevState) => ({ ...prevState, endDate: date }));

  const setIsFocused = (focused) =>
    setFormState((prevState) => ({
      ...prevState,
      isFocused: focused,
      selectedIndex: focused ? -1 : prevState.selectedIndex,
    }));

  return (
    <section className="relative">
      <div className="w-full h-[50vh] sm:h-full md:h-[600px] sticky z-10 top-0 md:relative">
        <img
          className="w-full h-full object-cover transition-transform duration-500"
          srcSet={`${dalLekSmall} 480w, ${dalLekFull} 1980w`}
          src={dalLekFull || "/placeholder.svg"}
          alt="Background"
        />
        <div className="absolute bottom-80 md:left-10 lg:left-[4.2rem] hidden md:flex items-center">
          <img
            src={discoverOne || "/placeholder.svg"}
            alt="Logo"
            className="h-5 mr-2 opacity-80 hover:opacity-100 transition-opacity duration-300"
          />
        </div>
        <div className="absolute top-[40%] sm:right-[0] left-[34%] sm:left-[34%] transform -translate-x-1/2 -translate-y-1/2 md:top-64 md:right-0 md:translate-x-0 md:translate-y-0 md:bottom-24 md:left-[2.5rem] lg:left-[4.2rem] flex justify-start items-center h-auto">
          <h1 className="text-white font-poppins font-extrabold md:text-[4.3rem] lg:text-[5.2rem] text-[2rem] em:text-3xl sm:text-[3rem] leading-10 sm:leading-none transition-colors duration-300">
            DISCOVER NEW <br /> HORIZONS
          </h1>
        </div>
        <div
          onClick={() => navigate("/destination")}
          className="absolute bottom-9 sm:bottom-16 md:bottom-32 right-[-3rem] sm:-right-14 md:-right-9 transform -translate-x-1/2 flex justify-center items-center w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-52 lg:h-52 cursor-pointer transition-transform duration-500 hover:scale-110"
        >
          <ExploreSvg />
        </div>
      </div>

      <div className="w-[90%] max-w-[1720px] h-auto p-4 md:p-16 bg-[#f8f8f8] shadow-lg rounded-lg mx-auto mt-[-2rem] md:mt-[-6rem] relative z-10">
        <div className="flex flex-col ew:flex-row items-center justify-between gap-4">
          <div className="relative w-full">
            <div className="flex items-center bg-[#f8f8f8] border rounded-md py-3 px-2 w-full hover:shadow-md transition-shadow duration-300">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter Destination"
                className="w-full bg-transparent focus:outline-none"
                value={formState.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                onKeyDown={handleKeyDown}
                autoComplete="off"
              />
            </div>

            {/* Enhanced Dropdown with keyboard navigation */}
            {formState.isFocused && formState.searchQuery && (
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
                          index === formState.selectedIndex
                            ? "bg-[#02896F] text-white"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-medium ${
                                index === formState.selectedIndex
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {destination.name}
                            </span>
                            {destination.type === "state" && (
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  index === formState.selectedIndex
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
                              index === formState.selectedIndex
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

          <div className="ew:w-auto flex justify-end">
            <div
              className="cursor-pointer hover:scale-110 transition-transform duration-300"
              onClick={toggleModal}
            >
              <FilterSvg />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 items-end">
          <div className="flex flex-col">
            <p className="text-gray-500 font-medium mb-1">Start Date</p>
            <div className="flex items-center bg-gray-100 rounded-md p-2 h-12 hover:shadow-md transition-shadow duration-300">
              <DatePicker
                selected={formState.startDate}
                onChange={setStartDate}
                placeholderText="E.g 2024-03-02"
                className="outline-none p-2 w-full bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer"
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </div>

          <div className="flex flex-col lg:col-span-1 col-span-2">
            <p className="text-gray-500 mb-1 font-medium">Guests</p>
            <div className="flex items-center justify-around bg-gray-100 rounded-md p-2 h-12 hover:shadow-md transition-shadow duration-300">
              <button
                onClick={decrementGuests}
                className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full hover:scale-110 transition-transform duration-300"
              >
                -
              </button>
              <p className="font-medium text-[#717A7C] text-lg">
                {formState.guests} guest{formState.guests > 1 ? "s" : ""}
              </p>
              <button
                onClick={incrementGuests}
                className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full hover:scale-110 transition-transform duration-300"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center col-span-2 lg:col-span-1">
            <button
              onClick={handleSearch}
              className="w-full bg-med-green py-2 rounded-md text-white font-medium text-xl hover:scale-95 hover:shadow-md transition-colors duration-300"
            >
              Search Packages
            </button>
          </div>
        </div>
      </div>

      <FilterBox
        showModal={formState.showModal}
        setShowModal={toggleModal}
        onClose={handleClose}
      />
    </section>
  );
}
