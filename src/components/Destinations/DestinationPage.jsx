import React from "react";
import { Route, Routes } from "react-router-dom";
import DestinationTitle from "./DestinationTitle";
import SubNavsDestination from "./SubNavsDestination";
import AllContinent from "./AllContinent";
import OneContinent from "./OneContinent/OneContinent";
import useFetch from "../../../hooks/useFetch";

export default function DestinationPage() {
  const { data, loading } = useFetch(
    "https://tripobazar-backend.vercel.app/api/continent"
  );

  return (
    <div className="bg-[#F8F8F8] max-w-[1920px] mx-auto">
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
