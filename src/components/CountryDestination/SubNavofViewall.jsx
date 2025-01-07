import React from "react";
const sections = [
  "All",
  "THEME",
  "PRICE",
  "DURATION",
  "CUSTOMER REVIEWS",
  "MY TRIPS",
];
function SubNavofViewall() {
  return (
    <nav className="bg-white mt-[45rem] sm:mt-[40rem] md:mt-[26rem] lg:mt-60 sticky top-[80px] z-30 shadow-inner ">
      <div className="max-w-7xl mx-auto px-0 em:px-4 py-4">
        <ul className="flex  flex-row items-start overflow-x-scroll md:items-center scrollbar-hide px-4 sm:justify-center text-[.7rem] em:text-sm uppercase leading-6 font-normal  gap-8">
          {sections.map((item, idx) => (
            <li
              key={idx}
              className={`text-gray-500 em:py-0 py-2 cursor-pointer em:border-b-0 ${
                idx === sections.length - 1 ? "border-b-0" : "border-b-0"
              }  em:w-auto  w-full whitespace-nowrap hover:text-med-green`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SubNavofViewall;
