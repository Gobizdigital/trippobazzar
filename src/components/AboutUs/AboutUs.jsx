import React, { useRef } from "react";
import WeCraft from "./WeCraft";
import SubNavbar from "./SubNavbar";
import Whoweare from "./Whoweare";
import OurValues from "./OurValues";
import OurMission from "./OurMission";
import Careers from "./Careers";
import StayConnected from "./StayConnected";

export default function AboutUs() {
  const WhoWeAreRef = useRef(null);
  const OurValuesRef = useRef(null);
  const OurMissionRef = useRef(null);
  const CareersRef = useRef(null);

  const sections = [
    { label: "WHO WE ARE", ref: WhoWeAreRef },
    { label: "OUR VALUES", ref: OurValuesRef },
    { label: "OUR MISSION", ref: OurMissionRef },
    { label: "CAREERS", ref: CareersRef },
  ];

  return (
    <div className="bg-[#F8F8F8] max-w-[1920px] mx-auto">
      <WeCraft />
      <SubNavbar sections={sections} />
      <Whoweare WhoWeAreRef={WhoWeAreRef} />
      <OurValues OurValuesRef={OurValuesRef} />
      <OurMission OurMissionRef={OurMissionRef} />
      <Careers CareersRef={CareersRef} />
      <StayConnected />
    </div>
  );
}
