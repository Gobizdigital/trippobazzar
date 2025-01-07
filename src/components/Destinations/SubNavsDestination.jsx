import React from "react";
import { Link, useParams } from "react-router-dom";

export default function SubNavsDestination() {
  // Sections and their corresponding routes

  const {item}=useParams();

  const sections = [
    { name: "All", path: "" }, // Root path for "All"
    { name: "Asia", path: "asia" },
    { name: "Africa", path: "africa" },
    { name: "Australia", path: "australia" },
    { name: "North America", path: "north-america" },
    { name: "South America", path: "south-america" },
  ];

  return (
    <>
      <nav className="bg-white sticky top-[80px] z-[19] shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ul className="flex flex-row em:flex-row overflow-x-scroll scrollbar-hide items-start em:items-center justify-center text-[.7rem] em:text-sm uppercase leading-6 font-normal gap-8">
            {sections.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={`/destination/${item.path}`}
                  // Use the mapping to get the route
                 
                  className={`text-gray-500 whitespace-nowrap uppercase em:py-0 py-2 em:border-b-0 ${
                    idx === sections.length - 1 ? "border-b-0" : "border-b-0"
                  } em:w-auto w-full hover:text-med-green`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
