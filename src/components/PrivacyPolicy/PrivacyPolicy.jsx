import React from "react";
import image from "../../assets/aboutus/advenPic.webp";
import { PRIVACYPOLICYDATA } from "./PrivacyPolicyJsonData";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";

export default function PrivacyPolicy() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  return (
    <div>
      <div className="w-[90%] mx-auto  py-2">
        <BreadCrumbsLink />
      </div>
      <div className="max-w-[1920px] md:max-h-[1080px] overflow-hidden mx-auto font-poppins flex flex-col-reverse md:flex-row justify-between bg-white">
        <div className="w-full md:w-1/2 scrollbar-hide overflow-y-scroll">
          <div className="max-w-[832px] px-10 py-28  w-full mx-auto">
            <p className="font-bold text-med-green text-base md:text-xl mb-4">
              Our Policy :: Trippo Bazzar
            </p>
            {PRIVACYPOLICYDATA.map((section, index) => (
              <div
                className={`${
                  PRIVACYPOLICYDATA.length - 1 === index ? "mb-0" : "mb-20"
                }`}
                key={index}
              >
                <h2 className="text-sm md:text-lg font-bold mb-2 leading-9">
                  {index + 1}.{section.title}
                </h2>
                {Array.isArray(section.content) ? (
                  section.content.map((item, subIndex) => (
                    <div
                      className="text-xs md:text-base font-normal mb-4 leading-7 md:leading-9"
                      key={subIndex}
                    >
                      <h3>{`${alphabet[subIndex]}. ${item.subtitle} ${item.text}`}</h3>
                    </div>
                  ))
                ) : (
                  <p className="text-xs md:text-base font-normal leading-7 md:leading-9">
                    {section.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className=" w-full  md:w-1/2 h-[200px] esm:h-[300px] sm:h-[500px] md:h-[1080px] ">
          <img
            src={image}
            alt="Our Mission Visual"
            className="w-full h-full object-cover "
          />
        </div>
      </div>
    </div>
  );
}
