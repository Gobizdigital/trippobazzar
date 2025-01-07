import React, { useRef, useState } from "react";
import useFetch from "../../../../hooks/useFetch";

const AddPackage = ({ addNew, setIsAddingPackage }) => {
  const { data: hotelData, loading } = useFetch(
    `https://tripobazar-backend.vercel.app/api/hotel`
  );
  const [data, setData] = useState({
    title: "",
    description: "",
    price: 0,
    whatsIncluded: [],
    coupon: [],
    MainPhotos: [],
    dayDescription: [],
    specialInstruction: "",
    conditionOfTravel: "",
    thingsToMaintain: "",
    hotels: [],
    policies: "",
    termsAndConditions: "",
  });

  const [newLocation, setNewLocation] = useState("");
  const [selectedHotelIdForDetails, setSelectedHotelIdForDetails] =
    useState("");
  const [selectedHotelIdForNewHotel, setSelectedHotelIdForNewHotel] =
    useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const filteredHotels = hotelData?.filter((hotel) =>
    hotel.hotelName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const packageData = ["Food", "Hotel", "Car", "Explore", "Travel", "Visa"];
  const textareasRef = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const addNewHotel = () => {
    if (!newLocation || !selectedHotelIdForNewHotel) return;

    // Find the hotel in hotelData using selectedHotelId
    const selectedHotel = hotelData.find(
      (hotel) => hotel._id === selectedHotelIdForNewHotel
    );

    const newHotel = {
      location: newLocation,
      hotelDetails: [selectedHotel._id],
    };

    // Update data state to include the new hotel
    setData((prevData) => ({
      ...prevData,
      hotels: [...prevData.hotels, newHotel],
    }));

    // Reset input fields
    setNewLocation("");
  };

  const removeHotel = (hotelId) => {
    const updatedHotels = data.hotels.filter(
      (details) => details._id !== hotelId
    );

    // Update the state to reflect the removal
    setData((prevData) => ({
      ...prevData,
      hotels: updatedHotels,
    }));
  };

  const removeHotelDetail = (hotelIndex, hotelDetailIndex) => {
    // Safeguard: Check if the hotel and hotelDetails exist
    if (!data?.hotels || !data.hotels[hotelIndex]?.hotelDetails) {
      return;
    }

    // Create a copy of the hotels array
    const updatedHotels = [...data.hotels];

    // Remove the specific hotel detail from the hotelDetails array
    updatedHotels[hotelIndex].hotelDetails.splice(hotelDetailIndex, 1);

    // Update the state with the new hotels array
    setData((prevData) => ({
      ...prevData,
      hotels: updatedHotels,
    }));
  };

  const addHotelDetail = (hotelId) => {
    // Find the selected hotel from hotelData by its ID
    const selectedHotel = hotelData?.find(
      (hotel) => hotel._id === selectedHotelIdForDetails
    );

    if (selectedHotel) {
      // Find the hotel that corresponds to the hotelId passed as a parameter
      const hotelIndex = data.hotels.findIndex(
        (hotel) => hotel._id === hotelId
      );

      if (hotelIndex !== -1) {
        // Check if the hotel is already in the hotelDetails array
        const hotelAlreadyAdded = data.hotels[hotelIndex].hotelDetails.some(
          (detail) => detail === selectedHotel._id // Compare the hotel IDs
        );

        if (!hotelAlreadyAdded) {
          // Add the hotel ID to the hotelDetails array
          const updatedHotels = [...data.hotels];
          updatedHotels[hotelIndex] = {
            ...data.hotels[hotelIndex],
            hotelDetails: [
              ...data.hotels[hotelIndex].hotelDetails,
              selectedHotel._id, // Only add the ID, not the whole object
            ],
          };

          // Update the state to reflect the change
          setData((prevData) => ({
            ...prevData,
            hotels: updatedHotels,
          }));
        }
      }
    }
  };

  const saveState = async () => {
    try {
      await addNew(data);
      setIsAddingPackage(false);
      console.log(data);
      setData({
        title: "",
        description: "",
        price: 0,
        whatsIncluded: [],
        coupon: [],
        photos: [],
        dayDescription: [],
        specialInstruction: "",
        conditionOfTravel: "",
        thingsToMaintain: "",
        hotels: [],
        policies: "",
        termsAndConditions: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleArrayChange = (field, index, subField, value) => {
    setData((prevData) => {
      const updatedArray = [...prevData[field]];
      updatedArray[index][subField] = value;
      return { ...prevData, [field]: updatedArray };
    });
  };

  const handlePhotoChange = (dayIndex, photoIndex, value) => {
    setData((prevData) => {
      const updatedArray = [...prevData.dayDescription];
      console.log(value);
      if (value === "") {
        updatedArray[dayIndex].photos = updatedArray[dayIndex].photos.filter(
          (photo, index) => index !== photoIndex
        );
      } else {
        updatedArray[dayIndex].photos[photoIndex] = value;
      }

      return { ...prevData, dayDescription: updatedArray };
    });
  };

  const handleMainPhotoChange = (index, value) => {
    setData((prevData) => {
      const updatedPhotos = [...prevData.MainPhotos];
      updatedPhotos[index] = value;
      return { ...prevData, MainPhotos: updatedPhotos };
    });
  };

  const handleLocationChange = (index, value) => {
    setData((prevData) => {
      const updatedHotels = [...prevData.hotels];

      if (value === "") {
        // Remove the hotel if the value is an empty string
        updatedHotels.splice(index, 1);
      } else {
        // Otherwise, update the hotel's location
        updatedHotels[index] = { ...updatedHotels[index], location: value };
      }

      return { ...prevData, hotels: updatedHotels };
    });
  };

  const handleAutoResize = () => {
    // Iterate over all textareas and adjust their heights
    textareasRef.current.forEach((textarea) => {
      if (textarea) {
        textarea.style.height = "auto"; // Reset height to auto
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
      }
    });
  };

  return (
    <div>
      <div className="bg-gray-50 text-gray-900">
        <div className="container mx-auto p-6">
          {/* Title and Description */}
          <section className="mb-8 flex flex-col">
            <input
              type="text"
              name="title"
              placeholder="PackageTitle"
              value={data.title}
              onChange={handleChange}
              className="text-4xl font-bold mb-2"
            />
            <textarea
              name="description"
              placeholder="description"
              value={data.description}
              onChange={handleChange}
              className="text-lg mb-4"
            />
            <input
              type="number"
              name="price"
              placeholder="price of the package"
              value={data.price}
              onChange={handleChange}
              className="text-xl font-semibold text-green-600"
            />
          </section>

          {/* Main Photos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Main Photos</h2>
            {data?.MainPhotos?.map((photo, index) => (
              <div key={index} className="flex items-center mb-4">
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => handleMainPhotoChange(index, e.target.value)}
                  className="w-full"
                  placeholder={`Main Photo URL ${index + 1}`}
                />
                <button
                  type="button"
                  onClick={() => {
                    const updatedPhotos = [...data.MainPhotos];
                    updatedPhotos.splice(index, 1);
                    setData((prevData) => ({
                      ...prevData,
                      MainPhotos: updatedPhotos,
                    }));
                  }}
                  className="text-red-500 ml-2"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setData((prevData) => ({
                  ...prevData,
                  MainPhotos: [...prevData.MainPhotos, ""], // Add a new empty photo input
                }));
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
            >
              Add Main Photo
            </button>
          </section>

          {/* Day Description*/}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Day Description</h2>
            {data.dayDescription.map((day, dayIndex) => (
              <div key={dayIndex} className="mb-6">
                <input
                  type="text"
                  name={`dayTitle-${dayIndex}`}
                  value={day.dayTitle}
                  onChange={(e) =>
                    handleArrayChange(
                      "dayDescription",
                      dayIndex,
                      "dayTitle",
                      e.target.value
                    )
                  }
                  className="text-xl font-semibold mb-2 w-full"
                  placeholder={`Day ${dayIndex + 1} Title`}
                />
                <textarea
                  name={`dayDetails-${dayIndex}`}
                  value={day.dayDetails}
                  onChange={(e) =>
                    handleArrayChange(
                      "dayDescription",
                      dayIndex,
                      "dayDetails",
                      e.target.value
                    )
                  }
                  ref={(el) => (textareasRef.current[dayIndex] = el)}
                  className="text-gray-700 mb-4 w-full resize-none overflow-hidden"
                  style={{ minHeight: "3rem" }}
                  placeholder={`Details for Day ${dayIndex + 1}`}
                />
                {/* Photo Inputs */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {day.photos.map((photo, photoIndex) => (
                    <div key={photoIndex} className="flex items-center">
                      <input
                        type="text"
                        value={photo}
                        onChange={(e) =>
                          handlePhotoChange(
                            dayIndex,
                            photoIndex,
                            e.target.value
                          )
                        }
                        className="w-full"
                        placeholder={`Photo URL for Day ${
                          dayIndex + 1
                        } - Photo ${photoIndex + 1}`}
                      />
                    </div>
                  ))}
                </div>
                {/* Add new photo input if needed */}
                <button
                  type="button"
                  onClick={() => {
                    const updatedData = [...data.dayDescription];
                    updatedData[dayIndex].photos.push(""); // Add a new empty photo input
                    setData((prevData) => ({
                      ...prevData,
                      dayDescription: updatedData,
                    }));
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Add Photo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updatedDayDescription = data.dayDescription.filter(
                      (_, index) => index !== dayIndex // Remove the item at the specified index
                    );
                    setData((prevData) => ({
                      ...prevData,
                      dayDescription: updatedDayDescription,
                    }));
                  }}
                  className="bg-red-500 ml-2 text-white px-4 py-2 rounded-lg mt-2"
                >
                  Remove this Day-{dayIndex + 1}
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                const newDay = {
                  dayTitle: "",
                  dayDetails: "",
                  photos: [""], // Initialize with one empty photo input
                };
                setData((prevData) => ({
                  ...prevData,
                  dayDescription: [...prevData.dayDescription, newDay],
                }));
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
            >
              Add Another Day
            </button>
          </section>

          {/* What's Included */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">What's Included</h2>
            <ul className=" flex items-center gap-3">
              {data.whatsIncluded.map((item, index) => (
                <li
                  key={index}
                  className="bg-blue-200 relative text-blue-800 px-3 py-1 rounded-lg"
                >
                  {item}
                  <button
                    className="text-red-500 absolute -top-1 -right-1 bg-red-300 rounded-full w-4 h-4 flex justify-center items-center"
                    onClick={() => {
                      const updatedWhatsIncluded = data.whatsIncluded.filter(
                        (packid) => packid !== item // Filter by state ID
                      );
                      setData({
                        ...data,
                        whatsIncluded: updatedWhatsIncluded,
                      });
                    }}
                  >
                    x
                  </button>
                </li>
              ))}
            </ul>
            <div className="mb-2 w-full">
              <ul className="w-full">
                {packageData?.map((packag, idx) => (
                  <li
                    key={idx}
                    className="cursor-pointer list-decimal p-2 w-full bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => {
                      // Check if the package is already added
                      if (!data.whatsIncluded.some((pkg) => pkg === packag)) {
                        setData({
                          ...data,
                          whatsIncluded: [...data.whatsIncluded, packag],
                        });
                      }
                    }}
                  >
                    <span className="mr-4">{packag}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Special Instructions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Special Instructions</h2>
            <textarea
              name="specialInstruction"
              value={data.specialInstruction}
              onChange={(e) => {
                handleChange(e);
                // handleAutoResize(); // Adjust height as user types
              }}
              ref={(el) => textareasRef.current.push(el)}
              className="text-gray-700 whitespace-pre-line w-full resize-none overflow-hidden"
            />
          </section>

          {/* Conditions of Travel */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Conditions of Travel</h2>
            <textarea
              name="conditionOfTravel"
              value={data.conditionOfTravel}
              onChange={handleChange}
              ref={(el) => textareasRef.current.push(el)}
              className="text-gray-700 whitespace-pre-line w-full"
            />
          </section>

          {/*Things to maintain*/}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Things to maintain</h2>
            <textarea
              name="thingsToMaintain"
              value={data.thingsToMaintain}
              onChange={(e) => {
                handleChange(e);
                handleAutoResize(); // Adjust height as user types
              }}
              ref={(el) => textareasRef.current.push(el)}
              className="text-gray-700 whitespace-pre-line w-full resize-none overflow-hidden"
            />
          </section>

          {/* Policies */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Policies</h2>

            <textarea
              name="policies"
              value={data.policies}
              ref={(el) => textareasRef.current.push(el)}
              onChange={handleChange}
              className="text-gray-700 whitespace-pre-line w-full"
            />
          </section>

          {/* Hotel */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Hotels</h2>
            {data?.hotels?.map((hotel, hotelIndex) => (
              <div key={hotelIndex} className="flex flex-col mb-4 gap-2">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={hotel.location}
                    onChange={(e) =>
                      handleLocationChange(hotelIndex, e.target.value)
                    }
                    className="border p-2 rounded"
                  />
                  <button
                    onClick={() => removeHotel(hotel._id)}
                    className="text-red-500 bg-red-200 rounded px-2 py-1"
                  >
                    Remove Hotel
                  </button>
                </div>

                <ul>
                  {hotel?.hotelDetails?.length > 0 ? (
                    hotel.hotelDetails.map((detailId, hotelDetailIndex) => {
                      const hotelObj = hotelData?.find(
                        (hotel) => hotel._id === detailId
                      );

                      return (
                        <li
                          key={hotelDetailIndex}
                          className="bg-blue-100 text-blue-800 p-2 rounded-md mb-2"
                        >
                          {hotelObj?.hotelName || ` ${detailId.hotelName}`}{" "}
                          <button
                            className="text-red-500 ml-2"
                            onClick={() =>
                              removeHotelDetail(hotelIndex, hotelDetailIndex)
                            }
                          >
                            x
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <li>No hotel details available</li>
                  )}
                </ul>

                <div className="flex flex-col gap-2">
                  {/* Custom Searchable Dropdown */}
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search and select a hotel"
                      className="border p-2 w-full rounded"
                      value={searchTerm} // Search input state
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setDropdownVisible(true);
                      }} // Update search term
                    />
                    {dropdownVisible && searchTerm && (
                      <ul className="absolute bg-white border rounded mt-2 w-full max-h-40 overflow-y-auto z-10">
                        {hotelData
                          ?.filter((hotelOption) =>
                            hotelOption.hotelName
                              .toLowerCase()
                              .includes(searchTerm.toLowerCase())
                          )
                          .map((filteredHotel) => (
                            <li
                              key={filteredHotel._id}
                              onClick={() => {
                                setSelectedHotelIdForDetails(filteredHotel._id);
                                setSearchTerm(filteredHotel.hotelName);
                                setDropdownVisible(false);
                              }}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                              {filteredHotel.hotelName}
                            </li>
                          ))}
                        {hotelData?.filter((hotelOption) =>
                          hotelOption.hotelName
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                        ).length === 0 && (
                          <li className="p-2 text-gray-500">
                            No results found
                          </li>
                        )}
                      </ul>
                    )}
                  </div>

                  {/* Add Detail Button */}
                  <button
                    onClick={() => {
                      addHotelDetail(hotel._id, selectedHotelIdForDetails);
                      setSearchTerm("");
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    disabled={!selectedHotelIdForDetails} // Disable button if no hotel is selected
                  >
                    Add Detail
                  </button>
                </div>
              </div>
            ))}

            <div className="mt-6 border p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Add New Hotel</h3>
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter location"
                className="border p-2 w-full mb-2"
              />

              <div className="relative w-full mb-2">
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setDropdownVisible(true)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search and select a hotel"
                  className="border p-2 rounded w-full"
                />
                {dropdownVisible &&
                  searchQuery &&
                  filteredHotels?.length > 0 && (
                    <ul className="absolute bg-white border rounded w-full max-h-40 overflow-y-auto mt-1 z-10">
                      {filteredHotels.map((hotel) => (
                        <li
                          key={hotel._id}
                          onClick={() => {
                            setSelectedHotelIdForNewHotel(hotel._id);
                            setSearchQuery(hotel.hotelName);
                            setDropdownVisible(false);
                          }}
                          className="p-2 hover:bg-gray-200 cursor-pointer"
                        >
                          {hotel.hotelName}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>

              <button
                onClick={addNewHotel}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
              >
                Add Hotel
              </button>
            </div>
          </section>

          {/* Terms and Conditions */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Terms and Conditions</h2>
            <textarea
              name="termsAndConditions"
              value={data.termsAndConditions}
              ref={(el) => {
                if (el && !textareasRef.current.includes(el)) {
                  textareasRef.current.push(el);
                }
              }}
              onChange={handleChange}
              className="text-gray-700 whitespace-pre-line w-full"
            />
          </section>

          {/* Save or Submit button */}
          <button
            onClick={saveState}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>

          <button
            onClick={() => {
              setIsAddingPackage(false);
            }}
            className="bg-red-500 ml-4 text-white px-4 py-2 rounded-lg"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPackage;
