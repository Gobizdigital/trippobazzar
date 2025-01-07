import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import dalLekFull from "/bg-home.webp?url";
import dalLekSmall from "/bg-home-small.webp?url";
import discoverOne from "../../assets/home/Discover-1.svg";
import FilterSvg from "../../../svgs/FilterSvg/index";
import DatePicker from "react-datepicker";
import ExploreSvg from "../../../svgs/ExploreSvg";
import FilterBox from "../FilterBox/FilterBox";
import { FlatDestinations } from "../Navbar/DestinationAccordionData";
import { useSearch } from "../../../context/SearchContext";

export default function DiscoverNewHorizon() {
  const navigate = useNavigate();
  const { setSearchData } = useSearch();

  const [formState, setFormState] = useState({
    guests: 1,
    showModal: false,
    isFocused: false,
    searchQuery: "",
    startDate: null,
    endDate: null,
    startLocation: "Ahmedabad",
  });

  // Filter destinations based on input
  const filteredDestinations = FlatDestinations.filter((destination) =>
    destination.name.toLowerCase().includes(formState.searchQuery.toLowerCase())
  );

  const handleClose=()=>{
    setFormState({ ...formState, showModal: false });
  }

  // Handle clicking on a destination from the list
  const handleDestinationClick = (destination) => {
    const regionPath = destination.region;
    const namePath = destination.name;

    const path =
      regionPath === "India"
        ? `/destination/asia/India/${namePath}`
        : `/destination/${regionPath}/${namePath}`;

    navigate(path);
  };
  const handleSearch = () => {
    setSearchData({
      guests: formState.guests,
      startDate: formState.startDate,
      endDate: formState.endDate,
      startLocation: formState.startLocation,
      destination: formState.searchQuery,
    });

    const selectedDestination = FlatDestinations.find(
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
    setFormState((prevState) => ({ ...prevState, searchQuery: query }));
  const setStartLocationQuery = (location) => {
    setFormState((prevState) => ({
      ...prevState,
      startLocation: location, // Update startLocation
    }));
  };
  const setStartDate = (date) =>
    setFormState((prevState) => ({ ...prevState, startDate: date }));
  const setEndDate = (date) =>
    setFormState((prevState) => ({ ...prevState, endDate: date }));
  const setIsFocused = (focused) =>
    setFormState((prevState) => ({ ...prevState, isFocused: focused }));

  return (
    <section className="relative">
      <div className="w-full h-[50vh] sm:h-full md:h-[600px] sticky z-10 top-0 md:relative">
        {/* <img
          className="w-full h-full object-cover"
          src={dalLek}
          alt="Background"
        /> */}
         <img
    className="w-full h-full object-cover"
    srcSet={` 
      ${dalLekSmall} 480w, 
      ${dalLekFull} 1980w
    `}
    src={dalLekFull}  // Fallback if srcSet is not supported
    alt="Background"
  />
        <div className="absolute bottom-80 md:left-10 lg:left-[4.2rem] hidden md:flex items-center">
          <img src={discoverOne} alt="Logo" className="h-5 mr-2" />
        </div>
        <div className="absolute top-[40%] sm:right-[0] left-[34%] sm:left-[34%] transform -translate-x-1/2 -translate-y-1/2 md:top-64 md:right-0 md:translate-x-0 md:translate-y-0 md:bottom-24 md:left-[2.5rem] lg:left-[4.2rem] flex justify-start items-center h-auto">
          <h1 className="text-white font-poppins font-extrabold md:text-[4.3rem] lg:text-[5.2rem] text-[2rem] em:text-3xl sm:text-[3rem] leading-10 sm:leading-none">
            DISCOVER NEW <br /> HORIZONS
          </h1>
        </div>
        <div className="absolute md:flex hidden top-20 right-4">
          <img src={discoverOne} alt="Logo" className="h-5 mr-2" />
        </div>
        <div className="absolute bottom-9 sm:bottom-16 md:bottom-32 right-[-3rem] sm:-right-14 md:-right-9 transform -translate-x-1/2 flex justify-center items-center w-28 h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-52 lg:h-52">
          <ExploreSvg />
        </div>
      </div>

      <div className="w-[90%] max-w-[1720px] h-auto p-4 md:p-16 bg-[#f8f8f8] shadow-lg rounded-lg mx-auto mt-[-2rem] md:mt-[-6rem] relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center border bg-[#f8f8f8] rounded-md py-3 px-2 w-full">
            <input
              type="text"
              value={formState.startLocation}
              onChange={(e) => setStartLocationQuery(e.target.value)} // Update state when the user changes the value
              placeholder="Where are you starting from?"
              className="w-full bg-transparent focus:outline-none"
            />
          </div>
          <p className="text-gray-500 font-medium">To</p>
          <div className="relative w-full">
            <div className="flex items-center bg-[#f8f8f8] border rounded-md py-3 px-2 w-full">
              <input
                type="text"
                placeholder="Enter Destination"
                className="w-full bg-transparent focus:outline-none"
                value={formState.searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              />
            </div>
            {formState.isFocused &&
              formState.searchQuery &&
              filteredDestinations.length > 0 && (
                <ul className="mt-4 absolute bg-[#f8f8f8] rounded-md p-4 w-full z-10">
                  {filteredDestinations.map((destination, index) => (
                    <li
                      onClick={() => {
                        setSearchQuery(destination.name);
                        setIsFocused(false);
                        // handleDestinationClick(destination);
                      }}
                      key={index}
                      className="py-2 border-b cursor-pointer"
                    >
                      <strong>{destination.name}</strong> - {destination.region}
                    </li>
                  ))}
                </ul>
              )}
          </div>
          <div className="md:w-auto w-full flex justify-end">
            <div className="cursor-pointer" onClick={toggleModal}>
              <FilterSvg />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 items-end">
          <div className="flex flex-col">
            <p className="text-gray-500 font-medium mb-1">Start Date</p>
            <div className="flex items-center bg-gray-100 rounded-md p-2 h-12">
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
          <div className="flex flex-col">
            <p className="text-gray-500 font-medium mb-1">End Date</p>
            <div className="flex items-center bg-gray-100 rounded-md p-2 h-12">
              <DatePicker
                selected={formState.endDate}
                onChange={setEndDate}
                placeholderText="E.g 2024-03-10"
                className="outline-none p-2 w-full bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer"
                dateFormat="yyyy-MM-dd"
                required
              />
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-gray-500 mb-1 font-medium">Guests</p>
            <div className="flex items-center justify-around bg-gray-100 rounded-md p-2 h-12">
              <button
                onClick={decrementGuests}
                className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full"
              >
                -
              </button>
              <p className="font-medium text-[#717A7C] text-lg">
                {formState.guests} guest{formState.guests > 1 ? "s" : ""}
              </p>
              <button
                onClick={incrementGuests}
                className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex justify-center items-center md:col-span-1">
            <button
              onClick={handleSearch}
              className="w-full bg-med-green py-2 rounded-md text-white font-medium text-xl"
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
        // formState={formState}
        // setFormState={setFormState}
      />
    </section>
  );
}
