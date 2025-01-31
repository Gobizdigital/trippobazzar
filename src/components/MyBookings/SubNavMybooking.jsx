import React, { useState } from "react";

function SubNavbar({ sections }) {
  

  

  return (
    <nav className="bg-white sticky top-[80px] z-10 shadow-inner mb-8 mt-3">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <p className="pb-2 italic underline font-medium em:hidden block">
          Sub Menus
        </p>
        <ul className="flex flex-col em:flex-row items-start em:items-center justify-center text-[12px] sm:text-[.7rem] em:text-sm lg:text-[.9rem] uppercase leading-6 font-normal em:space-x-8">
         
            <li className="text-sm"
            >
          UPCOMING TRIPS
            </li>
            <li className="text-sm"
            >
        PREVIOUS BOOKINGS
            </li>
            <li className="text-sm"
            >
     CANCELLED
            </li>
        </ul>
      </div>
    </nav>
  );
}

export default SubNavbar;
