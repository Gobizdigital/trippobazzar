import React, { useEffect, useRef, useState } from "react";
import { useWishlist } from "../../../context/WishListContext";
import Loader from "../Loader";
import EditButtonSvg from "../../../svgs/EditButton/index";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import DatePicker from "react-datepicker";
import { jwtDecode } from "jwt-decode";
import { IoIosArrowDown } from "react-icons/io";
import AddTravellers from "./AddTravellers";
import LikedCounty from "./LikedCounty";
import Coupns from "./Coupns";

function MyProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userDetails, setUserDetails, isLoading } = useWishlist();
  const [editUser, setEditUser] = useState(false);
  const profileRef = useRef(null);
  const loginDetailsRef = useRef(null);
  const savedTravelersRef = useRef(null);
  const mycoupnsRef = useRef(null);
  const bucketlistRef = useRef(null);
  const [extraTravellers, setExtraTravellers] = useState(
    userDetails?.ExtraTravellers || []
  );
  const [profileFields, setProfileFields] = useState({
    FullName: userDetails?.FullName || "",
    DateOfBirth: userDetails?.DateOfBirth || "",
    Gender: userDetails?.Gender || "",
    MaritalStatus: userDetails?.MaritalStatus || "",
    Address: userDetails?.Address || "",
    PinCode: userDetails?.PinCode || "",
    Email: userDetails?.Email || "",
    Coupons: userDetails?.Coupons || [],
    WishListCountries: userDetails?.WishListCountries || [],
    WishListStates: userDetails?.WishListStates || [],
  });

  useEffect(() => {
    if (!isLoading && userDetails && userDetails._id) {
      setProfileFields({
        FullName: userDetails.FullName || "",
        DateOfBirth: userDetails.DateOfBirth || "",
        Gender: userDetails.Gender || "",
        MaritalStatus: userDetails.MaritalStatus || "",
        Address: userDetails.Address || "",
        PinCode: userDetails.PinCode || "",
        Email: userDetails?.Email || "",
        Coupons: userDetails?.Coupons || [],
        WishListCountries: userDetails?.WishListCountries || [],
        WishListStates: userDetails?.WishListStates || [],
      });
      setExtraTravellers(userDetails.ExtraTravellers || []); // Set ExtraTravellers state
    }
  }, [userDetails]);

  const filledFields = Object.values(profileFields).filter((value) => {
    // Check if the value is a string and not empty after trimming
    if (typeof value === "string") {
      return value.trim() !== "";
    }
    // If it's not a string (like a Date), check if it's truthy (not null, undefined, etc.)
    return value != null;
  }).length; // Count of filled fields

  const totalFields = Object.keys(profileFields).length; // Total number of fields
  const profileCompletion = Math.round((filledFields / totalFields) * 100); // Calculate percentage

  const handleInputChange = (value, fieldName) => {
    setProfileFields((prevFields) => ({
      ...prevFields,
      [fieldName]: value,
    }));
  };

  const updateUser = async (updateData) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        return;
      }

      const decodedToken = jwtDecode(userInfo.token);
      const userId = decodedToken.id;

      const response = await axios.put(
        `https://tripobazar-backend.vercel.app/api/users/${userId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log("User updated successfully");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleSubmit = () => {
    const profileUpdateData = {
      FullName: profileFields.FullName,
      DateOfBirth: profileFields.DateOfBirth,
      Gender: profileFields.Gender,
      MaritalStatus: profileFields.MaritalStatus,
      Address: profileFields.Address,
      PinCode: profileFields.PinCode,
    };
    updateUser(profileUpdateData);
  };

  const navItems = [
    {
      id: "profile",
      label: "Profile",
      ref: profileRef,
    },
    {
      id: "loginDetails",
      label: "Login Details",
      ref: loginDetailsRef,
    },
    {
      id: "savedTravelers",
      label: "Saved Travelers",
      ref: savedTravelersRef,
    },
    {
      id: "myCoupons",
      label: "My Coupons",
      ref: mycoupnsRef,
    },
    {
      id: "bucketlist",
      label: "Bucket List",
      ref: bucketlistRef,
    },
  ];

  const handleScrollTo = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" });
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="md:flex max-w-[1920px] mx-auto p-0 m-0 h-auto w-full bg-tranparent">
      {/* Left Sidebar */}
      <div className="md:w-[20%]  md:sticky top-[8px] shadow-sm md:shadow-none h-full md:mx-8 md:mt-6  z-10 md:block w-full md:rounded-xl bg-white p-4 ">
        <div className="p-[5%] mb-3 text-center w-[103px] h-[103px] flex items-center justify-center font-semibold text-white rounded-[10px] customfradiant text-3xl">
          {profileFields?.FullName
            ? profileFields.FullName.split(" ")
                .filter((word) => word) // Ensure word is not an empty string or undefined
                .slice(0, 2)
                .map((word) => word[0]?.toUpperCase()) // Check if word[0] exists
                .join("")
            : "NN"}
        </div>

        <h3 className="font-semibold mb-0">
          {profileFields.FullName || "No Name"}
        </h3>
        <p className="text-[.7rem] text-[#0028319E] mb-6 ">
          {profileFields.Email || "Email"}
        </p>
        <ul className=" flex flex-wrap md:flex-col gap-4 md:gap-0 w-full text-[.8rem]">
          {navItems.map(({ id, label, ref }) => (
            <li
              key={id}
              onClick={() => handleScrollTo(ref)}
              className="cursor-pointer text-gray-700 mb-2 justify-between flex items-center"
            >
              <span className="flex  items-center">
                <span className="w-4 h-4 border-[.5px] flex items-center justify-center border-med-green rounded-full mr-3">
                  <span className="w-1 h-1 bg-med-green rounded-full"></span>
                </span>
                {label}
              </span>
              <span className="hidden md:flex font-bold text-2xl ">→</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Content */}
      <div className="w-full">
        <div className="flex-1 p-6  md:mt-6 md:rounded-l-xl bg-white  h-auto  space-y-12">
          {/* Profile Section */}

          <div ref={profileRef}>
            <div className="md:mt-3 mb-16">
              <p className=" text-sm  text-start text-gray-600">
                Your Profile is incomplete
              </p>
              <p className=" text-sm  text-right text-gray-600">
                {profileCompletion}%{" "}
              </p>
              <div className="relative w-full  bg-gray-200 h-[3px] rounded-md">
                <div
                  className="absolute top-0 left-0 bg-[#00B58AB2] h-[3px] rounded-md"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-xl font-bold">Profile</h3>
                <p className="text-[#0028319E] text-sm font-[400] mt-2">
                  User Details
                </p>
              </div>
              <div
                onClick={() => {
                  setEditUser((prev) => !prev);
                }}
              >
                {!editUser ? (
                  <EditButtonSvg />
                ) : (
                  <div className="flex items-center  gap-4">
                    <button
                      onClick={handleSubmit}
                      className="px-4 py-[10px] text-lg text-white bg-med-green mt-[5px] rounded-lg"
                    >
                      Save
                    </button>

                    <div className="flex items-center justify-center ">
                      <RxCross2 className="text-red-600 w-[50px] ml-[5px] mt-[5px] h-[50px] p-2 border rounded-full border-red-600" />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* inputs */}
            <div className="grid grid-cols-1 esm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 text-sm">
              <input
                type="text"
                placeholder="FullName"
                name="FullName"
                disabled={!editUser}
                value={profileFields.FullName}
                className="border p-2 rounded-md"
                onChange={(e) => {
                  handleInputChange(e.target.value, "FullName");
                }}
              />
              <div className="w-full">
                <DatePicker
                  selected={profileFields.DateOfBirth}
                  name="DateOfBirth"
                  onChange={(e) => handleInputChange(e, "DateOfBirth")}
                  disabled={!editUser}
                  wrapperClassName="w-full" // Ensure the wrapper is full width
                  className="border p-2 w-full rounded-md" // DatePicker input field
                  placeholderText="2004-03-02"
                  dateFormat="yyyy-MM-dd"
                />
              </div>

              <div className="relative">
                <select
                  className="border appearance-none p-2 rounded-md w-full "
                  value={profileFields.Gender}
                  disabled={!editUser}
                  onChange={(e) => {
                    handleInputChange(e.target.value, "Gender");
                  }}
                  name="Gender"
                >
                  <option className="text-gray-400">Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-Binary</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <IoIosArrowDown />
                </div>
              </div>

              <div className="relative">
                <select
                  className="border appearance-none p-2 w-full rounded-md "
                  disabled={!editUser}
                  value={profileFields.MaritalStatus}
                  onChange={(e) => {
                    handleInputChange(e.target.value, "MaritalStatus");
                  }}
                  name="MaritalStatus"
                >
                  <option>Marital Status</option>
                  <option>Single</option>
                  <option>Married</option>
                </select>
                <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                  <IoIosArrowDown />
                </div>
              </div>
              <input
                type="text"
                placeholder="Address"
                disabled={!editUser}
                name="Address"
                value={profileFields.Address}
                className="border p-2 rounded-md"
                onChange={(e) => {
                  handleInputChange(e.target.value, "Address");
                }}
              />
              <input
                type="text"
                placeholder="Pincode"
                disabled={!editUser}
                name="PinCode"
                value={profileFields.PinCode}
                className="border p-2 rounded-md"
                onChange={(e) => {
                  handleInputChange(e.target.value, "PinCode");
                }}
              />
            </div>
          </div>

          {/* Login Details Section */}
          <div ref={loginDetailsRef}>
            <h3 className="text-xl font-bold">Login Details</h3>

            <div className="grid gride-cols-1  md:grid-cols-2 lg:grid-cols-3 text-sm gap-4 mt-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <select className="border appearance-none p-2 rounded-l-md">
                    <option className="hover:bg-green-100">+91</option>
                    <option className="hover:bg-green-100">+1</option>
                    <option className="hover:bg-green-100">+44</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="border p-2 flex-1 rounded-r-md"
                />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded-md"
              />
              <div className="relative col-auto md:col-span-2 lg:col-span-1">
                <input
                  type="password"
                  placeholder="Password"
                  className="border p-2 w-full rounded-md"
                />
                <span className="absolute right-3 top-3 cursor-pointer">
                  👁️
                </span>
              </div>
            </div>
            <div className="flex justify-end">
              <label className="text-sm text-[#00B58A] cursor-pointer">
                Change Password?
              </label>
            </div>
          </div>

          {/* Saved Travelers Section */}
          <div ref={savedTravelersRef}>
            <div className="flex justify-between items-center">
              <h3 className="text-base em:text-xl font-bold">
                Saved Travelers
              </h3>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm md:text-base  text-med-green border-black border-[1.3px] hover:bg-med-green hover:border-med-green hover:text-white px-1 md:px-4 py-2 rounded-md"
              >
                + Add Traveler
              </button>
            </div>
            <ul className="mt-6 space-y-4">
              {extraTravellers.length > 0 ? (
                extraTravellers.map((traveler, index) => (
                  <li
                    key={index}
                    className=" border-b flex justify-between gap-4  bg-white p-4 rounded-md"
                  >
                    <div className="grid grid-cols-1 em:grid-cols-2 sm:grid-cols-3 w-full lg:grid-cols-4">
                      <div>
                        <label className="text-sm text-[#0028319E] font-normal bg-white rounded-md">
                          Name
                        </label>
                        <p>{traveler.TravellersName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-[#0028319E] font-normal bg-white rounded-md">
                          Age
                        </label>
                        <p>{traveler.TravellersAge}</p> {/* Corrected typo */}
                      </div>
                      <div>
                        <label className="text-sm text-[#0028319E] font-normal bg-white rounded-md">
                          Gender
                        </label>
                        <p>{traveler.TravellersGender || "NN"}</p>{" "}
                        {/* Corrected typo */}
                      </div>
                      <div className="lg:block hidden">
                        <label className="text-sm text-[#0028319E] font-normal bg-white rounded-md">
                          Number
                        </label>
                        <p>{traveler.TravellersNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-end whitespace-nowrap">
                      <button className="text-[#00B58A] bg-none text-end text-sm">
                        View Details
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li>No Travellers. Add Travellers.</li>
              )}
            </ul>
          </div>
        </div>

        {/* Modal for Add Traveler */}
        {isModalOpen && (
          <AddTravellers
            userDetails={userDetails}
            updateUser={updateUser}
            setIsModalOpen={setIsModalOpen}
            setExtraTravellers={setExtraTravellers}
          />
        )}
        <Coupns ref={mycoupnsRef} profileFields={profileFields} />
        <LikedCounty
          updateUser={updateUser}
          setUserDetails={setUserDetails}
          ref={bucketlistRef}
          profileFields={profileFields}
        />
      </div>
    </div>
  );
}

export default MyProfile;
