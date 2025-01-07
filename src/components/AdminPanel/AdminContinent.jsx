import React, { useState } from "react";
import useApiData from "../../../hooks/useApiData";
import Spinner from "../../../utils/Spinner";
import ImageModal from "../../../utils/ImageModal";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";
import LocationModal from "./LocationModal";
import Loader from "../Loader";
import ConfirmationModal from "../ConfirmationModal";

function AdminContinent() {
  const baseUrl = "https://tripobazar-backend.vercel.app/api/continent";
  const {
    data: continentData,
    loading,
    error,
    deleteById,
    updateById,
    addNew,
  } = useApiData(baseUrl);

  const { data: countryList } = useFetch(
    "https://tripobazar-backend.vercel.app/api/country"
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
  const navigate = useNavigate();

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditedDetails({ ...user });
  };

  const saveContinent = async () => {
    try {
      await updateById(editingUserId, editedDetails); // Update data via hook
    } catch (error) {
      console.log(error);
    }
    setEditingUserId(null);
  };

  const addContinent = async () => {
    try {
      await addNew(newContinent); // Call the addNew function from hook
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
    setSelectedImage(imageUrl); // Set the selected image URL
    setShowModal(true); // Show the modal
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
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
    navigate(`/adminpanel/destination/${continentName}/${continentId}`); // Redirect to the continent-country page
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
          // If adding a new continent, update newContinent.Countries
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

  const handleDelete = (id,name) => {
    setModal({
      message: `Are you sure you want to delete this continent ${name}?`,
      onConfirm: () => {
        deleteById(id); // Perform delete operation
        setModal(null); // Close modal
      },
      onCancel: () => setModal(null), // Close modal
    });
  };

  if (loading === true) {
    return <Loader/>;
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
    <div className="mr-1 p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-med-green font-bold text-xl">
            Add New Continent
          </h3>
          <button
            onClick={openContinentModal}
            className="bg-med-green text-white rounded-lg px-6 py-2 hover:bg-green-600 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Add Continent
          </button>
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
      </div>

      <div className="mb-6 flex justify-between">
        <p className="text-med-green font-bold">
          Total data: {continentData?.length}
        </p>
        <p className="text-med-green font-bold">Destination</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-left">Sr.</th>
              <th className="border border-gray-200 p-2 text-left">
                ContinentName
              </th>
              <th className="border border-gray-200 p-2 text-left">
                ContinentPhoto
              </th>
              <th className="border border-gray-200 p-2 text-left">
                Countries
              </th>
              <th className="border border-gray-200 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {continentData?.map((item, idx) => (
              <tr key={item._id || idx} className="border-b border-gray-200">
                {editingUserId === item._id ? (
                  <>
                    <td className="border border-gray-200 p-2">{idx + 1}</td>
                    <td className="border border-gray-200 p-2">
                      <input
                        type="text"
                        value={editedDetails.ContinentName || ""}
                        onChange={(e) =>
                          setEditedDetails({
                            ...editedDetails,
                            ContinentName: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input
                        type="text"
                        value={editedDetails.ContinentPhotoUrl || ""}
                        onChange={(e) =>
                          setEditedDetails({
                            ...editedDetails,
                            ContinentPhotoUrl: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      {/* Loop through the Countries array and create an editable tag for each country */}
                      {editedDetails.Countries &&
                      editedDetails.Countries.length > 0 ? (
                        editedDetails.Countries.map((country, index) => {
                          return (
                            <div
                              key={index}
                              className="inline-flex items-center mb-2 mr-2"
                            >
                              <span
                                key={country._id}
                                className="inline-block relative bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-2 mb-2"
                              >
                                {country.CountryName}

                                <button
                                  className="text-red-500 absolute -top-1 -right-1 bg-red-300 rounded-full w-4 h-4 flex justify-center items-center"
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
                                  x
                                </button>
                              </span>
                            </div>
                          );
                        })
                      ) : (
                        <span>No countries</span>
                      )}

                      {/* Add new country input */}
                      <div className="mt-2">
                        <select
                          onChange={handleCountryChange}
                          className="border px-2 py-1 rounded-full bg-gray-100 text-sm"
                        >
                          <option value="">Select Country</option>
                          {countryList?.map((country) => (
                            <option key={country._id} value={country._id}>
                              {country.CountryName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="border border-gray-200 p-2">
                      <button
                        className="text-green-400 px-3 py-1 rounded mr-2"
                        onClick={saveContinent}
                      >
                        Save
                      </button>
                      <button
                        className="text-red-400 px-3 py-1 rounded"
                        onClick={() => setEditingUserId(null)}
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="border border-gray-200 p-2">{idx + 1}</td>
                    <td
                      onClick={() => {
                        handleContinentClick(item._id, item?.ContinentName);
                      }}
                      className="border border-gray-200 p-2"
                    >
                      {item?.ContinentName}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <img
                        src={item?.ContinentPhotoUrl}
                        alt="continentImage"
                        onClick={() => openModal(item?.ContinentPhotoUrl)}
                        className="w-40 h-20 cursor-pointer"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item?.Countries.length > 0 ? (
                        item.Countries.map((country) => (
                          <span
                            key={country._id}
                            className="inline-block bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-2 mb-2"
                          >
                            {country.CountryName}
                          </span>
                        ))
                      ) : (
                        <span>No countries</span>
                      )}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <button
                        className="text-green-400 px-3 py-1 rounded mr-2"
                        onClick={() => startEditing(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-400 px-3 py-1 rounded"
                        onClick={() => handleDelete(item._id,item.ContinentName)}
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default AdminContinent;
