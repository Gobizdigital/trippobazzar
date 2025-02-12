import React from "react";
import SrchDestinationCountry from "../SerchDestinationCountry/SrchDestinationCountry";
import SubNavofViewall from "./SubNavofViewall";
import CardSection from "./CardSection";
import Discover from "./Discover";
import useFetch from "../../../hooks/useFetch";
import Loader from "../Loader";
import { useParams } from "react-router-dom";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
function CountryDestinationPage() {
  const { country } = useParams();

  const { data, loading, error } = useFetch(
    `https://trippo-bazzar-backend.vercel.app/api/country/name/${country}`
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1920px]  mx-auto">
       <div className="w-full sticky top-[80px]  z-[58] bg-white">
              <div className="w-[90%] mx-auto py-2">
                <BreadCrumbsLink/>
              </div>
            </div>
      <SrchDestinationCountry url={data?.CountryPhotoUrl} />
      <SubNavofViewall />
      <CardSection data={data} error={error} />
      <Discover data={data} />
    </div>
  );
}

export default CountryDestinationPage;
