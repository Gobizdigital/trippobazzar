"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import LeftArrowSvg from "../../../svgs/LeftArrowSvg"
import CompanyLogo from "../../../svgs/CompanyLogo"
import Loader from "../Loader"
import InputFieldsLogin from "./InputFieldsLogin"
import { useWishlist } from "../../../context/WishListContext"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const { verifyUser } = useWishlist()
  const [options, setOptions] = useState("mobilenumber")
  const [loader, setLoader] = useState(false)
  const navigate = useNavigate()
  const [details, setDetails] = useState({
    MobileNumber: "",
    Email: "",
    Password: "",
  })
  const [errors, setErrors] = useState({
    MobileNumber: "",
    Email: "",
    Password: "",
    general: "",
  })

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState)
  }

  const handleClick = (name) => {
    setOptions(name)
    setDetails((prev) => ({
      ...prev,
      MobileNumber: name === "mobilenumber" ? prev.MobileNumber : "",
      Email: name === "Email" ? prev.Email : "",
    }))
    setErrors({
      MobileNumber: "",
      Email: "",
      Password: "",
      general: "",
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setDetails((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }))
  }

  const validateForm = () => {
    let isValid = true
    const newErrors = { ...errors }

    // Validate based on selected option
    if (options === "mobilenumber") {
      if (!details.MobileNumber) {
        newErrors.MobileNumber = "Mobile number is required"
        isValid = false
      } else if (!/^[0-9]{10}$/.test(details.MobileNumber)) {
        newErrors.MobileNumber = "Mobile number must be 10 digits"
        isValid = false
      }
    } else {
      if (!details.Email) {
        newErrors.Email = "Email is required"
        isValid = false
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.Email)) {
        newErrors.Email = "Please enter a valid email"
        isValid = false
      }
    }

    // Validate password
    if (!details.Password) {
      newErrors.Password = "Password is required"
      isValid = false
    } 

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoader(true)
    const userData =
      options === "mobilenumber"
        ? { MobileNumber: details.MobileNumber, Password: details.Password }
        : { Email: details.Email, Password: details.Password }

    try {
      const response = await axios.post("https://trippo-bazzar-backend.vercel.app/api/users/login", userData)
      setLoader(false)

      const userInfo = {
        userId: response.data.data.user._id,
        email: response.data.data.user.Email,
        MobileNumber: response.data.data.user.MobileNumber,
        token: response.data.token,
      }
      localStorage.setItem("userInfo", JSON.stringify(userInfo))
      verifyUser()
      navigate("/")
    } catch (error) {
      setLoader(false)
      setErrors((prev) => ({
        ...prev,
        general: error.response?.data?.message || "Error logging in. Please try again.",
      }))
      console.error("Error logging in:", error)
    }
  }

  return (
    <div className="w-full max-w-[1980px] mx-auto font-poppins flex justify-center bg-login-image relative items-center bg-cover bg-center min-h-screen">
      <div className="absolute top-0 right-0 h-full md:w-2/3 lg:w-1/2 bg-white opacity-50"></div>

      <div className="absolute top-0 right-0 h-full md:w-2/3 lg:w-1/2 overflow-auto flex flex-col">
        <div className="backdrop-blur-md flex-grow p-6 md:p-10 lg:p-12 flex flex-col">
          <Link to={"/"} className="self-start mb-6">
            <LeftArrowSvg />
          </Link>

          <div className="flex w-full justify-center items-center mt-4 md:mt-10">
            <div className="max-w-[400px] w-full flex flex-col items-center">
              <CompanyLogo className="mb-3" />
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">Welcome Back</h1>

              {errors.general && (
                <div className="w-full p-3 mb-4 text-red-600 bg-red-100 rounded-lg">{errors.general}</div>
              )}

              <InputFieldsLogin
                showPassword={showPassword}
                togglePasswordVisibility={togglePasswordVisibility}
                options={options}
                handleClick={handleClick}
                details={details}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                loader={loader}
                errors={errors}
              />
            </div>
          </div>
        </div>
      </div>

      {loader && (
        <div className="fixed bg-transparent backdrop-blur-sm opacity-100 w-full h-screen top-0 left-0 flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  )
}
