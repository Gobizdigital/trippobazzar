import React from "react";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
import clip from "../../assets/aboutus/clipimage.webp";
import ContactUsSocialLinks from "./ContactUsSocialLinks";
import ContactUsInputFields from "./ContactUsInputFields";

export default function ContactUs() {
  
  return (
    <div className="font-poppins bg-white max-w-[1920px] mx-auto">
      <div className="w-[90%] mx-auto  py-2 bg-white">
        <BreadCrumbsLink />
      </div>
      <div className="bg-[#f8f8f8] py-5">
        <div className="w-[90%]  mx-auto">
          <div className="flex justify-between gap-10 mb-20 items-center">
            <div className="w-[500px] mmd:block hidden relative h-[500px]">
              <img
                className="w-full h-full object-contain"
                src={clip}
                alt="clip"
              />
              <ContactUsSocialLinks />
            </div>
            <div className="w-full mmd:w-1/2">
              <div className="my-9">
                <h1 className="text-3xl font-bold">
                  Let’s <span className="text-med-green">Connect</span>
                </h1>
                <p className="text-sm font-normal">
                  We're here to assist you through our website, resolving
                  queries for your satisfaction.
                </p>
              </div>

              <ContactUsInputFields />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
