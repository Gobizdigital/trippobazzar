"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useDebounce from "../../../../hooks/useDebounce";
import Loader from "../../Loader";
import useFetch from "../../../../hooks/useFetch";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";
import { IoIosStar } from "react-icons/io";
import ConfirmationModal from "../../ConfirmationModal";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowUpDown,
} from "lucide-react";

export default function AdminHotel() {
  const [searchInput, setSearchInput] = useState("");
  const [isAddingHotel, setIsAddingHotel] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [editHotel, setEditHotel] = useState(false);
  const [modal, setModal] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Pagination state
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Create axios headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  };

  // Sorting state
  const [sortBy, setSortBy] = useState("hotelName");
  const [sortDirection, setSortDirection] = useState("asc");

  const baseUrl =
    selectedId || isAddingHotel
      ? "https://trippo-bazzar-backend.vercel.app/api/hotel"
      : "https://trippo-bazzar-backend.vercel.app/api/hotel/fields/query";

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchInput, 500);

  const { data, loading: hotelLoading } = useFetch(
    selectedId ? `${baseUrl}/${selectedId}` : null
  );

  // Memoize fetchHotels to avoid recreating it on every render
  const fetchHotels = useCallback(async () => {
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

      setHotels(response.data.data);
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

  // Effect for fetching hotels when dependencies change
  useEffect(() => {
    fetchHotels();
  }, [fetchHotels]);

  // Effect for showing search indicator
  useEffect(() => {
    if (searchInput !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [searchInput, debouncedSearchTerm]);

  const deleteById = async (id) => {
    try {
      await axios.delete(
        `${"https://trippo-bazzar-backend.vercel.app/api/hotel"}/${id}`,
        axiosConfig
      );
      fetchHotels();
    } catch (error) {
      console.error(error);
    }
  };

  const updateById = async (id, data) => {
    try {
      await axios.put(`${baseUrl}/${id}`, data, axiosConfig);
      fetchHotels();
    } catch (error) {
      console.error(error);
    }
  };

  const addNew = async (data) => {
    try {
      await axios.post(baseUrl, data, axiosConfig);
      fetchHotels();
    } catch (error) {
      console.error(error);
    }
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

  if (loading && hotels.length === 0) {
    return <Loader />;
  }

  if (hotelLoading && selectedId) {
    return <Loader />;
  }

  return (
    <>
      {modal && (
        <ConfirmationModal
          message={modal.message}
          onConfirm={modal.onConfirm}
          onCancel={modal.onCancel}
        />
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Hotel Management
        </h1>

        {!selectedId ? (
          <div>
            {/* Header with Add/Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <button
                onClick={() => setIsAddingHotel(!isAddingHotel)}
                className={`${
                  isAddingHotel
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                } text-white font-medium rounded-full px-6 py-2.5 transition-all duration-300 flex items-center gap-2 shadow-sm`}
              >
                {isAddingHotel ? (
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
                    Add Hotel
                  </>
                )}
              </button>

              {!isAddingHotel && (
                <div className="relative w-full sm:w-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search hotels..."
                      value={searchInput}
                      onChange={handleSearchChange}
                      className="w-full sm:w-80 pl-10 pr-10 py-2.5 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                    />
                    <Search className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-3 w-5 h-5 text-blue-500 animate-spin" />
                    )}
                  </div>
                  {debouncedSearchTerm && (
                    <div className="mt-1 text-xs text-gray-500 pl-4">
                      Showing results for "{debouncedSearchTerm}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Filters and Sorting */}
            {!isAddingHotel && (
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Sort by:</span>
                  <button
                    onClick={handleSort}
                    className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <span>Hotel Name</span>
                    <ArrowUpDown
                      className={`w-4 h-4 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Show:</span>
                  <select
                    value={pagination.limit}
                    onChange={handleLimitChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                </div>
              </div>
            )}

            {/* Loading Overlay */}
            {loading && hotels.length > 0 && (
              <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-10 pointer-events-none">
                <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  <span>Loading hotels...</span>
                </div>
              </div>
            )}

            {/* Add Hotel Form or Hotel List */}
            {isAddingHotel ? (
              <AddHotel setIsAddingPackage={setIsAddingHotel} addNew={addNew} />
            ) : (
              <div className="space-y-3 mt-4">
                {hotels.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No hotels found. Add a new hotel or try a different search.
                  </div>
                ) : (
                  hotels.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {item?.hotelPhotoUrl?.[0] ? (
                            <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  item?.hotelPhotoUrl[0] || "/placeholder.svg"
                                }
                                alt={item?.hotelName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                            </div>
                          )}

                          <div className="flex-1">
                            <h3
                              onClick={() => setSelectedId(item._id)}
                              className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                            >
                              {item?.hotelName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {item?.hotelRating && (
                                <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded text-sm">
                                  <IoIosStar className="text-yellow-500 mr-1" />
                                  <span className="font-medium">
                                    {item?.hotelRating}
                                  </span>
                                </div>
                              )}
                              {item?.hotelType && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                  {item?.hotelType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setSelectedId(item._id)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(item._id, item.hotelName)
                            }
                            className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Pagination Controls */}
            {!isAddingHotel && pagination.totalPages > 1 && (
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
                    hotels
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
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
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
                                ? "bg-blue-500 text-white font-medium"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                    </div>

                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
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
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
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
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {editHotel ? (
              <EditHotel
                setEditPackage={setEditHotel}
                setSelectedId={setSelectedId}
                id={selectedId}
                updateById={updateById}
                initialData={data}
              />
            ) : (
              <>
                {/* Hotel Detail View */}
                <div className="relative">
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setEditHotel(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center gap-1"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center gap-1"
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
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Hotel Info */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {data?.hotelName}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {data?.hotelRating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <span className="text-gray-700 font-medium">
                            {data?.hotelRating}
                          </span>
                          <IoIosStar className="text-yellow-500" />
                        </div>
                      )}

                      {data?.hotelType && (
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {data?.hotelType}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photos Gallery */}
                  {data?.hotelPhotoUrl && data?.hotelPhotoUrl.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
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
                        Photo Gallery
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {data.hotelPhotoUrl.map(
                          (photo, index) =>
                            photo && (
                              <div
                                key={index}
                                className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-video"
                              >
                                <img
                                  src={photo || "/placeholder.svg"}
                                  alt={`${data?.hotelName} photo ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
