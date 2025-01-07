import React from "react";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
import { BiSearch } from "react-icons/bi";
import image from "../../assets/careerman.webp";
import { MdEmail } from "react-icons/md";
import people from "../../assets/peopleCareers.png";

export default function CareersPage() {
  return (
    <div className="max-w-[1920px] bg-[#ffffff] font-poppins mx-auto">
      <div className=" border-b py-2">
        <div className="w-[90%] mx-auto">
          <BreadCrumbsLink />
        </div>
      </div>
      <div className="w-[90%] mx-auto">
        <div className="flex flex-row items-end 1xl:items-center">
          <div className="w-full emd:w-1/2">
            <p className="text-[7vw] esm:text-[7vw] ew:text-[7vw] ew:leading-[10vw]  text-med-green md:text-[50px] md:leading-[80px] mt-10 md:mt-36 mb-6 md:mb-12 text-start font-bold">
              Innovation Meets Travel<br></br>
              <span className="text-black">Explore Careers</span>
            </p>
            <p className="max-w-xl mb-10">
              Join Trippo Bazzar and find exciting career opportunities that
              empower you to shape the future of the travel industry.
            </p>
            <div className="flex flex-col md:flex-row items-center w-full md:max-w-xl mb-10 md:mb-28 gap-4 mt-4">
              <div className="border border-med-green relative w-full md:w-auto rounded-md flex-1 outline-none">
                <input
                  type="text"
                  placeholder="Search jobs"
                  className=" w-full rounded-md py-3 pl-8 pr-2 bg-inherit outline-none"
                />
                <div className="absolute top-1/2 left-4 -translate-x-1/2 -translate-y-1/2">
                  <BiSearch />
                </div>
              </div>
              <button className="bg-med-green w-full ml-1 md:w-auto text-white py-3 px-7 rounded-md">
                Search
              </button>
            </div>
          </div>
          <div className="w-1/2 emd:block hidden h-full relative">
            <img src={image} alt="wth" className="w-full h-full object-cover" />
            <div className="absolute p-4  rounded-lg  shadow-2xl items-center top-40 lg:top-64 left-0">
              <div className="absolute inset-0 bg-white opacity-85 rounded-lg "></div>
              <div className="relative z-10 flex flex-row gap-1 items-center">
                <div className="text-yellow-300">
                  <MdEmail className="w-14 h-14" />
                </div>
                <div className="text-xs">
                  {" "}
                  <p className="text-blue-400 mb-1 font-semibold">
                    Congratulations
                  </p>
                  <p>You are joining our team</p>
                </div>
              </div>
            </div>

            <div className="absolute p-4  rounded-lg  shadow-2xl items-center top-2/3 right-0">
              <div className="absolute inset-0 bg-white opacity-85 rounded-lg "></div>
              <div className="relative flex flex-col items-center z-10 ">
                <div className="text-[#994523] text-center text-3xl leading-8 font-bold">
                  120+
                </div>
                <div className="text-xs text-center">
                  {" "}
                  <p className="mb-2">Active team members</p>
                </div>
                <div className="w-[80%] h-[80%] ">
                  <img
                    src={people}
                    alt="wth"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 pb-20 gap-x-4 mmd:gap-x-16 gap-y-4 mmd:gap-y-5">
          {[...Array(4)].map((_, idx) => {
            return (
              <div
                key={idx}
                className="border group hover:shadow-2xl transition-shadow ease-in-out duration-200 overflow-hidden relative rounded-lg px-9 py-10 bg-[#ffffff]"
              >
                <div className="h-full group-hover:opacity-100  transition-opacity ease-in-out duration-200 opacity-0  w-1 bg-med-green absolute top-0 left-0"></div>
                <div className="max-w-2xl">
                  <h1 className="text-base sm:text-xl font-bold mb-3  tracking-wide">
                    Junior UI/UX Designer
                  </h1>
                  <p className="tracking-wide sm:text-base esm:text-sm leading-6 text-xs mb-8">
                    Craft seamless digital experiences as a UI/UX Designer,
                    blending creativity with user-centric design to elevate our
                    products to new heights.
                  </p>
                </div>
                <div className="flex flex-wrap gap-5">
                  <div className="flex md:inline-flex flex-wrap  gap-5">
                    {["Full Time", "Design", "Remote"].map((item, idx) => (
                      <p
                        key={idx}
                        className="md:w-auto w-full md:inline-block  py-3 px-7 md:text-start text-center rounded-lg bg-[#f8f8f8] text-[#798283]"
                      >
                        {item}
                      </p>
                    ))}
                    <button className="md:w-auto w-full md:inline-block py-3 px-5 rounded-lg transition-colors ease-in-out duration-200 text-med-green border border-black group-hover:border-med-green group-hover:bg-med-green group-hover:text-white">
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
