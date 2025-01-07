import React from "react";

import CoursalSection from "./CoursalSection";
import FromOurTravellers from "./FromOurTravellers";
import PopularPackages from "./PopularPackages";
import YourCustomAdventure from "./YourCustomAdventure";
import DiscoverNewHorizon from "./DiscoverNewHorizon";

export default function HomePage() {
  return (
    <div className="max-w-[1920px] mx-auto">
      <DiscoverNewHorizon />
      <PopularPackages />
      <CoursalSection />
      <YourCustomAdventure />
      <FromOurTravellers />
    </div>
  );
}
