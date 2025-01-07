import React, { useState } from "react";

export default function ContactUsInputFields() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    enquiryType: "Support Assistance", // default selection for enquiry type
    message: "",
    getupdate: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Name and Email Inputs */}
      <input
        type="text"
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
        autoComplete="off"
        className="outline-2 p-3 w-full border mb-6 rounded-lg outline-med-green bg-inherit text-lg placeholder-gray-300 font-medium text-[#717A7C]"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        autoComplete="off"
        className="outline-2 p-3 w-full border mb-6  rounded-lg outline-med-green bg-inherit text-lg placeholder-gray-300 font-medium text-[#717A7C]"
      />

      {/* Enquiry Type Radio Buttons */}
      <div className="mb-6">
        <label className="block text-lg italic text-med-green mb-2">
          Please select a category:
        </label>
        <div className="flex flex-wrap gap-4">
          {[
            "Support Assistance",
            "General Enquiry",
            "Feedback",
            "Complaint",
            "Others",
          ].map((type) => (
            <label key={type} className="flex text-sm items-center">
              <input
                type="radio"
                name="enquiryType"
                value={type}
                checked={formData.enquiryType === type}
                onChange={handleChange}
                className="mr-2 custom-radio"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Message Textarea */}
      <textarea
        name="message"
        placeholder="Message..."
        value={formData.message}
        onChange={handleChange}
        className="outline-2 mb-4 p-3 w-full h-32 border  resize-none rounded-lg outline-med-green bg-inherit text-lg placeholder-gray-300 font-medium text-[#717A7C]"
      />
      <div className="flex mb-9 jusitfy-center items-start">
        <input
          type="checkbox"
          value={formData.getupdate}
          onChange={handleChange}
          className="custom-checkbox appearance-none"
        ></input>
        <label className="text-sm">
          I want to receive an additional call back on my registered mobile
          number
        </label>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-med-green rounded-lg text-white"
      >
        Send Now
      </button>
    </form>
  );
}
