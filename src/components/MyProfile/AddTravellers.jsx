import React, { useState } from "react";

export default function AddTravellers({
  userDetails,
  setIsModalOpen,
  setExtraTravellers,
  updateUser,
}) {
  const [formData, setFormData] = useState({
    TravellersName: "",
    TravellersEmail: "",
    TravellersAge: "",
    TravellersNumber: "",
    countryCode: "+91",
    TravellersDateOfBirth: "",
    TravellersPassportNumber: "",
    TravellersPassportIssuedCountry: "",
    TravellersPassportDateOfExpiry: "",
  });

  const handleInputChange = (e) => {
    setFormData((prevFields) => ({
      ...prevFields,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSaveTraveler = () => {
    const travellersData = {
      TravellersName: formData?.TravellersName,
      TravellersEmail: formData?.TravellersEmail,
      TravellersAge: formData?.TravellersAge,
      TravellersNumber: `${formData?.countryCode}-${formData?.TravellersNumber}`, // Concatenate countryCode and TravellersNumber
      TravellersDateOfBirth: formData?.TravellersDateOfBirth,
      TravellersPassportNumber: formData?.TravellersPassportNumber,
      TravellersPassportIssuedCountry:
        formData?.TravellersPassportIssuedCountry,
      TravellersPassportDateOfExpiry: formData?.TravellersPassportDateOfExpiry,
    };

    const travellersUpdateData = {
      ExtraTravellers: [
        ...(userDetails.ExtraTravellers || []), // Ensure it defaults to empty array if undefined
        travellersData, // Add new traveller data
      ],
    };
    updateUser(travellersUpdateData);
    setExtraTravellers((prev) => [...prev, travellersData]);
    setFormData({
      TravellersName: "",
      TravellersEmail: "",
      TravellersAge: "",
      TravellersNumber: "",
      countryCode: "+91",
      TravellersDateOfBirth: "",
      TravellersPassportNumber: "",
      TravellersPassportIssuedCountry: "",
      TravellersPassportDateOfExpiry: "",
    });
    setIsModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 bg-transparent  text-black 
  backdrop-blur-sm z-100 bg-opacity-50 flex items-center justify-center"
    >
      <div className="bg-white px-3 overflow-y-auto py-6  md:py-6 lg:p-9 rounded-lg h-auto md:h-auto w-[87%] sm:w-[70%] md:w-[60%] lg:w-[50%] shadow-lg relative">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Traveler’s Info</h3>
          <button className="text-red-500 font-semibold">Remove</button>
        </div>
        <p className="text-gray-500 text-sm mt-4">User Details</p>
        <div className="grid md:grid-cols-3 grid-cols-1 text-sm gap-4 mt-4">
          <input
            type="text"
            name="TravellersName"
            value={formData.TravellersName}
            onChange={handleInputChange}
            placeholder="Name"
            className="border p-2 rounded-md"
          />

          <input
            type="text"
            name="TravellersEmail"
            value={formData.TravellersEmail}
            onChange={handleInputChange}
            placeholder="Email"
            className="border p-2 rounded-md"
          />
          <input
            type="text"
            name="TravellersAge"
            value={formData.TravellersAge}
            onChange={handleInputChange}
            placeholder="Age"
            className="border p-2 rounded-md"
          />
          <div className="flex justify-center col-auto md:col-span-2 items-center">
            <select
              name="countryCode"
              value={formData.countryCode}
              onChange={handleInputChange}
              className="border p-2 rounded-l-md"
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
            </select>
            <input
              type="text"
              name="TravellersNumber"
              value={formData.TravellersNumber}
              onChange={handleInputChange}
              placeholder="Phone Number"
              className="border p-2 flex-1 rounded-r-md"
            />
          </div>
          <input
            type="date"
            name="TravellersDateOfBirth"
            value={formData.TravellersDateOfBirth}
            onChange={handleInputChange}
            className="border p-2 rounded-md"
          />
        </div>

        <p className="text-gray-500 text-sm mt-6">Passport Details</p>
        <div className="grid text-sm md:grid-cols-2 grid-cols-1 gap-4 mt-4">
          <input
            type="text"
            name="TravellersPassportNumber"
            value={formData.TravellersPassportNumber}
            onChange={handleInputChange}
            placeholder="Passport Number"
            className="border p-2 rounded-md"
          />
          <select
            name="TravellersPassportIssuedCountry"
            value={formData.TravellersPassportIssuedCountry}
            onChange={handleInputChange}
            className="border p-2 rounded-md"
          >
            <option value="">Issuing Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
          <input
            type="date"
            name="TravellersPassportDateOfExpiry"
            value={formData.TravellersPassportDateOfExpiry}
            onChange={handleInputChange}
            className="border p-2 rounded-md"
          />
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => {
              setIsModalOpen(false);
            }}
            className=" text-red-600 px-6 mr-4 py-2 rounded-md"
          >
            cancel
          </button>
          <button
            onClick={handleSaveTraveler}
            className="bg-green-500 text-white px-6 py-2 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
