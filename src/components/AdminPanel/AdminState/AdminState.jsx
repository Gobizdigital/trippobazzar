"use client";

import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit,
  Save,
  X,
  ChevronLeft,
  Package,
  MapPin,
  Loader2,
  Search,
  Check,
} from "lucide-react";
import useFetch from "../../../../hooks/useFetch";
import useApiData from "../../../../hooks/useApiData";
import ImageModal from "../../../../utils/ImageModal";
import ViewAndAddAllState from "./EditAndViewAllState";

export default function AdminState() {
  const [selectedId, setSelectedId] = useState();
  const [stateData, setStateData] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [packageSearch, setPackageSearch] = useState("");
  const [filteredPackages, setFilteredPackages] = useState([]);

  const { data: packageData, loading } = useFetch(
    "https://trippo-bazzar-backend.vercel.app/api/package"
  );

  const baseUrl = "https://trippo-bazzar-backend.vercel.app/api/state";
  const {
    data: allStateData,
    deleteById,
    updateById,
    addNew,
  } = useApiData(baseUrl);

  useEffect(() => {
    if (selectedId) {
      const fetchStates = async () => {
        const response = await fetch(
          `https://trippo-bazzar-backend.vercel.app/api/state/${selectedId}`
        );
        const result = await response.json();
        setStateData(result.data);
      };
      fetchStates();
    }
  }, [selectedId]);

  useEffect(() => {
    if (packageData) {
      setFilteredPackages(
        packageData.filter(
          (pkg) =>
            pkg.title.toLowerCase().includes(packageSearch.toLowerCase()) ||
            pkg.description.toLowerCase().includes(packageSearch.toLowerCase())
        )
      );
    }
  }, [packageSearch, packageData]);

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditedDetails({ ...user });
  };

  const saveState = async () => {
    const updatePayload = {
      ...editedDetails,
      Packages: editedDetails.Packages.map((pkg) =>
        typeof pkg === "object" ? pkg._id : pkg
      ),
    };
    try {
      await updateById(editingUserId, updatePayload);
      setEditingUserId(null);
      setStateData(editedDetails);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const deleteState = (id) => {
    deleteById(id);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const isPackageSelected = (packageId) => {
    return editedDetails.Packages?.some((pkg) =>
      typeof pkg === "object" ? pkg._id === packageId : pkg === packageId
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {!selectedId ? (
        <ViewAndAddAllState
          deleteState={deleteState}
          allStateData={allStateData}
          addNew={addNew}
          setSelectedId={setSelectedId}
          openModal={openModal}
        />
      ) : (
        <>
          {editingUserId === stateData._id ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setEditingUserId(null)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">Edit State</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State Name
                  </label>
                  <input
                    type="text"
                    name="StateName"
                    value={editedDetails.StateName}
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        StateName: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter state name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <input
                    type="text"
                    name="StatePhotoUrl"
                    value={editedDetails.StatePhotoUrl}
                    onChange={(e) =>
                      setEditedDetails({
                        ...editedDetails,
                        StatePhotoUrl: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Enter photo URL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Selected Packages
                  </label>
                  {editedDetails.Packages &&
                  editedDetails.Packages.length > 0 ? (
                    <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      {editedDetails.Packages.map((pack, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center bg-white text-gray-800 py-1.5 pl-3 pr-2 rounded-full text-sm border border-gray-200 shadow-sm"
                        >
                          <span>{pack.title}</span>
                          <button
                            className="ml-1.5 p-0.5 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-full"
                            onClick={() => {
                              const updatedPackages =
                                editedDetails.Packages.filter(
                                  (packid) => packid._id !== pack._id
                                );
                              setEditedDetails({
                                ...editedDetails,
                                Packages: updatedPackages,
                              });
                            }}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center mb-4">
                      <p className="text-gray-500">No packages selected</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Search and select packages below
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Available Packages
                    </label>
                    <span className="text-xs text-gray-500">
                      {filteredPackages.length} packages found
                    </span>
                  </div>

                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search packages..."
                      className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors text-sm"
                      value={packageSearch}
                      onChange={(e) => setPackageSearch(e.target.value)}
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg bg-white">
                    {filteredPackages?.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {filteredPackages?.map((packag) => {
                          const isSelected = isPackageSelected(packag._id);
                          return (
                            <li
                              key={packag._id}
                              className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center ${
                                isSelected ? "bg-green-50" : ""
                              }`}
                              onClick={() => {
                                if (!isSelected) {
                                  setEditedDetails({
                                    ...editedDetails,
                                    Packages: [
                                      ...editedDetails.Packages,
                                      packag,
                                    ],
                                  });
                                } else {
                                  const updatedPackages =
                                    editedDetails.Packages.filter((pkg) =>
                                      typeof pkg === "object"
                                        ? pkg._id !== packag._id
                                        : pkg !== packag._id
                                    );
                                  setEditedDetails({
                                    ...editedDetails,
                                    Packages: updatedPackages,
                                  });
                                }
                              }}
                            >
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                                  isSelected
                                    ? "bg-green-600 border-green-600 text-white"
                                    : "border-gray-300"
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-800">
                                    {packag.title}
                                  </span>
                                  <span className="text-green-600 text-sm font-medium">
                                    {" "}
                                    {`Rs ${
                                      packag.price ||
                                      packag?.pricing?.[0]?.basePrice
                                    } ` || "N/A"}{" "}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-500 truncate mt-0.5">
                                  {packag.description}
                                </p>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {packageSearch
                          ? "No packages match your search"
                          : "No packages available"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 mt-8">
                <button
                  onClick={() => setEditingUserId(null)}
                  className="px-5 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveState}
                  className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center mb-6">
                <button
                  onClick={() => setSelectedId(null)}
                  className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800">
                  State Details
                </h2>
              </div>

              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center mb-2">
                      <MapPin className="w-5 h-5 text-green-600 mr-2" />
                      <h1 className="text-3xl font-bold text-gray-800">
                        {stateData.StateName}
                      </h1>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => startEditing(stateData)}
                        className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit State
                      </button>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center"
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to List
                      </button>
                    </div>
                  </div>

                  <div className="md:w-1/2 bg-gray-100">
                    <img
                      src={stateData.StatePhotoUrl || "/placeholder.svg"}
                      alt={stateData.StateName}
                      className="w-full h-64 object-cover cursor-pointer"
                      onClick={() => openModal(stateData.StatePhotoUrl)}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Package className="w-5 h-5 text-green-600 mr-2" />
                  Associated Packages
                </h3>

                {stateData?.Packages?.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">
                      No packages associated with this state.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stateData?.Packages?.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="h-40 overflow-hidden relative">
                          <img
                            src={item.MainPhotos?.[0] || "/placeholder.jpg"}
                            alt={item.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <p className="text-sm font-medium">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {item.title}
                          </h3>
                          <div className="flex justify-between items-center mb-3">
                            <p className="text-green-600 font-bold">
                              {`Rs ${
                                item.price ||
                                item?.pricing?.[0]?.basePrice ||
                                "N/A"
                              }`}
                            </p>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                              Featured
                            </span>
                          </div>

                          {item.whatsIncluded?.length > 0 && (
                            <div className="mb-4">
                              <p className="text-xs text-gray-500 mb-1">
                                What's included:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {item.whatsIncluded
                                  .slice(0, 3)
                                  .map((includedItem, index) => (
                                    <span
                                      key={index}
                                      className="text-xs bg-gray-100 px-2 py-1 rounded-full"
                                    >
                                      {includedItem}
                                    </span>
                                  ))}
                                {item.whatsIncluded.length > 3 && (
                                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                    +{item.whatsIncluded.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showModal && (
        <ImageModal
          image={{ images: { original: { url: selectedImage } } }}
          handleCloseModal={closeModal}
        />
      )}
    </div>
  );
}
