"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import BookingDetails from "./BookingDetails";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [sortBy, setSortBy] = useState("PackageBookedDate");
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchTerm, statusFilter, paymentFilter, sortBy]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 12,
        search: searchTerm,
        status: statusFilter,
        paymentStatus: paymentFilter,
        sortBy: sortBy,
      });

      const response = await fetch(
        `https://trippo-bazzar-backend.vercel.app/api/booking?${queryParams}`
      );
      const data = await response.json();

      if (response.ok) {
        setBookings(data.data || []);
        setTotalPages(data.pagination?.totalPages || 0);
        setTotalBookings(data.pagination?.totalBookings || 0);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookingClick = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowDetails(true);
  };

  const handleBackToList = () => {
    setShowDetails(false);
    setSelectedBookingId(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {showDetails ? (
        // Booking Details View
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <BookingDetails
            bookingId={selectedBookingId}
            onBack={handleBackToList}
          />

          {/* Implement your booking details component here, passing selectedBookingId as prop */}
        </div>
      ) : (
        // Main Bookings List View
        <>
          {/* Header */}
          <div className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <svg
                      className="w-8 h-8 text-green-600 mr-3"
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
                    Bookings Management
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Manage all package bookings and customer details
                  </p>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-lg font-semibold">
                  Total: {totalBookings}
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div
              className="bg-white rounded-lg shadow-sm p-6 mb-6"
              data-aos="fade-up"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="Booked">Booked</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {/* Payment Filter */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <option value="">All Payments</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>

                {/* Sort */}
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="PackageBookedDate">Sort by Date</option>
                  <option value="PackageBookedPrice">Sort by Price</option>
                  <option value="TotalGuests">Sort by Guests</option>
                </select>
              </div>
            </div>

            {/* Bookings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : bookings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookings.map((booking, index) => (
                  <div
                    key={booking._id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden"
                    onClick={() => handleBookingClick(booking._id)}
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    {/* Header with Package Info */}
                    <div className="relative bg-gradient-to-r from-green-500 to-blue-600 p-6 text-white">
                      <div className="absolute top-4 right-4">
                        <svg
                          className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-opacity"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 pr-8">
                        {booking.PackageBooked?.name || "Package Details"}
                      </h3>
                      <p className="text-green-100 text-sm">
                        {booking.PackageBooked?.destination || "Destination"}
                      </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Guest Info */}
                      <div className="mb-4">
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {booking.GuestDetails?.[0]?.GuestName ||
                              "Guest Name"}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg
                            className="w-4 h-4 mr-2"
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
                          <span className="text-sm">
                            {booking.TotalGuests} Guests
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-9 0v10a2 2 0 002 2h8a2 2 0 002-2V7H7z"
                            />
                          </svg>
                          <span className="text-sm">
                            {formatDate(booking.PackageBookedDate)}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            booking.PackageBookedStatus
                          )}`}
                        >
                          {booking.PackageBookedStatus}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(
                            booking.PackageBookedPaymentStatus
                          )}`}
                        >
                          {booking.PackageBookedPaymentStatus}
                        </span>
                        {booking.IsDomesticPackage !== undefined && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {booking.IsDomesticPackage
                              ? "Domestic"
                              : "International"}
                          </span>
                        )}
                      </div>

                      {/* Price and Contact */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-lg font-bold text-gray-900">
                            {formatCurrency(booking.PackageBookedPrice)}
                          </p>
                          <p className="text-xs text-gray-500">Total Amount</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {booking.ContactNumber}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-32">
                            {booking.ContactEmail}
                          </p>
                        </div>
                      </div>

                      {/* ID */}
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">
                          ID: {booking._id.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12" data-aos="fade-up">
                <svg
                  className="w-16 h-16 text-gray-300 mx-auto mb-4"
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
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No bookings found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                className="flex items-center justify-between mt-8 bg-white rounded-lg shadow-sm p-4"
                data-aos="fade-up"
              >
                <div className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages} ({totalBookings}{" "}
                  total bookings)
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                      const pageNum = Math.max(1, currentPage - 2) + index;
                      if (pageNum > totalPages) return null;

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === pageNum
                              ? "bg-green-600 text-white"
                              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
