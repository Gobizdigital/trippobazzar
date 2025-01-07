import React from "react";
import image from "../../assets/aboutus/advenPic.webp";

function OurMission({OurMissionRef}) {
  return (
    <div ref={OurMissionRef} className="bg-white">
      <section className=" w-[90%] mx-auto h-auto flex items-center justify-between  flex-col-reverse md:flex-row">
        {/* Left div with heading and paragraph */}
        <div
          className=" lg:max-w-lg h-full w-[90%] mx-auto md:w-1/2 mb-10 md:mb-0 flex flex-col justify-center 
          text-center md:text-left"
        >
          <p className="text-2xl md:text-[40px]  emd:text-[60px] font-bold leading-[58px] md:mb-6 mmd:mb-9">
            Our Mission
          </p>
          <p className="text-gray-700 font-normal emd:leading-9 text-sm md:text-base emd:text-lg">
            We are on a mission to enrich your life through transformative
            travel experiences. Our commitment is to empower you with
            personalized adventures that bring unparalleled value to your
            journey. With transparency, excellence, and a deep passion for
            exploration, we strive to create memories that go beyond the
            ordinary, leaving you with a treasure trove of invaluable moments
            that last a lifetime.
          </p>
        </div>

        {/* Right div with curved image */}
        <div className=" w-full md:w-1/2 h-auto md:h-full ">
          <img
            src={image}
            alt="Our Mission Visual"
            className="w-full h-full object-cover  md:rounded-tl-[10rem]"
          />
        </div>
      </section>
    </div>
  );
}

export default OurMission;
