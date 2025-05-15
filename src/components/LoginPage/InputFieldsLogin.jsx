"use client"
import { Link } from "react-router-dom"
import PasswordSvg from "../../../svgs/PasswordSvg"
import IndianFlag from "../../../svgs/IndianFlag/index"
import UserSvg from "../../../svgs/UserSvg"
import GoogleWrapper from "../../../utils/GoogleWrapper"

export default function InputFieldsLogin({
  showPassword,
  togglePasswordVisibility,
  options,
  handleClick,
  details,
  handleChange,
  handleSubmit,
  errors,
}) {
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="text-base text-[#012831] mb-6 w-full flex justify-between tracking-wider">
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="contactMethod"
              value="mobilenumber"
              className="custom-radio"
              onClick={() => handleClick("mobilenumber")}
              defaultChecked
            />
            <label>Mobile Number</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="radio"
              name="contactMethod"
              value="Email"
              onClick={() => handleClick("Email")}
              className="custom-radio"
            />
            <label>Email Id</label>
          </div>
        </div>

        <div className="w-full space-y-4">
          {options === "mobilenumber" ? (
            <div className="w-full">
              <div className="w-full relative border border-[#717A7C] rounded-lg">
                <div className="absolute top-1/2 left-7 -translate-x-1/2 -translate-y-1/2">
                  <IndianFlag />
                </div>
                <input
                  type="text"
                  name="MobileNumber"
                  placeholder="Mobile Number"
                  value={details.MobileNumber}
                  onChange={handleChange}
                  autoComplete="tel"
                  className="outline-2 p-3 pl-20 outline-med-green bg-inherit text-lg font-medium w-full text-[#717A7C]"
                />
              </div>
              {errors.MobileNumber && <p className="text-red-500 text-sm mt-1">{errors.MobileNumber}</p>}
            </div>
          ) : (
            <div className="w-full">
              <div className="w-full border relative border-[#717A7C] rounded-lg">
                <div className="absolute top-1/2 left-7 -translate-x-1/2 -translate-y-1/2">
                  <UserSvg />
                </div>
                <input
                  type="email"
                  name="Email"
                  placeholder="Email"
                  value={details.Email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="outline-2 p-3 pl-14 outline-med-green bg-inherit text-lg font-medium w-full text-[#717A7C]"
                />
              </div>
              {errors.Email && <p className="text-red-500 text-sm mt-1">{errors.Email}</p>}
            </div>
          )}

          <div className="w-full">
            <div className="border rounded-lg w-full relative border-[#717A7C]">
              <div className="absolute top-1/2 left-7 -translate-x-1/2 -translate-y-1/2">
                <PasswordSvg />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="Password"
                placeholder="Password"
                value={details.Password}
                onChange={handleChange}
                autoComplete="current-password"
                className="py-3 pl-14 pr-16 bg-inherit outline-2 outline-med-green text-lg font-medium w-full text-[#717A7C]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute top-1/2 right-5 -translate-y-1/2 text-[#717A7C]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.Password && <p className="text-red-500 text-sm mt-1">{errors.Password}</p>}
          </div>

          <div className="text-right">
            <Link to="/forgot-password" className="hover:underline cursor-pointer text-[#717A7C]">
              Forgot your Password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              className="w-full text-lg font-medium bg-med-green text-white p-3 rounded-xl hover:bg-opacity-90 transition-colors"
            >
              Log in
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 mb-4">
        <GoogleWrapper />
      </div>

      <div className="text-center md:text-right">
        <p className="flex gap-2 justify-center md:justify-end">
          Don't have an account yet?
          <Link to={"/signup"}>
            <span className="text-blue-600 cursor-pointer hover:underline">Sign Up!</span>
          </Link>
        </p>
      </div>
    </div>
  )
}
