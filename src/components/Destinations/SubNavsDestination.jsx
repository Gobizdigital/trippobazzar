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
    { name: "Europe", path: "Europe" },
    { name: "Middle East", path: "Middle East" },
  ];

  return (
    <>
      <nav className="bg-white  shadow-inner">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <ul className="flex flex-row em:flex-row z-20  relative overflow-x-scroll scrollbar-hide items-start em:items-center justify-start em:justify-center text-[.7rem] em:text-sm uppercase leading-6 font-normal gap-8">
            {sections.map((item, idx) => (
            <li key={idx}>
            <Link
              to={`/destination/${item.path}`}
              className={`whitespace-nowrap uppercase em:py-0 py-2 em:border-b-0 ${
                idx === sections.length - 1 ? "border-b-4" : "border-b-2"
              } em:w-auto w-full ${
                location.pathname === `/destination/${item.path}`
                  ? "text-green-500"
                  : "text-gray-500"
              } hover:text-med-green`}
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
