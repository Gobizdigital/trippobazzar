import React, { useState } from "react";

import SearchCompo from "./SearchCompo";
import Itinerary from "./Itinerary";
import IternryDetails from "./IternryDetails";
import FromOurTravellers from "../HomePage/FromOurTravellers";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";
import useFetch from "../../../hooks/useFetch";
import { useParams } from "react-router-dom";
import Loader from "../Loader";
import TrmsConditions from "./TrmsConditions";
const sections = ["ITINERARY DETAILS", "TERMS & CONDITIONS"];
function PlanDetails() {
  const [activeSection, setActiveSection] = useState("ITINERARY DETAILS"); // Default active section

  const { id } = useParams();

  const { data, loading } = useFetch(
    `https://tripobazar-backend.vercel.app/api/package/${id}`
  );

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="max-w-[1920px] font-poppins  mx-auto bg-white">
      <div className="w-[90%] relative z-10 mx-auto py-2 overflow-x-auto whitespace-nowrap scrollbar-hide">
        <BreadCrumbsLink />
      </div>
      <SearchCompo data={data} />
      <Itinerary data={data} />

      {/* <SubNavPlanDetail /> */}
      <nav className="bg-white  mb-2 sticky z-10 top-[80px]">
        <div className="max-w-7xl mx-auto px-0 em:px-4 py-4">
          <ul className="flex  flex-row justify-center overflow-x-scroll items-center scrollbar-hide px-4 sm:justify-center text-[.7rem] em:text-sm uppercase leading-6 font-normal  gap-8">
            {sections.map((item, idx) => (
              <button
                key={idx}
                className={`text-gray-500 em:py-0 py-2 whitespace-nowrap hover:text-med-green ${
                  activeSection === item
                    ? "text-med-green border-b-2 border-med-green"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveSection(item)} // Update active section on click
              >
                {item}
              </button>
            ))}
          </ul>
        </div>
      </nav>

      {activeSection === "ITINERARY DETAILS" && <IternryDetails data={data} />}

      {activeSection === "TERMS & CONDITIONS" && (
        <TrmsConditions data={data?.termsAndConditions} />
      )}

      <FromOurTravellers />
    </div>
  );
}

export default PlanDetails;
