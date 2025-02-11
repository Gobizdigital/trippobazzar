import React, { useRef } from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function FromOurTravellers() {
  const { id } = useParams();

  // Ref to handle scrolling
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.firstChild.firstChild.offsetWidth; // Get the width of a single review card
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth =
        scrollContainerRef.current.firstChild.firstChild.offsetWidth; // Get the width of a single review card
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };

  const reviews = [
    {
      author: "Vikram",
      rating: 5,
      text: "Great value and amazing destinations! Trippobazaar helped us create wonderful memories. Highly recommend!",
    },
    {
      author: "Sneha",
      rating: 5,
      text: "An unforgettable experience! Trippobazaar provided everything we needed to enjoy our trip with ease and comfort. Excellent customer support and attention to detail.",
    },
    {
      author: "Amit",
      rating: 5,
      text: "Absolutely thrilled with the service! They helped us plan the perfect trip, and it was smooth from start to finish. Definitely booking again.",
    },
    {
      author: "Neha",
      rating: 5,
      text: "A seamless and well-organized travel experience. Everything was taken care of, and we could just enjoy our trip stress-free.",
    },
    {
      author: "Rahul",
      rating: 5,
      text: "I couldn’t recommend Trippobazaar more highly - we had the most amazing holiday. Every detail had been thought about and they were on hand to answer any questions straight away. Very personal service.",
    },
  ];

  return (
    <section
      className={`w-full md:w-[70%] lg:w-[87%] ${
        id ? "mb-0 pb-20" : "mb-20 pb-0"
      } h-auto mx-auto mt-8 p-4 bg-transparent`}
    >
      <h3 className="text-med-green text-center text-2xl font-semibold mb-8">
        From Our Travellers
      </h3>

      {/* Scrollable Reviews */}
      <div className="flex relative justify-center">
        {/* Left and Right Overlay */}
        <div className="absolute left-[-2px] top-0 bottom-0 z-20 bg-[#f8f8f8]  w-[5px]"></div>
        <div className="absolute right-0 top-0 bottom-0 z-20 bg-[#f8f8f8] w-[1.5px]"></div>

        {/* Scrollable Reviews Container */}
        <div
          ref={scrollContainerRef}
          className="flex justify-start overflow-x-auto w-full scrollbar-hide "
        >
          <div className="flex w-full relative z-0">
            {reviews.map((review, index) => (
              <div
                key={index}
                className={`w-[300px] sm:w-[300px] md:w-[33.33%] lg:w-[33.33%] 
          border-r-[1.5px] border-y-[1.5px] py-7 flex-shrink-0 h-auto text-start flex flex-col justify-between
          `} // Add left border only for first column
              >
                <div>
                  <div className="flex items-center justify-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="text-blue-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] px-6 font-normal mb-4">
                    {review.text}
                  </p>
                </div>
                <p className="text-gray-900 text-center font-normal mt-auto">
                  - {review.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center mt-4 gap-6">
        <button
          onClick={scrollLeft}
          className="p-2 rounded-full transition duration-300"
        >
          <FaArrowLeft className="text-gray-700 hover:text-gray-400" />
        </button>
        <button
          onClick={scrollRight}
          className="p-2 rounded-full  transition duration-300"
        >
          <FaArrowRight className="text-gray-700 hover:text-gray-400" />
        </button>
      </div>
    </section>
  );
}
