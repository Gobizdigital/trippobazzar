import React, { useState } from "react";
import useApiData from "../../../hooks/useApiData";

import ImageModal from "../../../utils/ImageModal";
import { useNavigate } from "react-router-dom";
import useFetch from "../../../hooks/useFetch";

import LocationModal from "./LocationModal";
import Loader from "../Loader";
import ConfirmationModal from "../ConfirmationModal";

function AdminCountry() {
  const baseUrl = "https://tripobazar-backend.vercel.app/api/country";
  const {
    data: countryData,
    loading,
    error,
    deleteById,
    updateById,
    addNew,
  } = useApiData(baseUrl);

  const { data: stateList } = useFetch(
    "https://tripobazar-backend.vercel.app/api/state" // Adjust the endpoint for fetching continents
  );

  const [newCountry, setNewCountry] = useState({
    CountryName: "",
    CountryPhotoUrl: "",
    States: [],
  });
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  

  const startEditing = (user) => {
    setEditingUserId(user._id);
    setEditedDetails({ ...user });
  };

  const saveCountry = async () => {
    try {
      await updateById(editingUserId, editedDetails); // Update data via hook
    } catch (error) {
      console.log(error);
    }
    setEditingUserId(null);
  };

  const addCountry = async () => {
    try {
      await addNew(newCountry); // Call the addNew function from hook
      setNewCountry({
        CountryName: "",
        CountryPhotoUrl: "",
        States: [],
      });
      setShowCountryModal(false);
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

  const handleContinentClick = (continentId, continentName) => {
    navigate(`/adminpanel/destination/${continentName}/${continentId}`); // Redirect to the continent-country page
  };

  const handleStateChange = (e) => {
    const selectedStateId = e.target.value;

    if (selectedStateId) {
      const selectedState = stateList.find(
        (state) => state._id === selectedStateId
      );

      if (selectedState) {
        if (editingUserId) {
          // If editing an existing country, update editedDetails.States
          setEditedDetails((prevDetails) => ({
            ...prevDetails,
            States: prevDetails.States
              ? [...prevDetails.States, selectedState]
              : [selectedState],
          }));
        } else {
          // If adding a new country, update newCountry.States
          setNewCountry((prevCountry) => ({
            ...prevCountry,
            States: prevCountry.States
              ? [...prevCountry.States, selectedState]
              : [selectedState],
          }));
        }
      }
    }
  };

  const handleDelete = (id,name) => {
    setModal({
      message: `Are you sure you want to delete this country ${name}?`,
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
          <h3 className="text-med-green font-bold text-xl">Add New Country</h3>
          <button
            onClick={openCountryModal}
            className="bg-med-green text-white rounded-lg px-6 py-2 hover:bg-green-600 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Add Country
          </button>
        </div>

        {showCountryModal && (
          <LocationModal
            type="country"
            handleSelectionChange={handleStateChange}
            addLocation={addCountry}
            list={stateList}
            newLocation={newCountry}
            setNewLocation={setNewCountry}
            closeModal={closeCountryModal}
          />
        )}
      </div>

      <div className="mb-6 flex justify-between">
        <p className="text-med-green font-bold">
          Total data: {countryData?.length}
        </p>
        <p className="text-med-green font-bold">Destination</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 p-2 text-left">Sr.</th>
              <th className="border border-gray-200 p-2 text-left">
                CountryName
              </th>
              <th className="border border-gray-200 p-2 text-left">
                CountryPhoto
              </th>
              <th className="border border-gray-200 p-2 text-left">States</th>
              <th className="border border-gray-200 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {countryData?.map((item, idx) => (
              <tr key={item._id || idx} className="border-b border-gray-200">
                {editingUserId === item._id ? (
                  <>
                    <td className="border border-gray-200 p-2">{idx + 1}</td>
                    <td className="border border-gray-200 p-2">
                      <input
                        type="text"
                        value={editedDetails.CountryName || ""}
                        onChange={(e) =>
                          setEditedDetails({
                            ...editedDetails,
                            CountryName: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      <input
                        type="text"
                        value={editedDetails.CountryPhotoUrl || ""}
                        onChange={(e) =>
                          setEditedDetails({
                            ...editedDetails,
                            CountryPhotoUrl: e.target.value,
                          })
                        }
                        className="w-full border p-2 rounded"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      {editedDetails.States &&
                      editedDetails.States.length > 0 ? (
                        editedDetails.States.map((state, index) => {
                          return (
                            <div
                              key={index}
                              className="inline-flex items-center mb-2 mr-2"
                            >
                              <span
                                key={state._id}
                                className="inline-block relative bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-2 mb-2"
                              >
                                {state.StateName}

                                <button
                                  className="text-red-500 absolute -top-1 -right-1 bg-red-300 rounded-full w-4 h-4 flex justify-center items-center"
                                  onClick={() => {
                                    const updatedStates =
                                      editedDetails.States.filter(
                                        (_, i) => i !== index
                                      );
                                    setEditedDetails({
                                      ...editedDetails,
                                      States: updatedStates,
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
                        <span>No States</span>
                      )}

                      <div className="mt-2">
                        <select
                          onChange={handleStateChange}
                          className="border px-2 py-1 rounded-full bg-gray-100 text-sm"
                        >
                          <option value="">Select State</option>
                          {stateList?.map((state) => (
                            <option key={state._id} value={state._id}>
                              {state.StateName}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="border border-gray-200 p-2">
                      <button
                        className="text-green-400 px-3 py-1 rounded mr-2"
                        onClick={saveCountry}
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
                        handleContinentClick(item._id, item?.CountryName);
                      }}
                      className="border border-gray-200 p-2"
                    >
                      {item?.CountryName}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <img
                        src={item?.CountryPhotoUrl}
                        alt="continentImage"
                        onClick={() => openModal(item?.CountryPhotoUrl)}
                        className="w-40 h-20 cursor-pointer"
                      />
                    </td>
                    <td className="border border-gray-200 p-2">
                      {item?.States.length > 0 ? (
                        item.States.map((state) => (
                          <span
                            key={state._id}
                            className="inline-block bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-2 mb-2"
                          >
                            {state.StateName}
                          </span>
                        ))
                      ) : (
                        <span>No states</span>
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
                        onClick={() => handleDelete(item._id,item.CountryName)}
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

export default AdminCountry;
