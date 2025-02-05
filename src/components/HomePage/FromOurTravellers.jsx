import React, { useRef } from "react";
import { FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function FromOurTravellers() {
  const { id } = useParams();
  
  // Ref to handle scrolling
  const scrollContainerRef = useRef(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstChild.firstChild.offsetWidth; // Get the width of a single review card
      scrollContainerRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = scrollContainerRef.current.firstChild.firstChild.offsetWidth; // Get the width of a single review card
      scrollContainerRef.current.scrollBy({
        left: cardWidth,
        behavior: "smooth",
      });
    }
  };
  

  return (
    <section className={`w-full md:w-[60%] lg:w-[67%] ${id ? "mb-0 pb-20" : "mb-20 pb-0"} h-auto mx-auto mt-8 p-4 bg-transparent`}>
      <h3 className="text-med-green text-center text-2xl font-semibold mb-8">
        From Our Travellers
      </h3>

      {/* Scrollable Reviews */}
      <div className="flex justify-center">
        <div
          ref={scrollContainerRef}
          className="flex justify-start overflow-x-auto w-full scrollbar-hide"
        >
          <div className="flex w-full  ">
            {/* Review 1 */}
           <div className="w-[300px] sm:w-[300px] md:w-[33.33%] py-7 lg:w-[33.33%] border-y-[1.5px] border-r-[1.5px] flex-shrink-0 h-auto text-start  flex flex-col justify-between ">
              <div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] px-6 font-normal mb-4">
                  Great value and amazing destinations! Trippobazaar helped us create wonderful memories. Highly recommend!
                </p>
              </div>
              <p className="text-gray-900 text-center font-normal mt-auto">
                - Vikram
              </p>
            </div>  

            {/* Review 2 */}
            <div className="w-[300px] sm:w-[300px] md:w-[33.33%] py-7 lg:w-[33.33%] border-y-[1.5px] border-r-[1.5px]  flex-shrink-0 h-auto text-start  flex flex-col justify-between ">
              <div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] px-6 font-normal mb-4">
                  An unforgettable experience! Trippobazaar provided everything we needed to enjoy our trip with ease and comfort. Excellent customer support and attention to detail.
                </p>
              </div>
              <p className="text-gray-900 text-center font-normal mt-auto">
                - Sneha
              </p>
            </div>

            {/* Review 3 */}
            <div className="w-[300px] sm:w-[300px] md:w-[33.33%] py-7 lg:w-[33.33%] border-y-[1.5px] border-r-[1.5px]  flex-shrink-0 h-auto text-start  flex flex-col justify-between ">
              <div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] px-6 font-normal mb-4">
                  Absolutely thrilled with the service! They helped us plan the perfect trip, and it was smooth from start to finish. Definitely booking again.
                </p>
              </div>
              <p className="text-gray-900 text-center font-normal mt-auto">
                - Amit
              </p>
            </div>

            {/* Review 4 */}
            <div className="w-[300px] sm:w-[300px] md:w-[33.33%] py-7 lg:w-[33.33%] border-y-[1.5px] border-r-[1.5px]  flex-shrink-0 h-auto text-start  flex flex-col justify-between ">
              <div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] px-6 font-normal mb-4">
                  A seamless and well-organized travel experience. Everything was taken care of, and we could just enjoy our trip stress-free.
                </p>
              </div>
              <p className="text-gray-900 text-center font-normal mt-auto">
                - Neha
              </p>
            </div>

            {/* Review 5 */}
          
            <div className="w-[300px] sm:w-[300px] md:w-[33.33%] py-7 lg:w-[33.33%] border-y-[1.5px]   flex-shrink-0 h-auto text-start  flex flex-col justify-between ">
              <div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] px-6 font-normal mb-4">
                  I couldn’t recommend Trippobazaar more highly - we had the most amazing holiday. Every detail had been thought about and they were on hand to answer any questions straight away. Very personal service.
                </p>
              </div>
              <p className="text-gray-900 text-center font-normal mt-auto">
                - Rahul
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center mt-4 gap-6">
        <button
          onClick={scrollLeft}
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition duration-300"
        >
          <FaArrowLeft className="text-gray-700 hover:text-gray-500" />
        </button>
        <button
          onClick={scrollRight}
          className="p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition duration-300"
        >
          <FaArrowRight className="text-gray-700 hover:text-gray-500" />
        </button>
      </div>
    </section>
  );
}
