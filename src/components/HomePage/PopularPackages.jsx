import React, { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import dubai from "../../assets/home/dubai.webp";
import newyork from "../../assets/home/newyorkk.webp";
import vietnam from "../../assets/home/vietnam.webp";
import singapore from "../../assets/home/Singapore.webp";
import Australia from "../../assets/home/australia.webp";
import FirstSvgWhatIncluded from "../../../svgs/WhatsIncluded/FirstSvgWhatIncluded/index";
import SecondSvgWhatIncluded from "../../../svgs/WhatsIncluded/SecondSvgWhatIncluded/index";
import ThirdSvgWhatIncluded from "../../../svgs/WhatsIncluded/ThirdSvgWhatIncluded/index";
import FourthSvgWhatIncluded from "../../../svgs/WhatsIncluded/FourthSvgWhatIncluded/index";
import FifthSvgWhatIncluded from "../../../svgs/WhatsIncluded/FifthSvgWhatIncluded/index";
import SixthSvgWhatIncluded from "../../../svgs/WhatsIncluded/SixthSvgWhatIncluded/index";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

export default function PopularPackages() {
  const { data } = useFetch(
    "https://trippo-bazzar-backend.vercel.app/api/package/query?limit=5"
  );
  const carouselItems = Array.isArray(data) ? data : [];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (carouselItems.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
    }
  };

  const handlePrev = () => {
    if (carouselItems.length > 0) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1
      );
    }
  };

  const progressWidth = carouselItems.length
    ? ((currentIndex + 1) / carouselItems.length) * 100
    : 0;

  const currentItem = carouselItems[currentIndex] || {};

  const {
    MainPhotos = [], // Array of images
    title, // Package title (use instead of 'location')
    price, // Main price
    pricing = [], // Pricing array (for extra options)
    description, // Package description
    whatsIncluded = [], // List of included features
  } = currentItem;

  console.log(currentItem);

  // Extract the first image safely
  const image = MainPhotos.length > 0 ? MainPhotos[0] : "/default-image.jpg"; // Use default if empty

  // Extract the base price if 'price' is undefined
  const finalPrice = price || pricing[0]?.basePrice || "N/A";

  const svgComponents = [
    FirstSvgWhatIncluded,
    SecondSvgWhatIncluded,
    ThirdSvgWhatIncluded,
    FourthSvgWhatIncluded,
    FifthSvgWhatIncluded,
    SixthSvgWhatIncluded,
  ];

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
        <div className="relative w-auto h-auto  mx-auto flex items-center">
          {/* Main Image Container */}
          <div className="w-full h-[700px] overflow-hidden rounded-lg">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute bottom-auto right-auto md:top-0 md:left-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 md:-translate-y-0 md:bottom-0 md:right-0 w-[90%] mx-auto vem:mx-0 vem:w-[500px] lg:w-[42.8%] h-[624px] md:h-[700px] bg-white p-4 rounded-lg md:rounded-r-lg">
            {/* Green Small Div */}
            <div className="absolute top-0 left-0">
              <p className="text-[.7rem] bg-[#2C9C48] rounded-br-lg rounded-tl-lg md:rounded-tl-none h-10 flex items-center justify-center w-44 font-semibold text-white">
                Seasonal Offer
              </p>
            </div>

            {/* Location and Price Info */}
            <div className="mt-5">
              <p className="text-3xl md:text-5xl mb-4 md:mb-4 leading-7 mt-10 font-bold">
                <span className="text-gray-600 text-base md:text-3xl  font-semibold">
                  {title}
                </span>
              </p>
              <div className="flex flex-row justify-center gap-4 mb-2 ew:mb-4 md:mb-3 max-w-lg mx-auto">
                <p className="text-gray-600 text-sm md:text-lg p-4">
                  {description}
                </p>
              </div>

              <h2 className="text-3xl font-bold text-[#00B58A]">
                Rs. {finalPrice}
              </h2>
              <p className="mt-2 mb-4 font-semibold">What’s included?</p>

              <div className="flex flex-wrap justify-center gap-2 mb-6 mx-auto">
                {svgComponents.map((SvgComponent, index) => (
                  <div key={index} className="w-6 sm:w-8 h-6 sm:h-8">
                    <SvgComponent />
                  </div>
                ))}
              </div>

              {/* Book Now Button */}
              <button className="w-[80%] sm:w-[70%] mb-4 sm:mb-[5%] bg-med-green text-white py-2 rounded-md hover:bg-green-600">
                Book Now
              </button>
            </div>

            {/* Additional Info Section */}
            <div className="absolute rounded-b-lg md:rounded-br-lg md:rounded-b-none bottom-0 left-0 w-full mt-4 border-t border-gray-200 bg-[#EDF7F9]">
              <p className="mt-8 px-2 text-sm md:text-base xlg:text-lg tracking-wide">
                Our travel plans include all facilities as per your custom
                requirements.
              </p>
              <p className="font-semibold text-base xlg:text-lg tracking-wide mt-2">
                {description}
              </p>
              <button className="border-[.1rem] mt-7 mb-8 rounded-lg text-med-green border-[#012831] w-2/5 font-poppins text-[.8rem] font-medium px-2 py-2">
                View All Plans
              </button>
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
