import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import TransitionLink from "../../../utils/TransitionLink";
import { FaArrowRightLong } from "react-icons/fa6";

const MultiDesitinationDropdown = ({ Destination }) => {
  const [isDestinationOpen, setIsDestinationOpen] = useState(false); // Tracks top-level menu state
  const [activeRegionIndex, setActiveRegionIndex] = useState(null); // Tracks active region
  const dropdownRef = useRef(null);

  const handleRegionClick = (idx) => {
    setActiveRegionIndex((prevIndex) => (prevIndex === idx ? null : idx));
  };

  const toggleDestinationMenu = () => {
    setIsDestinationOpen((prev) => !prev);
    setActiveRegionIndex(null); // Close regions when toggling
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDestinationOpen(false);
        setActiveRegionIndex(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Top-level menu */}
      <button
        onClick={toggleDestinationMenu}
        className="text-start px-7 py-4 border-b flex items-center gap-2 uppercase border-med-green w-full"
      >
        Destinations
        <span
          className={`transform transition-transform ${
            isDestinationOpen ? "rotate-180" : "rotate-0"
          }`}
        >
          <IoIosArrowDown className="w-5 pl-1 text-med-green h-5" />
        </span>
      </button>

      <div
        className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
          isDestinationOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="w-full z-10 bg-white border-t">
          {Destination.description.map((region, idx) => (
            <div key={idx} className="relative">
              <div
                onClick={() => handleRegionClick(idx)}
                className="text-start px-7 py-4 border-b uppercase border-med-green w-full cursor-pointer flex justify-between items-center"
              >
                {region.region}
                <span
                  className={`transform transition-transform ${
                    activeRegionIndex === idx ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <IoIosArrowDown className="w-5 pl-1 text-med-green h-5" />
                </span>
              </div>
              {/* Submenu for Destinations */}
              <div
                className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                  activeRegionIndex === idx ? "max-h-screen" : "max-h-0"
                }`}
              >
                <div className="bg-white border-t w-full">
                  {region.destinations.map((destination, destIdx) => (
                    <TransitionLink
                      to={`/destination/${region.region}/${destination.name}`}
                      key={destIdx}
                      onClick={() => {
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center group gap-4 text-start px-7 py-4 border-b uppercase border-med-green w-full hover:bg-gray-100"
                    >
                      <FaArrowRightLong className="text-med-green group-hover:translate-x-1 transition-transform ease-in-out duration-200" />{destination.name}
                    </TransitionLink>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MultiDesitinationDropdown;
