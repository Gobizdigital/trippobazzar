import React from "react";
import { MdStar, MdStarHalf, MdStarOutline } from "react-icons/md";

export default function HotelsPlan({
  customizeHotel,
  handleDropdownClick,
  toggleDropdown,
  openModal,
  handleHotelArray,
  selectedHotel,
  data,
  setCustomizeHotel,
  isDropdownOpen,
  handleApplyClick,
  handleHotelChangeInput,
}) {
  return (
    <div>
      {data?.hotels?.map((hotel) => {
        return (
          <div key={hotel._id || hotelIndex}>
            {" "}
            {/* Fallback to index if hotel._id is not available */}
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              {hotel.location}
            </h4>
            {hotel?.hotelDetails.map((hdetail, hdetailIndex) => {
              return (
                <div
                  key={hdetail._id || hdetailIndex}
                  onClick={() => handleHotelArray(hotel, hdetail)}
                  className={`w-auto flex flex-col  transition-transform ease-in-out duration-300 sm:flex-row mb-4 items-center border-2 rounded-3xl 
    cursor-pointer p-2 space-y-2 sm:space-y-0 
    ${
      selectedHotel.some((item) => item._id === hdetail._id)
        ? "border-med-green"
        : "border-gray-200 hover:border-gray-300"
    }`}
                >
                  {/* Content */}

                  <img
                    src={hdetail?.hotelPhotoUrl?.[0] || ""}
                    onClick={() =>
                      hdetail?.hotelPhotoUrl && openModal(hdetail.hotelPhotoUrl)
                    }
                    alt="Hotel"
                    className="w-[30%] h-[30%] rounded-3xl sm:mr-4"
                  />

                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">
                      {hdetail.hotelName}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {/* Button */}
                      <button
                        className="bg-green-400 text-white px-2 py-1 rounded text-xs sm:text-sm"
                        onClick={(e) => {
                          toggleDropdown(hdetail._id);
                          handleDropdownClick(e); // Ensure this is invoked properly
                        }}
                      >
                        Rooms, Adults, Children
                      </button>

                      {/* Dropdown */}
                      {isDropdownOpen === hdetail._id && (
                        <div
                          onClick={handleDropdownClick}
                          className="absolute mt-[75%] sm:mt-[45%] md:mt-[34%] lg:mt-[25%] bg-white  shadow-lg rounded-lg p-4 w-56 z-10"
                        >
                          {/* Input 1: Rooms */}
                          <div className="mb-3">
                            <label
                              htmlFor="rooms"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Rooms
                            </label>
                            <input
                              id="rooms"
                              name="rooms"
                              value={customizeHotel.rooms}
                              onChange={handleHotelChangeInput}
                              type="number"
                              className="mt-1 block w-full border-[1.5px] text-center border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              placeholder="Enter number of rooms"
                            />
                          </div>

                          {/* Input 2: Adults */}
                          <div className="mb-3">
                            <label
                              htmlFor="adults"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Adults
                            </label>
                            <input
                              id="adults"
                              name="adults"
                              value={customizeHotel.adults}
                              onChange={handleHotelChangeInput}
                              type="number"
                              className="mt-1 block w-full border-[1.5px] text-center border-green-500  rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              placeholder="Enter number of adults"
                            />
                          </div>

                          {/* Input 3: Children */}
                          <div>
                            <label
                              htmlFor="children"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Children
                            </label>
                            <input
                              id="children"
                              name="children"
                              value={customizeHotel.children}
                              onChange={handleHotelChangeInput}
                              type="number"
                              className="mt-1 text-center block w-full border-[1.4px] border-green-500  rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              placeholder="Enter number of children"
                            />
                          </div>
                          {/* Input 3: ExtraBed */}
                          <div className="mt-4">
                            <label
                              htmlFor="extraBed"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Extra Bed
                            </label>
                            <input
                              id="extraBed"
                              name="extraBed"
                              type="checkbox"
                              checked={customizeHotel.extraBed} // Whether extra bed is selected
                              onChange={() =>
                                setCustomizeHotel((prevState) => ({
                                  ...prevState,
                                  extraBed: !prevState.extraBed, // Toggle the extra bed state
                                }))
                              }
                              className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                          </div>
                          {/* Input 3: ChildrenUnder5 */}
                          <div className="mt-4">
                            <label
                              htmlFor="childrenAgeUnder5"
                              className="block text-sm font-medium text-gray-700"
                            >
                              Children Age Under 5
                            </label>
                            <input
                              id="childrenAgeUnder5"
                              name="childrenAgeUnder5"
                              type="checkbox"
                              checked={customizeHotel.childrenAgeUnder5} // Whether extra bed is selected
                              onChange={() =>
                                setCustomizeHotel((prevState) => ({
                                  ...prevState,
                                  childrenAgeUnder5:
                                    !prevState.childrenAgeUnder5, // Toggle the extra bed state
                                }))
                              }
                              className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            />
                          </div>
                          <button
                            onClick={() => {
                              handleApplyClick(hdetail);
                            }}
                            className="bg-med-green text-[.8rem] text-white w-full mt-2 py-2 rounded"
                          >
                            Apply
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      Delux
                    </p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(5)].map((_, i) => {
                        if (i < Math.floor(hdetail.hotelRating)) {
                          // Full stars
                          return <MdStar key={i} className="text-yellow-400" />;
                        } else if (i < hdetail.hotelRating) {
                          // Half star
                          return (
                            <MdStarHalf key={i} className="text-yellow-400" />
                          );
                        } else {
                          // Empty stars
                          return (
                            <MdStarOutline key={i} className="text-gray-300" />
                          );
                        }
                      })}
                    </div>
                    <p className=" mt-1 ">
                      Total Price:{" "}
                      <span className="font-medium text-green-700">
                        Rs{" "}
                        {selectedHotel.some((item) => item._id === hdetail._id)
                          ? selectedHotel.find(
                              (item) => item._id === hdetail._id
                            )?.hotelPrice
                          : hdetail.hotelPrice}
                        +
                      </span>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
