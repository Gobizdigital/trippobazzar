import React, { useRef, useState } from "react";

export default function CarouselImageModal({ images, handleCloseModal }) {
  const imageref = useRef(null);
  const [imageIndex, setImageIndex] = useState(0);

  const handleNext = () => {
    setImageIndex((prev) => (prev + 1) % images.length); // Loop to the start
  };

  const handlePrev = () => {
    setImageIndex((prev) => (prev - 1 + images.length) % images.length); // Loop to the end
  };

  return (
    <div
      onClick={(e) => {
        if (imageref.current && imageref.current.contains(e.target)) {
          return;
        }
        handleCloseModal();
      }}
      className="fixed z-20 top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm cursor-pointer"
    >
      <div
        ref={imageref}
        className="relative cursor-default max-w-full max-h-full flex justify-center items-center"
      >
        {/* Current Image */}
        <div style={{ width: "600px", height: "450px" }}>
          <img
            src={images[imageIndex]}
            alt={`Slide ${imageIndex + 1}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Use "cover" for cropping or "contain" to fit
            }}
          />
        </div>

        {/* Previous Button */}
        {/* Previous Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal close on button click
            handlePrev();
          }}
          className="absolute left-4 text-xl top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-6 py-3 rounded-full focus:outline-none hover:bg-opacity-70 shadow-lg"
        >
          &#8249;
        </button>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal close on button click
            handleNext();
          }}
          className="absolute right-4 text-xl top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-6 py-3 rounded-full focus:outline-none hover:bg-opacity-70 shadow-lg"
        >
          &#8250;
        </button>
      </div>
    </div>
  );
}
