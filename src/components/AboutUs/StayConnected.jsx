import React from "react";
import clip from "../../assets/aboutus/clipimage.webp";
import ContactUsSocialLinks from "../ContactUs/ContactUsSocialLinks";
import { socialMediaData } from "../../../utils/SocialMediaData";

export default function StayConnected() {
  return (
    <div className="py-10">
      <h1 className=" text-6xl md:text-[60px] leading-[40px] md:leading-[80px] mb-8 md:mb-20  text-center font-bold">
        Stay Connected,<br></br>{" "}
        <span className="text-med-green">Join Our Social Updates!</span>
      </h1>
      <div className="w-full mb-8 flex justify-center">
        <div className="w-[500px] md:block hidden relative h-[500px]">
          <img className="w-full h-full object-contain" src={clip} alt="clip" />
          <ContactUsSocialLinks />
        </div>
        <div className="md:hidden flex justify-center md:justify-start space-x-3 mt-4">
          {socialMediaData.map((item, index) => (
            <div
              key={index}
              className="w-16 h-16 flex items-center justify-center group cursor-pointer rounded-full border border-med-green p-[6px] active:bg-med-green active:text-white bg-white"
            >
              <div className="group-hover:scale-110  transition-transform ease-in-out duration-300">
                {item.icon}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
