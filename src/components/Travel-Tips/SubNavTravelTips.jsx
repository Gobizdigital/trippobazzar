import React, { useState, useEffect } from "react";

function SubNavTravelTips({ descriptionRefs, sections }) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Handle scroll to set the active index
  useEffect(() => {
    const handleScroll = () => {
      descriptionRefs.current.forEach((ref, idx) => {
        const sectionTop = ref.current.getBoundingClientRect().top;
        const sectionHeight = ref.current.offsetHeight;

        // Check if the section is in view
        if (sectionTop <= window.innerHeight / 2 && sectionTop + sectionHeight >= 0) {
          setActiveIndex(idx);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [descriptionRefs]);

  const handleScrollToSection = (index) => {
    descriptionRefs.current[index].current.scrollIntoView({
      behavior: "smooth",
      block: "start", // Scroll to the top of the section
    });
  };

  return (
    <nav className="bg-white sticky top-[80px] z-30 shadow-inner">
      <div className="max-w-7xl mx-auto px-4  md:py-4">
        <ul className="hidden md:flex flex-row whitespace-nowrap items-center justify-center text-[.7rem] md:text-sm uppercase leading-6 font-normal md:space-x-8">
          {sections.map((item, idx) => (
            <li
              onClick={() => handleScrollToSection(idx)}
              key={idx}
              className={`py-0 md:border-b-0 w-auto cursor-pointer ${
                activeIndex === idx ? "text-med-green font-bold" : "text-gray-500"
              } hover:text-med-green`}
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
