"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"
import { jwtDecode } from "jwt-decode"

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    _id: "",
    Email: "",
    Password: "",
    isAdmin: false,
    FullName: "",
    MobileNumber: "",
    DateOfBirth: "",
    status: true,
    Address: "",
    MaritalStatus: "",
    Gender: "",
    PinCode: "",
    Coupons: [],
    WishListCountries: [],
    WishListStates: [],
    ExtraTravellers: [],
    BookingDetails: [],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  // Add initialization state to prevent premature redirects
  const [isInitialized, setIsInitialized] = useState(false)

  const verifyUser = async () => {
    setIsLoading(true)
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))

      if (!userInfo) {
        console.warn("No user info found, skipping verification.")
        setIsLoading(false)
        setIsInitialized(true) // Mark as initialized even if no user
        return
      }

      const decodedToken = jwtDecode(userInfo.token)
      const currentTime = Date.now() / 1000 // Convert to seconds

      if (decodedToken.exp && decodedToken.exp < currentTime) {
        console.warn("Token expired, logging out.")
        setIsTokenValid(false)
        setIsInitialized(true)
        return
      }

      const userId = decodedToken.id
      if (!userId) {
        console.warn("Invalid token structure, logging out.")
        setIsTokenValid(false)
        setIsInitialized(true)
        return
      }

      const response = await axios.get(`https://trippo-bazzar-backend.vercel.app/api/users/data/${userId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })

      if (response.status === 200) {
        const userData = response.data.data
        setUserDetails({
          _id: userData._id || "",
          Email: userData.Email || "",
          isAdmin: userData.isAdmin || false,
          FullName: userData.FullName || "",
          MobileNumber: userData.MobileNumber || "",
          DateOfBirth: userData.DateOfBirth || "",
          status: userData.status ?? true,
          Address: userData.Address || "",
          Gender: userData.Gender || "",
          MaritalStatus: userData.MaritalStatus || "",
          PinCode: userData.PinCode || "",
          Coupons: userData.Coupons || [],
          WishListCountries: userData.WishListCountries || [],
          WishListStates: userData.WishListStates || [],
          ExtraTravellers: userData.ExtraTravellers || [],
          BookingDetails: userData.BookingDetails || [],
        })
      }
    } catch (error) {
      console.error("Error verifying user:", error)

      // Handle specific errors before forcing logout
      if (error.response?.status === 401) {
        console.warn("Unauthorized access, token might be invalid.")
        setIsTokenValid(false)
      } else {
        console.warn("API failure, but keeping user logged in.")
      }
    } finally {
      setIsLoading(false)
      setIsInitialized(true) // Mark as initialized after verification attempt
    }
  }

  useEffect(() => {
    verifyUser()
  }, [])

  // Handle logout when token is invalid, but only after initialization
  useEffect(() => {
    if (isInitialized && !isTokenValid) {
      localStorage.removeItem("userInfo")
      window.location.href = "/login"
    }
  }, [isTokenValid, isInitialized])

  const updateUserWishlist = async (updatedCountries, updatedStates) => {
    setIsLoading(true)
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
      if (!userInfo) {
        setIsLoading(false)
        return
      }

      const decodedToken = jwtDecode(userInfo.token)
      const userId = decodedToken.id

      const response = await axios.put(
        `https://trippo-bazzar-backend.vercel.app/api/users/${userId}`,
        {
          WishListCountries: updatedCountries,
          WishListStates: updatedStates,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      )

      if (response.status === 200) {
        setUserDetails((prevState) => ({
          ...prevState,
          WishListCountries: updatedCountries,
          WishListStates: updatedStates,
        }))
      }
    } catch (error) {
      console.error("Error updating wishlist:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const addCountryToWishlist = (countryId) => {
    const isCountryInWishlist = userDetails.WishListCountries.some((wishlist) => {
      if (typeof wishlist === "object" && wishlist._id) {
        return wishlist._id === countryId
      }
      return wishlist === countryId
    })

    if (!isCountryInWishlist) {
      const updatedCountries = [...userDetails.WishListCountries, countryId]
      updateUserWishlist(updatedCountries, userDetails.WishListStates)
    } else {
      const updatedCountries = userDetails.WishListCountries.filter((wishlistCountry) => {
        if (typeof wishlistCountry === "object" && wishlistCountry._id) {
          return wishlistCountry._id !== countryId
        }
        return wishlistCountry !== countryId
      })
      updateUserWishlist(updatedCountries, userDetails.WishListStates)
    }
  }

  const addStateToWishlist = async (stateId) => {
    const isStateInWishlist = userDetails.WishListStates.some((wishlist) => {
      if (typeof wishlist === "object" && wishlist._id) {
        return wishlist._id === stateId
      }
      return wishlist === stateId
    })

    if (!isStateInWishlist) {
      const updatedStates = [...userDetails.WishListStates, stateId]
      await updateUserWishlist(userDetails.WishListCountries, updatedStates)
    } else {
      const updatedStates = userDetails.WishListStates.filter((wishlistState) => {
        if (typeof wishlistState === "object" && wishlistState._id) {
          return wishlistState._id !== stateId
        }
        return wishlistState !== stateId
      })
      await updateUserWishlist(userDetails.WishListCountries, updatedStates)
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        userDetails,
        setUserDetails,
        addCountryToWishlist,
        addStateToWishlist,
        isLoading,
        verifyUser,
        isInitialized, // Expose initialization state
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  return useContext(WishlistContext)
}

