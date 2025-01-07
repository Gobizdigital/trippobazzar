import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    _id: "",
    Email: "",
    Password: "",
    isAdmin: false, // Default as false
    FullName: "",
    MobileNumber: "",
    DateOfBirth: "",
    status: true, // Default as true
    Address: "",
    MaritalStatus: "",
    Gender: "",
    PinCode: "",
    Coupons: [],
    WishListCountries: [],
    WishListStates: [],
    ExtraTravellers: [],
  });

  const [isLoading, setIsLoading] = useState(false); // Loader state

  const verifyUser = async () => {
    setIsLoading(true);
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        setIsLoading(false);
        return;
      }

      const decodedToken = jwtDecode(userInfo.token);
      if (decodedToken && decodedToken.id) {
        const userId = decodedToken.id;
        const response = await axios.get(
          `https://tripobazar-backend.vercel.app/api/users/data/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );

        if (response.status === 200) {
          const userData = response.data.data;
          setUserDetails({
            _id: userData._id || "",
            Email: userData.Email || "",
            Password: userData.Password || "",
            isAdmin: userData.isAdmin || false,
            FullName: userData.FullName || "",
            MobileNumber: userData.MobileNumber || "",
            DateOfBirth: userData.DateOfBirth || "",
            status: userData.status || true,
            Address: userData.Address || "",
            Gender: userData.Gender || "",
            MaritalStatus: userData.MaritalStatus || "",
            PinCode: userData.PinCode || "",
            Coupons: userData.Coupons || [],
            WishListCountries: userData.WishListCountries || [],
            WishListStates: userData.WishListStates || [],
            ExtraTravellers: userData.ExtraTravellers || [],
          });
        }
      }
    } catch (error) {
      console.error("Error verifying user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUser(); // Initially verify user when the app starts
  }, []);

  const updateUserWishlist = async (updatedCountries, updatedStates) => {
    setIsLoading(true); // Show loader
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        setIsLoading(false);
        return;
      }

      const decodedToken = jwtDecode(userInfo.token);
      const userId = decodedToken.id;

      const response = await axios.put(
        `https://tripobazar-backend.vercel.app/api/users/${userId}`,
        {
          WishListCountries: updatedCountries,
          WishListStates: updatedStates,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );

      if (response.status === 200) {
        setUserDetails((prevState) => ({
          ...prevState,
          WishListCountries: updatedCountries,
          WishListStates: updatedStates,
        }));
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    } finally {
      setIsLoading(false); // Hide loader
    }
  };

  const addCountryToWishlist = (countryId) => {
    const isCountryInWishlist = userDetails.WishListCountries.some(
      (wishlist) => {
        if (typeof wishlist === "object" && wishlist._id) {
          return wishlist._id === countryId;
        }
        return wishlist === countryId;
      }
    );

    if (!isCountryInWishlist) {
      const updatedCountries = [...userDetails.WishListCountries, countryId];
      updateUserWishlist(updatedCountries, userDetails.WishListStates);
    } else {
      const updatedCountries = userDetails.WishListCountries.filter(
        (wishlistCountry) => {
          if (typeof wishlistCountry === "object" && wishlistCountry._id) {
            return wishlistCountry._id !== countryId;
          }
          return wishlistCountry !== countryId;
        }
      );
      updateUserWishlist(updatedCountries, userDetails.WishListStates);
    }
  };

  const addStateToWishlist = async (stateId) => {
    const isStateInWishlist = userDetails.WishListStates.some((wishlist) => {
      if (typeof wishlist === "object" && wishlist._id) {
        return wishlist._id === stateId;
      }
      return wishlist === stateId;
    });

    if (!isStateInWishlist) {
      const updatedStates = [...userDetails.WishListStates, stateId];
      // Wait for the wishlist update operation to complete
      await updateUserWishlist(userDetails.WishListCountries, updatedStates);
    } else {
      const updatedStates = userDetails.WishListStates.filter(
        (wishlistState) => {
          if (typeof wishlistState === "object" && wishlistState._id) {
            return wishlistState._id !== stateId;
          }
          return wishlistState !== stateId;
        }
      );
      // Wait for the wishlist update operation to complete
      await updateUserWishlist(userDetails.WishListCountries, updatedStates);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        userDetails,
        setUserDetails,
        addCountryToWishlist,
        addStateToWishlist,
        isLoading, // Expose loader state
        verifyUser,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  return useContext(WishlistContext);
};
