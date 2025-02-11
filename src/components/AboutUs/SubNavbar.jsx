import React, { useState } from "react";

function SubNavbar({ sections }) {
  const [activeSection, setActiveSection] = useState(null);

  const handleScrollTo = (sectionRef, label) => {
    if (sectionRef && sectionRef.current) {
      const offsetAdjustment = window.matchMedia("(min-width: 768px)").matches
        ? 90
        : 300;
      const offsetTop =
        sectionRef.current.getBoundingClientRect().top +
        window.scrollY -
        offsetAdjustment;

      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });

      // Set the active section
      setActiveSection(label);
    }
  };

  return (
    <nav className="bg-white shadow-inner mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
 
        <ul className="flex flex-row items-start em:items-center justify-center text-[12px] sm:text-[.7rem] em:text-sm lg:text-[.9rem] uppercase leading-6 font-normal em:space-x-8">
          {sections.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                handleScrollTo(item.ref, item.label);
              }}
              className={`cursor-pointer em:py-0 py-2 em:border-b-0 ${
                idx === sections.length - 1 ? "border-b-0" : "border-b"
              } em:w-auto w-full ${
                activeSection === item.label ? "text-green-500" : "text-gray-500"
              } hover:text-black`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SubNavbar;
