import React from "react";
import image1 from "../../assets/aboutus/career1.webp";
import image2 from "../../assets/aboutus/career2.webp";

function Careers({ CareersRef }) {
  return (
    <div ref={CareersRef} className="bg-white shadow-xl">
      <div className="w-[90%] mx-auto ">
        <section className="w-full h-auto md:min-h-[600px] mb-7   flex flex-col md:flex-row ">
          {/* First Div */}
          <div className=" w-1/2 hidden md:flex justify-center pr-10 items-center relative">
            <div className="w-[400px] h-[300px] ">
              <img
                src={image1}
                alt="Large Image"
                className="rounded-2xl w-full h-full object-cover"
              />
            </div>
            <div className="w-[298px] h-[271px] absolute bottom-0 left-0">
              <img
                src={image2}
                alt="Smaller Image"
                className="rounded-2xl w-full h-full object-cover z-10"
              />
            </div>
          </div>

          {/* Second Div */}
          <div className="flex bg-[#012831] w-full py-10 md:py-0 md:w-1/2 text-white flex-col justify-center items-center ">
            <div className="max-w-lg px-10 xl:px-0">
              <h1 className=" text-xl sm:text-2xl lg:text-3xl text-left font-bold">
                With Passion &<br></br>
                Wanderlust Soul
              </h1>

              <p className="mt-4 text-left text-sm sm:text-base lg:text-[]">
                Embark on a journey fueled by passion! Uncover your next career
                adventure by exploring our Careers page – where your
                professional heart finds a home.
              </p>
              <div className="mt-4 flex flex-wrap space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
                <button className="border border-white text-white hover:bg-white hover hover:text-[#012831]  px-4 py-2 rounded shadow">
                  Discover Careers
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Careers;
