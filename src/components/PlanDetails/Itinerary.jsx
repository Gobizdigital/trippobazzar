import React from "react";

const Itinerary = ({ data }) => {
  return (
    <div className="bg-[#f8f8f8] ">
      <section className="w-full md:w-[90%] mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center">
          <h3 className="text-med-green  text-start font-bold text-lg md:text-2xl mt-2">
            Here’s Your Itinerary:
            <span className="text-black font-bold ml-2 text-lg md:text-2xl mt-2">
              Trip to {data?.title} All Inclusive Deal Seasonal Special Offer
            </span>{" "}
          </h3>
        </div>

        {/* Subtitle Section */}
        <p className="text-gray-700 font-semibold text-sm md:text-base text-start mt-4">
          {data?.description}
        </p>

        {/* Image Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 gap-4">
          {/* Main Large Image */}
          <div className="w-full md:w-1/2 lg:w-[60%] ">
            <img
              src={data?.MainPhotos[0]}
              alt="Main Destination photo 1"
              className="rounded-lg  object-cover  w-full h-[250px] md:h-[400px]"
            />
          </div>

          {/* Smaller Images */}
          <div className="grid grid-cols-2 gap-4 w-full md:w-1/2 lg:w-5/12">
            {/**/}
            {data?.MainPhotos?.slice(1).map((item, idx) => {
              return (
                <img
                  key={idx}
                  src={item}
                  alt={`${idx + 1} image`}
                  className="rounded-lg  object-cover w-full h-[120px] md:h-[192px]"
                />
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Itinerary;
