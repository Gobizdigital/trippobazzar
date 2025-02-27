import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const { id, state } = useParams();
  const [selectedPricing, setSelectedPricing] = useState(null);
  const [selectedPricePerPerson, setSelectedPricePerPerson] = useState(false);
  const [searchData, setSearchData] = useState({
    guests: 1,
    startDate: null,
    endDate: null,
    startLocation: "",
    destination: "",
  });
  const [filterProp, setFilterProp] = useState({
    range: "0",
    checkboxes: {
      lessThan50000: false,
      between500000And1000000: false,
      between1000000And1500000: false,
      moreThan1500000: false,
    },
    reviews: "0",
    sortBy: "withoutflight",
    visaIncluded: false,
    selectPreferences: {
      hotelstay: false,
      meals: false,
      localtransport: false,
      sightseeing: false,
    },
    themePreferences: {
      architecture: false,
      artsandentertainment: false,
      history: false,
      inventions: false,
      religion: false,
      music: false,
      sports: false,
    },
  });

  useEffect(() => {
    if (id) {
      setSearchData((prev) => ({
        ...prev,
        destination: state,
      }));
    } else {
      // If id is removed, reset the destination field
      setSearchData((prev) => ({
        ...prev,
        destination: "",
      }));
    }
  }, [state, id]);

  return (
    <SearchContext.Provider
      value={{
        searchData,
        setSearchData,
        filterProp,
        selectedPricing,
        setSelectedPricing,
        selectedPricePerPerson,
        setSelectedPricePerPerson,
        setFilterProp,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
