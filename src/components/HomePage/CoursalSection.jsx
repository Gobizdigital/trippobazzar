import React, { useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import YellowCircularDisc from "../../../svgs/Home/YellowCircularDisc/index";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import elephant from "/Elephant.webp?url";
import ocean from "/Ocean.webp?url";
import couples from "/Couples.webp?url";
import explorer from "/Explorer.webp?url";

export default function CoursalSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const destinations = [
    { image: elephant, name: "MySuru" },
    { image: ocean, name: "Thailand" },
    { image: couples, name: "Borabora" },
    { image: explorer, name: "Rajasthan" },
  ];

  const containerRef = useRef(null);

  const handleScroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = 300;
      containerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full h-auto relative bg-[#FFFFFF]" data-aos="fade-up">
      <div className="relative h-auto min-h-[550px] md:min-h-[765px]">
        <div className="absolute top-0 left-0 h-2/3 w-full bg-[#012831]"></div>
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-white"></div>
        <div className="relative z-10 pt-14 pb-14 border-b border-white text-white text-center" data-aos="fade-down">
          <h3 className="text-3xl font-bold mb-4">Trending Destinations</h3>
          <p className="text-sm md:text-base font-thin">
            Explore new places and create unforgettable memories.
          </p>
        </div>
        <div className="w-full flex justify-center my-6 gap-4" data-aos="fade-right">
          <button onClick={() => handleScroll("left")} className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <BsArrowLeft />
          </button>
          <button onClick={() => handleScroll("right")} className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <BsArrowRight />
          </button>
        </div>
        <div ref={containerRef} className="flex gap-4 pl-4 md:pl-7 overflow-x-auto snap-x snap-mandatory scrollbar-hide relative z-10" data-aos="fade-out">
          {destinations.map((destination, index) => (
            <div key={index} className="w-64 h-80 snap-center flex-shrink-0 rounded-lg overflow-hidden shadow-md" data-aos="zoom-in">
              <img className="w-full h-full object-cover" src={destination.image} alt={destination.name} />
              <div className="absolute inset-0 flex items-center justify-center">
                <YellowCircularDisc className="w-24 h-24" />
                <p className="absolute text-white text-lg font-bold">{destination.name}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
