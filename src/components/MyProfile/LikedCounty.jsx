import React, { useState, forwardRef, useEffect } from "react";
import { FaHeart } from "react-icons/fa";

// Wrap the component in forwardRef
const LikedCounty = forwardRef(
  ({ profileFields, setUserDetails, updateUser }, ref) => {
    const [locations, setLocations] = useState([]);

    useEffect(() => {
      if (profileFields?.WishListCountries && profileFields?.WishListStates) {
        const stateLocation = profileFields?.WishListStates.map((item) => item);
        const countryLocation = profileFields?.WishListCountries.map(
          (item) => item
        );
        setLocations([...stateLocation, ...countryLocation]);
      }
    }, [profileFields]);

    const toggleHeart = async (event, id) => {
      event.stopPropagation();

      let updatedCountries = [...profileFields.WishListCountries];
      let updatedStates = [...profileFields.WishListStates];

      if (updatedCountries.some((country) => country._id === id)) {
        updatedCountries = updatedCountries.filter(
          (country) => country._id !== id
        );
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          WishListCountries: updatedCountries,
        }));
      }
      // Remove the state if it's already in the list
      else if (updatedStates.some((state) => state._id === id)) {
        updatedStates = updatedStates.filter((state) => state._id !== id);
        setUserDetails((prevDetails) => ({
          ...prevDetails,
          WishListStates: updatedStates,
        }));
      }

      try {
        const updateData = {
          WishListCountries: updatedCountries,
          WishListStates: updatedStates,
        };

        await updateUser(updateData);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    };

    return (
      <section ref={ref} className="relative bg-cover bg-opacity-0 px-0 py-5">
        <div className="overflow-x-auto rounded-lg scrollbar-hide py-8 px-5 bg-white h-auto w-full">
          <h3 className="text-base em:text-xl mb-4 font-bold">Bucket Lists</h3>
          <div className="flex gap-8 w-56">
            {locations.map((card, LikedIdx) => (
              <div
                key={LikedIdx}
                className="relative border hover:cursor-pointer group rounded-lg overflow-hidden shadow-lg w-[270px] flex-shrink-0 snap-center"
              >
                {/* Image */}
                <div className="w-full h-48 overflow-hidden">
                  <img
                    src={card.StatePhotoUrl || card.CountryPhotoUrl}
                    alt={`Image of ${LikedIdx}`}
                    className="w-full h-full group-hover:scale-105 duration-300 ease-in-out transition-transform object-cover"
                  />
                </div>

                {/* Top left tag */}
                <p className="absolute top-0 left-0 bg-green-500 text-white px-3 py-2 rounded-br-md">
                  {card?.price}
                </p>

                {/* Heart icon */}
                <button
                  onClick={(e) => toggleHeart(e, card._id)}
                  className={`absolute top-1 right-2 text-2xl p-2 rounded-full transition-all text-pink-500`}
                >
                  <FaHeart />
                </button>

                {/* Bottom div */}
                <div className="bg-white w-full px-3 py-2 flex justify-between items-center">
                  <p>{card.StateName || card.CountryName}</p>
                  <span className="text-lg group-hover:translate-x-1 transition-transform ease-in-out duration-300">
                    &#8594;
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
);

export default LikedCounty;
