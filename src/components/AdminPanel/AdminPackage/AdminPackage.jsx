import React, { useState } from "react";
import useApiData from "../../../../hooks/useApiData";

import useFetch from "../../../../hooks/useFetch";
import EditPackage from "./EditPackage";
import AddPackage from "./AddPackage";
import Loader from "../../Loader";
import ConfirmationModal from "../../ConfirmationModal";

export default function AdminPackage() {
  const [selectedId, setSelectedId] = useState();
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [modal, setModal] = useState(null);

  // Filter the data based on user input

  const [editPackage, setEditPackage] = useState(false);
  const baseUrl = "https://tripobazar-backend.vercel.app/api/package";
  const {
    data: allStateData,
    loading: allpackage,
    deleteById,
    updateById,
    addNew,
  } = useApiData(baseUrl);

  const { data, loading } = useFetch(
    `https://tripobazar-backend.vercel.app/api/package/${selectedId}`
  );

  const filteredData = allStateData.filter((item) =>
    item?.title?.toLowerCase().includes(searchInput.toLowerCase())
  );
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

  if (allpackage || loading) {
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
      {!selectedId ? (
        <div>
          {/* Button to show AddPackage form */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => setIsAddingPackage(!isAddingPackage)}
              className="bg-green-600 h-10 py-3 text-center flex items-center hover:scale-95 transition-transform ease-in-out duration-300 text-white font-medium rounded-full px-4 mb-4"
            >
              {isAddingPackage ? "Cancel" : "Add Package"}
            </button>

            {!isAddingPackage && (
              <input
                type="text"
                placeholder="Search by Title"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="mb-4 p-2 border border-black outline-none rounded w-[85%]"
              />
            )}
          </div>

          {/* Show AddPackage form when isAddingPackage is true */}
          {isAddingPackage ? (
            <AddPackage
              setIsAddingPackage={setIsAddingPackage}
              addNew={addNew}
            />
          ) : (
            <div>
              {filteredData?.map((item, idx) => (
                <div key={idx}>
                  <ul className="flex flex-col">
                    <li className="relative flex items-center justify-between mb-3 text-med-green rounded-lg overflow-hidden transition-colors ease-in-out duration-300 bg-white p-4">
                      <span
                        onClick={() => setSelectedId(item._id)}
                        className="text-left cursor-pointer text-xl font-semibold"
                      >
                        {item?.title}
                      </span>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-gray-500">
                          {item?.description}
                        </p>
                        <img
                          src={item?.MainPhotos[0]}
                          onClick={() => openModal(item?.MainPhotos[0])}
                          alt={`state icon`}
                          className="w-10 h-5 cursor-pointer object-cover rounded ml-4"
                        />
                        <button
                          onClick={() => handleDelete(item._id,item.title)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {!editPackage ? (
            <div className="bg-gray-50 text-gray-900">
              <div className="container mx-auto p-6">
                {/* Title and Description */}
                <section className="mb-8 relative">
                  <div className="flex justify-between items-center">
                    <h1 className="text-4xl font-bold mb-2">{data?.title}</h1>
                  </div>
                  <p className="text-lg mb-4">{data?.description}</p>
                  <p className="text-xl font-semibold text-green-600">
                    Price: Rs. {data?.price}/-
                  </p>

                  <div className="absolute top-1 right-0 flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setEditPackage(true);
                      }}
                      className="bg-blue-600 h-10 py-3 text-center flex items-center hover:scale-95 transition-transform ease-in-out duration-300 text-white font-medium rounded-full px-4"
                    >
                      Edit Package
                    </button>
                    <button
                      onClick={() => {
                        setSelectedId(null);
                      }}
                      className="bg-red-600 h-10 py-3 text-center flex items-center hover:scale-95 transition-transform ease-in-out duration-300 text-white font-medium rounded-full px-4"
                    >
                      Back
                    </button>
                  </div>
                </section>

                {/* What's Included */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">What's Included</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {data?.whatsIncluded.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Coupon Codes */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Available Coupons</h2>
                  <ul className="flex space-x-2">
                    {data?.coupon.map((code, index) => (
                      <li
                        key={index}
                        className="bg-blue-200 text-blue-800 px-3 py-1 rounded-lg"
                      >
                        {code}
                      </li>
                    ))}
                  </ul>
                </section>

                {/* Photos */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Photos</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {data?.MainPhotos?.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Tour photo ${index + 1}`}
                        className="rounded-lg w-[400px] h-[300px] shadow-md"
                      />
                    ))}
                  </div>
                </section>

                {/* Itinerary */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
                  {data?.dayDescription.map((day, index) => (
                    <div key={index} className="mb-6">
                      <h3 className="text-xl font-semibold mb-2">
                        {day.dayTitle}
                      </h3>
                      <p className="text-gray-700 mb-4 whitespace-pre-line">
                        {day.dayDetails}
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        {day?.photos.map((photo, photoIndex) => (
                          <img
                            key={photoIndex}
                            src={photo}
                            alt={`Day ${index + 1} photo ${photoIndex + 1}`}
                            className="rounded-lg w-full h-[300px] shadow-md"
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </section>

                {/* Special Instructions */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Special Instructions
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {data?.specialInstruction}
                  </p>
                </section>

                {/* Conditions of Travel */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Conditions of Travel
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {data?.conditionOfTravel}
                  </p>
                </section>

                {/* Things to Maintain */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Things to Maintain
                  </h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {data?.thingsToMaintain}
                  </p>
                </section>

                {/* Hotels */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Hotels</h2>
                  {data?.hotels?.map((hotel, index) => (
                    <div key={index} className="mb-4">
                      <h3 className="text-lg font-semibold">
                        {hotel.location}
                      </h3>
                      <ul className="list-disc list-inside space-y-1">
                        {hotel?.hotelDetails?.map((detail, detailIndex) => (
                          <li key={detailIndex} className="text-gray-700">
                            {detail.hotelName}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </section>

                {/* Policies */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Policies</h2>
                  <p className="text-gray-700 whitespace-pre-line">
                    {data?.policies}
                  </p>
                </section>

                {/* Terms and Conditions */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">
                    Terms and Conditions
                  </h2>

                  <p className="text-gray-700 whitespace-pre-line">
                    {data?.termsAndConditions}
                  </p>
                </section>
              </div>
            </div>
          ) : (
            <EditPackage
              setEditPackage={setEditPackage}
              setSelectedId={setSelectedId}
              id={selectedId}
              updateById={updateById}
              initialData={data}
            />
          )}
        </>
      )}
    </>
  );
}
