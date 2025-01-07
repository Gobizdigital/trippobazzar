import React from "react";

function SubNavbar({ sections }) {
  const handleScrollTo = (sectionRef) => {
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
    }
  };

  return (
    <nav className="bg-white sticky top-[80px] z-10 shadow-inner mb-8">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="pb-2 italic underline font-medium em:hidden block">
          Sub Menus
        </p>
        <ul className="flex flex-col em:flex-row items-start  em:items-center justify-center text-[12px] sm:text-[.7rem] em:text-sm uppercase leading-6 font-normal  em:space-x-8">
          {sections.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                handleScrollTo(item.ref);
              }}
              className={`text-gray-500 em:py-0 py-2  em:border-b-0 ${
                idx === sections.length - 1 ? "border-b-0" : "border-b"
              }  em:w-auto  w-full hover:text-black`}
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
