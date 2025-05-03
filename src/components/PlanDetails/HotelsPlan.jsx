"use client"
import { MdStar, MdStarHalf, MdStarOutline } from "react-icons/md"

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
        // Check if a hotel from this location is already selected
        const isLocationSelected = selectedHotel.some((item) => item.location === hotel.location)

        // Find the selected hotel for this location (if any)
        const selectedHotelForLocation = selectedHotel.find((item) => item.location === hotel.location)

        return (
          <div key={hotel._id || hotel.location}>
            <h4 className="font-semibold mb-2 text-sm sm:text-base">
              {hotel.location}
              {isLocationSelected && <span className="ml-2 text-green-500 text-xs">(Hotel selected)</span>}
            </h4>

            {isLocationSelected ? (
              // If a hotel is selected for this location, only show the selected hotel
              <div
                key={selectedHotelForLocation._id}
                onClick={() => handleHotelArray(hotel, selectedHotelForLocation)}
                className="w-auto flex flex-col transition-transform ease-in-out duration-300 sm:flex-row mb-4 items-center border-2 rounded-3xl 
                cursor-pointer p-2 space-y-2 sm:space-y-0 border-med-green"
              >
                <img
                  src={selectedHotelForLocation?.hotelPhotoUrl?.[0] || ""}
                  onClick={() =>
                    selectedHotelForLocation?.hotelPhotoUrl && openModal(selectedHotelForLocation.hotelPhotoUrl)
                  }
                  alt="Hotel"
                  className="w-[300px] h-[200px] md:w-[30%] md:h-[30%] rounded-3xl sm:mr-4"
                />

                <div className="flex flex-col items-center sm:items-start md:flex-1">
                  <p className="font-semibold text-sm sm:text-base">{selectedHotelForLocation.hotelName}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      className="bg-green-400 text-white px-2 py-1 rounded text-xs sm:text-sm"
                      onClick={(e) => {
                        toggleDropdown(selectedHotelForLocation._id)
                        handleDropdownClick(e)
                      }}
                    >
                      Rooms, Adults, Children
                    </button>

                    {isDropdownOpen === selectedHotelForLocation._id && (
                      <div
                        onClick={handleDropdownClick}
                        className="absolute mt-[75%] sm:mt-[45%] md:mt-[34%] lg:mt-[25%] bg-white shadow-lg rounded-lg p-4 w-56 z-10"
                      >
                        <div className="mb-3">
                          <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
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

                        <div className="mb-3">
                          <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                            Adults
                          </label>
                          <input
                            id="adults"
                            name="adults"
                            value={customizeHotel.adults}
                            onChange={handleHotelChangeInput}
                            type="number"
                            className="mt-1 block w-full border-[1.5px] text-center border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            placeholder="Enter number of adults"
                          />
                        </div>

                        <div>
                          <label htmlFor="children" className="block text-sm font-medium text-gray-700">
                            Children
                          </label>
                          <input
                            id="children"
                            name="children"
                            value={customizeHotel.children}
                            onChange={handleHotelChangeInput}
                            type="number"
                            className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                            placeholder="Enter number of children"
                          />
                        </div>

                        <div className="mt-4">
                          <label htmlFor="extraBed" className="block text-sm font-medium text-gray-700">
                            Extra Bed
                          </label>
                          <input
                            id="extraBed"
                            name="extraBed"
                            type="checkbox"
                            checked={customizeHotel.extraBed}
                            onChange={() =>
                              setCustomizeHotel((prevState) => ({
                                ...prevState,
                                extraBed: !prevState.extraBed,
                              }))
                            }
                            className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                          />
                        </div>

                        <div className="mt-4">
                          <label htmlFor="childrenAgeUnder5" className="block text-sm font-medium text-gray-700">
                            Children Age Under 5
                          </label>
                          <input
                            id="childrenAgeUnder5"
                            name="childrenAgeUnder5"
                            type="checkbox"
                            checked={customizeHotel.childrenAgeUnder5}
                            onChange={() =>
                              setCustomizeHotel((prevState) => ({
                                ...prevState,
                                childrenAgeUnder5: !prevState.childrenAgeUnder5,
                              }))
                            }
                            className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                          />
                        </div>

                        <button
                          onClick={() => {
                            handleApplyClick(selectedHotelForLocation)
                          }}
                          className="bg-med-green text-[.8rem] text-white w-full mt-2 py-2 rounded"
                        >
                          Apply
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 mt-2">{selectedHotelForLocation?.hotelType}</p>
                  <div className="flex gap-1 mt-1">
                    {[...Array(5)].map((_, i) => {
                      if (i < Math.floor(selectedHotelForLocation.hotelRating)) {
                        return <MdStar key={i} className="text-yellow-400" />
                      } else if (i < selectedHotelForLocation.hotelRating) {
                        return <MdStarHalf key={i} className="text-yellow-400" />
                      } else {
                        return <MdStarOutline key={i} className="text-gray-300" />
                      }
                    })}
                  </div>
                  <p className="mt-1">
                    Total Price:{" "}
                    <span className="font-medium text-green-700">Rs {selectedHotelForLocation.hotelPrice}+</span>
                  </p>
                </div>
              </div>
            ) : (
              // If no hotel is selected for this location, show all hotels
              hotel?.hotelDetails.map((hdetail, hdetailIndex) => {
                return (
                  <div
                    key={hdetail._id || hdetailIndex}
                    onClick={() => handleHotelArray(hotel, hdetail)}
                    className="w-auto flex flex-col transition-transform ease-in-out duration-300 sm:flex-row mb-4 items-center border-2 rounded-3xl 
                    cursor-pointer p-2 space-y-2 sm:space-y-0 border-gray-200 hover:border-gray-300"
                  >
                    <img
                      src={hdetail?.hotelPhotoUrl?.[0] || ""}
                      onClick={() => hdetail?.hotelPhotoUrl && openModal(hdetail.hotelPhotoUrl)}
                      alt="Hotel"
                      className="w-[300px] h-[200px] md:w-[30%] md:h-[30%] rounded-3xl sm:mr-4"
                    />

                    <div className="flex flex-col items-center sm:items-start md:flex-1">
                      <p className="font-semibold text-sm sm:text-base">{hdetail.hotelName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          className="bg-green-400 text-white px-2 py-1 rounded text-xs sm:text-sm"
                          onClick={(e) => {
                            toggleDropdown(hdetail._id)
                            handleDropdownClick(e)
                          }}
                        >
                          Rooms, Adults, Children
                        </button>

                        {isDropdownOpen === hdetail._id && (
                          <div
                            onClick={handleDropdownClick}
                            className="absolute mt-[75%] sm:mt-[45%] md:mt-[34%] lg:mt-[25%] bg-white shadow-lg rounded-lg p-4 w-56 z-10"
                          >
                            <div className="mb-3">
                              <label htmlFor="rooms" className="block text-sm font-medium text-gray-700">
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

                            <div className="mb-3">
                              <label htmlFor="adults" className="block text-sm font-medium text-gray-700">
                                Adults
                              </label>
                              <input
                                id="adults"
                                name="adults"
                                value={customizeHotel.adults}
                                onChange={handleHotelChangeInput}
                                type="number"
                                className="mt-1 block w-full border-[1.5px] text-center border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                placeholder="Enter number of adults"
                              />
                            </div>

                            <div>
                              <label htmlFor="children" className="block text-sm font-medium text-gray-700">
                                Children
                              </label>
                              <input
                                id="children"
                                name="children"
                                value={customizeHotel.children}
                                onChange={handleHotelChangeInput}
                                type="number"
                                className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                                placeholder="Enter number of children"
                              />
                            </div>

                            <div className="mt-4">
                              <label htmlFor="extraBed" className="block text-sm font-medium text-gray-700">
                                Extra Bed
                              </label>
                              <input
                                id="extraBed"
                                name="extraBed"
                                type="checkbox"
                                checked={customizeHotel.extraBed}
                                onChange={() =>
                                  setCustomizeHotel((prevState) => ({
                                    ...prevState,
                                    extraBed: !prevState.extraBed,
                                  }))
                                }
                                className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                            </div>

                            <div className="mt-4">
                              <label htmlFor="childrenAgeUnder5" className="block text-sm font-medium text-gray-700">
                                Children Age Under 5
                              </label>
                              <input
                                id="childrenAgeUnder5"
                                name="childrenAgeUnder5"
                                type="checkbox"
                                checked={customizeHotel.childrenAgeUnder5}
                                onChange={() =>
                                  setCustomizeHotel((prevState) => ({
                                    ...prevState,
                                    childrenAgeUnder5: !prevState.childrenAgeUnder5,
                                  }))
                                }
                                className="mt-1 text-center block w-full border-[1.4px] border-green-500 rounded-md shadow-sm focus:ring-green-400 focus:border-green-400 sm:text-sm"
                              />
                            </div>

                            <button
                              onClick={() => {
                                handleApplyClick(hdetail)
                              }}
                              className="bg-med-green text-[.8rem] text-white w-full mt-2 py-2 rounded"
                            >
                              Apply
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-2">{hdetail?.hotelType}</p>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => {
                          if (i < Math.floor(hdetail.hotelRating)) {
                            return <MdStar key={i} className="text-yellow-400" />
                          } else if (i < hdetail.hotelRating) {
                            return <MdStarHalf key={i} className="text-yellow-400" />
                          } else {
                            return <MdStarOutline key={i} className="text-gray-300" />
                          }
                        })}
                      </div>
                      <p className="mt-1">
                        Total Price: <span className="font-medium text-green-700">Rs {hdetail.hotelPrice}+</span>
                      </p>
                    </div>
                  </div>
                )
              })
            )}

            {/* Add a button to change selection if a hotel is already selected */}
            {isLocationSelected && (
              <button
                onClick={() => {
                  // Find the selected hotel for this location
                  const hotelToRemove = selectedHotel.find((item) => item.location === hotel.location)

                  // Call handleHotelArray to deselect it
                  if (hotelToRemove) {
                    handleHotelArray(hotel, hotelToRemove)
                  }
                }}
                className="text-sm text-green-600 mb-6 hover:text-green-800 underline"
              >
                Change selection for {hotel.location}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
