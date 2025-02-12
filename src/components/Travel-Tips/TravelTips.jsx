import React, { useRef } from "react";
import TravelTipsTitle from "./TravelTipsTitle";
import SubNavTravelTips from "./SubNavTravelTips";
import TravelDescription from "./TravelDescription";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";

function TravelTips() {
  const sections = [
    "WHAT TO BRING",
    "TRANSPORT",
    "SAFETY",
    "MEDICAL",
    "BANKS, CREDIT CARDS & MONEY",
    "SHOPPING",
    "TIME",
  ];

  const descriptionRefs = useRef(sections.map(() => React.createRef()));

  return (
    <div className='className="bg-[#F8F8F8] max-w-[1920px] mx-auto'>
      <div className="w-full sticky top-[80px]  z-[19] bg-white">
        <div className="w-[90%] mx-auto py-2">
          <BreadCrumbsLink />
        </div>
      </div>
      <TravelTipsTitle />
      <SubNavTravelTips descriptionRefs={descriptionRefs} sections={sections} />
      <TravelDescription descriptionRefs={descriptionRefs} />
    </div>
  );
}

export default TravelTips;
