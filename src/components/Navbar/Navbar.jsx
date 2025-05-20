"use client";

import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import HamburgerSvg from "../../../svgs/HamburgerSvg";
import LargeDeviceSidebar from "./LargeDeviceSidebar";
import SideHamBurgerMenu from "./SideHamBurgerMenu";
import { Link, useLocation } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import { IoIosArrowDown } from "react-icons/io";
import MenuSvg from "../../../svgs/MenuSvg";
import TransitionLink from "../../../utils/TransitionLink";
import { NavbarData } from "./DestinationAccordionData";
import HomeLogoSvg from "../../../svgs/HomeLogo";

const Navbar = () => {
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const location = useLocation();
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const downRef = useRef([]);

  const toggleDestinations = (index) => {
    // If clicking the same dropdown that's already open, close it
    if (openDropdownIndex === index) {
      setOpenDropdownIndex(null);
    } else {
      // Otherwise, open the clicked dropdown
      setOpenDropdownIndex(index);
    }
  };

  // Fetch continent data from API
  const { data } = useFetch(
    `https://trippo-bazzar-backend.vercel.app/api/continent/fields/query?fields=ContinentName,Countries`,
    false
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const hideMenu = () => {
    setIsMenuOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 999px)");

    const handleMediaQueryChange = (e) => {
      if (e.matches) {
        hideMenu();
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        downRef.current &&
        !Object.values(downRef.current).some(
          (ref) => ref && ref.contains(e.target)
        )
      ) {
        setOpenDropdownIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Group continents and organize data for the dropdown
  const organizeDestinationData = () => {
    if (!data) return [];

    const continents = data;
    const result = [];

    // Find Asia continent to extract India
    const asiaContinent = continents.find(
      (cont) => cont.ContinentName === "Asia"
    );

    // Add India section if it exists
    if (asiaContinent) {
      const indiaCountry = asiaContinent.Countries.find(
        (country) => country.CountryName === "India"
      );
      if (
        indiaCountry &&
        indiaCountry.States &&
        indiaCountry.States.length > 0
      ) {
        result.push({
          region: "India",
          items: indiaCountry.States.map((state) => ({
            name: state.StateName,
            path: `/destination/asia/India/${state.StateName}`,
          })),
        });
      }
    }

    // Add other continents
    continents.forEach((continent) => {
      // Skip empty continents
      if (!continent.Countries || continent.Countries.length === 0) return;

      // For Asia, exclude India as it's already handled
      let countries = continent.Countries;
      if (continent.ContinentName === "Asia") {
        countries = countries.filter(
          (country) => country.CountryName !== "India"
        );
      }

      if (countries.length > 0) {
        result.push({
          region: continent.ContinentName,
          items: countries.map((country) => ({
            name: country.CountryName,
            path: `/destination/${continent.ContinentName}/${country.CountryName}`,
          })),
        });
      }
    });

    return result;
  };

  const destinationGroups = organizeDestinationData();

  return (
    <div className="sticky top-0 z-100 max-w-[1920px] mx-auto">
      <div className="z-30 border-b bg-white mx-auto">
        <nav className="bg-white flex items-center justify-between py-4 relative w-[90%] emd:w-[95%] xlg:w-[90%] mx-auto">
          <div className="hidden emd:flex items-center gap-8 xlg:gap-10">
            {userData === null ? (
              <Link
                to={"/login"}
                className="border-[.1rem] rounded-lg text-[#02896F] border-[#012831] font-poppins text-[.8rem] font-medium px-2 py-2"
              >
                Login/Sign Up
              </Link>
            ) : (
              <Link className="">
                <button
                  onClick={toggleSidebar}
                  className="border-[.1rem] hidden emd:flex justify-center items-center gap-2 rounded-lg tracking-wider text-med-green border-[#012831] font-poppins text-[.8rem] font-medium px-8 py-2"
                >
                  <MenuSvg />
                  Menu
                </button>
              </Link>
            )}
            <div className="flex flex-row whitespace-nowrap items-center justify-between gap-6">
              <div className="relative">
              

                {/* Compact Destinations Dropdown */}
                <div className="flex flex-row whitespace-nowrap items-center justify-between gap-4">
                  <div className="relative">
                    <button className="flex text-xs uppercase justify-center items-center">
                      <TransitionLink
                        to="/destination"
                        className="px-1.5 py-1.5"
                        onClick={() => setOpenDropdownIndex(null)}
                      >
                        Destinations
                      </TransitionLink>
                      <IoIosArrowDown
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDestinations("dest");
                        }}
                        className="w-4 h-4 ml-1 text-med-green"
                      />
                    </button>

                    {/* Improved Destinations Dropdown - Shows all locations */}
                    <div
                      ref={(el) => (downRef.current["dest"] = el)}
                      style={{
                        visibility:
                          openDropdownIndex === "dest" ? "visible" : "hidden",
                      }}
                      className={`absolute z-20 transition-all ease-in-out duration-300 left-0 mt-2 w-[90vw] md:w-[95vw] lg:w-[90vw] max-w-[1200px] ${
                        openDropdownIndex === "dest"
                          ? "opacity-100 transform translate-y-0"
                          : "opacity-0 pointer-events-none transform -translate-y-2"
                      }`}
                    >
                      {!destinationGroups || destinationGroups.length === 0 ? (
                        // Skeleton loader when data is not available
                        <div className="absolute z-20 transition-all duration-200 ease-in-out left-0 mt-2 w-auto max-w-[800px] opacity-100 transform translate-y-0">
                          <div className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                            <div className="flex flex-wrap gap-4 max-h-[400px] overflow-y-auto">
                              {Array.from({ length: 4 }).map((_, groupIdx) => (
                                <div
                                  key={groupIdx}
                                  className="min-w-[140px] max-w-[180px]"
                                >
                                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                                  <ul className="space-y-2">
                                    {Array.from({ length: 6 }).map(
                                      (_, itemIdx) => (
                                        <li
                                          key={itemIdx}
                                          className="h-3 bg-gray-200 rounded w-full"
                                        ></li>
                                      )
                                    )}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Improved destinations dropdown - Shows all locations
                        <div
                          className={`absolute z-20 transition-all duration-200 ease-in-out left-0 mt-2 w-auto max-w-[1000px] ${
                            openDropdownIndex === "dest"
                              ? "opacity-100 transform translate-y-0"
                              : "opacity-0 pointer-events-none transform -translate-y-2"
                          }`}
                        >
                          <div className="p-4 bg-white rounded-md shadow-md border border-gray-200">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-[500px] overflow-y-auto">
                              {destinationGroups.map((group, idx) => (
                                <div key={idx} className="min-w-[120px]">
                                  <h3 className="text-xs uppercase font-semibold text-[#02896F] border-b border-[#02896F] pb-1 mb-2">
                                    {group.region}
                                  </h3>
                                  <ul className="space-y-1">
                                    {/* Show all items without limiting to 6 */}
                                    {group.items.map((item, itemIdx) => (
                                      <li key={itemIdx} className="group">
                                        <Link
                                          to={item.path}
                                          onClick={() =>
                                            setOpenDropdownIndex(null)
                                          }
                                          className="text-xs text-gray-700 hover:text-[#02896F] transition-colors duration-200 flex items-center"
                                        >
                                          <span className="opacity-0 group-hover:opacity-100 mr-1 transition-opacity duration-200">
                                            •
                                          </span>
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {NavbarData.map((item, idx) => (
                    <div key={idx} className="relative">
                      <button
                        onClick={() => toggleDestinations(idx)}
                        className="flex text-xs uppercase justify-center items-center"
                      >
                        {item.title}
                        <IoIosArrowDown className="w-4 h-4 ml-1 text-med-green" />
                      </button>
                      <div
                        ref={(el) => (downRef.current[idx] = el)}
                        style={{
                          visibility:
                            openDropdownIndex === idx ? "visible" : "hidden",
                        }}
                        className={`absolute z-20 w-[160px] transition-opacity ease-in-out duration-300 left-0 mt-2 bg-white shadow-md border rounded-md ${
                          openDropdownIndex === idx
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <ul className="p-2 whitespace-nowrap">
                          {item.description.map((liItems, liIdx) => (
                            <li
                              key={liIdx}
                              onClick={() => {
                                setOpenDropdownIndex(null);
                              }}
                              className="py-1 text-xs cursor-pointer border-b-2 border-transparent hover:border-med-green transition-all duration-200"
                            >
                              {liItems.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

             
            </div>
          </div>

          {/* Center - Logo (always centered) */}
          <TransitionLink
            to="/"
            aria-label="Go to homepage"
            className="flex-grow flex justify-start emd:justify-center"
          >
            <HomeLogoSvg />
          </TransitionLink>

          {/* Right Side - Nav Links and Search Bar (visible on medium and larger screens) */}
          <div className="hidden whitespace-nowrap emd:flex items-center justify-center space-x-5 xlg:space-x-9">
            <TransitionLink
              className={`font-poppins text-[.8rem] font-normal relative inline-block transition duration-300 ease-in-out ${
                location.pathname === "/aboutus" ? "text-med-green" : ""
              } hover:text-green-500`}
              to={"/aboutus"}
            >
              ABOUT US
            </TransitionLink>
            <TransitionLink
              to={"/traveltips"}
              className={`font-poppins text-[.8rem] font-normal
                ${location.pathname === "/traveltips" ? "text-med-green" : ""}
                relative inline-block transition duration-300 ease-in-out hover:text-green-500`}
            >
              TRAVEL TIPS
            </TransitionLink>
            <TransitionLink
              to="/"
              className="font-poppins text-[.8rem] font-normal relative inline-block transition duration-300 ease-in-out hover:text-green-500"
            >
              OFFERS
            </TransitionLink>

            {/* Search Icon */}
            <div className="relative">
              <Link to={"/searchpage"} aria-label="Go to search page">
                <button
                  aria-label="Search"
                  className="text-sm border-[1px] border-[#012831] rounded-full p-2"
                >
                  <FaSearch />
                </button>
              </Link>
              {isSearchVisible && (
                <input
                  type="text"
                  placeholder="Search"
                  className="absolute top-6 right-0 w-[50vw] border-2 rounded-lg p-2 mt-8"
                />
              )}
            </div>

            {/* Book a Trip Button */}
            <TransitionLink to="/destination">
              <button className="bg-med-green text-white text-[.8rem] px-4 h-9 rounded-md">
                Book a Trip
              </button>
            </TransitionLink>
          </div>

          {/* Mobile Menu Toggle Button (Hamburger Icon) */}
          <button
            className="emd:hidden text-med-green mt-2 p-4"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            <HamburgerSvg />
          </button>
        </nav>

        <SideHamBurgerMenu
          hideMenu={hideMenu}
          toggleMenu={toggleMenu}
          setIsMenuOpen={setIsMenuOpen}
          isMenuOpen={isMenuOpen}
        />
      </div>
      <LargeDeviceSidebar
        isSidebarOpen={isSidebarOpen}
        closeSidebar={closeSidebar}
      />
    </div>
  );
};

export default Navbar;
