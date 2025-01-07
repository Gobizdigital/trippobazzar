import React from "react";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
import largeImage from "../../../src/assets/TravelTips/img1.webp";
import smallImage from "../../../src/assets/TravelTips/img1-small.webp";
import { IoSearch } from "react-icons/io5";
import FilterSvg from "../../../svgs/FilterSvg";
function TravelTipsTitle() {
  return (
    <div className="bg-white">
      <div className="w-[90%] mx-auto  py-2">
        <BreadCrumbsLink />
      </div>
      <section>
        <div className="h-[90%] relative">
          {/* Image */}

          <picture className="relative w-full h-56 md:h-96 sm:h-80">
            <source media="(max-width: 768px)" srcSet={smallImage} />
            <source media="(min-width: 769px)" srcSet={largeImage} />
            <img
              src={largeImage}
              alt="Background"
              className="w-full h-full object-contain"
            />
          </picture>

          {/* Search Bar */}
          <div className="absolute top-10 left-0 w-full flex justify-center px-4">
            <div className="relative w-full max-w-2xl md:max-w-[90%]">
              <input
                type="text"
                placeholder="Search..."
                className="w-full py-3 sm:py-4  pr-28 md:pr-52 pl-10 md:pl-12 text-base sm:text-lg outline-none border rounded-md shadow-md"
              />
              <IoSearch className="absolute w-4 h-4 sm:w-5 sm:h-5 text-med-green top-1/2 left-3 transform -translate-y-1/2" />
              <div className="flex items-center gap-2 sm:gap-4 absolute top-1/2 right-4 sm:right-8 transform -translate-y-1/2">
                <div className="w-auto hidden sm:flex cursor-pointer  justify-end">
                  <FilterSvg />
                </div>
                <button className="bg-med-green text-white px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base rounded-lg">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TravelTipsTitle;
