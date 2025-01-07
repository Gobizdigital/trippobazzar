import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useWishlist } from "../../../context/WishListContext";
const CardSection = ({ data, error }) => {
  const { continent, country } = useParams();
  const navigate = useNavigate();

  const [liked, setLiked] = useState(Array(data?.length || 0).fill([])); // Initial state for heart toggle
  const { addStateToWishlist, userDetails, verifyUser } = useWishlist();

  useEffect(() => {
    if (!data || !userDetails?.WishListStates) return;

    const wishlistStateIds = userDetails.WishListStates.map((wishlist) =>
      typeof wishlist === "object" ? wishlist._id : wishlist
    );

    const initialLikedState = data?.States?.filter(
      (state) => wishlistStateIds.includes(state._id) // Check if the state's ID is in the wishlist
    ).map((country) => country._id);

    setLiked(initialLikedState || []);
  }, [data, userDetails?.WishListStates]);

  const toggleHeart = (event, id) => {
    event.stopPropagation();

    setLiked((prevLiked) => {
      if (prevLiked.includes(id)) {
        return prevLiked.filter((likedId) => likedId !== id);
      } else {
        return [...prevLiked, id];
      }
    });

    addStateToWishlist(id);

    verifyUser();
  };

  if (error) {
    return (
      <div className="w-full h-screen relative -z-10 flex flex-col justify-center items-center bg-gray-100 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-4">
          Packages for {country} will be coming soon
        </h2>
        <p className="text-lg text-gray-500">
          Stay tuned for the latest updates on {country} travel packages!
        </p>
      </div>
    );
  }

  return (
    <section className="relative  bg-cover bg-opacity-0 px-5 p-11">
      <div className="grid grid-cols-1 sm:grid-cols-2 w-[90%] mx-auto lg:grid-cols-4 gap-8">
        {data?.States?.map((card, index) => {
          return (
            <div
              key={index}
              onClick={() => {
                navigate(
                  `/destination/${continent}/${country}/${card.StateName}`
                );
              }}
              className="relative border hover:cursor-pointer group rounded-lg overflow-hidden shadow-lg"
            >
              {/* Image */}
              <div className="w-full h-48 overflow-hidden">
                <img
                  src={card.StatePhotoUrl}
                  alt="Image Description"
                  className="w-full h-full group-hover:scale-105 duration-300 ease-in-out transition-transform object-cover"
                />
              </div>

              {/* Top left tag */}
              <p className="absolute top-0 left-0 bg-green-500 text-white px-3 py-2 rounded-br-md">
                ₹ {card.Packages[0]?.price} onwards
              </p>

              {/* Heart icon */}
              <button
                className={`absolute top-2 right-2   p-1 rounded-full ${
                  liked.includes(card._id) ? "text-pink-500" : "text-white"
                }`}
                onClick={(e) => toggleHeart(e, card._id)}
                aria-label="Wishlist The State"
              >
                <FaHeart />
              </button>

              {/* Bottom div */}
              <div className="bg-white w-full px-3 py-2 flex justify-between items-center">
                <p>{card.StateName}</p>
                <span className="text-lg group-hover:translate-x-1 transition-transform ease-in-out duration-300">
                  &#8594;
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CardSection;
