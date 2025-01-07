import React, { useEffect, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import Spinner from "../../../../utils/Spinner";
import useApiData from "../../../../hooks/useApiData";
import ImageModal from "../../../../utils/ImageModal";
import ViewAndAddAllState from "./EditAndViewAllState";
import Loader from "../../Loader";

export default function AdminState() {
  const [selectedId, setSelectedId] = useState();
  const [stateData, setStateData] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedDetails, setEditedDetails] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
    setSelectedImage(imageUrl); // Set the selected image URL
    setShowModal(true); // Show the modal
  };

  const deleteState = (id) => {
    deleteById(id);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  console.log(packageData);

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
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
            <div className="flex flex-col items-start">
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
                className="mb-3 p-2 text-2xl font-semibold text-med-green bg-light-gray rounded-md shadow-sm"
              />
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
                className="mb-5 p-2 text-lg text-gray-600 bg-light-gray rounded-md shadow-sm"
              />
              {editedDetails.Packages && editedDetails.Packages.length > 0 ? (
                editedDetails.Packages.map((pack, index) => {
                  return (
                    <div
                      key={index}
                      className="inline-flex items-center  mb-2 mr-2"
                    >
                      <span
                        key={pack._id}
                        className="inline-block relative bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm mr-4"
                      >
                        {pack.title}

                        <button
                          className="text-red-500 absolute -top-1 -right-1 bg-red-300 rounded-full w-4 h-4 flex justify-center items-center"
                          onClick={() => {
                            const updatedPackages =
                              editedDetails.Packages.filter(
                                (packid) => packid._id !== pack._id // Filter by state ID
                              );
                            setEditedDetails({
                              ...editedDetails,
                              Packages: updatedPackages,
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
                <p className="mb-4">No Packages selected.</p>
              )}

              <div className="mb-2 w-full">
                <ul className="w-full">
                  {packageData?.map((packag) => (
                    <li
                      key={packag._id}
                      className="cursor-pointer list-decimal p-2 w-full bg-gray-100 rounded-md hover:bg-gray-200"
                      onClick={() => {
                        // Check if the package is already added
                        if (
                          !editedDetails.Packages.some(
                            (pkg) => pkg._id === packag._id
                          )
                        ) {
                          setEditedDetails({
                            ...editedDetails,
                            Packages: [...editedDetails.Packages, packag],
                          });
                        }
                      }}
                    >
                      <span className="mr-4">{packag.title}</span>
                      <span className="text-gray-600">
                        [{packag.description}]
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setEditingUserId(null);
                  }}
                  className="px-4 py-2 bg-red-700 text-xs text-white font-semibold rounded-md hover:underline transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={saveState}
                  className="px-4 py-2 bg-med-green text-xs text-white font-semibold rounded-md hover:underline transition-all duration-300"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex justify-between items-start mb-8 bg-white p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-start max-w-xl">
                  <h1 className="mb-5 font-semibold text-7xl text-med-green italic text-left bg-light-gray p-6 rounded-lg shadow-md">
                    {stateData.StateName}
                  </h1>
                  <div className="flex gap-4 items-center">
                    <button
                      onClick={() => {
                        startEditing(stateData);
                      }}
                      className="px-4 py-2 bg-blue-500 text-xs text-white font-semibold rounded-md hover:underline transition-all duration-300"
                    >
                      Edit State
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(null);
                      }}
                      className="px-4 py-2 bg-red-700 text-xs text-white font-semibold rounded-md hover:underline transition-all duration-300"
                    >
                      Back
                    </button>
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <img
                    src={stateData.StatePhotoUrl}
                    alt={stateData.StateName}
                    className="max-w-xl h-auto rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                  />
                </div>
              </div>
              <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
                <div>
                  <p className="font-semibold italic text-med-green mb-4">
                    All Packages
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                  {stateData?.Packages?.map((item, idx) => (
                    <div
                      key={idx}
                      className=" rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <div className="w-full h-32 p-0">
                        <img
                          src={item.MainPhotos[0]} // Assuming `item.imageUrl` holds the package image URL
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-xl font-semibold mb-2">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{item.description}</p>
                        <p className="text-med-green font-bold mb-4">
                          Rs{item.price}
                        </p>
                        <ul className="mb-4 flex flex-wrap gap-4 text-gray-600">
                          {item.whatsIncluded?.map((includedItem, index) => (
                            <li key={index}>{includedItem}</li>
                          ))}
                        </ul>
                        <div className="flex justify-between">
                          <button className="bg-med-green text-white rounded-lg w-full py-2 hover:bg-green-600 transition-all duration-300">
                            View More
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
