import React, { useState } from "react";

import "react-intl-tel-input/dist/main.css";
import IntlTelInput from "react-intl-tel-input";
const GuestForm = () => {
  const [phone, setPhone] = useState("");
  // State to track the number of guests
  const [guestCount, setGuestCount] = useState(1);

  // Function to add a new guest
  const handleAddGuest = () => {
    setGuestCount(guestCount + 1);
  };

  return (
<div className="flex flex-col md:flex-row h-full p-0 font-poppins">
  {/* Left Side - Image */}
  <div className="w-full hidden md:flex md:w-[25%] md:h-[50vh] lg:h-[90vh] bg-login-image relative items-center bg-cover bg-center">
    <div className="absolute inset-0 bg-black opacity-40"></div>
<img className="absolute top-[50%] right-0" src="src/assets/Polygon 1.png"/>
  </div>

  {/* Right Side - Form */}
  <div className="w-full md:w-[75%] px-6 md:px-12 pt-3 rounded-bl-xl mb-5 pb-5 bg-white h-auto">
    {/* Heading and Add Guests Button */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Confirm Details</h2>
      <button
        type="button"
        onClick={handleAddGuest}
        className="bg-transparent text-med-green border-[1.5px] text-sm gap-2 flex justify-center items-center border-black px-[12px] py-[1px] hover:scale-95 rounded-lg"
      >
        <span className="text-xl text-black ">+ </span>Add Guests
      </button>
    </div>

    {/* Render Guest Details Forms */}
    {Array.from({ length: guestCount }).map((_, index) => (
      <div key={index} className="mb-8 text-sm">
        <p className="text-sm font-normal text-gray-500 mb-4">
          Guest Details {index + 1}
        </p>

        {/* Form Fields */}
        <form>
          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-1/3">
              <input
                type="text"
                className="w-full p-2 border-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                placeholder="Full Name"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <input
                type="date"
                className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                placeholder="Date of Birth"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <select className="w-full p-2 text-gray-400 border-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]">
                <option className="" value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-1/3">
              <input
                type="text"
                className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                placeholder="Passport Number"
              />
            </div>
            <div className="w-full sm:w-1/3">
              <select className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]">
                <option className="text-black" value="us">Passport Issuing Country</option>
                <option className="text-black" value="us">United States</option>
                <option className="text-black" value="in">India</option>
                <option className="text-black" value="uk">United Kingdom</option>
              </select>
            </div>
            <div className="w-full sm:w-1/3">
              <input
                type="date"
                className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
                placeholder="Passport Expiry Date"
              />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="w-full sm:w-1/3">
              <select className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]">
                <option className="text-black" value="us">Nationality</option>
                <option className="text-black" value="us">United States</option>
                <option className="text-black" value="in">India</option>
                <option className="text-black" value="uk">United Kingdom</option>
              </select>
            </div>
          </div>
        </form>
      </div>
    ))}

    <div className="bg-slate-300 w-full h-[1px]"></div>

    <h2 className="text-xl font-bold my-5">Contact Details</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
      <input
        type="tel"
        name="mobile"
        id="mobile"
        pattern="[0-9]{10}"
        placeholder="Enter your mobile number"
        className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
        required
      />

      <input
        type="email"
        placeholder="Email ID"
        className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
        required
      />
    </div>

    <div className="bg-slate-300 w-full h-[1px] mt-5"></div>

    <h2 className="text-xl font-bold my-5">GST Details</h2>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
      <select className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]">
        <option className="text-black" value="us">Nationality</option>
        <option className="text-black" value="us">United States</option>
        <option className="text-black" value="in">India</option>
        <option className="text-black" value="uk">United Kingdom</option>
      </select>

      <input
        type="number"
        placeholder="GST Number"
        className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
        required
      />
      <input
        type="text"
        placeholder="Address"
        className="w-full p-2 border-gray-400 text-gray-400 placeholder:text-gray-400 rounded-lg border-[1.6px]"
        required
      />
    </div>

    <div className="bg-slate-300 w-full h-[1px] mt-5"></div>

    <h2 className="text-xl text-med-green flex justify-start gap-2 items-start font-bold my-5">
      Cancellation <span className="text-black">Policy</span>
    </h2>
    <button className="border-[.5px] text-[#27BFEA] text-[0.7rem] px-3 py-1 rounded-lg">
      Cancellation for your trip will be eligible till 24th March 2024
    </button>
    <p className="text-sm font-semibold my-3">
      You can cancel your international travel package up to 10 days before your scheduled departure date without incurring any fees.
    </p>
    <ol className="list-disc grid grid-cols-1 gap-2">
      <li className="text-sm">We offer a range of cancellation options to suit your needs, including flexible and standard policies.</li>
      <li className="text-sm">Depending on the package and circumstances, you may have the choice to modify or cancel your booking with minimal hassle.</li>
      <li className="text-sm">Our cancellation policies are transparent and clearly outlined during the booking process.</li>
    </ol>

    <h2 className="text-xl text-med-green flex justify-start gap-2 items-start font-bold my-5">
      Refund <span className="text-black">Policy</span>
    </h2>
    <button className="border-[.5px] text-[#27BFEA] text-[0.7rem] px-3 py-1 rounded-lg">
      Full refund for your trip will be eligible till 9th March 2024
    </button>

    <ol className="list-disc grid grid-cols-1 gap-2 mt-5">
      <li className="text-sm"><span className="font-semibold">Full refund:</span> Cancellations made within 4 days of booking.</li>
      <li className="text-sm"><span className="font-semibold">Partial refund:</span> Cancellations made between 8 days to 10 days before departure will be subject to a partial refund, with the exact amount depending on the timing of cancellation.</li>
      <li className="text-sm"><span className="font-semibold">Non-refundable:</span> Cancellations made after 10 days before departure are non-refundable.</li>
    </ol>
    <p className="text-sm text-med-green mt-5">
      Please note that specific refund amounts and deadlines may vary depending on the terms of your individual package. For further details or assistance, please contact our dedicated support team.
    </p>

    <div className="bg-slate-300 w-full h-[1px]"></div>
    <div className="w-full bg-white mt-5 flex justify-end">
      <button className="bg-med-green text-white hover:scale-105 text-sm px-4 py-2 rounded-lg">
        Confirm and Proceed
      </button>
    </div>
  </div>
</div>

  );
};

export default GuestForm;