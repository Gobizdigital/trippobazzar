import React, { useState } from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import Cruise from "../../assets/CountryDestination/Cruise.webp";

export default function PopulerActivity() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselItems = 10; // This should be a number

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems); // Wrap around using modulo
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex === 0 ? carouselItems - 1 : prevIndex - 1) // Wrap around when going backward
    );
  };

  // Calculate progress width based on current index
  const progressWidth = ((currentIndex + 1) / carouselItems) * 100; // Use `carouselItems` instead of `carouselItems.length`

  return (
    <section className="w-full max-w-[1720px] mx-auto h-auto md:min-h-[1080px] bg-white relative ">
      <div className="flex md:flex-row flex-col h-full w-full ">
        {/* Right Side Image Div */}

        <div className="w-full md:w-[50%] h-full bg-white p-8 flex flex-col justify-center">
          <h4 className="text-med-green font-medium">POPULAR ACTIVITIES </h4>
          <h2 className="text-[40px] esm:text-[50px] em:text-[65px] md:text-[7vw] exl:text-[100px] exl:leading-[120px] font-extrabold leading-[50px] em:leading-[70px] md:leading-[8vw] md:mt-11 mb-8 em:mb-14">
            CRUISE AT <br></br> NILE RIVER
          </h2>
          <p className="text-gray-700 w-full md:max-w-md mb-10 md:mb-28">
            Explore Egypt's ancient wonders, from the iconic Pyramids of Giza to
            the vibrant markets of Cairo, for an unforgettable journey through
            time. Embark on a Nile cruise to immerse yourself in the country's
            rich history and cultural heritage, creating memories that will last
            a lifetime.
          </p>

          {/* Search Bar */}
          <div className="flex flex-col md:flex-row items-center w-full md:max-w-xl mb-10 md:mb-28 gap-4 mt-4">
            <button className="bg-med-green hover:bg-white hover:border hover:border-med-green hover:text-med-green w-full ml-1 md:w-auto text-white py-2 px-6 rounded-md">
              Customize Plan
            </button>
            <button className="border border-med-green w-full ml-1 md:w-auto text-med-green hover:text-white hover:bg-med-green py-2 px-6 rounded-md">
              Know More
            </button>
          </div>
          <div className="mb-20">
            <p className="text-6xl font-extrabold flex items-center space-x-1">
              <span className="relative -top-1">{currentIndex + 1}</span>
              <span className="text-3xl font-medium relative top-1">/</span>
              <span className="relative top-2 text-4xl font-medium">
                {carouselItems}
              </span>
            </p>
          </div>
          <div className="hidden md:flex flex-row gap-10 py-4 justify-between items-center w-[56%]">
            <div className="w-auto flex gap-2 justify-start">
              {" "}
              <button onClick={handlePrev} className="  transform text-2xl  ">
                <BsArrowLeft />
              </button>
              <button onClick={handleNext} className=" transform text-2xl  ">
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
        </div>
        {/* Left Side Text Div */}
        <div className=" w-full md:w-[50%] bg-white h-auto md:h-[1080px]">
          <img
            src={Cruise}
            alt="Adventure"
            className="w-full h-full object-cover  md:rounded-bl-[30%]"
          />
        </div>
      </div>
    </section>
  );
}
