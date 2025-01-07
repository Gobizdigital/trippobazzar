import React from "react";

import SrchDestinationCountry from "../../SerchDestinationCountry/SrchDestinationCountry";
import CrousalSection from "./CrousalSection";
import StealDealPakage from "../../Statedestination/StealDealPakage";
import LastPart from "./LastPart";
import Loader from "../../Loader";
import { useParams } from "react-router-dom";

function OneContinent({ data, loading }) {
  // Filter data based on the route parameter

  const { item } = useParams();

  const filteredData = data?.filter(
    (continent) => continent.ContinentName.toLowerCase() === item?.toLowerCase()
  );

  const firstContinent = filteredData?.[0];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1920px] mx-auto">
      <SrchDestinationCountry />
      <CrousalSection selectedDestination={firstContinent} />
      <StealDealPakage />
      <LastPart />
    </div>
  );
}

export default OneContinent;
