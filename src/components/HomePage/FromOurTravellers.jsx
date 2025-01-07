import React from "react";
import { FaStar } from "react-icons/fa";
import { useParams } from "react-router-dom";

export default function FromOurTravellers() {
  const {id}=useParams();
  const reviews = [
    {
      text: "I couldn’t recommend Trippobazaar more highly - we had the most amazing holiday. Every detail had been thought about and they were on hand to answer any questions straight away. Very personal service.",
      name: "Rahul",
    },
    {
      text: "An unforgettable experience! Trippobazaar provided everything we needed to enjoy our trip with ease and comfort. Excellent customer support and attention to detail.",
      name: "Sneha",
    },
    {
      text: "Absolutely thrilled with the service! They helped us plan the perfect trip, and it was smooth from start to finish. Definitely booking again.",
      name: "Amit",
    },
  ];
  return (
    <section className={`w-full md:w-[60%] ${id?"mb-0 pb-20":"mb-20 pb-0"}  h-auto   mx-auto mt-8 p-4 bg-transparent `}>
      <h3 className="text-med-green text-center text-2xl font-semibold mb-8">
        From Our Travellers
      </h3>

      {/* Reviews Carousel */}
      <div className="flex justify-center">
        <div className="flex justify-start scrollbar-hide overflow-x-auto ">
          {reviews.map((review, index) => (
            <div
              key={index}
              className={`w-[300px] flex-shrink-0 h-auto border-2 text-start p-9 flex flex-col justify-between ${
                index === 0 ? "border-x-0" : ""
              } ${index === reviews.length - 1 ? "border-x-0" : ""}`}
            >
              <div>
                <div className="flex items-center justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-blue-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-center text-[12px] sm:text-[.7rem] font-normal mb-4">
                  {review.text}
                </p>
              </div>
              <p className="text-gray-900 text-center font-normal mt-auto">
                - {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
