"use client";

import { useState } from "react";

export default function AddHotel({ setIsAddingPackage, addNew }) {
  const [data, setData] = useState({
    hotelName: "",
    // hotelPrice: "",
    hotelRating: "",
    hotelPhotoUrl: [],
    hotelType: "",
  });

  const packageData = [
    "Budget",
    "Standard",
    "Deluxe",
    "Super Deluxe",
    "Premium",
    "Luxury",
    "Royal",
    "UNI"
  ];

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
        // hotelPrice: "",
        hotelRating: "",
        hotelPhotoUrl: [],
        hotelType: "",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-lg border border-gray-200">
      <div className="container p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">
          Add New Hotel
        </h2>

        {/* Hotel Basic Information */}
        <section className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              name="hotelName"
              placeholder="Hotel name"
              value={data.hotelName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all text-xl font-medium outline-none"
            />
            <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-600">
              Hotel Name
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="number"
                name="hotelRating"
                placeholder="4.5"
                value={data.hotelRating}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                min="0"
                max="5"
                step="0.1"
              />
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-600">
                Rating (0-5)
              </label>
            </div>

            {/* <div className="relative">
              <input
                type="number"
                name="hotelPrice"
                placeholder="1999"
                value={data.hotelPrice}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                min="0"
              />
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-xs text-gray-600">Price (₹)</label>
            </div> */}
          </div>
        </section>

        {/* Hotel Type Selection */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Hotel Category
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {packageData.map((packag, idx) => (
              <div
                key={idx}
                className={`cursor-pointer p-4 rounded-lg text-center transition-all duration-300 transform hover:scale-105 ${
                  data.hotelType === packag
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                }`}
                onClick={() => setData({ ...data, hotelType: packag })}
              >
                <span className="font-medium">{packag}</span>
              </div>
            ))}
          </div>

          {data.hotelType && (
            <p className="mt-3 text-sm font-medium text-blue-600">
              Selected: {data.hotelType}
            </p>
          )}
        </section>

        {/* Hotel Photos */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Hotel Photos
            </h2>
            <button
              type="button"
              onClick={() => {
                setData((prevData) => ({
                  ...prevData,
                  hotelPhotoUrl: [
                    ...prevData.hotelPhotoUrl,
                    "",
                    "",
                    "",
                    "",
                    "",
                  ],
                }));
              }}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add 5 Photos
            </button>
          </div>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {data?.hotelPhotoUrl?.map((photo, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => handleMainPhotoChange(index, e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-sm"
                  placeholder={`Photo URL ${index + 1}`}
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
                  className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setData((prevData) => ({
                ...prevData,
                hotelPhotoUrl: [...prevData.hotelPhotoUrl, ""],
              }));
            }}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Add Photo
          </button>
        </section>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4 border-t">
          <button
            onClick={saveState}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Save Hotel
          </button>

          <button
            onClick={() => {
              setIsAddingPackage(false);
            }}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors duration-300 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
