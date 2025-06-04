"use client";

import { useState, useEffect } from "react";

export default function BookingDetails({ bookingId, onBack }) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://trippo-bazzar-backend.vercel.app/api/booking/${bookingId}`
      );
      const data = await response.json();

      if (response.ok) {
        setBooking(data.data);
      } else {
        setError(data.message || "Failed to fetch booking details");
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
      setError("Failed to fetch booking details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm";
      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200 shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-sm";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm";
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200 shadow-sm";
      case "Failed":
        return "bg-red-50 text-red-700 border-red-200 shadow-sm";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 shadow-sm";
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    if (!amount) return "₹0";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const calculateAge = (dob) => {
    if (!dob) return "N/A";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Helper function to safely get package details
  const getPackageDetails = () => {
    if (!booking.PackageBooked)
      return { title: "N/A", description: "N/A", price: 0 };

    if (typeof booking.PackageBooked === "string") {
      return { title: booking.PackageBooked, description: "N/A", price: 0 };
    }

    return {
      title: booking.PackageBooked.title || "N/A",
      description: booking.PackageBooked.description || "N/A",
      price: booking.PackageBooked.price || 0,
      whatsIncluded: booking.PackageBooked.whatsIncluded || [],
      dayDescription: booking.PackageBooked.dayDescription || [],
      specialInstruction: booking.PackageBooked.specialInstruction || "N/A",
      conditionOfTravel: booking.PackageBooked.conditionOfTravel || "N/A",
      thingsToMaintain: booking.PackageBooked.thingsToMaintain || "N/A",
      MainPhotos: booking.PackageBooked.MainPhotos || [],
      policies: booking.PackageBooked.policies || "N/A",
      termsAndConditions: booking.PackageBooked.termsAndConditions || "N/A",
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                  >
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/3 mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded-lg"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-2/3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Error Loading Booking
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">
            Booking Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            The booking you're looking for doesn't exist.
          </p>
          <button
            onClick={onBack}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-6 py-3 rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Back to Bookings
          </button>
        </div>
      </div>
    );
  }

  const packageDetails = getPackageDetails();

  console.log(packageDetails);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Booking Details
                </h1>
                <p className="text-gray-600 mt-1">
                  Complete booking information and guest details
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                  booking.PackageBookedStatus
                )}`}
              >
                {booking.PackageBookedStatus}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(
                  booking.PackageBookedPaymentStatus
                )}`}
              >
                {booking.PackageBookedPaymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Package Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-2 mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Package Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Package Title
                  </label>
                  <p className="text-lg font-semibold text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                    {packageDetails.title}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Start Date
                  </label>
                  <p className="text-lg text-gray-900 bg-emerald-50 rounded-lg px-3 py-2 font-medium">
                    {formatDate(booking.PackageStartDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    End Date
                  </label>
                  <p className="text-lg text-gray-900 bg-emerald-50 rounded-lg px-3 py-2 font-medium">
                    {formatDate(booking.PackageEndDate)}
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Total Guests
                  </label>
                  <p className="text-lg font-bold text-emerald-600 bg-emerald-50 rounded-lg px-3 py-2">
                    {booking.TotalGuests || 0} Guests
                  </p>
                </div>
                <div className="space-y-1">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Package Type
                  </label>
                  <span
                    className={`inline-flex px-3 py-2 rounded-lg text-sm font-semibold ${
                      booking.IsDomesticPackage
                        ? "bg-blue-100 text-blue-800 border border-blue-200"
                        : "bg-purple-100 text-purple-800 border border-purple-200"
                    }`}
                  >
                    {booking.IsDomesticPackage
                      ? "🇮🇳 Domestic"
                      : "🌍 International"}
                  </span>
                </div>
              </div>

              {/* Package Description */}
              {packageDetails.description &&
                packageDetails.description !== "N/A" && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Package Description
                      </label>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-900 leading-relaxed">
                          {packageDetails.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              {/* Booking Date and User Info */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Booking Date
                    </label>
                    <p className="text-lg text-gray-900 bg-gray-50 rounded-lg px-3 py-2">
                      {formatDateTime(booking.PackageBookedDate)}
                    </p>
                  </div>
                  {booking.userId && (
                    <div className="space-y-1">
                      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        User ID
                      </label>
                      <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2 font-mono">
                        {typeof booking.userId === "object"
                          ? booking.userId._id || booking.userId.toString()
                          : booking.userId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Package Details Section */}
            {(packageDetails.whatsIncluded?.length > 0 ||
              packageDetails.dayDescription?.length > 0) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Package Details
                  </h2>
                </div>

                {/* What's Included */}
                {packageDetails.whatsIncluded?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      What's Included
                    </h3>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <ul className="space-y-2">
                        {packageDetails.whatsIncluded.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <svg
                              className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="text-gray-900">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Day Description */}
                {packageDetails.dayDescription?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Day-wise Itinerary
                    </h3>
                    <div className="space-y-3">
                      {packageDetails.dayDescription.map((day, index) => (
                        <div
                          key={index}
                          className="bg-blue-50 rounded-lg p-4 border border-blue-200"
                        >
                          <h4 className="font-semibold text-blue-900 mb-2">
                            Day {index + 1}
                          </h4>
                          <p className="text-gray-900">{day.dayTitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Enhanced Guest Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 mr-3">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Guest Details ({booking.GuestDetails?.length || 0} Guests)
                </h2>
              </div>

              <div className="space-y-6">
                {booking.GuestDetails?.map((guest, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-white hover:shadow-sm transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-gray-900 flex items-center">
                        <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                          {index + 1}
                        </span>
                        Guest {index + 1}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          Age: {calculateAge(guest.DOB)}
                        </span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-medium ${
                            guest.Gender === "male"
                              ? "bg-blue-100 text-blue-800"
                              : guest.Gender === "female"
                              ? "bg-pink-100 text-pink-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {guest.Gender?.charAt(0).toUpperCase() +
                            guest.Gender?.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Full Name
                        </label>
                        <p className="text-gray-900 font-semibold bg-white rounded-lg px-3 py-2 border">
                          {guest.GuestName || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Date of Birth
                        </label>
                        <p className="text-gray-900 bg-white rounded-lg px-3 py-2 border">
                          {formatDate(guest.DOB)}
                        </p>
                      </div>
                      {guest.IdType && (
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            ID Type
                          </label>
                          <p className="text-gray-900 bg-white rounded-lg px-3 py-2 border">
                            {guest.IdType}
                          </p>
                        </div>
                      )}
                      {guest.AadharNumber && (
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Aadhar Number
                          </label>
                          <p className="text-gray-900 font-mono bg-white rounded-lg px-3 py-2 border">
                            {guest.AadharNumber}
                          </p>
                        </div>
                      )}
                      {guest.PassportNumber && (
                        <>
                          <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Passport Number
                            </label>
                            <p className="text-gray-900 font-mono bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                              {guest.PassportNumber}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Issued Country
                            </label>
                            <p className="text-gray-900 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                              {guest.PassportIssuedCountry || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Issue Date
                            </label>
                            <p className="text-gray-900 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                              {formatDate(guest.PassportIssuedDate)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Expiry Date
                            </label>
                            <p className="text-gray-900 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                              {formatDate(guest.PassportDateOfExpiry)}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Hotel Bookings */}
            {booking.BookedHotels && booking.BookedHotels.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Hotel Bookings ({booking.BookedHotels.length})
                  </h2>
                </div>

                <div className="space-y-6">
                  {booking.BookedHotels.map((hotel, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl p-6 bg-gradient-to-r from-purple-50 to-white hover:shadow-sm transition-shadow duration-200"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center">
                          <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
                            {index + 1}
                          </span>
                          {hotel.hotelName || "Hotel Name Not Available"}
                        </h3>
                        {hotel.hotelRating && (
                          <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < hotel.hotelRating
                                    ? "text-amber-400"
                                    : "text-gray-300"
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="ml-2 text-sm font-semibold text-amber-700">
                              {hotel.hotelRating}/5
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Location
                          </label>
                          <p className="text-gray-900 bg-white rounded-lg px-3 py-2 border">
                            {hotel.hotelLocation || "N/A"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Rooms
                          </label>
                          <p className="text-gray-900 font-semibold bg-white rounded-lg px-3 py-2 border">
                            {hotel.rooms || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Adults
                          </label>
                          <p className="text-gray-900 font-semibold bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                            {hotel.adults || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Children
                          </label>
                          <p className="text-gray-900 font-semibold bg-blue-50 rounded-lg px-3 py-2 border border-blue-200">
                            {hotel.children || 0}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Children Under 5
                          </label>
                          <span
                            className={`inline-flex px-3 py-2 rounded-lg text-sm font-semibold ${
                              hotel.childrenAgeUnder5
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {hotel.childrenAgeUnder5 ? "✓ Yes" : "✗ No"}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Extra Bed
                          </label>
                          <span
                            className={`inline-flex px-3 py-2 rounded-lg text-sm font-semibold ${
                              hotel.extraBed
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {hotel.extraBed ? "✓ Yes" : "✗ No"}
                          </span>
                        </div>
                      </div>

                      {/* Hotel Photos */}
                      {hotel.hotelPhotoUrl &&
                        hotel.hotelPhotoUrl.length > 0 && (
                          <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                              Hotel Photos
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {hotel.hotelPhotoUrl.map((photo, photoIndex) => (
                                <div
                                  key={photoIndex}
                                  className="relative group"
                                >
                                  <img
                                    src={photo || "/placeholder.svg"}
                                    alt={`${
                                      hotel.hotelName || "Hotel"
                                    } - Photo ${photoIndex + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border border-gray-200 group-hover:shadow-md transition-shadow duration-200"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg"></div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Coupon Details */}
            {booking.CouponDetails &&
              Object.keys(booking.CouponDetails).length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center mb-6">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-2 mr-3">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Coupon Details
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-200">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                      {JSON.stringify(booking.CouponDetails, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

            {/* Special Remarks */}
            {booking.SpecialRemarks && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Special Remarks
                  </h2>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6 border border-indigo-200">
                  <p className="text-gray-900 leading-relaxed text-lg">
                    {booking.SpecialRemarks}
                  </p>
                </div>
              </div>
            )}

            {/* Package Instructions and Policies */}
            {(packageDetails.specialInstruction !== "N/A" ||
              packageDetails.policies !== "N/A" ||
              packageDetails.termsAndConditions !== "N/A") && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg p-2 mr-3">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Important Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {packageDetails.specialInstruction !== "N/A" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Special Instructions
                      </h3>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p
                          className="text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: packageDetails.specialInstruction,
                          }}
                        ></p>
                      </div>
                    </div>
                  )}

                  {packageDetails.policies !== "N/A" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Policies
                      </h3>
                      <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <p
                          className="text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: packageDetails.policies,
                          }}
                        ></p>
                      </div>
                    </div>
                  )}

                  {packageDetails.termsAndConditions !== "N/A" && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Terms & Conditions
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <p
                          className="text-gray-900"
                          dangerouslySetInnerHTML={{
                            __html: packageDetails.termsAndConditions,
                          }}
                        ></p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Payment Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg p-2 mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Payment Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200">
                  <label className="block text-sm font-semibold text-emerald-700 uppercase tracking-wide mb-2">
                    Total Amount Paid
                  </label>
                  <p className="text-3xl font-bold text-emerald-600">
                    {formatCurrency(booking.PackageBookedPrice)}
                  </p>
                </div>

                {packageDetails.price > 0 &&
                  packageDetails.price !== booking.PackageBookedPrice && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <label className="block text-sm font-semibold text-blue-700 uppercase tracking-wide mb-2">
                        Original Package Price
                      </label>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(packageDetails.price)}
                      </p>
                    </div>
                  )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Payment Status
                  </label>
                  <span
                    className={`inline-flex px-4 py-2 rounded-lg text-sm font-semibold border ${getPaymentStatusColor(
                      booking.PackageBookedPaymentStatus
                    )}`}
                  >
                    {booking.PackageBookedPaymentStatus}
                  </span>
                </div>

                {booking.RazorPayPaymentId && (
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Payment ID
                    </label>
                    <p className="text-gray-900 font-mono text-sm bg-gray-50 rounded-lg px-3 py-2 border break-all">
                      {booking.RazorPayPaymentId}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Booking Date
                  </label>
                  <p className="text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border">
                    {formatDateTime(booking.PackageBookedDate)}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Contact Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-2 mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  Contact Details
                </h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <p className="text-gray-900 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 font-semibold">
                    {booking.ContactNumber}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                    Email Address
                  </label>
                  <p className="text-gray-900 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 break-all">
                    {booking.ContactEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced GST Information */}
            {(booking.GSTNumber || booking.GSTAddress || booking.GSTCity) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-2 mr-3">
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    GST Details
                  </h2>
                </div>

                <div className="space-y-4">
                  {booking.GSTNumber && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        GST Number
                      </label>
                      <p className="text-gray-900 font-mono bg-purple-50 rounded-lg px-3 py-2 border border-purple-200 font-semibold">
                        {booking.GSTNumber}
                      </p>
                    </div>
                  )}
                  {booking.GSTAddress && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        GST Address
                      </label>
                      <p className="text-gray-900 bg-purple-50 rounded-lg px-3 py-2 border border-purple-200">
                        {booking.GSTAddress}
                      </p>
                    </div>
                  )}
                  {booking.GSTCity && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        GST City
                      </label>
                      <p className="text-gray-900 bg-purple-50 rounded-lg px-3 py-2 border border-purple-200">
                        {booking.GSTCity}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Enhanced Booking ID */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg p-2 mr-3">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Booking ID</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border">
                <p className="text-gray-600 font-mono text-sm break-all leading-relaxed">
                  {typeof booking._id === "object"
                    ? booking._id.toString()
                    : booking._id || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
