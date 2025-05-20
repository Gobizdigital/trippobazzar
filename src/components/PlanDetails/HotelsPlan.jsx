"use client";
import { IoIosImages } from "react-icons/io";
import { MdStar, MdStarHalf, MdStarOutline } from "react-icons/md";

export default function HotelsPlan({
  handleHotelArray,
  selectedHotel,
  data,
  openModal,
  selectedPackageType,
}) {
  return (
    <div className="space-y-6">
      {data?.hotels?.map((hotel) => {
        // Check if a hotel from this location is already selected
        const isLocationSelected = selectedHotel.some(
          (item) => item.location === hotel.location
        );

        // Find the selected hotel for this location (if any)
        const selectedHotelForLocation = selectedHotel.find(
          (item) => item.location === hotel.location
        );

        // Filter hotel details based on the selected package type
        const filteredHotelDetails = selectedPackageType
          ? hotel?.hotelDetails.filter(
              (hdetail) =>
                hdetail.hotelType === "UNI" || // Always include if hotelType is "UNI"
                hdetail.hotelType.toLowerCase() ===
                  selectedPackageType.toLowerCase()
            )
          : hotel?.hotelDetails;

        return (
          <div key={hotel._id || hotel.location} className="pb-6 last:pb-0">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-lg text-gray-800 border-l-4 border-green-500 pl-3">
                {hotel.location}
              </h4>

              {isLocationSelected && (
                <button
                  onClick={() => {
                    const hotelToRemove = selectedHotel.find(
                      (item) => item.location === hotel.location
                    );
                    if (hotelToRemove) {
                      handleHotelArray(hotel, hotelToRemove);
                    }
                  }}
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1.5 rounded-md transition-colors"
                >
                  Change selection
                </button>
              )}
            </div>

            {isLocationSelected ? (
              // Selected hotel view - more compact with less white space
              <div
                key={selectedHotelForLocation._id}
                className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100"
              >
                <div className="flex flex-row">
                  <div className="relative w-1/3">
                    <div className="h-32 sm:h-40 overflow-hidden">
                      <img
                        src={selectedHotelForLocation?.hotelPhotoUrl?.[0] || ""}
                        alt={selectedHotelForLocation.hotelName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {selectedHotelForLocation?.hotelPhotoUrl?.length > 1 && (
                      <button
                        onClick={() =>
                          selectedHotelForLocation?.hotelPhotoUrl &&
                          openModal(selectedHotelForLocation.hotelPhotoUrl)
                        }
                        className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm"
                      >
                        <IoIosImages className="text-gray-700 text-sm" />
                      </button>
                    )}

                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-medium py-1 px-3">
                      Selected
                    </div>
                  </div>

                  <div className="p-3 w-2/3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium text-base text-gray-800">
                        {selectedHotelForLocation.hotelName}
                      </h3>
                      <div className="flex items-center bg-green-50 px-2 py-1 rounded text-xs">
                        {selectedHotelForLocation?.hotelType !== "UNI" && (
                          <span className="text-green-600 font-medium">
                            {selectedHotelForLocation.hotelType || "Deluxe"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2 flex items-center">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => {
                          if (
                            i < Math.floor(selectedHotelForLocation.hotelRating)
                          ) {
                            return (
                              <MdStar
                                key={i}
                                className="text-yellow-400 text-sm"
                              />
                            );
                          } else if (i < selectedHotelForLocation.hotelRating) {
                            return (
                              <MdStarHalf
                                key={i}
                                className="text-yellow-400 text-sm"
                              />
                            );
                          } else {
                            return (
                              <MdStarOutline
                                key={i}
                                className="text-gray-300 text-sm"
                              />
                            );
                          }
                        })}
                      </div>
                      <span className="ml-1 text-xs text-gray-500">
                        {selectedHotelForLocation.hotelRating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Hotel selection grid - now filtered by package type
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredHotelDetails.length > 0 ? (
                  filteredHotelDetails.map((hdetail, hdetailIndex) => (
                    <div
                      key={hdetail._id || hdetailIndex}
                      onClick={() => handleHotelArray(hotel, hdetail)}
                      className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-100"
                    >
                      <div className="relative">
                        <div className="h-36 overflow-hidden">
                          <img
                            src={hdetail?.hotelPhotoUrl?.[0] || ""}
                            alt={hdetail.hotelName}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {hdetail?.hotelType !== "UNI" && (
                          <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                            {hdetail?.hotelType || "Hotel"}
                          </div>
                        )}

                        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 text-xs px-2 py-1 rounded flex items-center">
                          <MdStar className="mr-0.5 text-xs" />
                          {hdetail.hotelRating.toFixed(1)}
                        </div>

                        {hdetail?.hotelPhotoUrl?.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              hdetail?.hotelPhotoUrl &&
                                openModal(hdetail.hotelPhotoUrl);
                            }}
                            className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-full shadow-sm"
                          >
                            <IoIosImages className="text-gray-700 text-sm" />
                          </button>
                        )}
                      </div>

                      <div className="p-3">
                        <h3 className="font-medium text-sm text-gray-800 truncate">
                          {hdetail.hotelName}
                        </h3>

                        <div className="mt-2 flex justify-between items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => {
                              if (i < Math.floor(hdetail.hotelRating)) {
                                return (
                                  <MdStar
                                    key={i}
                                    className="text-yellow-400 text-xs"
                                  />
                                );
                              } else if (i < hdetail.hotelRating) {
                                return (
                                  <MdStarHalf
                                    key={i}
                                    className="text-yellow-400 text-xs"
                                  />
                                );
                              } else {
                                return (
                                  <MdStarOutline
                                    key={i}
                                    className="text-gray-300 text-xs"
                                  />
                                );
                              }
                            })}
                          </div>

                          <button className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded transition-colors">
                            Select
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center text-gray-500">
                    No hotels available for the selected package type. Please
                    select a different package.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
