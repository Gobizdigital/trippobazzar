import React from "react";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
import image from "../../assets/destination/map.webp";

export default function DestinationTitle() {
  return (
    <div className="relative z-10">
      <div>
        <div className="w-[90%] mx-auto  py-2">
          <BreadCrumbsLink />
        </div>
        <section className="relative flex flex-row justify-between w-full h-56 md:h-96 sm:h-80 bg-[#012831]">
          <div className="flex flex-col justify-center items-start md:max-w-md h-full text-white px-4 sm:px-9">
            <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[4rem] mb-2 md:mb-1 font-extrabold">
              DESTINATIONS
            </h1>
            <p className="text-sm sm:text-base md:text-lg font-light ">
              Discover your dream destination! Simply hover over the world map
              to select a region and explore alluring travel destinations.
            </p>
          </div>
          <div className="h-[90%] md:block hidden my-auto">
            <img
              src={image}
              alt="wth"
              className="object-contain w-full h-full"
            />
          </div>
        </section>
      </div>
    </div>
  );
}
