import React from "react";
const sections = ["ITINERARY DETAILS", "POLICIES","TERMS & CONDITIONS"];
function SubNavPlanDetail() {
  return (
    <nav className="bg-white  mb-2 sticky z-10 top-[80px]">
      <div className="max-w-7xl mx-auto px-0 em:px-4 py-4">
        <ul className="flex  flex-row items-start overflow-x-scroll md:items-center scrollbar-hide px-4 sm:justify-center text-[.7rem] em:text-sm uppercase leading-6 font-normal  gap-8">
          {sections.map((item, idx) => (
            <button
              key={idx}
              className={`text-gray-500 em:py-0 py-2   em:border-b-0 ${
                idx === sections.length - 1 ? "border-b-0" : "border-b-0"
              }  em:w-auto  w-full whitespace-nowrap hover:text-med-green`}
            >
              {item}
            </button>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default SubNavPlanDetail;
