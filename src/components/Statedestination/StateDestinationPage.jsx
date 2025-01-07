import React, { useState } from "react";
import SubNavCountry from "./SubNavCountry.jsx";
import CountryPakages from "./CountryPakages.jsx";
import StealDealPakage from "./StealDealPakage.jsx";
import PopulerActivity from "./PopulerActivity.jsx";
import useFetch from "../../../hooks/useFetch.jsx";
import { useParams } from "react-router-dom";
import Loader from "../Loader.jsx";
import SrchDestinationCountry from "../SerchDestinationCountry/SrchDestinationCountry.jsx";
import { useSearch } from "../../../context/SearchContext";
import FilterBox from "../FilterBox/FilterBox.jsx";

function StateDestinationPage() {
  const { continent, country, state } = useParams();
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => setShowModal(!showModal);

  const { filterProp } = useSearch();

  const { data, loading, error } = useFetch(
    `https://tripobazar-backend.vercel.app/api/state/name/${state}`
  );

  if (loading) {
    return <Loader />;
  }

  // Helper function to check if any filters are active
  const isFilterActive = () => {
    const { range, checkboxes, selectPreferences, reviews } = filterProp;

    // Check if any checkbox is selected
    if (Object.values(checkboxes).some((value) => value)) return true;

    // Check if any select preference is active
    if (Object.values(selectPreferences).some((value) => value)) return true;

    if (range !== "0") return true;

    // Check if reviews filter is active
    if (reviews !== "0") return true;

    return false;
  };

  const filterPackages = () => {
    if (!data || !data.Packages) return [];

    // If no filters are active, return all packages
    if (!isFilterActive()) return data.Packages;

    return data.Packages.filter((pkg) => {
      const price = pkg.price || 0;

      // Price Range Filter
      const selectedPriceRanges = [];
      if (filterProp.checkboxes.lessThan50000)
        selectedPriceRanges.push({ min: 0, max: 50000 });
      if (filterProp.checkboxes.between500000And1000000)
        selectedPriceRanges.push({ min: 50000, max: 100000 });
      if (filterProp.checkboxes.between1000000And1500000)
        selectedPriceRanges.push({ min: 100000, max: 150000 });
      if (filterProp.checkboxes.moreThan1500000)
        selectedPriceRanges.push({ min: 1500000, max: Infinity });

      const priceMatches = selectedPriceRanges.some(
        (range) => price >= range.min && price <= range.max
      );

      if (selectedPriceRanges.length > 0 && !priceMatches) return false;

      const range = parseInt(filterProp.range, 10);
      const daysMatch = pkg.description
        ? pkg.description.match(/(\d+)\s*Days/i)
        : null;
      const packageDays = daysMatch ? parseInt(daysMatch[1], 10) : null;

      // Filter for exact match with the selected range
      if (range && packageDays !== range) return false;

      // Reviews Filter
      const reviews = parseInt(filterProp.reviews, 10);
      if (reviews && reviews < 4) {
        if (pkg.reviews && pkg.reviews < reviews) return false;
      }

      // Preferences Filter
      const preferences = filterProp.selectPreferences;
      if (
        (preferences.hotelstay && !pkg.whatsIncluded.includes("Hotel")) ||
        (preferences.meals && !pkg.whatsIncluded.includes("Food")) ||
        (preferences.localtransport && !pkg.whatsIncluded.includes("Car")) ||
        (preferences.sightseeing && !pkg.whatsIncluded.includes("Explore"))
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredPackages = filterPackages();

  return (
    <div className=" mx-auto max-w-[1920px] h-full ">
      <SrchDestinationCountry />
      <SubNavCountry toggleModal={toggleModal} />
      <FilterBox showModal={showModal} onClose={toggleModal} />
      <CountryPakages
        data={filteredPackages}
        error={error}
        continent={continent}
        country={country}
        state={state}
      />
      <StealDealPakage />
      <PopulerActivity />
    </div>
  );
}

export default StateDestinationPage;
