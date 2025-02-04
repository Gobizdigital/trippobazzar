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
  const handleThumbnailClick = (index) => {
    setImageIndex(index);
  };

  return (
    <div
      onClick={(e) => {
        if (imageref.current && imageref.current.contains(e.target)) {
          return;
        }
        handleCloseModal();
      }}
      className="fixed z-20 top-0 bg-black bg-opacity-50 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm cursor-pointer"
    >
      <div
        ref={imageref}
        className="relative cursor-default md:max-w-full md:max-h-full flex justify-center items-center"
      >
        {/* Current Image */}
        <div className="flex flex-col gap-4 items-center">
          <div className="md:w-[600px] md:h-[400px] h-[30vh] w-[98%]">
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

          <div className="w-full h-[1px] bg-white" />

          <div className="flex w-full overflow-x-auto scrollbar-hide justify-between space-x-2">
            {images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Thumbnail ${index + 1}`}
                onClick={() => handleThumbnailClick(index)}
                className={`cursor-pointer  h-20 object-cover rounded-md border-2 ${
                  imageIndex === index
                    ? "border-blue-500"
                    : "border-transparent"
                }`}
                style={{
                  transition: "border 0.3s ease-in-out",
                  width: "110px",
                }}
              />
            ))}
          </div>
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
