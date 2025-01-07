import React, { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
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

  return (
    <SearchContext.Provider
      value={{ searchData, setSearchData, filterProp, setFilterProp }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
