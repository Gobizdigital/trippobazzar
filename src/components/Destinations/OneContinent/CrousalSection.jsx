import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import continentimg from "../../../assets/oneContinent.png";

function CrousalSection({ selectedDestination }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGridView, setIsGridView] = useState(false); // New state to toggle grid view
  const visibleCards = 4; // Number of visible cards in the carousel

  const handlePrev = () => {
    if (!isGridView) {
      setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
    }
  };

  const handleNext = () => {
    if (!isGridView) {
      setCurrentIndex((prevIndex) =>
        prevIndex < selectedDestination?.Countries?.length - visibleCards
          ? prevIndex + 1
          : prevIndex
      );
    }
  };

  if (!selectedDestination?.Countries?.length) {
    return (
      <div className="w-full h-auto pt-96 pb-40 flex justify-center items-center bg-gray-100">
        <h1 className="text-4xl max-w-6xl font-extrabold text-gray-800 text-center">
          {selectedDestination?.ContinentName
            ? `${selectedDestination.ContinentName} Coming Soon: A journey awaits you with breathtaking views, unforgettable experiences, and more to explore. Stay tuned for updates!`
            : "Coming Soon: A journey awaits you with breathtaking views, unforgettable experiences, and more to explore. Stay tuned for updates!"}
        </h1>
      </div>
    );
  }

  return (
    <section className="pt-[185%] esm:pt-[150%] ew:pt-[120%] font-poppins overflow-hidden sm:pt-[100%] md:pt-[50%] lg:pt-72 bg-white/20 bg-opacity-10 relative">
      <div className="w-full h-full md:h-[850px] absolute -z-[10px] -top-6 opacity-25 right-0">
        <img
          src={continentimg}
          alt="Continent"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative w-[90%] flex flex-col items-center md:items-start mx-auto z-0">
        <h3 className="text-2xl em:text-4xl vem:text-5xl md:text-7xl font-bold">
          It’s time for{" "}
          <span className="text-med-green">
            {selectedDestination?.ContinentName || "Loading...."}
          </span>
        </h3>
        <p className="mt-4 text-sm md:text-start text-center sm:text-base max-w-3xl leading-7 md:leading-8">
          Discover {selectedDestination?.ContinentName}'s magnificent landscapes
          and vibrant cultures. Embark on an unforgettable adventure filled with
          wildlife safaris, ancient wonders, and pristine beaches.
        </p>

        {/* Toggle between carousel and grid */}
        <button
          className="mt-6 bg-med-green text-sm sm:text-base text-white py-2 px-4 rounded"
          onClick={() => setIsGridView((prev) => !prev)}
        >
          View All {selectedDestination?.ContinentName} Destinations
        </button>

        <div className="overflow-x-auto pt-10 scrollbar-hide w-full relative">
          <div
            className={`${
              isGridView
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3  gap-5 w-full"
                : "flex flex-nowrap gap-5 w-full transition-transform duration-500"
            }`}
            style={
              isGridView
                ? {}
                : { transform: `translateX(-${currentIndex * 360}px)` }
            }
          >
            {(isGridView
              ? selectedDestination?.Countries
              : selectedDestination?.Countries?.slice(0, 5)
            )?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  navigate(
                    `/destination/${selectedDestination.ContinentName}/${item.CountryName}`
                  );
                }}
                className={`${
                  isGridView ? "w-[100%]" : "w-[350px]"
                } flex-shrink-0 cursor-pointer`}
              >
                <div className="bg-white shadow-lg h-auto rounded overflow-hidden">
                  <div
                    className={`w-full h-[190px] ${
                      isGridView ? "md:h-[300px]" : "md:h-[230px]"
                    } `}
                  >
                    <img
                      src={item?.CountryPhotoUrl}
                      alt={`photoNumber:${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 bg-transparent h-[44%]">
                    <h4 className="text-xl text-gray-600 tracking-wide font-bold">
                      {item?.CountryName}
                    </h4>
                    <p className="mt-2 text-xs md:text-[.8rem] font-semibold text-gray-500">
                      {item?.States[0]?.Packages[0]?.description ||
                        "8 Days 7 Nights | 2 Guests"}
                    </p>
                    <p className="mt-2 md:mt-1 text-xs md:text-[.8rem] font-semibold text-gray-500">
                      ₹{item?.States[0]?.Packages[0]?.price} onwards
                    </p>
                    <div className="flex gap-4 mt-4">
                      <button className="bg-med-green text-white text-xs py-2 px-4 rounded">
                        Book Now
                      </button>
                      <button className="bg-transparent text-med-green border font-medium text-xs border-black py-2 px-4 rounded-md">
                        View All Plans
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons - Hide when Grid View is active */}
        {!isGridView && (
          <div className="absolute top-[25%] mt-3 gap-4 right-10 hidden md:flex items-center">
            <button
              onClick={handlePrev}
              className={`bg-white rounded-full p-2 shadow w-12 h-12 flex items-center justify-center ${
                currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={currentIndex === 0}
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              className={`bg-white rounded-full p-2 shadow w-12 h-12 flex items-center justify-center ${
                currentIndex >=
                selectedDestination?.Countries?.length - visibleCards
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                currentIndex >=
                selectedDestination?.Countries?.length - visibleCards
              }
            >
              &gt;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default CrousalSection;
