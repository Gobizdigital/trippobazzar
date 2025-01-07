import React, { useState } from "react";

export default function AddHotel({ setIsAddingPackage, addNew }) {
  const [data, setData] = useState({
    hotelName: "",
    hotelPrice: null,
    hotelRating: null,
    hotelPhotoUrl: [],
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleMainPhotoChange = (index, value) => {
    setData((prevData) => {
      const updatedPhotos = [...prevData.hotelPhotoUrl];
      updatedPhotos[index] = value;
      return { ...prevData, hotelPhotoUrl: updatedPhotos };
    });
  };

  const saveState = async () => {
    try {
      await addNew(data);
      setIsAddingPackage(false);
      console.log(data);
      setData({
        hotelName: "",
        hotelPrice: 0,
        hotelRating: 0,
        hotelPhotoUrl: [],
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="bg-gray-50 text-gray-900">
      <div className="container mx-auto p-6">
        {/* Title and Description */}
        <section className="mb-8 flex flex-col">
          <input
            type="text"
            name="hotelName"
            placeholder="Hotel name"
            value={data.hotelName}
            onChange={handleChange}
            className="text-4xl font-bold mb-2"
          />

          <input
            type="number"
            name="hotelRating"
            placeholder="rating of the Hotel E.g: 4.5"
            value={data.hotelRating}
            onChange={handleChange}
            className="text-xl font-semibold mb-4 text-green-600"
          />
          <input
            type="number"
            name="hotelPrice"
            placeholder="price of the Hotel"
            value={data.hotelPrice}
            onChange={handleChange}
            className="text-xl font-semibold text-green-600"
          />
        </section>

        {/* Main Photos */}
        <section className="mb-8">
          <div className="flex items-center mb-4  gap-4">
            <h2 className="text-2xl font-bold ">Hotel Photos</h2>
            <button
              type="button"
              onClick={() => {
                setData((prevData) => ({
                  ...prevData,
                  hotelPhotoUrl: [
                    ...prevData.hotelPhotoUrl,
                    "", // Add five empty photo inputs
                    "",
                    "",
                    "",
                    "",
                  ],
                }));
              }}
              className="bg-green-500 text-white px-4 py-2 rounded-lg"
            >
              Add 5 Photos
            </button>
          </div>
          {data?.hotelPhotoUrl?.map((photo, index) => (
            <div key={index} className="flex items-center mb-4">
              <input
                type="text"
                value={photo}
                onChange={(e) => handleMainPhotoChange(index, e.target.value)}
                className="w-full"
                placeholder={`HotelPhotos URL ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => {
                  const updatedPhotos = [...data.hotelPhotoUrl];
                  updatedPhotos.splice(index, 1);
                  setData((prevData) => ({
                    ...prevData,
                    hotelPhotoUrl: updatedPhotos,
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
                hotelPhotoUrl: [...prevData.hotelPhotoUrl, ""], // Add a new empty photo input
              }));
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2"
          >
            Add Main Photo
          </button>
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
  );
}
