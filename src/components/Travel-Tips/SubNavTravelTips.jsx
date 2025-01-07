import React from "react";

function SubNavTravelTips({ descriptionRefs, sections }) {
  const handleScrollToSection = (index) => {
    descriptionRefs.current[index].current.scrollIntoView({
      behavior: "smooth",
      block: "start", // Scroll to the top of the section
    });
  };

  return (
    <nav className="bg-white sticky top-[80px] z-30 shadow-inner">
      <div className="max-w-7xl mx-auto px-4  md:py-4">
        <ul className="hidden md:flex flex-row whitespace-nowrap  items-center justify-center text-[.7rem] md:text-sm uppercase leading-6 font-normal  md:space-x-8">
          {sections.map((item, idx) => (
            <li
              onClick={() => handleScrollToSection(idx)}
              key={idx}
              className={`text-gray-500 py-0  md:border-b-0 ${
                idx === sections.length - 1 ? "border-b-0" : "border-b"
              }  w-auto   hover:text-med-green`}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SubNavTravelTips;
