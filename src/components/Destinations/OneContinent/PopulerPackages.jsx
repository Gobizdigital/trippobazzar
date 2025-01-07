import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";

function PopulerPackages() {
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
        image:
          "https://d3hne3c382ip58.cloudfront.net/files/uploads/bookmundi/resized/cmsfeatured/summer-in-egypt-1682660289-785X440.jpg?width=384&quality=undefined",
        location: "Egypt All Inclusive Deal",
        country: "",
        price: "₹ 48,999",
        description: "Get EXTRA 10% OFF USING CODE TRIPPO10",
      },
  
      {
        image:
        "https://d3hne3c382ip58.cloudfront.net/files/uploads/bookmundi/resized/cmsfeatured/summer-in-egypt-1682660289-785X440.jpg?width=384&quality=undefined",
        location: "NEW YORK",
        country: "USA",
        price: "$ 2,199",
        description: "Get EXTRA 10% OFF USING CODE TRIPPO10",
      },
    ];
    const progressWidth = ((currentIndex + 1) / carouselItems.length) * 100;
    const { image, location, country, price, description } =
      carouselItems[currentIndex];
  
    const OURVALUESDATA = [
      {
        title: "Easy and Secure Payments",
        desc: "Elevate your travel experience with our unwavering dedication to excellence, where meticulous attention to detail meets professional service.",
      },
      {
        title: "Customize Your Travel",
        desc: "Unleash the power of choice with Trippo Bazaar, where personalized travel experiences put you in control of every adventure.",
      },
      {
        title: "Easy Modification",
        desc: "Navigate your journey with confidence – Our commitment to transparency ensures clear and honest communication, building trust at every step.",
      },
    ];
    return (
      <>
        <h1 className="text-black text-center font-poppins mt-10 text-[30px] md:text-[40px] font-extrabold leading-none">
          Steal Deal Packages
        </h1>
        <p className="mb-10 mt-5 md:text-base text-sm text-center">
          Simplify your journey choices effortlessly with our convenient <br />
          and easy-to-choose travel packages.
        </p>
        <section className="relative text-center w-[90%] max-w-[1720px] mx-auto">
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
            <div className="absolute bottom-auto right-auto md:top-12 md:left-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-translate-x-0 md:-translate-y-0 md:bottom-0 md:right-0 w-[90%] mx-auto vem:mx-0 vem:w-[500px] lg:w-[42.8%] h-[624px] md:h-[700px] bg-white p-4 rounded-lg md:rounded-r-lg">
              {/* Green Small Div */}
              <div className="absolute top-0 left-0">
                <p className="text-[.7rem] bg-[#2C9C48] rounded-br-lg rounded-tl-lg md:rounded-tl-none h-10 flex items-center justify-center w-44 font-semibold text-white">
                  Seasonal Offer
                </p>
              </div>
  
              {/* Location and Price Info */}
              <div className="mt-5">
                <h3 className="text-3xl md:text-5xl mb-4 md:mb-5 mt-7 font-bold">
                  {location}
                  <span className="text-gray-600 text-base md:text-xl font-medium">
                    ,{country}
                  </span>
                </h3>
                <div className="flex flex-row justify-center gap-4 mb-2 ew:mb-4 md:mb-3 max-w-lg mx-auto">
                  <p className="text-gray-600 text-sm md:text-lg whitespace-nowrap rounded-lg bg-[#f8f8f8] font-medium p-4">
                    8 Days 7 Nights
                  </p>
                  <p className="text-gray-600 text-sm md:text-lg whitespace-nowrap rounded-lg bg-[#f8f8f8] font-medium p-4">
                    2 Guests
                  </p>
                </div>
  
                <h2 className="bg-white text-3xl ew:text-5xl font-bold text-[#00B58A] inline-block px-2 py-1 rounded-md">
                  {price}
                </h2>
                <p className="mt-2 mb-2 font-semibold">What’s included?</p>
  
                <div className="flex flex-wrap justify-center gap-2 mb-2 mx-auto">
                  {[img1, img2, img3, img4, img5, img6].map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Icon ${idx + 1}`}
                      className="w-6 sm:w-8 h-6 sm:h-8"
                    />
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
          <div className="flex flex-row gap-10 py-2 justify-between items-center w-[98%] md:w-[56%]">
            <div className="w-auto flex gap-2 justify-start">
              <button
                onClick={handlePrev}
                aria-label="Previous"
                className="transform text-2xl cursor-pointer"
              >
                <BsArrowLeft />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next"
                className="transform text-2xl cursor-pointer"
              >
                <BsArrowRight />
              </button>
            </div>
            <div className="h-[2px] w-full bg-gray-200">
              <div
                style={{ width: `${progressWidth}%` }}
                className="h-full bg-zinc-900"
              ></div>
            </div>
          </div>
        </section>
     
      </>
    );
}

export default PopulerPackages