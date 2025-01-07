import React, { useState } from "react";
import useApiData from "../../../../hooks/useApiData";
import Loader from "../../Loader";
import useFetch from "../../../../hooks/useFetch";
import AddHotel from "./AddHotel";
import EditHotel from "./EditHotel";
import { IoIosStar } from "react-icons/io";
import ConfirmationModal from "../../ConfirmationModal";
export default function AdminHotel() {
  const [searchInput, setSearchInput] = useState("");
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const [editPackage, setEditPackage] = useState(false);
  const [modal, setModal] = useState(null);

  const baseUrl = "https://tripobazar-backend.vercel.app/api/hotel";
  const {
    data: allHotelData,
    loading: allpackage,
    deleteById,
    updateById,
    addNew,
  } = useApiData(baseUrl);

  const { data, loading } = useFetch(
    `https://tripobazar-backend.vercel.app/api/hotel/${selectedId}`
  );

  const filteredData = allHotelData.filter((item) =>
    item?.hotelName?.toLowerCase().includes(searchInput.toLowerCase())
  );

  const handleDelete = (id,name) => {
    setModal({
      message: `Are you sure you want to delete this ${name}?`,
      onConfirm: () => {
        deleteById(id); // Perform delete operation
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
          <div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsAddingPackage(!isAddingPackage)}
                className="bg-green-600 h-10 py-3 text-center flex items-center hover:scale-95 transition-transform ease-in-out duration-300 text-white font-medium rounded-full px-4 mb-4"
              >
                {isAddingPackage ? "Cancel" : "Add Hotel"}
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
          </div>

          {/* Show AddPackage form when isAddingPackage is true */}
          {isAddingPackage ? (
            <AddHotel setIsAddingPackage={setIsAddingPackage} addNew={addNew} />
          ) : (
            <div>
              {filteredData?.reverse()?.map((item, idx) => (
                <div key={idx}>
                  <ul className="flex flex-col">
                    <li className="relative flex items-center justify-between mb-3 text-med-green rounded-lg overflow-hidden transition-colors ease-in-out duration-300 bg-white p-4">
                      <span
                        onClick={() => setSelectedId(item._id)}
                        className="text-left cursor-pointer text-xl font-semibold"
                      >
                        {item?.hotelName}
                      </span>
                      <div className="flex items-center gap-4">
                        <p className="text-xs text-gray-500">
                          ₹{item?.hotelPrice}/-
                        </p>
                        <img
                          src={item?.hotelPhotoUrl[0]}
                          onClick={() => openModal(item?.hotelPhotoUrl[0])}
                          alt={`state icon`}
                          className="w-10 h-5 cursor-pointer object-cover rounded ml-4"
                        />
                        <button
                          onClick={() => handleDelete(item._id,item.hotelName)}
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
                    <h1 className="text-4xl font-bold mb-2">
                      {data?.hotelName}
                    </h1>
                  </div>
                  <p className="text-lg mb-4">{data?.description}</p>
                  <p className="text-xl font-semibold text-green-600">
                    Price: Rs. {data?.hotelPrice}/-
                  </p>
                  <p className="text-xl flex gap-1 items-center font-semibold ">
                    <span> Rating</span>{" "}
                    <span className="mt-[2px]">{data?.hotelRating}</span>
                    <IoIosStar className="mb-1 text-yellow-300" />
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

                {/* Photos */}
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Photos</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {data?.hotelPhotoUrl.length > 0 ? (
                      data.hotelPhotoUrl.map((photo, index) => (
                        <img
                          key={index}
                          src={photo}
                          alt={`Tour photo ${index + 1}`}
                          className="rounded-lg w-[400px] h-[300px] shadow-md"
                        />
                      ))
                    ) : (
                      <p className="text-black">No Photos of these Hotels</p>
                    )}
                  </div>
                </section>
              </div>
            </div>
          ) : (
            <EditHotel
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
