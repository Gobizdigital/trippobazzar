import React, { useState } from "react";
import FilterSvg from "../../../svgs/FilterSvg/index";
import DatePicker from "react-datepicker";
import image from "../../assets/africa-bg.webp";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
import FilterBox from "../FilterBox/FilterBox";
import { useNavigate, useParams } from "react-router-dom";
import { useSearch } from "../../../context/SearchContext";
import { FlatDestinations } from "../Navbar/DestinationAccordionData";

function SrchDestinationCountry() {
  const [showModal, setShowModal] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false); // Initially set to false
  const toggleModal = () => setShowModal(!showModal);
  const navigate = useNavigate();
  const { searchData, setSearchData } = useSearch();
  const { item, country, state } = useParams();

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

  const filteredDestinations = FlatDestinations.filter((destination) =>
    destination.name
      .toLowerCase()
      .includes(searchData.destination.toLowerCase())
  );

  // Single handleChange function
  const handleChange = (name, value) => {
    setSearchData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDestinationClick = (destination) => {
    const regionPath = destination.region;
    const namePath = destination.name;

    const path =
      regionPath === "India"
        ? `/destination/asia/India/${namePath}`
        : `/destination/${regionPath}/${namePath}`;

    navigate(path);
    setDropdownVisible(false); // Hide dropdown when a destination is selected
  };

  const handleSearch = () => {
    const selectedDestination = FlatDestinations.find(
      (destination) =>
        destination.name.toLowerCase() === searchData.destination.toLowerCase()
    );

    if (selectedDestination) {
      handleDestinationClick(selectedDestination);
    } else {
      navigate("/");
    }
  };

  // Show the dropdown when the input is focused
  const handleFocus = () => setDropdownVisible(true);

  // Hide the dropdown when the input loses focus
  const handleBlur = () => setTimeout(() => setDropdownVisible(false), 200);

  return (
    <div className="rounded-b-3xl font-poppins ">
      {item ? (
        <></>
      ) : (
        <div className="w-[90%] relative z-10 mx-auto py-2">
          <BreadCrumbsLink />
        </div>
      )}
      <div className="w-full h-full relative">
        <img
          src={image}
          alt="main-Picture"
          className="w-full h-auto object-contain"
          loading="eager"
          fetchpriority="high"
          width="1920" // Specify width
          height="1080" // Specify height
          style={{ objectFit: "contain" }} // Make sure the image scales to fit while maintaining aspect ratio
        />

        <div className="absolute w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-full flex items-center justify-center">
            <h2
              className={`text-base uppercase tracking-[30px] md:tracking-[40px] text-white ew:text-xl sm:text-7xl  lg:mb-4 text-center font-bold`}
            >
              {state ? state : item || country}
            </h2>
          </div>
        </div>
        <div className="flex absolute z-10 -bottom-[420px] left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col py-20 w-[90%] mx-auto justify-center items-center">
          <div className="w-[90%] max-w-[1720px] h-auto p-4 md:p-16 bg-[#f8f8f8] shadow-lg rounded-lg mx-auto top-[43rem] sm:top-[42rem] md:top-[19rem] lg:top-[5rem] lg:mt-[-2rem] relative ">
            {/* Starting Location and Destination Inputs */}
            <div className="flex flex-col md:flex-row items-center jusitfy-between gap-4">
              <div className="flex items-center border bg-[#f8f8f8] rounded-md py-3 px-2 w-full">
                <input
                  type="text"
                  placeholder="Where are you starting from?"
                  value={searchData.startLocation}
                  onChange={(e) =>
                    handleChange("startLocation", e.target.value)
                  }
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
                    value={searchData.destination}
                    onChange={(e) =>
                      handleChange("destination", e.target.value)
                    }
                    onFocus={handleFocus} // Show dropdown on focus
                    onBlur={handleBlur} // Hide dropdown on blur
                  />
                </div>
                {(searchData.destination || filteredDestinations.length > 0) &&
                  dropdownVisible && (
                    <ul className="mt-4 absolute bg-[#f8f8f8] rounded-md p-4 min-h-[10px] w-full z-20">
                      {filteredDestinations.map((destination, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            setSearchData((prev) => ({
                              ...prev,
                              destination: destination.name,
                            }));
                          }}
                          className="py-2 border-b cursor-pointer"
                        >
                          <strong>{destination.name}</strong> -{" "}
                          {destination.region}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              {state ? (
                ""
              ) : (
                <div className="md:w-auto w-full  flex justify-end">
                  <div className="cursor-pointer" onClick={toggleModal}>
                    <FilterSvg />
                  </div>
                </div>
              )}
            </div>

            {/* Date Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 items-end">
              {/* Start Date */}
              <div className="flex flex-col">
                <p className="text-gray-500 font-medium mb-1">Start Date</p>
                <div className="flex items-center bg-gray-100 rounded-md p-2 h-12">
                  <DatePicker
                    placeholderText="E.g 2004-03-02"
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
                <div className="flex items-center bg-gray-100 rounded-md p-2 h-12">
                  <DatePicker
                    placeholderText="E.g 2004-03-02"
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
                <div className="flex items-center justify-around bg-gray-100 rounded-md p-2 h-12">
                  <button
                    onClick={decrementGuests}
                    className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full"
                  >
                    -
                  </button>
                  <p className="font-medium text-[#717A7C] text-lg">
                    {searchData.guests || 1} guests
                  </p>
                  <button
                    onClick={incrementGuests}
                    className="bg-med-green w-7 h-7 flex items-center justify-center text-white rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex w-full text-center text-lg h-11 items-center justify-center font-medium px-4 py-2 bg-med-green text-white rounded-md"
              >
                <p>Search Packages</p>
              </button>
            </div>
          </div>
        </div>
        <FilterBox showModal={showModal} onClose={toggleModal} />
      </div>
    </div>
  );
}

export default SrchDestinationCountry;
