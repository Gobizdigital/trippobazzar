import React from "react";
import largeImage from "../../assets/aboutus/bg-about.webp";
import smallImage from "../../assets/aboutus/bg-about-small.webp";

import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";

function WeCraft() {

  return (
    <div className="bg-white">
      <div className="w-[90%] mx-auto  py-2">
        <BreadCrumbsLink />
      </div>
      <section className="relative w-full h-56 md:h-96 sm:h-80 bg-top bg-cover bg-no-repeat">
        <picture className="absolute inset-0 z-0">
          <source media="(max-width: 768px)" srcSet={smallImage} />
          <source media="(min-width: 769px)" srcSet={largeImage} />
          <img
            src={largeImage}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </picture>

        <div className="relative z-10 flex flex-col justify-center items-start h-full text-white px-4 sm:px-9">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-[4rem] font-extrabold">
            WE CRAFT
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mt-2 md:mt-1">
            A journey that is yours.
          </p>
        </div>
      </section>
    </div>
  );
}

export default WeCraft;
