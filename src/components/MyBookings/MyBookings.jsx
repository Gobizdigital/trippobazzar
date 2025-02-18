import React from "react";
import FirstSvgWhatIncluded from "../../../svgs/WhatsIncluded/FirstSvgWhatIncluded/index";
import SecondSvgWhatIncluded from "../../../svgs/WhatsIncluded/SecondSvgWhatIncluded/index";
import ThirdSvgWhatIncluded from "../../../svgs/WhatsIncluded/ThirdSvgWhatIncluded/index";
import FourthSvgWhatIncluded from "../../../svgs/WhatsIncluded/FourthSvgWhatIncluded/index";
import FifthSvgWhatIncluded from "../../../svgs/WhatsIncluded/FifthSvgWhatIncluded/index";
import SixthSvgWhatIncluded from "../../../svgs/WhatsIncluded/SixthSvgWhatIncluded/index";
import SubNavbar from "./SubNavMybooking";
import { useWishlist } from "../../../context/WishListContext";

function MyBookings() {
  const { userDetails } = useWishlist();
  console.log(userDetails);
  return (
    <>
      <SubNavbar />
      <div className="w-full flex gap-4 bg-transparent p-4 h-full bg-black">
        {/* Static Card Layout */}
        <div className="w-[95%]   grid grid-cols-1  gap-10">
          {/* Static Card 1 */}
          {/* Static Card 3 */}
          <div className="bg-white  py-2 flex border text-center cursor-pointer rounded-2xl shadow-sm hover:shadow-lg">
            {/* Card Image */}
            <div className="relative w-[35%]   h-full p-4 mb-2">
              <img
                src="src/assets/africa-bg.webp"
                alt="Card Image"
                className="w-full  h-full rounded-2xl object-cover "
              />
            </div>
            {/* Card Content */}
            <div className="text-start ml-4 pr-2">
              <button className="text-[0.6rem] rounded-lg font-semibold  bg-[#AAC4D51A] text-[#27BFEA] px-2 py-1 ">
                29 Dec 2024 - 2 Jan 2025
              </button>
              <h4 className="text-base text-[#002831C2]   sm:text-lg font-bold mb-1">
                Trip to Egypt Flight Inclusive Deal Seasonal Special Offer
              </h4>
              <p className="text-xs sm:text-sm text-[#002831C2] mb-2">
                This is a description for the package.
              </p>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#00B58A]">
                Rs.14999
              </h3>
              <p className="text-xs sm:text-sm text-black font-semibold mb-2">
                What’s included?
              </p>
              {/* Static Logo Images */}
              <div className="flex flex-wrap justify-start gap-6 mb-2 mx-auto">
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <FirstSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <SecondSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <ThirdSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <FourthSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <FifthSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <SixthSvgWhatIncluded />
                </div>
              </div>
              {/* Book Now Button */}
              <div className="flex justify-between gap-4 my-4 ">
                <button className="w-[80%] sm:w-[70%] mb-4 sm:mb-[9%] bg-med-green text-white py-2 text-sm rounded-md hover:scale-95">
                  View Details
                </button>
                <button className="w-[80%] sm:w-[70%] mb-4 sm:mb-[9%] border-black border-[1.3px] text-med-green text-sm hover:scale-95 py-2 rounded-md">
                  Modify Booking
                </button>
              </div>
            </div>
          </div>
          {/* Static Card 3 */}
          <div className="bg-white py-2 flex border text-center cursor-pointer rounded-2xl shadow-sm hover:shadow-lg">
            {/* Card Image */}
            <div className="relative w-[35%]  h-full p-4 mb-2">
              <img
                src="src/assets/africa-bg.webp"
                alt="Card Image"
                className="w-full  h-full object-cover rounded-2xl"
              />
            </div>
            {/* Card Content */}
            <div className="text-start ml-4 pr-2">
              <button className="text-[0.6rem] rounded-lg font-semibold  bg-[#AAC4D51A] text-[#27BFEA] px-2 py-1 ">
                29 Dec 2024 - 2 Jan 2025
              </button>
              <h4 className="text-base text-[#002831C2]   sm:text-lg font-bold mb-1">
                Trip to Egypt Flight Inclusive Deal Seasonal Special Offer
              </h4>
              <p className="text-xs sm:text-sm text-[#002831C2] mb-2">
                This is a description for the package.
              </p>
              <h3 className="text-lg sm:text-xl font-bold mb-2 text-[#00B58A]">
                Rs.14999
              </h3>
              <p className="text-xs sm:text-sm text-black font-semibold mb-2">
                What’s included?
              </p>
              {/* Static Logo Images */}
              <div className="flex flex-wrap justify-start gap-6 mb-2 mx-auto">
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <FirstSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <SecondSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <ThirdSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <FourthSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <FifthSvgWhatIncluded />
                </div>
                <div className="w-6 sm:w-8 h-6 sm:h-8">
                  <SixthSvgWhatIncluded />
                </div>
              </div>
              {/* Book Now Button */}
              <div className="flex justify-between gap-4 my-4 ">
                <button className="w-[80%] sm:w-[70%] mb-4 sm:mb-[9%] bg-med-green text-white py-2 text-sm rounded-md hover:scale-95">
                  View Details
                </button>
                <button className="w-[80%] sm:w-[70%] mb-4 sm:mb-[9%] border-black border-[1.3px] text-med-green text-sm hover:scale-95 py-2 rounded-md">
                  Modify Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyBookings;
