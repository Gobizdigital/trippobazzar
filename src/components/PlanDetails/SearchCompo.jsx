import React, { useState } from "react";

import { useSearch } from "../../../context/SearchContext.jsx";

import DatePicker from "react-datepicker";
import { FaLocationDot } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";
import CalenderSvg from "../../../svgs/CalenderSvg/index.jsx";
import EditButtonSvg from "../../../svgs/EditButton/index.jsx";
function SearchCompo({ data }) {
  const { searchData, setSearchData } = useSearch();

  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isEditingGuests, setIsEditingGuests] = useState(false);

  const toggleDateEdit = () => setIsEditingDates(!isEditingDates);
  const toggleGuestEdit = () => setIsEditingGuests(!isEditingGuests);

  const updateSearchData = (field, value) => {
    setSearchData((prev) => ({ ...prev, [field]: value }));
  };

  const numberOfDays = parseInt(data?.description.split(" ")[0], 10);
  if (isNaN(numberOfDays)) {
    return;
  }

  const startDate = searchData.startDate
    ? new Date(searchData.startDate)
    : new Date();

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + numberOfDays);

  return (
    <div className="max-w-[1720px] font-poppins w-full em:w-[90%] mx-auto h-auto p-4 py-10 bg-white   relative z-10">
      {/* Starting Location and Destination Inputs */}

      <div className="flex flex-wrap flex-row items-start md:items-end justify-start sm:justify-center lg:justify-between gap-10 lg:gap-4">
        {/* From */}
        <div className="relative w-auto">
          <p className="text-gray-500 md:text-base text-sm font-medium tracking-wider mb-2">
            From
          </p>
          <div className="flex items-center gap-3">
            <FaLocationDot className="text-med-green mb-1 text-base md:text-xl" />
            <p className="text-base md:text-lg">New Delhi</p>
          </div>
        </div>

        {/* Destination */}
        <div className="relative w-auto">
          <p className="text-gray-500 text-sm md:text-base font-medium tracking-wider mb-2">
            Destination
          </p>
          <div className="flex items-center gap-3">
            <FaLocationDot className="text-med-green mb-1 text-base md:text-xl" />
            <p className="text-base md:text-lg">Leh-Ladakh</p>
          </div>
        </div>

        {/*Start Date*/}
        <div className="flex flex-col">
          <p className="text-gray-500 text-sm md:text-base font-medium tracking-wider mb-1">
            Start Date
          </p>
          <div
            className={`flex items-center ${
              isEditingDates ? "gap-0" : "gap-3"
            }`}
          >
            {isEditingDates ? (
              <DatePicker
                selected={new Date(searchData.startDate)}
                className="w-36 text-base md:text-lg"
                onChange={(date) =>
                  updateSearchData("startDate", date.toISOString())
                }
                dateFormat="EEE, dd MMM yyyy"
              />
            ) : (
              <>
                <div className="mb-1 text-base md:text-xl">
                  <CalenderSvg />
                </div>
                <p className="text-base md:text-lg">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(searchData.startDate || new Date()))}
                </p>
              </>
            )}
          </div>
        </div>

        {/* End Date */}
        <div className="flex flex-col">
          <p className="text-gray-500 text-sm md:text-base font-medium tracking-wider mb-1">
            End Date
          </p>
          <div
            className={`flex items-center ${
              isEditingDates ? "gap-0" : "gap-3"
            }`}
          >
            {isEditingDates ? (
              <DatePicker
                selected={new Date(searchData.endDate)}
                className="w-36 text-base md:text-lg outline-1"
                onChange={(date) =>
                  updateSearchData("endDate", date.toISOString())
                }
                dateFormat="EEE, dd MMM yyyy"
              />
            ) : (
              <>
                <div className="mb-1 text-base md:text-xl">
                  <CalenderSvg />
                </div>
                <p className="text-base md:text-lg">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }).format(new Date(searchData.endDate || new Date(endDate)))}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Guests */}
        <div className="flex flex-col">
          <p className="text-gray-500 text-sm md:text-base font-medium tracking-wider mb-1">
            Guests
          </p>
          <div
            className={`flex items-center ${
              isEditingGuests ? "gap-0" : "gap-3"
            }`}
          >
            {isEditingGuests ? (
              <input
                type="number"
                min="1"
                className="w-20 text-base md:text-lg border rounded px-2"
                value={searchData.guests || 1}
                onChange={(e) =>
                  updateSearchData("guests", parseInt(e.target.value, 10))
                }
              />
            ) : (
              <>
                <FaUser className="text-med-green mb-1 text-base md:text-xl" />
                <p className="text-base md:text-lg">
                  {searchData.guests || 1} guests
                </p>
              </>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex items-center justify-end">
          <div
            className="cursor-pointer"
            onClick={() => {
              toggleGuestEdit();
              toggleDateEdit();
            }}
          >
            <EditButtonSvg />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchCompo;
