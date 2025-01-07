import React, { useState } from "react";
import LeftArrowSvg from "../../../svgs/LeftArrowSvg";
import CompanyLogo from "../../../svgs/CompanyLogo";
import InputFieldsLogin from "./InputFieldsLogin";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Loader from "../Loader";
import { useWishlist } from "../../../context/WishListContext";
export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { verifyUser } = useWishlist();
  const [options, setOptions] = useState("mobilenumber");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [details, setDetails] = useState({
    MobileNumber: "",
    Email: "",
    Password: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleClick = (name) => {
    setOptions(name);
    setDetails((prev) => ({
      ...prev,
      MobileNumber: name === "mobilenumber" ? prev.MobileNumber : "",
      Email: name === "Email" ? prev.Email : "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const userData =
      options === "mobilenumber"
        ? { MobileNumber: details.MobileNumber, Password: details.Password }
        : { Email: details.Email, Password: details.Password };

    try {
      const response = await axios.post(
        "https://tripobazar-backend.vercel.app/api/users/login",
        userData
      );
      setLoader(false);

      const userInfo = {
        userId: response.data.data.user._id,
        email: response.data.data.user.Email,
        MobileNumber: response.data.data.user.MobileNumber,
        token: response.data.token,
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      verifyUser();
      navigate("/");
    } catch (error) {
      setLoader(false);
      console.error("Error logging in:", error);
    }
  };
  return (
    <div className="w-full max-w-[1980px] mx-auto h-auto font-poppins flex justify-center bg-login-image relative items-center bg-cover bg-center min-h-screen">
      <div className="absolute top-1/2  left-1/2 right-auto  md:top-0 h-auto md:min-h-screen md:right-0 md:left-auto  -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 w-auto md:-translate-y-0 bg-white opacity-50 md:w-2/3 lg:w-1/2 p-3"></div>

      <div className="absolute top-1/2 left-1/2 right-auto md:left-auto -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 w-full h-screen md:-translate-y-0 md:top-0 md:right-0 md:w-2/3 lg:w-1/2 md:h-screen overflow-hidden flex flex-col">
        <div className="backdrop-blur-md flex-grow overflow-y-scroll scrollbar-hide p-3">
          <Link to={"/"} className=" absolute top-10 left-10 cursor-pointer">
            <LeftArrowSvg />
          </Link>

          <div className="flex w-full mt-36  justify-center items-center">
            <div className="max-w-[400px] md:max-w-sm w-full flex flex-col items-center">
              <CompanyLogo className="mb-3" />
              <h1 className="text-[35px] lsm:text-6xl font-semibold leading-[86px] mb-6">
                Welcome Back
              </h1>
              <InputFieldsLogin
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                options={options}
                handleClick={handleClick}
                details={details}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loader={loader}
              />
            </div>
          </div>
        </div>
      </div>
      {loader && (
        <div className="fixed bg-transparent backdrop-blur-sm opacity-100 w-full h-screen top-0 left-0">
          {/* <Spinner /> */}
          <Loader />
        </div>
      )}
    </div>
  );
}
