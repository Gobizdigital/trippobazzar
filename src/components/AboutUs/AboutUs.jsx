import React, { useRef, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import WeCraft from "./WeCraft";
import SubNavbar from "./SubNavbar";
import Whoweare from "./Whoweare";
import OurValues from "./OurValues";
import OurMission from "./OurMission";
import Careers from "./Careers";
import StayConnected from "./StayConnected";

import TransitionLink from "../../../utils/TransitionLink";

export default function AboutUs() {
  const WhoWeAreRef = useRef(null);
  const OurValuesRef = useRef(null);
  const OurMissionRef = useRef(null);
  const CareersRef = useRef(null);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  const sections = [
    { label: "WHO WE ARE", ref: WhoWeAreRef },
    { label: "OUR VALUES", ref: OurValuesRef },
    { label: "OUR MISSION", ref: OurMissionRef },
    { label: "CAREERS", ref: CareersRef },
  ];

  return (
    <div className="bg-[#F8F8F8] max-w-[1920px] mx-auto">
      <div data-aos="fade-up">
        <WeCraft />
      </div>
      <div data-aos="fade-down">
        <SubNavbar sections={sections} />
      </div>
      <div data-aos="fade-right">
        <Whoweare WhoWeAreRef={WhoWeAreRef} />
      </div>
      <div data-aos="fade-left">
        <OurValues OurValuesRef={OurValuesRef} />
      </div>
      <div data-aos="zoom-in">
        <OurMission OurMissionRef={OurMissionRef} />
      </div>
      <div data-aos="flip-up">
        <Careers CareersRef={CareersRef} />
      </div>
      <div data-aos="fade-up">
        <StayConnected />
      </div>
    </div>
  );
}
