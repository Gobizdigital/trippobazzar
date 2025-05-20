import React from "react";
import SrchDestinationCountry from "../../SerchDestinationCountry/SrchDestinationCountry";
import CrousalSection from "./CrousalSection";
import StealDealPakage from "../../Statedestination/StealDealPakage";
import LastPart from "./LastPart";
import Loader from "../../Loader";
import { useParams } from "react-router-dom";

function OneContinent({ data, loading }) {
  // Get the route parameter
  const { item } = useParams();

  // Replace dashes with spaces in the URL parameter to match the format in the database
  const formattedItem = item.replace(/-/g, " ").toUpperCase(); // Convert to uppercase to ensure case-insensitivity

  // Filter data based on the formatted parameter
  let filteredData = [];
  if (formattedItem === "NORTH AMERICA") {
    filteredData = data?.filter(
      (continent) => continent.ContinentName.toUpperCase() === "NORTH AMERICA"
    );
  } else if (formattedItem === "SOUTH AMERICA") {
    filteredData = data?.filter(
      (continent) => continent.ContinentName.toUpperCase() === "SOUTH AMERICA"
    );
  } else {
    filteredData = data?.filter(
      (continent) => continent.ContinentName.toUpperCase() === formattedItem
    );
  }

  const firstContinent = filteredData?.[0];


  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1920px] mx-auto">
      <SrchDestinationCountry url={firstContinent?.ContinentPhotoUrl} />
      <CrousalSection selectedDestination={firstContinent} item={item} />
      <StealDealPakage />
      <LastPart />
    </div>
  );
}

export default OneContinent;
