import React from "react";
import bgimage from "../../assets/aboutus/OurValues.webp";
import ExcelenceSvg from "../../../svgs/ExcelenceSvg";
import discoverOne from "../../assets/home/Discover-1.svg";
import EmpowermentSvg from "../../../svgs/EmpowermentSvg";
import TransparencySvg from "../../../svgs/TransparancySvg";
import ExploreSvg from "../../../svgs/ExploreSvg";
function OurValues({ OurValuesRef }) {
  const OURVALUESDATA = [
    {
      icon: <ExcelenceSvg />,
      title: "Excellence",
      desc: "Elevate your travel experience with our unwavering dedication to excellence, where meticulous attention to detail meets professional service.",
    },
    {
      icon: <EmpowermentSvg />,
      title: "Empowerment",
      desc: "Unleash the power of choice with Trippo Bazaar, where personalized travel experiences put you in control of every adventure.",
    },
    {
      icon: <TransparencySvg />,
      title: "Transparency",
      desc: "Navigate your journey with confidence – Our commitment to transparency ensures clear and honest communication, building trust at every step.",
    },
  ];

  return (
    <div ref={OurValuesRef}>
      <section
        className="relative w-full h-80 md:h-[650px] bg-top bg-cover bg-no-repeat"
        style={{ backgroundImage: `url(${bgimage})` }}
      >
        <div className="absolute inset-0 h-full w-full " />
        <div className="flex flex-col justify-center items-start h-full text-white px-4 sm:px-9">
          <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-[3.3rem] font-bold">
            WORLDWIDE REACH,<br></br>
            190+ COUNTRIES.
          </h1>
        </div>
        <div className="absolute md:flex hidden top-20 left-2/3">
          <img src={discoverOne} alt="Logo" className="h-5  mr-2" />
        </div>
        <div className="absolute bottom-32 -right-28 xlg:right-28 transform -translate-x-1/2 hidden md:flex justify-center items-center">
          <ExploreSvg />
        </div>
      </section>
      <div className="bg-white">
        <div className="w-[90%] mx-auto grid grid-cols-1 place-items-center sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-10 mmd:gap-28 px-4 sm:px-10 md:px-28 h-auto py-8 sm:py-16 md:py-28 ">
          {OURVALUESDATA.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`sm:max-w-[503px] ${
                  idx === OURVALUESDATA.length - 1
                    ? "sm:col-span-2"
                    : "sm:col-span-1"
                } md:col-span-1 text-center pb-10 sm:pb-0 flex flex-col justify-center items-center h-auto md:h-[400px] w-full`}
              >
                {item.icon}
                <p className="font-bold mb-0 text-lg sm:text-sm md:text-lg mt-4">
                  {item.title}
                </p>
                <br />
                <p className="text-base sm:text-xs md:text-sm font-normal text-center">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default OurValues;
