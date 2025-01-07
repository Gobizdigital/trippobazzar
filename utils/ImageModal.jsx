import React, { useRef } from "react";

export default function ImageModal({ image, handleCloseModal }) {
  const imageref = useRef(null);

  return (
    <div
      onClick={(e) => {
        if (imageref.current.contains(e.target)) {
          return;
        }
        handleCloseModal();
      }}
      className="fixed top-0 cursor-pointer left-0 w-full h-full flex justify-center items-center backdrop-blur-sm"
    >
      <div
        ref={imageref}
        style={{
          width: `${image?.images.original.width}`,
          height: `${image?.images.original.height}`,
        }}
        className="cursor-default"
      >
        <img
          src={image?.images.original.url}
          alt="Continent"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
