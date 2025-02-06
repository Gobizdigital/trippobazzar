import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import CoursalSection from "./CoursalSection";
import FromOurTravellers from "./FromOurTravellers";
import PopularPackages from "./PopularPackages";
import YourCustomAdventure from "./YourCustomAdventure";
import DiscoverNewHorizon from "./DiscoverNewHorizon";

export default function HomePage() {
  useEffect(() => {
    AOS.init({ duration: 1000, easing: "ease-in-out", once: true });
  }, []);

  return (
    <div className="max-w-[1920px] mx-auto">
      <div data-aos="fade-up">
        <DiscoverNewHorizon />
      </div>
      <div data-aos="fade-right">
        <PopularPackages />
      </div>
      <div data-aos="fade-left">
        <CoursalSection />
      </div>
      <div data-aos="zoom-in">
        <YourCustomAdventure />
      </div>
      <div data-aos="flip-up">
        <FromOurTravellers />
      </div>
    </div>
  );
}
