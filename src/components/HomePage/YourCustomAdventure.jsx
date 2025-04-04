import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import adventureImage from "../../assets/home/advanture.webp";
import { FlatDestinations } from "../Navbar/DestinationAccordionData";
import { useNavigate } from "react-router-dom";

export default function YourCustomAdventure() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselItems = 10; // This should be a number
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    searchQuery: "",
  });

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems); // Wrap around using modulo
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex === 0 ? carouselItems - 1 : prevIndex - 1) // Wrap around when going backward
    );
  };

  // Calculate progress width based on current index
  const progressWidth = ((currentIndex + 1) / carouselItems) * 100; // Use `carouselItems` instead of `carouselItems.length`
  const filteredDestinations = FlatDestinations.filter((destination) =>
    destination.name.toLowerCase().includes(formState.searchQuery.toLowerCase())
  );

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

  const setSearchQuery = (query) =>
    setFormState((prevState) => ({ ...prevState, searchQuery: query }));

  const setIsFocused = (focused) =>
    setFormState((prevState) => ({ ...prevState, isFocused: focused }));

  return (
    <section className="w-full max-w-[1720px] mx-auto h-auto  bg-white relative ">
      <div className="flex md:flex-row flex-col h-full w-full ">
        {/* Right Side Image Div */}

        <div className="w-full md:w-[50%] h-full bg-white p-8 flex flex-col justify-center">
          <h2 className="text-[40px] esm:text-[50px] em:text-[65px] md:text-[5.2vw] exl:text-[6rem] exl:leading-[120px] font-extrabold leading-[50px] em:leading-[70px] md:leading-[8vw] md:mt-6 mb-8 em:mb-10">
            YOUR CUSTOM ADVENTURE.
          </h2>
          <p className="text-gray-700 text-sm pr-3 md:pr-9 w-full md:max-w-md mb-10 md:mb-11">
            Craft your dream journey with us. Explore destinations, create
            memories, and let your adventure begin. From enchanting getaways to
            exotic adventures, our website crafts the perfect journey just for
            you.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col relative md:flex-row items-center w-full md:max-w-xl mb-10 md:mb-14 gap-4 mt-4">
            <input
              type="text"
              placeholder="Search destinations..."
              className="border-[1.5px] border-med-green w-full md:w-auto text-sm rounded-l-md py-2 px-4 flex-1 outline-none"
              value={formState.searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            <button
              onClick={handleSearch}
              className="bg-med-green w-full ml-1 text-sm md:w-auto text-white py-2 px-6 rounded-md"
            >
              Search
            </button>

            {formState.isFocused &&
              formState.searchQuery &&
              filteredDestinations.length > 0 && (
                <ul className="mt-4 absolute top-10 bg-[#f8f8f8] rounded-md p-4 w-full z-10">
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
          <div className="mb-12">
            <p className="text-6xl font-extrabold flex items-center space-x-1">
              <span className="relative -top-1">{currentIndex + 1}</span>
              <span className="text-3xl font-medium relative top-1">/</span>
              <span className="relative top-2 text-4xl font-medium">
                {carouselItems}
              </span>
            </p>
          </div>
          <div className="flex flex-row gap-10 py-4 justify-between items-center w-[56%]">
            <div className="w-auto flex gap-2 justify-start">
              <button
                aria-label="Previous item"
                onClick={handlePrev}
                className="transform text-2xl"
              >
                <BsArrowLeft />
              </button>
              <button
                aria-label="Next item"
                onClick={handleNext}
                className="transform text-2xl"
              >
                <BsArrowRight />
              </button>
            </div>
            <div className="h-[2px] w-full bg-gray-200">
              <div
                style={{ width: `${progressWidth}%` }}
                className="h-full bg-zinc-900"
              ></div>
            </div>
          </div>
        </div>
        {/* Left Side Text Div */}
        <div className="w-full md:w-[49%] mx-auto bg-white h-auto md:aspect-[4/5]">
          <img
            src={adventureImage}
            alt="Adventure"
            className="w-full h-full object-cover md:rounded-bl-[30%]"
          />
        </div>
      </div>
    </section>
  );
}
