"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Edit,
  Trash2,
  Plus,
  MapPin,
  Save,
  X,
  Search,
  RefreshCw,
  Eye,
  Globe,
  PlusCircle,
  ImageIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Loader2,
} from "lucide-react";

import useFetch from "../../../hooks/useFetch";
import axios from "axios";

import Loader from "../Loader";
import ConfirmationModal from "../ConfirmationModal";
import ImageModal from "../../../utils/ImageModal";
import LocationModal from "./LocationModal";
import useDebounce from "../../../hooks/useDebounce";

function AdminCountry() {
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const [showCountryModal, setShowCountryModal] = useState(false);
  const baseUrl =
    editingUserId || showCountryModal
      ? "https://trippo-bazzar-backend.vercel.app/api/country"
      : "https://trippo-bazzar-backend.vercel.app/api/country/fields/query";
  const [countryData, setCountryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: stateList } = useFetch(
    "https://trippo-bazzar-backend.vercel.app/api/state"
  );

  const [newCountry, setNewCountry] = useState({
    CountryName: "",
    CountryPhotoUrl: "",
    States: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [modal, setModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [stateSearchTerm, setStateSearchTerm] = useState("");
  const [filteredStates, setFilteredStates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const stateDropdownRef = useRef(null);
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = userInfo?.token;

  // Create axios headers
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`, // Include the token in the Authorization header
    },
  };

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 9,
  });

  // Sorting state
  const [sortBy, setSortBy] = useState("CountryName");
  const [sortDirection, setSortDirection] = useState("asc");

  // Debounce search term to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Memoize fetchCountries to avoid recreating it on every render
  const fetchCountries = useCallback(async () => {
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

      setCountryData(response.data.data);
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

  // Effect for fetching countries when dependencies change
  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

  // Effect for showing search indicator
  useEffect(() => {
    if (searchTerm !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [searchTerm, debouncedSearchTerm]);

  useEffect(() => {
    if (stateList) {
      setFilteredStates(
        stateList.filter((state) =>
          state.StateName.toLowerCase().includes(stateSearchTerm.toLowerCase())
        )
      );
    }
  }, [stateList, stateSearchTerm]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target)
      ) {
        setIsStateDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteById = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(`${baseUrl}/${id}`, axiosConfig);
      setIsLoading(false);
      fetchCountries();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const updateById = async (id, data) => {
    try {
      setIsLoading(true);
      await axios.put(`${baseUrl}/${id}`, data, axiosConfig);
      setIsLoading(false);
      fetchCountries();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const addNew = async (data) => {
    try {
      setIsLoading(true);
      await axios.post(baseUrl, data, axiosConfig);
      setIsLoading(false);
      fetchCountries();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditedDetails({ ...user });
  };

  const saveCountry = async () => {
    try {
      setIsLoading(true);
      await updateById(editingUserId, editedDetails);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
    setEditingUserId(null);
  };

  const addCountry = async () => {
    try {
      setIsLoading(true);
      await addNew(newCountry);
      setIsLoading(false);
      setNewCountry({
        CountryName: "",
        CountryPhotoUrl: "",
        States: [],
      });
      setShowCountryModal(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openCountryModal = () => {
    setShowCountryModal(true);
  };

  const closeCountryModal = () => {
    setShowCountryModal(false);
    setNewCountry({
      CountryName: "",
      CountryPhotoUrl: "",
      States: [],
    });
  };

  const handleStateSelect = (state) => {
    if (editingUserId) {
      const isAlreadySelected = editedDetails.States?.some(
        (s) => s._id === state._id
      );
      if (!isAlreadySelected) {
        setEditedDetails((prevDetails) => ({
          ...prevDetails,
          States: prevDetails.States ? [...prevDetails.States, state] : [state],
        }));
      }
    } else {
      const isAlreadySelected = newCountry.States?.some(
        (s) => s._id === state._id
      );
      if (!isAlreadySelected) {
        setNewCountry((prevCountry) => ({
          ...prevCountry,
          States: prevCountry.States ? [...prevCountry.States, state] : [state],
        }));
      }
    }
    setStateSearchTerm("");
    setIsStateDropdownOpen(false);
  };

  const removeState = (stateId) => {
    if (editingUserId) {
      setEditedDetails((prevDetails) => ({
        ...prevDetails,
        States: prevDetails.States.filter((state) => state._id !== stateId),
      }));
    } else {
      setNewCountry((prevCountry) => ({
        ...prevCountry,
        States: prevCountry.States.filter((state) => state._id !== stateId),
      }));
    }
  };

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete this country ${name}?`,
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

  if (loading === true && countryData.length === 0) {
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

      <div className="bg-gray-50 min-h-screen p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <Globe className="w-6 h-6 mr-2 text-emerald-500" />
                Countries Management
              </h2>
              <p className="text-gray-500 mt-1">
                Manage all countries and their associated states
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-medium">
                Total: {pagination.totalCount || 0}
              </div>
              <button
                onClick={openCountryModal}
                className="bg-emerald-500 text-white rounded-lg px-4 py-2 hover:bg-emerald-600 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-1.5" />
                Add Country
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search countries..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 w-full"
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                {isSearching && (
                  <Loader2 className="absolute right-3 top-3 w-5 h-5 text-emerald-500 animate-spin" />
                )}
              </div>
              {debouncedSearchTerm && (
                <div className="mt-1 text-xs text-gray-500">
                  Showing results for "{debouncedSearchTerm}"
                </div>
              )}
            </div>

            <div className="flex items-center">
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
            </div>
          </div>
        </div>

        {/* Loading Overlay */}
        {loading && countryData.length > 0 && (
          <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-10 pointer-events-none">
            <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
              <span>Loading countries...</span>
            </div>
          </div>
        )}

        {/* Country Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countryData.map((item, idx) => (
            <div
              key={item._id || idx}
              className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              {editingUserId === item._id ? (
                // Edit Mode
                <div className="p-5">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country Name
                    </label>
                    <input
                      type="text"
                      value={editedDetails.CountryName || ""}
                      onChange={(e) =>
                        setEditedDetails({
                          ...editedDetails,
                          CountryName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo URL
                    </label>
                    <input
                      type="text"
                      value={editedDetails.CountryPhotoUrl || ""}
                      onChange={(e) =>
                        setEditedDetails({
                          ...editedDetails,
                          CountryPhotoUrl: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    {editedDetails.CountryPhotoUrl && (
                      <div className="mt-2 relative rounded-lg overflow-hidden h-32 bg-gray-100">
                        <img
                          src={
                            editedDetails.CountryPhotoUrl || "/placeholder.svg"
                          }
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/400x200?text=Invalid+URL";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      States
                    </label>

                    {/* Selected States */}
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {editedDetails.States &&
                      editedDetails.States.length > 0 ? (
                        editedDetails.States.map((state) => (
                          <div
                            key={state._id}
                            className="inline-flex items-center bg-blue-100 text-blue-800 py-1 px-2.5 rounded-full text-xs"
                          >
                            {state.StateName}
                            <button
                              className="ml-1.5 text-blue-600 hover:text-red-500"
                              onClick={() => removeState(state._id)}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))
                      ) : (
                        <span className="text-gray-500 text-sm">
                          No states selected
                        </span>
                      )}
                    </div>

                    {/* State Search */}
                    <div className="relative" ref={stateDropdownRef}>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search states..."
                          value={stateSearchTerm}
                          onChange={(e) => setStateSearchTerm(e.target.value)}
                          onFocus={() => setIsStateDropdownOpen(true)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        />
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      </div>

                      {isStateDropdownOpen && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                          {filteredStates.length > 0 ? (
                            filteredStates.map((state) => (
                              <div
                                key={state._id}
                                onClick={() => handleStateSelect(state)}
                                className="px-3 py-2 hover:bg-emerald-50 cursor-pointer flex items-center justify-between text-sm"
                              >
                                <span>{state.StateName}</span>
                                <PlusCircle className="w-4 h-4 text-emerald-500" />
                              </div>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-center text-gray-500 text-sm">
                              {stateSearchTerm
                                ? "No states found"
                                : "Type to search states"}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      className="flex items-center text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                      onClick={() => setEditingUserId(null)}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </button>
                    <button
                      className="flex items-center text-white bg-emerald-500 hover:bg-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
                      onClick={saveCountry}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-1" />
                      )}
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="relative h-40 bg-gray-100 group">
                    <img
                      src={
                        item?.CountryPhotoUrl ||
                        "https://via.placeholder.com/400x200?text=No+Image"
                      }
                      alt={item?.CountryName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x200?text=No+Image";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                      <div className="p-4 w-full">
                        <h3
                          className="text-white font-bold text-xl cursor-pointer hover:underline flex items-center"
                          onClick={() => startEditing(item)}
                        >
                          <MapPin className="w-5 h-5 mr-1.5 inline" />
                          {item?.CountryName}
                        </h3>
                      </div>
                    </div>
                    <button
                      onClick={() => openModal(item?.CountryPhotoUrl)}
                      className="absolute top-2 right-2 bg-black/30 hover:bg-black/50 p-1.5 rounded-full text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-2 flex items-center">
                        <ImageIcon className="w-4 h-4 mr-1.5 text-emerald-500" />
                        States
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {item?.States && item.States.length > 0 ? (
                          item.States.map((state) => (
                            <span
                              key={state._id}
                              className="inline-block bg-blue-100 text-blue-800 py-1 px-2.5 rounded-full text-xs"
                            >
                              {state.StateName}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-sm">
                            No states
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        ID: {item._id?.substring(0, 8)}...
                      </span>
                      <div className="flex gap-2">
                        <button
                          className="flex items-center text-emerald-600 hover:text-emerald-800 px-2 py-1 hover:bg-emerald-50 rounded transition-colors text-sm"
                          onClick={() => startEditing(item)}
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          Edit
                        </button>
                        <button
                          className="flex items-center text-red-600 hover:text-red-800 px-2 py-1 hover:bg-red-50 rounded transition-colors text-sm"
                          onClick={() =>
                            handleDelete(item._id, item.CountryName)
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}

          {countryData.length === 0 && !loading && (
            <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <Globe className="w-12 h-12 text-gray-300 mb-3" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No Countries Found
                </h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm
                    ? "No countries match your search criteria"
                    : "There are no countries available"}
                </p>
                <button
                  onClick={openCountryModal}
                  className="bg-emerald-500 text-white rounded-lg px-4 py-2 hover:bg-emerald-600 transition-all duration-300 flex items-center"
                >
                  <Plus className="w-5 h-5 mr-1.5" />
                  Add Country
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pagination Controls - Redesigned */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-gray-100">
              <div className="flex items-center mb-4 sm:mb-0">
                <span className="text-sm text-gray-600 mr-2">
                  Items per page:
                </span>
                <select
                  value={pagination.limit}
                  onChange={handleLimitChange}
                  className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                >
                  <option value="6">6</option>
                  <option value="9">9</option>
                  <option value="12">12</option>
                  <option value="24">24</option>
                </select>
              </div>

              <div className="text-sm text-gray-600">
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
                countries
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

        {showCountryModal && (
          <LocationModal
            type="country"
            handleSelectionChange={handleStateSelect}
            addLocation={addCountry}
            list={stateList}
            newLocation={newCountry}
            setNewLocation={setNewCountry}
            closeModal={closeCountryModal}
          />
        )}

        {showModal && (
          <ImageModal
            image={{ images: { original: { url: selectedImage } } }}
            handleCloseModal={closeModal}
          />
        )}
      </div>
    </>
  );
}

export default AdminCountry;
