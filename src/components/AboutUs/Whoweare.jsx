import image1 from "../../assets/aboutus/image1over.webp";
import image2 from "../../assets/aboutus/image2over.webp";

import React from "react";

export default function Whoweare({WhoWeAreRef}) {
  return (
    <section ref={WhoWeAreRef} className="w-[90%] mx-auto h-auto mb-7  bg-[#F8F8F8] flex flex-col md:flex-row ">
      {/* First Div */}
      <div className="flex-1 flex flex-col justify-center items-start mb-6 md:mb-0 md:pr-6">
        <h1 className="text-black text-3xl sm:text-4xl lg:text-5xl font-bold">
          Welcome to
        </h1>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-med-green">
          Trippo Bazaar
        </h1>
        <p className="text-black mt-4 text-sm sm:text-base lg:text-lg">
          Your gateway to extraordinary travel experiences. As a leading travel
          agency, we specialize in crafting bespoke adventures that seamlessly
          blend luxury, adventure, and cultural exploration. Our dedicated team
          is committed to turning your travel dreams into reality, offering
          amazing features and services that redefine your journey. Discover the
          extraordinary with Trippo Bazaar – where every destination becomes a
          personalized masterpiece.
        </p>
        <div className="mt-4 flex flex-wrap gap-4">
          <button className="bg-med-green text-white hover:text-med-green hover:bg-white px-4 py-2 rounded shadow">
            Explore Plans
          </button>
          <button className="border border-med-green text-med-green hover:text-white hover:bg-med-green px-4 py-2 rounded shadow">
            Our Policy
          </button>
        </div>
      </div>

      {/* Second Div */}
      <div className="md:flex-1 hidden md:flex justify-center md:justify-end items-center md:items-end relative mt-6 mb- sm:mb-96 md:mb-20 md:mt-0">
        <img
          src={image1}
          alt="Large Image"
          className="rounded-2xl md:me-10 lg:mr-8 shadow-2xl w-3/4 h-auto md:w-5/6 lg:w-3/4 z-1"
        />
        <img
          src={image2}
          alt="Smaller Image"
          className="rounded-2xl shadow-2xl w-1/2 h-auto absolute right-0 bottom-2 md:right-4 md:bottom-0 lg:right-0 lg:bottom-[-3rem] z-10"
        />
      </div>
    </section>
  );
}
