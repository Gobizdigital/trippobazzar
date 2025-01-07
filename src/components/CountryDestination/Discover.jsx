import React from "react";
import image1 from "../../assets/aboutus/image1over.webp";
import image2 from "../../assets/aboutus/image2over.webp";
function Discover({ data }) {
  return (
    <div>
      <section className="w-[90%] mt-5 mx-auto h-auto mb-7  bg-[#F8F8F8] flex flex-col md:flex-row ">
        {/* First Div */}
        <div className="flex-1 flex flex-col justify-center items-start mb-6 md:mb-0 md:pr-6">
          <h1 className="text-black text-3xl sm:text-4xl lg:text-5xl font-bold">
            Discover <span>{data?.CountryName}</span>
          </h1>

          <p className="text-black mt-4 text-sm sm:text-base lg:text-lg">
            Embark on an unforgettable journey through <span>{data?.CountryName}</span>, a country where
            ancient traditions and modern life seamlessly blend. 
            Explore breathtaking landscapes, bustling cities, and rich cultures
            that have shaped this diverse land for centuries. Feel the warmth of
            <span>{data?.CountryName}’s</span> people, whose stories and heritage are passed down through
            generations.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <button className="bg-med-green text-white hover:text-med-green hover:bg-white px-4 py-2 rounded shadow">
              Customize Plan
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
    </div>
  );
}

export default Discover;
