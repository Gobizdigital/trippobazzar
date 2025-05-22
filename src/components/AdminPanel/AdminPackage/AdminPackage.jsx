"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useDebounce from "../../../../hooks/useDebounce";
import useFetch from "../../../../hooks/useFetch";
import EditPackage from "./EditPackage";
import AddPackage from "./AddPackage";
import Loader from "../../Loader";
import ConfirmationModal from "../../ConfirmationModal";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";

export default function AdminPackage() {
  const [selectedId, setSelectedId] = useState();
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [modal, setModal] = useState(null);
  const [editPackage, setEditPackage] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [imageModal, setImageModal] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Pagination state
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 9,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState("title");
  const [sortDirection, setSortDirection] = useState("asc");

  const baseUrl = selectedId
    ? "https://trippo-bazzar-backend.vercel.app/api/package"
    : "https://trippo-bazzar-backend.vercel.app/api/package/fields/query";

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const { data, loading: packageLoading } = useFetch(
    selectedId ? `${baseUrl}/${selectedId}` : null
  );

  // Memoize fetchPackages to avoid recreating it on every render
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(baseUrl, {
        params: {
          page: pagination.currentPage,
          limit: pagination.limit,
          search: debouncedSearchTerm || undefined,
          sortBy,
          sortDirection,
        },
      });

      setPackages(response.data.data);
      setPagination({
        currentPage: response.data.pagination.currentPage,
        totalPages: response.data.pagination.totalPages,
        totalCount: response.data.pagination.totalCount,
        limit: response.data.pagination.limit,
      });
      setLoading(false);
      setIsSearching(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      setIsSearching(false);
    }
  }, [
    pagination.currentPage,
    pagination.limit,
    debouncedSearchTerm,
    sortBy,
    sortDirection,
  ]);

  // Effect for fetching packages when dependencies change
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Effect for showing search indicator
  useEffect(() => {
    if (searchInput !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [searchInput, debouncedSearchTerm]);

  const deleteById = async (id) => {
    try {
      await axios.delete(`${baseUrl}/${id}`);
      fetchPackages();
    } catch (error) {
      console.error(error);
    }
  };

  const updateById = async (id, data) => {
    try {
      await axios.put(`${baseUrl}/${id}`, data);
      fetchPackages();
    } catch (error) {
      console.error(error);
    }
  };

  const addNew = async (data) => {
    try {
      await axios.post(baseUrl, data);
      fetchPackages();
    } catch (error) {
      console.error(error);
    }
  };

  // Function to get the lowest base price from pricing array
  const getLowestPrice = (pricingArray) => {
    if (!pricingArray || !pricingArray.length) return null;

    return pricingArray.reduce((lowest, current) => {
      const currentPrice = current.basePrice
        ? Number.parseFloat(current.basePrice)
        : Number.POSITIVE_INFINITY;
      return currentPrice < lowest ? currentPrice : lowest;
    }, Number.POSITIVE_INFINITY);
  };

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete this ${name}?`,
      onConfirm: () => {
        deleteById(id);
        setModal(null);
      },
      onCancel: () => setModal(null),
    });
  };

  const openImageModal = (imageUrl) => {
    setImageModal(imageUrl);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const handleLimitChange = (e) => {
    const newLimit = Number.parseInt(e.target.value);
    setPagination((prev) => ({
      ...prev,
      limit: newLimit,
      currentPage: 1, // Reset to first page when changing limit
    }));
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setPagination((prev) => ({
      ...prev,
      currentPage: 1, // Reset to first page when searching
    }));
  };

  const handleSort = () => {
    // Toggle direction
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    setPagination((prev) => ({
      ...prev,
      currentPage: 1, // Reset to first page when sorting
    }));
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.currentPage;

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    // Always show first and last page
    const pages = [1];

    // Calculate middle pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    // Add last page if not already included
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  if (loading && packages.length === 0) {
    return <Loader />;
  }

  if (packageLoading && selectedId) {
    return <Loader />;
  }

  const tabs = [
    {
      id: "details",
      label: "Details",
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    {
      id: "pricing",
      label: "Pricing",
      icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    },
    { id: "included", label: "What's Included", icon: "M5 13l4 4L19 7" },
    {
      id: "itinerary",
      label: "Itinerary",
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "hotels",
      label: "Hotels",
      icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    },
    {
      id: "photos",
      label: "Photos",
      icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
    },
    {
      id: "policies",
      label: "Policies & Terms",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
  ];

  return (
    <>
      {modal && (
        <ConfirmationModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}

      {imageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 rounded-full p-2 text-white transition-colors"
              onClick={() => setImageModal(null)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={imageModal || "/placeholder.svg"}
              alt="Enlarged view"
              className="max-h-[90vh] max-w-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      {!selectedId ? (
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl p-6 min-h-[80vh]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              {`${isAddingPackage ? "Add New Package" : "Package Management"}`}
            </h1>
            <button
              onClick={() => setIsAddingPackage(!isAddingPackage)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg transform hover:translate-y-[-2px] ${
                isAddingPackage
                  ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
              }`}
            >
              {isAddingPackage ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Package
                </>
              )}
            </button>
          </div>

          {!isAddingPackage && (
            <div className="mb-8 space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search packages by title..."
                    value={searchInput}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-10 py-4 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-white shadow-md hover:shadow-lg"
                  />
                  {isSearching && (
                    <Loader2 className="absolute right-4 top-4 w-5 h-5 text-emerald-500 animate-spin" />
                  )}
                </div>
                {debouncedSearchTerm && (
                  <div className="mt-1 text-sm text-gray-500 pl-4">
                    Showing results for "{debouncedSearchTerm}"
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <button
                    onClick={handleSort}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <span>Title</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      } transition-transform`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                  >
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="24">24</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {loading && packages.length > 0 && (
            <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-10 pointer-events-none">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                <span>Loading packages...</span>
              </div>
            </div>
          )}

          {isAddingPackage ? (
            <AddPackage
              setIsAddingPackage={setIsAddingPackage}
              addNew={addNew}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.length > 0 ? (
                packages.map((item, idx) => {
                  // Get lowest price from pricing array if available
                  const lowestPrice = getLowestPrice(item?.pricing);
                  const displayPrice = lowestPrice || item?.price || "N/A";

                  return (
                    <div
                      key={idx}
                      className="relative group"
                      onMouseEnter={() => setHoveredCard(idx)}
                      onMouseLeave={() => setHoveredCard(null)}
                    >
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                        <div className="relative h-56 overflow-hidden">
                          <img
                            src={
                              item?.MainPhotos?.[0] || "/placeholder-image.jpg"
                            }
                            alt={item?.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onClick={() =>
                              item?.MainPhotos?.[0] &&
                              openImageModal(item.MainPhotos[0])
                            }
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                          {/* Price badge */}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
                            <span className="text-sm font-semibold text-gray-900">
                              ₹{displayPrice}
                            </span>
                          </div>

                          <div className="absolute bottom-0 left-0 p-5 w-full">
                            <h3 className="text-white font-bold text-xl truncate">
                              {item?.title}
                            </h3>
                            <p className="text-white/80 text-sm mt-1 line-clamp-1">
                              {item?.description || "No description available"}
                            </p>
                          </div>
                        </div>

                        <div className="p-5">
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item?.whatsIncluded
                              ?.slice(0, 3)
                              .map((feature, i) => (
                                <span
                                  key={i}
                                  className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full"
                                >
                                  {feature.length > 20
                                    ? feature.substring(0, 20) + "..."
                                    : feature}
                                </span>
                              ))}
                            {item?.whatsIncluded?.length > 3 && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                +{item.whatsIncluded.length - 3} more
                              </span>
                            )}
                          </div>

                          <div className="flex justify-between items-center mt-2">
                            <button
                              onClick={() => setSelectedId(item._id)}
                              className="text-emerald-600 hover:text-emerald-800 font-medium flex items-center gap-1 transition-colors"
                            >
                              View Details
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item._id, item.title)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-full hover:bg-red-50"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Floating action buttons that appear on hover */}
                      <div
                        className={`absolute top-2 left-2 transition-opacity duration-300 ${
                          hoveredCard === idx ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <button
                          onClick={() =>
                            item?.MainPhotos?.[0] &&
                            openImageModal(item.MainPhotos[0])
                          }
                          className="bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-700"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
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
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                  <div className="bg-purple-50 p-6 rounded-full mb-6">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-purple-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    No packages found
                  </h3>
                  <p className="text-gray-500 max-w-md">
                    We couldn't find any packages matching your search. Try
                    adjusting your search terms or add a new package.
                  </p>
                  <button
                    onClick={() => setIsAddingPackage(true)}
                    className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-300 transform hover:translate-y-[-2px]"
                  >
                    Add New Package
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!isAddingPackage && pagination.totalPages > 1 && (
            <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100">
                <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                  Showing{" "}
                  <span className="font-medium">
                    {(pagination.currentPage - 1) * pagination.limit + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalCount
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{pagination.totalCount}</span>{" "}
                  packages
                </div>
              </div>

              <div className="flex items-center justify-center p-4">
                <nav className="flex items-center space-x-1">
                  <button
                    onClick={() => handlePageChange(1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-md ${
                      pagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Go to first page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`p-2 rounded-md ${
                      pagination.currentPage === 1
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Go to previous page"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex items-center">
                    {getPageNumbers().map((pageNum, index) =>
                      pageNum === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-2 py-1 text-gray-500"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => handlePageChange(pageNum)}
                          className={`w-9 h-9 mx-0.5 rounded-full ${
                            pagination.currentPage === pageNum
                              ? "bg-emerald-500 text-white font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Go to next page"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <button
                    onClick={() => handlePageChange(pagination.totalPages)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`p-2 rounded-md ${
                      pagination.currentPage === pagination.totalPages
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    aria-label="Go to last page"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {!editPackage ? (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Header with back button and actions */}
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 text-white relative">
                <div className="flex justify-between items-start">
                  <div className="max-w-3xl">
                    <div className="flex items-center gap-2 mb-2">
                      <button
                        onClick={() => setSelectedId(null)}
                        className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors mr-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                          />
                        </svg>
                      </button>
                      <span className="text-white/70 text-sm">
                        Package Details
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold mb-3">{data?.title}</h1>
                    <p className="text-purple-100 max-w-2xl text-lg">
                      {data?.description}
                    </p>

                    {/* Price display - show lowest price from pricing array if available */}
                    {(() => {
                      const lowestPrice = getLowestPrice(data?.pricing);
                      const displayPrice = lowestPrice || data?.price || "N/A";

                      return (
                        <div className="mt-6 inline-block bg-white/10 backdrop-blur-sm px-6 py-3 rounded-xl">
                          <span className="font-medium text-purple-100">
                            Starting from{" "}
                          </span>
                          <span className="text-2xl font-bold">
                            ₹{displayPrice}/-
                          </span>
                        </div>
                      );
                    })()}
                  </div>
                  <div>
                    <button
                      onClick={() => setEditPackage(true)}
                      className="bg-white text-emerald-700 hover:bg-purple-50 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-lg font-medium"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Package
                    </button>
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap gap-6 mt-8">
                  {data?.dayDescription?.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{data.dayDescription.length} Days</span>
                    </div>
                  )}

                  {data?.hotels?.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>{data.hotels.length} Hotels</span>
                    </div>
                  )}

                  {data?.MainPhotos?.length > 0 && (
                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-purple-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>{data.MainPhotos.length} Photos</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tabs navigation */}
              <div className="border-b border-gray-200 px-6 bg-white sticky top-0 z-10">
                <div className="flex overflow-x-auto hide-scrollbar space-x-1">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-4 font-medium text-sm whitespace-nowrap border-b-2 transition-colors flex items-center gap-2 ${
                        activeTab === tab.id
                          ? "border-emerald-600 text-emerald-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={tab.icon}
                        />
                      </svg>
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab content */}
              <div className="p-8">
                {/* Details Tab */}
                {activeTab === "details" && (
                  <div className="space-y-8">
                    <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 p-6 rounded-2xl">
                      <h2 className="text-xl font-bold text-emerald-800 mb-3">
                        Package Overview
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {data?.description}
                      </p>
                    </div>

                    {/* Coupon Codes */}
                    {data?.coupon?.length > 0 && (
                      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-yellow-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                          </svg>
                          Available Coupons
                        </h2>
                        <div className="flex flex-wrap gap-3">
                          {data.coupon.map((code, index) => (
                            <div
                              key={index}
                              className="bg-yellow-50 text-yellow-800 px-4 py-2 rounded-lg text-sm font-medium border border-yellow-200 relative overflow-hidden group"
                            >
                              <div className="absolute -left-2 top-0 bottom-0 w-4 bg-yellow-200 transform -skew-x-12"></div>
                              <div className="absolute -right-2 top-0 bottom-0 w-4 bg-yellow-200 transform skew-x-12"></div>
                              <span className="relative z-10">{code}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Special Instructions */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-purple-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Special Instructions
                      </h2>
                      <div className="bg-gray-50 p-5 rounded-xl">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {data?.specialInstruction ||
                            "No special instructions provided."}
                        </p>
                      </div>
                    </div>

                    {/* Things to Maintain */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-emerald-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        Things to Maintain
                      </h2>
                      <div className="bg-gray-50 p-5 rounded-xl">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {data?.thingsToMaintain ||
                            "No maintenance instructions provided."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pricing Tab */}
                {activeTab === "pricing" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Package Pricing
                    </h2>
                    {data?.pricing?.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {data.pricing.map((priceItem, index) => (
                          <div
                            key={index}
                            className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-5 py-4 text-white">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-bold">
                                  {priceItem.guestCount} Guests
                                </span>
                                <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full">
                                  {priceItem.packageType}
                                </span>
                              </div>
                            </div>
                            <div className="p-5 space-y-3">
                              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600 font-medium">
                                  Base Price:
                                </span>
                                <span className="font-bold text-green-600 text-lg">
                                  ₹{priceItem.basePrice}
                                </span>
                              </div>
                              {priceItem.extraPersonCharge && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-gray-600">
                                    Extra Person:
                                  </span>
                                  <span className="font-medium">
                                    ₹{priceItem.extraPersonCharge}
                                  </span>
                                </div>
                              )}
                              {priceItem.extraBedCharge && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-gray-600">
                                    Extra Bed:
                                  </span>
                                  <span className="font-medium">
                                    ₹{priceItem.extraBedCharge}
                                  </span>
                                </div>
                              )}
                              {priceItem.CNB && (
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                  <span className="text-gray-600">
                                    Child Without Bed:
                                  </span>
                                  <span className="font-medium">
                                    ₹{priceItem.CNB}
                                  </span>
                                </div>
                              )}
                              {priceItem.perPerson !== undefined && (
                                <div className="flex justify-between items-center py-2">
                                  <span className="text-gray-600">
                                    Per Person Rate:
                                  </span>
                                  <span
                                    className={`font-medium px-3 py-1 rounded-full text-sm ${
                                      priceItem.perPerson
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {priceItem.perPerson ? "Yes" : "No"}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-2xl text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          No pricing details available for this package.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* What's Included Tab */}
                {activeTab === "included" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      What's Included
                    </h2>
                    {data?.whatsIncluded?.length > 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.whatsIncluded.map((item, index) => (
                            <li
                              key={index}
                              className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl transition-colors"
                            >
                              <div className="bg-emerald-100 rounded-full p-1 mt-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5 text-emerald-600"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                              <span className="text-gray-700">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-2xl text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          No included items listed for this package.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Itinerary Tab */}
                {activeTab === "itinerary" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-emerald-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Itinerary
                    </h2>
                    {data?.dayDescription?.length > 0 ? (
                      <div className="space-y-8">
                        {data.dayDescription.map((day, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4 text-white">
                              <h3 className="text-xl font-bold">
                                {day.dayTitle}
                              </h3>
                            </div>
                            <div className="p-6">
                              <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
                                {day.dayDetails}
                              </p>
                              {day?.photos?.length > 0 && (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                                  {day.photos.map((photo, photoIndex) => (
                                    <div
                                      key={photoIndex}
                                      className="relative group overflow-hidden rounded-xl shadow-sm"
                                    >
                                      <img
                                        src={photo || "/placeholder.svg"}
                                        alt={`Day ${index + 1} photo ${
                                          photoIndex + 1
                                        }`}
                                        className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-110"
                                        onClick={() => openImageModal(photo)}
                                      />
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button
                                          onClick={() => openImageModal(photo)}
                                          className="bg-white/20 backdrop-blur-sm p-2 rounded-full"
                                        >
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6 text-white"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                            />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-2xl text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          No itinerary details available for this package.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Hotels Tab */}
                {activeTab === "hotels" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-amber-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      Hotels
                    </h2>
                    {data?.hotels?.length > 0 ? (
                      <div className="space-y-6">
                        {data.hotels.map((hotel, index) => (
                          <div
                            key={index}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                          >
                            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 text-white">
                              <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-amber-100"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                  {hotel.location}
                                </h3>
                                <button
                                  onClick={() => {
                                    // Get all hotel names for this location
                                    const hotelNames = hotel.hotelDetails
                                      .map((detail) => {
                                        // Handle both object references and direct IDs
                                        const hotelObj = data?.hotels
                                          ?.flatMap(
                                            (hotel) => hotel.hotelDetails || []
                                          )
                                          .find(
                                            (h) =>
                                              h._id === (detail?._id ?? detail)
                                          );

                                        return (
                                          hotelObj?.hotelName || "Unknown Hotel"
                                        );
                                      })

                                      .filter((name) => name); // Filter out any undefined names

                                    // Format the text as "Location: Hotel1, Hotel2, Hotel3"
                                    const textToCopy = `${
                                      hotel.location
                                    }: ${hotelNames.join(", ")}`;

                                    // Copy to clipboard
                                    navigator.clipboard.writeText(textToCopy);

                                    // Show a temporary tooltip or feedback
                                    const el = document.createElement("div");
                                    el.className =
                                      "fixed top-4 right-4 bg-black/80 text-white px-4 py-2 rounded-lg z-50";
                                    el.textContent = "Hotel info copied!";
                                    document.body.appendChild(el);
                                    setTimeout(
                                      () => document.body.removeChild(el),
                                      2000
                                    );
                                  }}
                                  className="bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1.5 text-sm flex items-center gap-1 transition-colors"
                                  title="Copy hotel information"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                    />
                                  </svg>
                                  Copy
                                </button>
                              </div>
                            </div>
                            <div className="p-6">
                              {hotel?.hotelDetails?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                  {hotel.hotelDetails.map(
                                    (detail, detailIndex) => (
                                      <div
                                        key={detailIndex}
                                        className="bg-amber-50 p-4 rounded-xl"
                                      >
                                        <div className="flex items-center">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-amber-500 mr-2"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                            />
                                          </svg>
                                          <span className="font-medium text-gray-800">
                                            {detail.hotelName}
                                          </span>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="text-gray-500 italic">
                                  No hotel details available for this location.
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-2xl text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          No hotel information available for this package.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Photos Tab */}
                {activeTab === "photos" && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-rose-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Photos
                    </h2>
                    {data?.MainPhotos?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                        {data.MainPhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="group relative overflow-hidden rounded-xl shadow-md"
                          >
                            <img
                              src={photo || "/placeholder.svg"}
                              alt={`Tour photo ${index + 1}`}
                              className="w-full h-56 object-cover transition-transform duration-700 group-hover:scale-110"
                              onClick={() => openImageModal(photo)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => openImageModal(photo)}
                                className="bg-white/20 backdrop-blur-sm p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-6 w-6 text-white"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gray-50 p-8 rounded-2xl text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-12 w-12 text-gray-400 mx-auto mb-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-gray-500 text-lg">
                          No photos available for this package.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Policies & Terms Tab */}
                {activeTab === "policies" && (
                  <div className="space-y-8">
                    {/* Conditions of Travel */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          Conditions of Travel
                        </h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {data?.conditionOfTravel ||
                            "No conditions specified."}
                        </p>
                      </div>
                    </div>

                    {/* Policies */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          Policies
                        </h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {data?.policies || "No policies specified."}
                        </p>
                      </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <div className="bg-gradient-to-r from-gray-700 to-gray-900 px-6 py-4 text-white">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-gray-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                          </svg>
                          Terms and Conditions
                        </h2>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {data?.termsAndConditions ||
                            "No terms and conditions specified."}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <EditPackage
              setEditPackage={setEditPackage}
              setSelectedId={setSelectedId}
              id={selectedId}
              updateById={updateById}
              initialData={data}
            />
          )}
        </>
      )}
    </>
  );
}
