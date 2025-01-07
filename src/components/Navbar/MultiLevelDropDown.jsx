import React, { useState, useRef, useEffect } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { Link } from "react-router-dom";
import { NavbarData } from "./DestinationAccordionData";
import { FaArrowRightLong } from "react-icons/fa6";

const MultilevelDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(null); // Tracks active dropdown state
  const [activeSubMenuIndex, setActiveSubMenuIndex] = useState(null); // Tracks active submenu (region)
  const dropdownRef = useRef(null);

  const handleMainMenuClick = (idx) => {
    // Toggle the main menu dropdown
    setIsDropdownOpen((prevIndex) => (prevIndex === idx ? null : idx));
    setActiveSubMenuIndex(null); // Reset the submenu when opening a new menu
  };

  const handleSubMenuClick = (idx) => {
    // Toggle the submenu for a specific main menu item
    setActiveSubMenuIndex((prevIndex) => (prevIndex === idx ? null : idx));
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(null);
        setActiveSubMenuIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      {NavbarData.map((menu, idx) => (
        <div key={idx} className="relative">
          {/* Main Menu Button */}
          <button
            onClick={() => handleMainMenuClick(idx)}
            className="text-start px-7 py-4 border-b flex items-center gap-2 uppercase border-med-green w-full"
          >
            {menu.title}
            <span
              className={`transform transition-transform ${
                isDropdownOpen === idx ? "rotate-180" : "rotate-0"
              }`}
            >
              <IoIosArrowDown className="w-5 pl-1 text-med-green h-5" />
            </span>
          </button>

          {/* Submenu (Description) */}
          {isDropdownOpen === idx && (
            <div
              className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                isDropdownOpen === idx ? "max-h-screen" : "max-h-0"
              }`}
            >
              <div className="w-full z-10 bg-white border-t">
                {menu.description.map((submenu, subIdx) => (
                  <div key={subIdx} className="relative">
                    {/* Submenu Button */}
                    <div
                      onClick={() => handleSubMenuClick(subIdx)}
                      className="text-start group flex items-center gap-4 px-7 py-4 border-b uppercase border-med-green w-full cursor-pointer "
                    >
                     
                      <FaArrowRightLong className="text-med-green group-hover:translate-x-1 transition-transform ease-in-out duration-200" /> {submenu.name}
                    </div>

                    {/* Destinations / Submenu Content */}
                    <div
                      className={`transition-max-height duration-300 ease-in-out overflow-hidden ${
                        activeSubMenuIndex === subIdx ? "max-h-screen" : "max-h-0"
                      }`}
                    >
                      <div className="bg-white border-t w-full">
                        <Link
                          to={`/submenu/${menu.title}/${submenu.name}`}
                          className="block text-start px-7 py-4 border-b uppercase border-med-green w-full hover:bg-gray-100"
                        >
                          More Info
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MultilevelDropdown;
