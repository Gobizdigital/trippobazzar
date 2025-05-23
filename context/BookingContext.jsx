import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingDetails, setBookingDetails] = useState({
    selectedHotels: [],
    Pack_id: "",
    guests: 0,
    coupon: { id: "", discountPercentage: 0, maxDiscount: 0 },
    selectedPricing: null,
    services: null,
    IsDomesticPackage: false,
    SpecialRemarks: "",
  });
  return (
    <BookingContext.Provider value={{ bookingDetails, setBookingDetails }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
