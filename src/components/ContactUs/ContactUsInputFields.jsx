import axios from "axios";
import React, { useState } from "react";

export default function ContactUsInputFields() {
  const [formData, setFormData] = useState({
    contactName: "",
    contactEmail: "",
    contactPhoneNumber: "",
    contactReason: "Support Assistance", // default selection for enquiry type
    contactDescription: "",
    contactMePhoneNumber: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://trippo-bazzar-backend.vercel.app/api/contact", formData);

      alert("Your contact details have been submitted successfully!");
      setFormData({
        contactName: "",
        contactEmail: "",
        contactPhoneNumber: "",
        contactReason: "Support Assistance",
        contactDescription: "",
        contactMePhoneNumber: false,
      });
    } catch (error) {
      console.log(error);
      alert("Error submitting contact details. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="contactName"
        placeholder="Name"
        value={formData.contactName}
        onChange={handleChange}
        autoComplete="off"
        className="outline-2 p-3 w-full border mb-6 rounded-lg outline-med-green bg-inherit text-lg placeholder-gray-300 font-medium text-[#717A7C]"
      />
      <input
        type="email"
        name="contactEmail"
        placeholder="Email"
        value={formData.contactEmail}
        onChange={handleChange}
        autoComplete="off"
        className="outline-2 p-3 w-full border mb-6  rounded-lg outline-med-green bg-inherit text-lg placeholder-gray-300 font-medium text-[#717A7C]"
      />

      <input
        type="text"
        name="contactPhoneNumber"
        placeholder="Phone Number"
        value={formData.contactPhoneNumber}
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
                name="contactReason"
                value={type}
                checked={formData.contactReason === type}
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
        name="contactDescription"
        placeholder="Message..."
        value={formData.contactDescription}
        onChange={handleChange}
        className="outline-2 mb-4 p-3 w-full h-32 border  resize-none rounded-lg outline-med-green bg-inherit text-lg placeholder-gray-300 font-medium text-[#717A7C]"
      />
      <div className="flex mb-9 justify-center items-start">
        <input
          type="checkbox"
          name="contactMePhoneNumber"
          checked={formData.contactMePhoneNumber} // Control the checkbox with 'checked'
          onChange={(e) =>
            setFormData({ ...formData, contactMePhoneNumber: e.target.checked })
          }
          className="custom-checkbox appearance-none"
        />
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
