import React, { useRef } from "react";
import YellowCircularDisc from "../../../svgs/Home/YellowCircularDisc/index";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import elephant from "/Elephant.webp?url";
import ocean from "/Ocean.webp?url";
import couples from "/Couples.webp?url";
import explorer from "/Explorer.webp?url";

export default function CoursalSection() {
  const destinations = [
    { image: elephant, name: "MySuru" },
    { image: ocean, name: "Thailand" },
    { image: couples, name: "Borabora" },
    { image: explorer, name: "Rajasthan" },
    { image: elephant, name: "MySuru" },
    { image: ocean, name: "Thailand" },
    { image: couples, name: "Borabora" },
    { image: explorer, name: "Rajasthan" },
  ];

  // Reference to the container that will scroll horizontally
  const containerRef = useRef(null);

  const handleScroll = (direction) => {
    if (containerRef.current && containerRef.current.firstChild) {
      const itemWidth = containerRef.current.firstChild.clientWidth;
      containerRef.current.scrollBy({
        left: direction === "left" ? -itemWidth : itemWidth,
        behavior: "smooth",
      });
    }
  };
  return (
    <section className="w-full h-auto relative">
      <div className="relative h-auto min-h-[865px] em:min-h-[1080px]">
        <div className="absolute top-0 left-0 h-2/3 w-full bg-[#012831]"></div>
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-white"></div>
        <div className="relative z-10 pt-14 pb-14 border-b border-white text-white">
          <h3 className="text-[30px] md:text-[40px] text-center font-bold mb-4">
            Trending Destinations
          </h3>
          <p className="md:text-base text-sm text-center font-thin">
            We provide a wide range of destination packages as we want our
            customers <br />
            to have a great time exploring new places and have fun.
          </p>
        </div>
        <div className="w-full flex justify-center my-12 gap-4 relative z-10">
          <button
            aria-label="Scroll left"
            onClick={() => handleScroll("left")}
            className="w-10 h-10 opacity-70 hover:opacity-90 bg-white rounded-full flex items-center justify-center"
          >
            <BsArrowLeft />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => handleScroll("right")}
            className="w-10 h-10 opacity-70 hover:opacity-90 bg-white rounded-full flex items-center justify-center"
          >
            <BsArrowRight />
          </button>
        </div>
        <div
          ref={containerRef}
          className="flex mx-4 md:mx-0 md:ml-24 md:pr-24 gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide relative z-10"
        >
          {destinations.map((destination, index) => (
            <div
              key={index}
              className="w-[100%] sm:w-[60%] md:w-auto lg:w-[30%] h-auto snap-center flex-shrink-0 rounded-lg overflow-hidden shadow-md bg-opacity-50 backdrop-filter backdrop-blur-sm border-white"
            >
              <div className="w-auto h-auto relative">
                <img
                  className="w-full h-full object-cover"
                  src={destination.image}
                  alt={destination.name}
                />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <YellowCircularDisc />
                  <div className="absolute inset-0 flex items-center justify-center text-6xl leading-10 text-white">
                    <p>{destination.name}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
