import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { Destination } from "./DestinationAccordionData";

import MultiDesitinationDropdown from "./MultiDesitinationDropdown";
import MultilevelDropDown from "./MultiLevelDropDown";
import HomeLogoSvg from "../../../svgs/HomeLogo";

export default function SideHamBurgerMenu({
  toggleMenu,
  isMenuOpen,
  hideMenu,
  setIsMenuOpen,
}) {
  const data = [
    // { name: "Destinations", link: "/destination" },
    // { name: "What's new", link: "/" },
    // { name: "My trips", link: "/" },
    { name: "About Us", link: "/aboutus" },
    { name: "Travel Tips", link: "/traveltips" },
    { name: "Visas", link: "/" },
    { name: "Profile", link: "/" },
    { name: "My Bookings", link: "/" },
    { name: "Privacy Policy", link: "/aboutus/privacy-policy" },
    { name: "Careers", link: "/aboutus/careers" },
    { name: "FAQs", link: "/" },
  ];

  const [userData, setUserData] = useState(null);

  const location = useLocation();

  useEffect(() => {
    // Prevent body scroll when the menu is open
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMenuOpen]);

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleLinkClick = async (link) => {
    const body = document.querySelector("body");
    if (location.pathname !== link) {
      if (body) {
        body.classList.add("page-transition");
        await sleep(350);
        window.scrollTo(0, 0);
        hideMenu();
        await sleep(350);
        body.classList.remove("page-transition");
      }
    }
  };

  useEffect(() => {
    const data = localStorage.getItem("userInfo");
    if (data) {
      setUserData(JSON.parse(data));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // Clears all data from localStorage
    setUserData(null);
    toggleMenu(); // Closes the menu
  };

  return (
    <>
      {/* Sidebar Menu */}
      <div
        className={`fixed inset-0 max-w-[1980px] mx-auto z-[9999] w-full h-full top-1/2 transition-transform ease-in-out duration-500 left-1/2 ${
          isMenuOpen ? "-translate-x-1/2" : "translate-x-[200%]"
        } -translate-y-1/2 bg-white overflow-hidden shadow-lg`}
      >
        <div className="w-[98%] mx-auto h-full flex flex-col">
          {/* Header Section */}
          <div className="flex justify-between mt-5 px-3 items-center">
            <Link to={"/"} aria-label="Redirects to Homepage">
              <HomeLogoSvg />
            </Link>
            {userData ? (
              <button
                onClick={handleLogout}
                className="border-[.1rem] rounded-lg text-med-green border-[#012831] font-poppins text-[1rem] font-medium px-4 py-2"
              >
                LogOut
              </button>
            ) : (
              <Link to="/login">
                <button className="border-[.1rem] rounded-lg text-med-green border-[#012831] font-poppins text-[1rem] font-medium px-4 py-2">
                  Login
                </button>
              </Link>
            )}
            <button
              aria-label="Close RightSideBar"
              className="text-xl"
              onClick={toggleMenu}
            >
              <IoCloseOutline className="w-8 h-8 text-gray-500" />
            </button>
          </div>

          {/* Scrollable Options List */}
          <div className="flex flex-col overflow-y-auto py-4">
            <MultiDesitinationDropdown
              setIsMenuOpen={setIsMenuOpen}
              Destination={Destination}
            />
            <MultilevelDropDown />

            {data.map((item, idx) => (
              <Link
                to={item.link}
                className="text-start px-7 py-4 border-b uppercase border-med-green w-full"
                onClick={() => handleLinkClick(item.link)}
                key={idx}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Footer Section */}
          <div className="flex items-center justify-start gap-3 py-4 px-3">
            <Link to="/searchpage">
              <button
                aria-label="Search"
                className="w-12 h-12 border-[1px] border-[#012831] rounded-full flex justify-center items-center"
              >
                <FaSearch className="text-base" />
              </button>
            </Link>

            <Link to={"/contactus"}>
              <button className="bg-med-green text-white px-4 h-9 rounded-md">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
