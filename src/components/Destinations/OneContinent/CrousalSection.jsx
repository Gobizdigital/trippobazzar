import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import continentimg from "../../../assets/oneContinent.png";
function CrousalSection({ selectedDestination }) {
  const navigate = useNavigate();

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < selectedDestination[0]?.Countries.length - 4
        ? prevIndex + 1
        : prevIndex
    );
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
    <section className=" pt-[185%] esm:pt-[150%] ew:pt-[120%] font-poppins overflow-hidden  sm:pt-[100%] md:pt-[50%] lg:pt-72 bg-white/20 bg-opacity-10  relative">
      <div className="w-full h-full md:h-[850px] absolute -z-[10px] -top-6 opacity-25 right-0">
        <img
          src={continentimg}
          alt="wth"
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
        <button className="mt-6 bg-med-green text-sm sm:text-base text-white py-2 px-4 rounded">
          View All {selectedDestination?.ContinentName} Destinations
        </button>

        <div className="  overflow-hidden  pt-7 w-full ">
          <div className="flex flex-col md:items-start items-center md:flex-row gap-10 w-full transition-transform duration-500">
            {selectedDestination?.Countries?.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  navigate(
                    `/destination/${selectedDestination.ContinentName}/${item.CountryName}`
                  );
                }}
                className="w-full sm:w-[350px] " // This makes sure each item takes up a responsive fraction of the width.
              >
                <div className="bg-white shadow-lg h-auto rounded overflow-hidden">
                  <div className="w-full h-[190px] md:h-[270px]">
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
        <div className="absolute  top-[25%] mt-3 gap-4 right-10 hidden md:flex items-center">
          <button
            onClick={handlePrev}
            className="  bg-white rounded-full p-2 shadow w-12 h-12 flex items-center justify-center"
          >
            &lt;
          </button>
          <button
            onClick={handleNext}
            className=" bg-white rounded-full p-2 shadow w-12 h-12 flex items-center justify-center"
          >
            &gt;
          </button>
        </div>
      </div>
    </section>
  );
}

export default CrousalSection;
