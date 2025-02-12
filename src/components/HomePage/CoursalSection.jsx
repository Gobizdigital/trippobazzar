import React, { useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import YellowCircularDisc from "../../../svgs/Home/YellowCircularDisc/index";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import elephant from "/Elephant.webp?url";
import ocean from "/Ocean.webp?url";
import couples from "/Couples.webp?url";
import explorer from "/Explorer.webp?url";
import bhutan from "/bhutan.webp?/url";
import egypt from "/egypt_slide.webp?/url";
import morocco from "/morocco_slide.webp?/url";
import turkey from "/Turky_slide.webp?/url";
import greece from "/grees_slide.webp?/url";
import himachal from "/himachal_slide.webp?/url";
import { useNavigate } from "react-router-dom";

export default function CoursalSection() {
  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
  }, []);

  const navigate = useNavigate();

  const destinations = [
    {
      image:
        "https://i.pinimg.com/736x/2b/7d/99/2b7d991158563c90373e59ade2f9000c.jpg",
      name: "Kerala",
      href: "destination/asia/India/Kerala",
    },
    {
      image:
        "https://i.pinimg.com/736x/32/f3/a6/32f3a6805354e2ba8d47330059bfe1b0.jpg",
      name: "Rajasthan",
      href: "/destination/asia/India/Rajasthan",
    },
  
    {
      image:
        "https://i.pinimg.com/736x/69/ed/1a/69ed1ab7eea1b75a04105f4de8a145e9.jpg",
      name: "Vietnam",
      href: "destination/asia/Vietnam",
    },
    {
      image: egypt,
      name: "Egypt",
      href: "/destination/Africa/Egypt",
    },
    {
      image:
        "https://i.pinimg.com/736x/8c/35/92/8c3592733aea7e1e4cd0aa91499765e2.jpg",
      name: "SaudiArabia",
      href: "/destination/MiddleEast/SaudiArabia",
    },
    {
      image: himachal,
      name: "Himachal",
      href: "/destination/asia/India/Himachal",
    },
   
    {
      image: bhutan,
      name: "Bhutan",
      href: "/destination/asia/Bhutan",
    },
    {
      image: egypt,
      name: "Egypt",
      href: "/destination/Africa/Egypt",
    },
  
    {
      image: turkey,
      name: "Turkey",
      href: "/destination/MiddleEast/Turkey",
    },
    {
      image: greece,
      name: "Greece",
      href: "/destination/Europe/Greece",
    },
    {
      image:
        "https://i.pinimg.com/736x/08/03/77/080377146330a8cd46781907fed4eaeb.jpg",
      name: "Thailand",
      href: "destination/asia/Thailand",
    },
  
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

  const handleNavigate = (link) => {
    navigate(link);
  };

  return (
    <section className="w-full h-auto relative bg-[#FFFFFF]" data-aos="fade-up">
      <div className="relative h-auto min-h-[550px] md:min-h-[765px]">
        <div className="absolute top-0 left-0 h-2/3 w-full bg-[#012831]"></div>
        <div className="absolute bottom-0 left-0 h-1/3 w-full bg-white"></div>
        <div
          className="relative z-10 pt-14 pb-14 border-b border-white text-white text-center"
          data-aos="fade-down"
        >
          <h3 className="text-3xl font-bold mb-4">Trending Destinations</h3>
          <p className="text-sm md:text-base font-thin">
            Explore new places and create unforgettable memories.
          </p>
        </div>
        <div
          className="w-full flex justify-center my-6 gap-4"
          data-aos="fade-right"
        >
          <button
            onClick={() => handleScroll("left")}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            <BsArrowLeft />
          </button>
          <button
            onClick={() => handleScroll("right")}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center"
          >
            <BsArrowRight />
          </button>
        </div>
        <div
          ref={containerRef}
          className="flex gap-4 pl-4 md:pl-7 overflow-x-auto snap-x snap-mandatory scrollbar-hide relative z-10"
          data-aos="fade-out"
        >
      {destinations.map((destination, index) => (
  <div
    onClick={() => handleNavigate(destination.href)}
    key={index}
    className="w-64 h-[20rem] snap-center  flex-shrink-0 rounded-lg overflow-hidden shadow-md relative group "
    data-aos="zoom-in"
  >
    <img
      className="w-full h-full object-cover transition-all  duration-300 filter grayscale group-hover:grayscale-0"
      src={destination.image}
      alt={destination.name}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <YellowCircularDisc className="w-24 h-24" />
      <p className="absolute text-white text-lg font-bold">
        {destination.name}
      </p>
    </div>
  </div>
))}

        </div>
      </div>
    </section>
  );
}
