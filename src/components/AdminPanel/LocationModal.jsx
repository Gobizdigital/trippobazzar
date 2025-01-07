import React, { useRef } from "react";

export default function LocationModal({
  type, // e.g., "continent", "country", "state"
  handleSelectionChange,
  addLocation,
  list,
  newLocation,
  setNewLocation,
  closeModal,
}) {
  const modalRef = useRef(null);

  const config = {
    continent: {
      title: "Add New Continent",
      namePlaceholder: "Continent Name",
      photoPlaceholder: "Continent Photo URL",
      listLabel: "Countries",
      nameKey: "ContinentName",
      photoUrlKey: "ContinentPhotoUrl",
      displayKey: "CountryName",
    },
    country: {
      title: "Add New Country",
      namePlaceholder: "Country Name",
      photoPlaceholder: "Country Photo URL",
      listLabel: "States",
      nameKey: "CountryName",
      photoUrlKey: "CountryPhotoUrl",
      displayKey: "StateName",
    },
    state: {
      title: "Add New State",
      namePlaceholder: "State Name",
      photoPlaceholder: "State Photo URL",
      listLabel: "Cities",
      nameKey: "StateName",
      photoUrlKey: "StatePhotoUrl",
      displayKey: "CityName",
    },
  };

  const currentConfig = config[type];

  return (
    <div
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          closeModal();
        }
      }}
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center backdrop-blur-sm bg-black bg-opacity-50 z-50"
    >
      <div
        ref={modalRef}
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-max"
      >
        <h2 className="text-xl font-semibold mb-4">{currentConfig.title}</h2>

        <input
          type="text"
          placeholder={currentConfig.namePlaceholder}
          value={newLocation[currentConfig.nameKey]}
          onChange={(e) =>
            setNewLocation({
              ...newLocation,
              [currentConfig.nameKey]: e.target.value,
            })
          }
          className="border p-2 rounded w-full mb-4"
        />

        <input
          type="text"
          placeholder={currentConfig.photoPlaceholder}
          value={newLocation[currentConfig.photoUrlKey]}
          onChange={(e) =>
            setNewLocation({
              ...newLocation,
              [currentConfig.photoUrlKey]: e.target.value,
            })
          }
          className="border p-2 rounded w-full mb-4"
        />

        {/* Multi-select dropdown */}
        {type !== "state" && list && (
          <div className="relative inline-block w-full mb-4">
            <select
              multiple
              onChange={handleSelectionChange}
              className="appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-med-green"
            >
              {list?.map((item) => (
                <option key={item._id} value={item._id}>
                  {item[currentConfig.displayKey]}
                </option>
              ))}
            </select>
          </div>
        )}

        {type !== "state" && list && (
          <div className="mt-2 flex flex-wrap gap-2 w-full">
            {newLocation[currentConfig.listLabel]?.map((name, index) => {
              const selectedItem = list?.find((item) => item._id === name._id);

              return (
                selectedItem && (
                  <span
                    key={index}
                    className="inline-block bg-blue-100 text-blue-800 py-1 px-3 rounded-full text-sm"
                  >
                    {selectedItem[currentConfig.displayKey]}
                  </span>
                )
              );
            })}
          </div>
        )}

        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={closeModal}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={addLocation}
            className="bg-green-400 text-white px-4 py-2 rounded"
          >
            Add {currentConfig.title.split(" ")[2]} {/* Dynamic button text */}
          </button>
        </div>
      </div>
    </div>
  );
}
