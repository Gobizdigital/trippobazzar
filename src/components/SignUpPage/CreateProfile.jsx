import React, { useEffect, useState } from "react";
import LeftArrowSvg from "../../../svgs/LeftArrowSvg";
import CompanyLogo from "../../../svgs/CompanyLogo";
import UserSvg from "../../../svgs/UserSvg";
import CalenderSvg from "../../../svgs/CalenderSvg";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    FullName: "",
    Email: "",
    DateOfBirth: null, // Initialize with null
  });
  const [id, setid] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setFormData((prev) => ({
        ...prev,
        Email: userInfo.email || "",
      }));
      setid(userInfo.userId);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prevData) => ({
      ...prevData,
      DateOfBirth: date,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `https://tripobazar-backend.vercel.app/api/users/${id}`,
        formData
      );
      console.log("Response from backend:", response.data);
      if (response.data) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="max-w-[1980px] mx-auto h-auto">
      <div className="w-full font-poppins flex justify-center relative items-center bg-cover bg-center min-h-screen">
        <div className="relative w-full h-auto flex-grow overflow-y-scroll scrollbar-hide p-3">
          <Link to="/signup" className="absolute top-10 left-10 cursor-pointer">
            <LeftArrowSvg />
          </Link>

          <div className="flex w-full mt-14 justify-center items-center">
            <div className="max-w-md w-full flex flex-col items-center">
              <CompanyLogo className="mb-3" />
              <h1 className="text-[28px] esm:text-[35px] em:text-6xl whitespace-nowrap font-semibold leading-[86px] mb-6">
                Welcome aboard!
              </h1>

              <form
                onSubmit={handleSubmit}
                className="w-full flex flex-col items-center"
              >
                <input
                  type="text"
                  name="FullName"
                  placeholder="Full Name"
                  value={formData.FullName}
                  onChange={handleChange}
                  autoComplete="off"
                  className="outline-2 p-3 w-full border mb-6 border-[#717A7C] rounded-lg outline-med-green bg-inherit text-lg font-medium text-[#717A7C]"
                />
                <input
                  type="email"
                  name="Email"
                  placeholder="Email Id"
                  value={formData.Email}
                  onChange={handleChange}
                  autoComplete="off"
                  className="outline-2 p-3 w-full border mb-6 border-[#717A7C] rounded-lg outline-med-green bg-inherit text-lg font-medium text-[#717A7C]"
                />

                {formData.DateOfBirth !== undefined && (
                  <div className="w-full border mb-6 relative border-[#717A7C] rounded-lg">
                    <div className="absolute top-1/2 right-3 -translate-x-1/2 -translate-y-1/2">
                      <CalenderSvg />
                    </div>
                    <DatePicker
                      selected={formData.DateOfBirth || null} // Ensure DatePicker always receives a defined value or null
                      onChange={handleDateChange}
                      placeholderText="E.g 2004-03-02"
                      className="outline-2 p-3 w-full outline-med-green bg-inherit text-lg font-medium text-[#717A7C] cursor-pointer"
                      dateFormat="yyyy-MM-dd"
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full mb-8 text-lg font-medium bg-med-green text-white p-3 rounded-xl"
                >
                  Create a Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
