"use client";

import { useState } from "react";
import useApiData from "../../../hooks/useApiData";
import useFetch from "../../../hooks/useFetch";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader";
import ConfirmationModal from "../ConfirmationModal";
import ImageModal from "../../../utils/ImageModal";
import LocationModal from "./LocationModal";

function AdminContinent() {
  const baseUrl = "https://trippo-bazzar-backend.vercel.app/api/continent";
  const {
    data: continentData,
    loading,
    deleteById,
    updateById,
    addNew,
  } = useApiData(baseUrl);

  const { data: countryList } = useFetch(
    "https://trippo-bazzar-backend.vercel.app/api/country"
  );

  const [newContinent, setNewContinent] = useState({
    ContinentName: "",
    ContinentPhotoUrl: "",
    Countries: [],
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const [modal, setModal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showContinentModal, setShowContinentModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const startEditing = (continent) => {
    setEditingUserId(continent._id);
    setEditedDetails({ ...continent });
  };

  const saveContinent = async () => {
    try {
      await updateById(editingUserId, editedDetails);
    } catch (error) {
      console.log(error);
    }
    setEditingUserId(null);
  };

  const addContinent = async () => {
    try {
      await addNew(newContinent);
      setNewContinent({
        ContinentName: "",
        ContinentPhotoUrl: "",
        Countries: [],
      });
      setShowContinentModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const openContinentModal = () => {
    setShowContinentModal(true);
  };

  const closeContinentModal = () => {
    setShowContinentModal(false);
    setNewContinent({
      ContinentName: "",
      ContinentPhotoUrl: "",
      Countries: [],
    });
  };

  const handleContinentClick = (continentId, continentName) => {
    navigate(`/adminpanel/destination/${continentName}/${continentId}`);
  };

  const handleCountryChange = (e) => {
    const selectedCountryId = e.target.value;

    if (selectedCountryId) {
      const selectedCountry = countryList.find(
        (country) => country._id === selectedCountryId
      );

      if (selectedCountry) {
        if (editingUserId) {
          setEditedDetails((prevDetails) => ({
            ...prevDetails,
            Countries: prevDetails.Countries
              ? [...prevDetails.Countries, selectedCountry]
              : [selectedCountry],
          }));
        } else {
          setNewContinent((prevContinent) => ({
            ...prevContinent,
            Countries: prevContinent.Countries
              ? [...prevContinent.Countries, selectedCountry]
              : [selectedCountry],
          }));
        }
      }
    }
  };

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete ${name}?`,
      onConfirm: () => {
        deleteById(id);
        setModal(null);
      },
      onCancel: () => setModal(null),
    });
  };

  const filteredContinents = continentData?.filter((continent) =>
    continent.ContinentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading === true) {
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

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 sm:mb-0">
            Continent Management
          </h1>
          <button
            onClick={openContinentModal}
            className="bg-green-500 hover:bg-green-600 text-white rounded-lg px-4 py-2 transition-all duration-200 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Continent
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="relative w-full sm:w-64 mb-4 sm:mb-0">
            <input
              type="text"
              placeholder="Search continents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Total continents:{" "}
            <span className="font-medium">{continentData?.length || 0}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContinents?.map((continent) => (
            <div
              key={continent._id}
              className={`bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${
                editingUserId === continent._id ? "ring-2 ring-blue-500" : ""
              }`}
            >
              {editingUserId === continent._id ? (
                // Edit Mode
                <div className="p-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Continent Name
                    </label>
                    <input
                      type="text"
                      value={editedDetails.ContinentName || ""}
                      onChange={(e) =>
                        setEditedDetails({
                          ...editedDetails,
                          ContinentName: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Photo URL
                    </label>
                    <input
                      type="text"
                      value={editedDetails.ContinentPhotoUrl || ""}
                      onChange={(e) =>
                        setEditedDetails({
                          ...editedDetails,
                          ContinentPhotoUrl: e.target.value,
                        })
                      }
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Countries
                    </label>
                    <div className="flex flex-wrap mb-2">
                      {editedDetails.Countries &&
                      editedDetails.Countries.length > 0 ? (
                        editedDetails.Countries.map((country, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center mr-2 mb-2"
                          >
                            <span className="inline-block bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-xs">
                              {country.CountryName}
                              <button
                                className="ml-1 text-blue-800 hover:text-red-600 font-bold"
                                onClick={() => {
                                  const updatedCountries =
                                    editedDetails.Countries.filter(
                                      (_, i) => i !== index
                                    );
                                  setEditedDetails({
                                    ...editedDetails,
                                    Countries: updatedCountries,
                                  });
                                }}
                              >
                                ×
                              </button>
                            </span>
                          </div>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">
                          No countries selected
                        </span>
                      )}
                    </div>

                    <select
                      onChange={handleCountryChange}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                      <option value="">Add a country</option>
                      {countryList?.map((country) => (
                        <option key={country._id} value={country._id}>
                          {country.CountryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
                      onClick={() => setEditingUserId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
                      onClick={saveContinent}
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div
                    className="h-40 bg-gray-200 relative cursor-pointer"
                    onClick={() => openModal(continent.ContinentPhotoUrl)}
                  >
                    <img
                      src={continent.ContinentPhotoUrl || "/placeholder.svg"}
                      alt={continent.ContinentName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <h3
                      className="text-lg font-semibold text-gray-800 mb-2 cursor-pointer hover:text-blue-600"
                      onClick={() =>
                        handleContinentClick(
                          continent._id,
                          continent.ContinentName
                        )
                      }
                    >
                      {continent.ContinentName}
                    </h3>

                    <div className="mb-4">
                      <p className="text-sm text-gray-500 mb-1">Countries:</p>
                      <div className="flex flex-wrap">
                        {continent.Countries &&
                        continent.Countries.length > 0 ? (
                          continent.Countries.map((country) => (
                            <span
                              key={country._id}
                              className="inline-block bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full text-xs mr-1 mb-1"
                            >
                              {country.CountryName}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-gray-500">
                            No countries
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-1.5 text-gray-500 hover:text-blue-600 rounded-full hover:bg-blue-50"
                        onClick={() => startEditing(continent)}
                        title="Edit"
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
                      </button>
                      <button
                        className="p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50"
                        onClick={() =>
                          handleDelete(continent._id, continent.ContinentName)
                        }
                        title="Delete"
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
                </>
              )}
            </div>
          ))}

          {filteredContinents?.length === 0 && (
            <div className="col-span-full text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <p className="text-gray-500">
                No continents found. Try a different search or add a new
                continent.
              </p>
            </div>
          )}
        </div>
      </div>

      {showContinentModal && (
        <LocationModal
          type="continent"
          handleSelectionChange={handleCountryChange}
          addLocation={addContinent}
          list={countryList}
          newLocation={newContinent}
          setNewLocation={setNewContinent}
          closeModal={closeContinentModal}
        />
      )}

      {showModal && (
        <ImageModal
          image={{ images: { original: { url: selectedImage } } }}
          handleCloseModal={closeModal}
        />
      )}
    </>
  );
}

export default AdminContinent;
