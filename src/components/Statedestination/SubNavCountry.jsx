import React from "react";

import SmallerFilterSvg from "../../../svgs/SmallerFilterSvg";
const sections = ["ALL PACKAGES", "SEASONAL OFFERS", "ALL INCLUSIVE"];
function SubNavCountry({ toggleModal }) {
  return (
    <nav className="bg-white mt-[30rem] sm:mt-[35rem] md:mt-[26rem] lg:mt-60 sticky top-[80px] z-30 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <ul
          className="flex flex-row em:flex-row  scrollbar-hide px-4 overflow-x-scroll items-center justify-start
         em:justify-center text-[.7rem] em:text-sm uppercase leading-6 font-normal  gap-8"
        >
          <div
            className="cursor-pointer block md:absolute  md:left-32 mmd:left-48"
            onClick={toggleModal}
          >
            <SmallerFilterSvg />
          </div>
          {sections.map((item, idx) => (
            <button
              key={idx}
              className={`text-gray-500 em:py-0  em:w-auto whitespace-nowrap  w-full hover:text-med-green`}
            >
              {item}
            </button>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SubNavCountry;
