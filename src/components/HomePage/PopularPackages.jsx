import React, { useState } from "react";
import dubai from "../../assets/home/dubai.webp";
import newyork from "../../assets/home/newyorkk.webp";
import vietnam from "../../assets/home/vietnam.webp";
import singapore from "../../assets/home/Singapore.webp";
import Australia from "../../assets/home/australia.webp";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Link } from "react-router-dom";

export default function PopularPackages() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
    );
  };

  const carouselItems = [
    {
      image: dubai,
      location: "Dubai",
      country: "UAE",
      price: "₹ 48,999",
      description: "Dubai travel plans starting at just ₹39,999.",
      destination: "destination/MiddleEast",
    },

    {
      image: newyork,
      location: "NEW YORK",
      country: "USA",
      price: "₹ 192410",
      description: "Experience New York from ₹2,199.",
      destination: "destination/Usa",
    },
    {
      image: vietnam,
      location: "VIETNAM",
      country: "ASIA",
      price: "₹ 43,750",
      description: "Experience Vietnam from ₹ 43,750.",
      destination: "destination/asia/Vietnam",
    },
    {
      image: singapore,
      location: "SINGAPORE",
      country: "ASIA",
      price: "₹ 43,750",
      description: "Experience Singapore from ₹ 43,750.",
      destination: "destination/asia",
    },
    {
      image: Australia,
      location: "SYDNEY",
      country: "AUSTRALIA",
      price: "₹ 43,750",
      description: "Experience Australia from ₹ 43,750.",
      destination: "destination/Australia",
    },
  ];
  const progressWidth = ((currentIndex + 1) / carouselItems.length) * 100;
  const { image, location, country, price, description, destination } =
    carouselItems[currentIndex];

  return (
    <>
      <h1 className="text-black text-center font-poppins mt-10 text-[30px] md:text-[40px] font-extrabold leading-none">
        Popular Packages
      </h1>
      <p className="mb-10 mt-5 md:text-base text-sm text-center ">
        Simplify your journey choices effortlessly with our convenient <br></br>{" "}
        and easy-to-choose travel packages.
      </p>
      <section className=" relative text-center w-[90%] max-w-[1720px] mx-auto">
        <div className="relative w-auto h-auto mx-auto flex items-center">
          {/* Main Image Container */}
          <div className="w-full h-[700px] overflow-hidden rounded-lg">
            <img
              src={image}
              alt={location}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Overlay Container */}
          <div className="absolute bottom-auto right-auto md:top-auto md:left-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 md:-translate-y-0 md:bottom-0 md:right-0 w-[90%] mx-auto vem:mx-0 vem:w-[500px] lg:w-[42.8%] h-[624px] md:h-[700px] bg-white p-4 rounded-lg md:rounded-r-lg">
            {/* Green Small Div */}
            <div className="absolute top-0 left-0 ">
              <p className="text-[.7rem] bg-[#00B58A] rounded-br-lg rounded-tl-lg md:rounded-tl-none  h-10 flex items-center justify-center w-44  font-semibold text-white ">
                seasonal offer{" "}
              </p>
            </div>

            {/* Location and Price Info */}
            <div className=" mt-5">
              <p className="text-3xl md:text-5xl mb-4 md:mb-8 mt-16 font-bold">
                {location}
                <span className="text-gray-600 text-base md:text-xl font-medium">
                  ,{country}
                </span>
              </p>
              <div className="flex flex-row justify-center gap-4 mb-2 ew:mb-4 md:mb-10 max-w-lg mx-auto">
                <p className="text-gray-600 text-sm md:text-lg whitespace-nowrap rounded-lg bg-[#f8f8f8] font-medium p-4 ">
                  8 Days 7 Nights
                </p>
                <p className="text-gray-600 text-sm md:text-lg whitespace-nowrap rounded-lg bg-[#f8f8f8] font-medium p-4 ">
                  2 Guests
                </p>
              </div>

              <h2 className="  bg-[white] text-3xl ew:text-5xl font-bold text-[#00B58A] inline-block px-2 py-1 rounded-md">
                {price}
              </h2>
              <p className="mt-2 font-semibold">What’s included?</p>

              {/* Included Icons */}

              {/* Book Now Button */}
              <button className="mt-4 px-4 py-2 bg-med-green text-white rounded-md font-medium">
                Book Now
              </button>
            </div>

            {/* Additional Info Section */}
            <div className="absolute rounded-b-lg md:rounded-br-lg md:rounded-b-none bottom-0 left-0 w-full mt-4 border-t border-gray-200 bg-[#EDF7F9]">
              <p className="mt-8 px-4 text-sm md:text-base xlg:text-lg tracking-wide">
                Our travel plans include all facilities as per your custom
                requirements.
              </p>
              <p className="font-semibold text-base xlg:text-lg tracking-wide mt-4 px-4">
                {description}
              </p>
              <div className="flex justify-center mt-4">
                <Link
                  to={destination}
                  className="w-3/5 px-4 py-3 text-[.9rem] font-medium font-poppins rounded-lg border border-[#012831] text-med-green text-center"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Buttons */}
        <div className="flex flex-row gap-10 py-4 justify-between items-center w-[98%] md:w-[56%]">
          <div className="w-auto flex gap-2 justify-start">
            {" "}
            <button
              aria-label="Previous"
              onClick={handlePrev}
              className="  transform text-2xl  "
            >
              <BsArrowLeft />
            </button>
            <button
              aria-label="Next"
              onClick={handleNext}
              className=" transform text-2xl  "
            >
              <BsArrowRight />
            </button>
          </div>
          <div className="h-[2px] w-full bg-gray-200">
            <div
              style={{ width: `${progressWidth}%` }}
              className="h-full  bg-zinc-900"
            ></div>
          </div>
        </div>
      </section>
    </>
  );
}
