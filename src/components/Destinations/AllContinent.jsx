import React, { useEffect } from "react";
import Loader from "../Loader";
import { useState, useRef } from "react";
import {
  FaHeart,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SearchDestinationPage from "../SearchDestination/SearchDestinationPage";
import { useWishlist } from "../../../context/WishListContext";
function AllContinent({ data, loading }) {
  const [liked, setLiked] = useState(Array(data?.length || 0).fill([])); // Initial state for heart toggle
  const scrollContainerRef = useRef([]);
  const carouselRef = useRef(null); // Reference for the carousel container
  const navigate = useNavigate();
  const { addCountryToWishlist, userDetails, verifyUser } = useWishlist();

  useEffect(() => {
    if (!data || !userDetails?.WishListCountries) return;

    const wishlistCountryIds = userDetails.WishListCountries.map((wishlist) =>
      typeof wishlist === "object" ? wishlist._id : wishlist
    );

    const initialLikedState = data?.flatMap(
      (item) =>
        item?.Countries?.filter((country) =>
          wishlistCountryIds.includes(country._id)
        ).map((country) => country._id) // Store matching IDs
    );

    setLiked(initialLikedState || []);
  }, [data, userDetails?.WishListCountries]);

  const toggleHeart = (event, id) => {
    event.stopPropagation();

    setLiked((prevLiked) => {
      if (prevLiked.includes(id)) {
        return prevLiked.filter((likedId) => likedId !== id);
      } else {
        return [...prevLiked, id];
      }
    });

    addCountryToWishlist(id);

    verifyUser();
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft -= 250; // Scroll left by 250px
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft += 250; // Scroll right by 250px
    }
  };

  const handleScrollTo = (index) => {
    if (scrollContainerRef.current[index]) {
      const element = scrollContainerRef.current[index];
      const offset = 100; // Adjust this value to scroll a bit up (in pixels)

      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth",
      });
    }
  };

  if ((loading === true, !data)) {
    return <Loader />;
  }

  return (
    <>
      <SearchDestinationPage />
      <div className="overflow-hidden w-full">
        {data?.map((item, idx) => (
          <section
            key={idx}
            ref={(el) => (scrollContainerRef.current[idx] = el)} // Assign ref
            className="relative h-auto w-full overflow-hidden max-w-full"
          >
            {/* Background Image with dark overlay */}
            <div className="w-full h-full">
              <img
                className="w-full h-full object-cover absolute inset-0"
                src={item.ContinentPhotoUrl}
                alt={`Background of ${item.ContinentName}`}
              />
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>

            <div className="flex h-[820px] items-start relative z-0">
              {/* Dots */}
              <div className="h-full w-[1px] cursor-pointer flex flex-col justify-center items-center gap-[85px] bg-white absolute left-5 sm:left-10 md:left-20 z-20">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    onClick={() => handleScrollTo(index)}
                    className="w-5 h-5 flex items-center justify-center border border-white rounded-full"
                  >
                    <div
                      className={`${
                        idx === index ? "w-[11px] h-[11px]" : "w-[6px] h-[6px]"
                      } rounded-full bg-white`}
                    ></div>
                  </div>
                ))}
              </div>

              <div className="relative z-10 pl-8 sm:pl-16 md:pl-40 pt-10 md:pt-16 pb-10 md:pb-20 text-white max-w-full">
                <h1 className="text-[2.8rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.8rem] uppercase font-bold mb-2 sm:mb-3">
                  {item.ContinentName}
                </h1>
                <p className="text-sm sm:text-lg font-normal mb-4 sm:mb-5">
                  Discover the enchanting wonders <br />
                  of {item.ContinentName}'s tourism treasures
                </p>

                {/* Carousel Navigation */}
                <div className="flex items-center mb-3 mt-6 sm:mt-1 space-x-2 z-20 relative">
                  <button
                    onClick={scrollLeft}
                    aria-label="Scroll left in featured Continent carousel"
                    className="p-2 text-white bg-black bg-opacity-50 rounded hover:bg-opacity-70"
                  >
                    <FaChevronLeft />
                  </button>
                  <button
                    onClick={scrollRight}
                    aria-label="Scroll right in featured Continent carousel"
                    className="p-2 text-white bg-black bg-opacity-50 rounded hover:bg-opacity-70"
                  >
                    <FaChevronRight />
                  </button>
                </div>

                {/* Carousel Section */}
                <div >
                  <div
                    ref={carouselRef}
                    className="flex overflow-x-auto space-x-4 mt-10 sm:mt-16 md:mt-20 scrollbar-hide scroll-snap-x-mandatory"
                    style={{ scrollSnapType: "x mandatory", width: "100%" }}
                  >
                    {item?.Countries?.map((card, index) => (
                      <div
                        key={`${index}-1`} // Unique key for the first instance
                        onClick={() =>
                          navigate(
                            `/destination/${item.ContinentName}/${card.CountryName}`
                          )
                        }
                        className="relative h-[260px]  w-[350px] rounded-lg overflow-hidden shadow-lg flex-shrink-0 scroll-snap-align-start cursor-pointer"
                      >
                        {/* Image */}
                        <img
                          src={card.CountryPhotoUrl}
                          alt={`Photo of ${card.CountryName}`}
                          className="w-full h-[70%] md:h-[80%] object-cover"
                        />

                        {/* Top left tag */}
                        <p className="absolute top-0 text-base left-0 bg-green-500 text-white px-3 py-2 rounded-br-md">
                          ₹ {card?.States[0]?.Packages[0]?.price} onwards
                        </p>

                        {/* Heart icon */}
                        <button
                          className={`absolute top-2 right-2 text-2xl sm:text-3xl p-1 rounded-full ${
                            liked.includes(card._id)
                              ? "text-pink-500"
                              : "text-white"
                          }`}
                          onClick={(e) => toggleHeart(e, card._id)}
                          aria-label="Wishlist icon"
                        >
                          <FaHeart />
                        </button>

                        {/* Bottom div */}
                        <div className="bg-white h-[24%] rounded-b-lg md:h-[20%] text-lg sm:text-xl md:text-2xl text-black w-full px-3 py-2 flex justify-between items-center">
                          <p>{card.CountryName}</p>
                          <FaArrowRight className="text-md sm:text-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

export default AllContinent;
