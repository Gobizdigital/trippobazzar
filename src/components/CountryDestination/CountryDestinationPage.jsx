import React from "react";
import SrchDestinationCountry from "../SerchDestinationCountry/SrchDestinationCountry";
import SubNavofViewall from "./SubNavofViewall";
import CardSection from "./CardSection";
import Discover from "./Discover";
import useFetch from "../../../hooks/useFetch";
import Loader from "../Loader";
import { useParams } from "react-router-dom";
function CountryDestinationPage() {
  const { country } = useParams();

  const { data, loading, error } = useFetch(
    `https://tripobazar-backend.vercel.app/api/country/name/${country}`
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1920px]  mx-auto">
      <SrchDestinationCountry />
      <SubNavofViewall />
      <CardSection data={data} error={error} />
      <Discover data={data} />
    </div>
  );
}

export default CountryDestinationPage;
