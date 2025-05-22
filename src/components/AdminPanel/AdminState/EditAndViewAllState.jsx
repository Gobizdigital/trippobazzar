"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import useDebounce from "../../../../hooks/useDebounce";
import {
  Plus,
  Trash2,
  Eye,
  Search,
  MapPin,
  Globe,
  ArrowUpRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";
import LocationModal from "../LocationModal";
import ConfirmationModal from "../../ConfirmationModal";

export default function ViewAndAddAllState({
  addNew,
  deleteById,
  setSelectedId,
  openModal,
  setNewState,
  newState,
  modal,
  setModal,
}) {
  const [showStateModal, setShowStateModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [isSearching, setIsSearching] = useState(false);

  // Pagination state
  const [states, setStates] = useState([]);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState("StateName");
  const [sortDirection, setSortDirection] = useState("asc");

  const baseUrl =
    "https://trippo-bazzar-backend.vercel.app/api/state/fields/query";

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoize fetchStates to avoid recreating it on every render
  const fetchStates = useCallback(async () => {
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

      setStates(response.data.data);
      setFilteredStates(response.data.data);
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

  // Effect for fetching states when dependencies change
  useEffect(() => {
    fetchStates();
  }, [fetchStates]);

  // Effect for showing search indicator
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  const closeStateModal = () => {
    setShowStateModal(false);
    setNewState({ StateName: "", StatePhotoUrl: "", Packages: [] });
  };

  const openStateModal = () => {
    setShowStateModal(true);
  };

  const addState = async () => {
    try {
      setLoading(true);
      await addNew(newState);
      setNewState({ StateName: "", StatePhotoUrl: "", Packages: [] });
      setShowStateModal(false);
      fetchStates(); // Refresh the list after adding
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete ${name}?`,
      onConfirm: async () => {
        try {
          setLoading(true);
          await deleteById(id);
          // Explicitly fetch states after deletion completes
          await fetchStates();
          setModal(null);
        } catch (error) {
          console.error("Error deleting state:", error);
        } finally {
          setLoading(false);
        }
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
    setSearchTerm(e.target.value);
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

  if (loading && states.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-600 font-medium">Processing...</span>
      </div>
    );
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

      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-6 mb-6 border border-green-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-green-700 font-bold text-2xl flex items-center">
              <Globe className="mr-2 h-6 w-6 text-green-600" />
              Destination States
            </h3>
            <p className="text-gray-600 mt-1">
              Manage your travel destinations
            </p>
            <div className="text-sm text-gray-500 mt-2">
              Total:{" "}
              <span className="font-medium">{pagination.totalCount}</span>{" "}
              states found
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-l-lg border border-r-0 ${
                  viewMode === "grid"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-r-lg border ${
                  viewMode === "list"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={openStateModal}
              className="bg-green-600 text-white rounded-lg px-6 py-2.5 hover:bg-green-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
              disabled={loading}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New State
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search states..."
                className="pl-10 pr-10 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 w-5 h-5 text-green-500 animate-spin" />
              )}
            </div>
            {debouncedSearchTerm && (
              <div className="mt-1 text-xs text-gray-500 pl-4">
                Showing results for "{debouncedSearchTerm}"
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={handleSort}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <span>Sort by Name</span>
              <ArrowUpDown
                className={`w-4 h-4 ${
                  sortDirection === "desc" ? "rotate-180" : ""
                } transition-transform`}
              />
            </button>

            <select
              value={pagination.limit}
              onChange={handleLimitChange}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        {showStateModal && (
          <LocationModal
            type="state"
            addLocation={addState}
            newLocation={newState}
            setNewLocation={setNewState}
            closeModal={closeStateModal}
          />
        )}
      </div>

      {/* Loading Overlay */}
      {loading && states.length > 0 && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-10 pointer-events-none">
          <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-green-500 animate-spin" />
            <span>Loading states...</span>
          </div>
        </div>
      )}

      {filteredStates?.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg mb-2">No states found</p>
            <p className="text-gray-400 mb-4">
              {searchTerm
                ? "Try a different search term"
                : "Add your first state to get started"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates?.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              <div
                className="h-40 bg-gray-200 relative overflow-hidden"
                onClick={() => openModal(item?.StatePhotoUrl)}
              >
                <img
                  src={
                    item?.StatePhotoUrl ||
                    "/placeholder.svg?height=200&width=400"
                  }
                  alt={`${item?.StateName} thumbnail`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/placeholder.svg?height=200&width=400";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item._id);
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 text-blue-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600 hover:text-white"
                  title="View details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-green-600 transition-colors flex items-center"
                      onClick={() => setSelectedId(item._id)}
                    >
                      <MapPin className="w-4 h-4 mr-1 text-green-600 flex-shrink-0" />
                      {item?.StateName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {item?.Packages?.length || 0} packages available
                    </p>
                  </div>

                  <button
                    onClick={() => handleDelete(item._id, item.StateName)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete state"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedId(item._id)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                  >
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </button>

                  <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-6 md:col-span-5">State</div>
            <div className="col-span-3 md:col-span-4 hidden md:block">
              Packages
            </div>
            <div className="col-span-3 md:col-span-2">Status</div>
            <div className="col-span-3 md:col-span-1 text-right">Actions</div>
          </div>

          {filteredStates?.map((item, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 gap-4 p-4 items-center ${
                idx !== filteredStates.length - 1
                  ? "border-b border-gray-100"
                  : ""
              } hover:bg-gray-50 transition-colors`}
            >
              <div className="col-span-6 md:col-span-5 flex items-center">
                <div
                  className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-gray-200"
                  onClick={() => openModal(item?.StatePhotoUrl)}
                >
                  <img
                    src={
                      item?.StatePhotoUrl ||
                      "/placeholder.svg?height=100&width=100"
                    }
                    alt={`${item?.StateName} thumbnail`}
                    className="w-full h-full object-cover cursor-pointer"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/placeholder.svg?height=100&width=100";
                    }}
                  />
                </div>
                <div>
                  <h3
                    className="font-medium text-gray-800 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => setSelectedId(item._id)}
                  >
                    {item?.StateName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 md:hidden">
                    {item?.Packages?.length || 0} packages
                  </p>
                </div>
              </div>

              <div className="col-span-3 md:col-span-4 hidden md:block">
                <div className="flex items-center">
                  <span className="text-gray-700">
                    {item?.Packages?.length || 0} packages
                  </span>
                  {item?.Packages?.length > 0 && (
                    <div className="ml-2 flex -space-x-2">
                      {[...Array(Math.min(3, item?.Packages?.length))].map(
                        (_, i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600"
                          >
                            P
                          </div>
                        )
                      )}
                      {item?.Packages?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                          +{item?.Packages?.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-3 md:col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-600"></span>
                  Active
                </span>
              </div>

              <div className="col-span-3 md:col-span-1 flex items-center justify-end gap-1">
                <button
                  onClick={() => setSelectedId(item._id)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id, item.StateName)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete state"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
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
              of <span className="font-medium">{pagination.totalCount}</span>{" "}
              states
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
                          ? "bg-green-500 text-white font-medium"
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
    </>
  );
}
