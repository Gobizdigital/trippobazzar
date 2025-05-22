import React from "react";
import { Route, Routes } from "react-router-dom";
import DestinationTitle from "./DestinationTitle";
import SubNavsDestination from "./SubNavsDestination";
import AllContinent from "./AllContinent";
import OneContinent from "./OneContinent/OneContinent";
import useFetch from "../../../hooks/useFetch";
import BreadCrumbsLink from "../../../utils/BreadCrumbsLink";

export default function DestinationPage() {
  const { data, loading } = useFetch("https://trippo-bazzar-backend.vercel.app/api/continent/all/limit");

  return (
    <div className="bg-[#F8F8F8] max-w-[1920px] mx-auto">
      <div className="w-full sticky top-[80px]  z-[21] bg-white">
        <div className="w-[90%] mx-auto py-2">
          <BreadCrumbsLink />
        </div>
      </div>
      <DestinationTitle />
      <SubNavsDestination />
      <Routes>
        <Route
          path=""
          element={<AllContinent data={data} loading={loading} />}
        />
        <Route
          path="/:item"
          element={<OneContinent data={data} loading={loading} />}
        />
      </Routes>
    </div>
  );
}
