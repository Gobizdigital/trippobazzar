import React, { useState } from "react";
import LocationModal from "../LocationModal";
import Spinner from "../../../../utils/Spinner";
import Loader from "../../Loader";
import ConfirmationModal from "../../ConfirmationModal";

export default function ViewAndAddAllState({
  addNew,
  allStateData,
  deleteState,
  setSelectedId,
  openModal
}) {
  const [showStateModal, setShowStateModal] = useState(false);
  const [newState, setNewState] = useState({
    StateName: "",
    StatePhotoUrl: "",
    Packages: [],
  });
  const [loading, setLoading] = useState(false); // Loading state to track the process
  const [modal, setModal] = useState(null);

  const closeStateModal = () => {
    setShowStateModal(false);
    setNewState({ StateName: "", StatePhotoUrl: "" });
  };

  const openStateModal = () => {
    setShowStateModal(true);
  };

  const addCountry = async () => {
    try {
      setLoading(true); // Set loading state to true when starting the process
      await addNew(newState); // Call addNew function to add the new state
      setNewState({ StateName: "", StatePhotoUrl: "", Packages: [] });
      setShowStateModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Reset loading state after the operation is done
    }
  };

  const handleDelete = (id,name) => {
    setModal({
      message: `Are you sure you want to delete this ${name}?`,
      onConfirm: () => {
        deleteState(id); // Perform delete operation
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
      <div className="mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-med-green font-bold text-xl">Add New State</h3>
          <button
            onClick={openStateModal}
            className="bg-med-green text-white rounded-lg px-6 py-2 hover:bg-green-600 transition-all duration-300 shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Adding..." : "Add State"}{" "}
            {/* Show different text based on loading state */}
          </button>
        </div>

        {showStateModal && (
          <LocationModal
            type="state"
            addLocation={addCountry}
            newLocation={newState}
            setNewLocation={setNewState}
            closeModal={closeStateModal}
          />
        )}
      </div>

      {/* Displaying all state data */}
      {allStateData?.map((item, idx) => (
        <div key={idx}>
          <ul className="flex flex-col">
            <li className="relative flex items-center justify-between mb-3 text-med-green rounded-lg overflow-hidden transition-colors ease-in-out duration-300 bg-white p-4">
              <span
                onClick={() => setSelectedId(item._id)}
                className="text-left cursor-pointer text-xl font-semibold"
              >
                {item?.StateName}
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={item?.StatePhotoUrl}
                  onClick={() => openModal(item?.StatePhotoUrl)}
                  alt={`state icon`}
                  className="w-10 h-5 cursor-pointer object-cover rounded ml-4"
                />
                <button
                  onClick={() => handleDelete(item._id,item.StateName)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
      ))}
    </>
  );
}
