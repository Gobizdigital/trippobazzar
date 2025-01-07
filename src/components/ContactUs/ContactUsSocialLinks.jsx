import React from "react";
import { PiInstagramLogoLight, PiYoutubeLogo } from "react-icons/pi";
import { BsTelephoneFill } from "react-icons/bs";
import { MdEmail } from "react-icons/md";

export default function ContactUsSocialLinks() {
  return (
    <>
      <div className="bg-white border rounded-full absolute top-36 left-8 group cursor-pointer flex justify-center items-center border-med-green w-40 h-40">
        <PiInstagramLogoLight className="w-16 group-hover:scale-110 transition-transform ease-in-out duration-300 h-16" />
      </div>

      <div className="bg-white border rounded-full absolute bottom-10 left-40 emd:bottom-4 emd:left-44 group cursor-pointer flex justify-center items-center border-med-green w-20 h-20">
        <BsTelephoneFill className="w-6 group-hover:scale-110 transition-transform ease-in-out duration-300 h-6" />
      </div>

      <div className="bg-white border rounded-full absolute top-10 emd:top-6 right-20 group cursor-pointer flex justify-center items-center border-med-green w-20 h-20">
        <MdEmail className="w-6 group-hover:scale-110 transition-transform ease-in-out duration-300 h-6" />
      </div>
      <div className="bg-white border rounded-full absolute bottom-20 right-8 emd:bottom-16 emd:right-7 group cursor-pointer flex justify-center items-center border-med-green w-20 h-20">
        <PiYoutubeLogo className="w-8 group-hover:scale-110 transition-transform ease-in-out duration-300 h-8" />
      </div>
    </>
  );
}
