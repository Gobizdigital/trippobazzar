"use client"

import { useState } from "react"
import useApiData from "../../../../hooks/useApiData"
import Loader from "../../Loader"
import useFetch from "../../../../hooks/useFetch"
import AddHotel from "./AddHotel"
import EditHotel from "./EditHotel"
import { IoIosStar } from "react-icons/io"
import ConfirmationModal from "../../ConfirmationModal"

export default function AdminHotel() {
  const [searchInput, setSearchInput] = useState("")
  const [isAddingPackage, setIsAddingPackage] = useState(false)
  const [selectedId, setSelectedId] = useState()
  const [editPackage, setEditPackage] = useState(false)
  const [modal, setModal] = useState(null)

  const baseUrl = "https://trippo-bazzar-backend.vercel.app/api/hotel"
  const { data: allHotelData, loading: allpackage, deleteById, updateById, addNew } = useApiData(baseUrl)

  const { data, loading } = useFetch(`https://trippo-bazzar-backend.vercel.app/api/hotel/${selectedId}`)

  const filteredData = allHotelData.filter((item) => item?.hotelName?.toLowerCase().includes(searchInput.toLowerCase()))

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete this ${name}?`,
      onConfirm: () => {
        deleteById(id)
        setModal(null)
      },
      onCancel: () => setModal(null),
    })
  }

  if (allpackage || loading) {
    return <Loader />
  }

  return (
    <>
      {modal && <ConfirmationModal message={modal.message} onConfirm={modal.onConfirm} onCancel={modal.onCancel} />}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Hotel Management</h1>

        {!selectedId ? (
          <div>
            {/* Header with Add/Search */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              <button
                onClick={() => setIsAddingPackage(!isAddingPackage)}
                className={`${
                  isAddingPackage ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                } text-white font-medium rounded-full px-6 py-2.5 transition-all duration-300 flex items-center gap-2 shadow-sm`}
              >
                {isAddingPackage ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Hotel
                  </>
                )}
              </button>

              {!isAddingPackage && (
                <div className="relative w-full sm:w-auto">
                  <input
                    type="text"
                    placeholder="Search hotels..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full sm:w-80 pl-10 pr-4 py-2.5 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-400 absolute left-3 top-3"
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
              )}
            </div>

            {/* Add Hotel Form or Hotel List */}
            {isAddingPackage ? (
              <AddHotel setIsAddingPackage={setIsAddingPackage} addNew={addNew} />
            ) : (
              <div className="space-y-3 mt-4">
                {filteredData.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    No hotels found. Add a new hotel or try a different search.
                  </div>
                ) : (
                  filteredData?.reverse()?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4">
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {item?.hotelPhotoUrl[0] ? (
                            <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={item?.hotelPhotoUrl[0] || "/placeholder.svg"}
                                alt={item?.hotelName}
                                className="h-full w-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="h-16 w-24 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                              </svg>
                            </div>
                          )}

                          <div className="flex-1">
                            <h3
                              onClick={() => setSelectedId(item._id)}
                              className="text-lg font-semibold text-gray-800 hover:text-blue-600 cursor-pointer transition-colors"
                            >
                              {item?.hotelName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              {/* <span className="text-sm text-gray-500">₹{item?.hotelPrice}</span> */}
                              {item?.hotelRating && (
                                <div className="flex items-center bg-yellow-100 px-2 py-0.5 rounded text-sm">
                                  <IoIosStar className="text-yellow-500 mr-1" />
                                  <span className="font-medium">{item?.hotelRating}</span>
                                </div>
                              )}
                              {item?.hotelType && (
                                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                                  {item?.hotelType}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => setSelectedId(item._id)}
                            className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(item._id, item.hotelName)}
                            className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            {editPackage ? (
              <EditHotel
                setEditPackage={setEditPackage}
                setSelectedId={setSelectedId}
                id={selectedId}
                updateById={updateById}
                initialData={data}
              />
            ) : (
              <>
                {/* Hotel Detail View */}
                <div className="relative">
                  {/* Header Image */}
                  
                
                  {/* Action Buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => setEditPackage(true)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
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
                      Edit
                    </button>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md flex items-center gap-1"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                      </svg>
                      Back
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Hotel Info */}
                  <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">{data?.hotelName}</h1>

                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      {/* {data?.hotelPrice && (
                        <div className="flex items-center gap-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span className="text-lg font-semibold text-green-600">₹{data?.hotelPrice}</span>
                        </div>
                      )} */}

                      {data?.hotelRating && (
                        <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                          <span className="text-gray-700 font-medium">{data?.hotelRating}</span>
                          <IoIosStar className="text-yellow-500" />
                        </div>
                      )}

                      {data?.hotelType && (
                        <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                          {data?.hotelType}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photos Gallery */}
                  {data?.hotelPhotoUrl && data?.hotelPhotoUrl.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Photo Gallery
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {data.hotelPhotoUrl.map(
                          (photo, index) =>
                            photo && (
                              <div
                                key={index}
                                className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 aspect-video"
                              >
                                <img
                                  src={photo || "/placeholder.svg"}
                                  alt={`${data?.hotelName} photo ${index + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  )
}
