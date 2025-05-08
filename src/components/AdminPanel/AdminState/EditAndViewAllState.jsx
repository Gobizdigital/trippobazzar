"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Eye, Search, MapPin, Globe, ArrowUpRight, Loader2 } from 'lucide-react'
import LocationModal from "../LocationModal"
import ConfirmationModal from "../../ConfirmationModal"

export default function ViewAndAddAllState({
  addNew,
  allStateData,
  deleteState,
  setSelectedId,
  openModal
}) {
  const [showStateModal, setShowStateModal] = useState(false)
  const [newState, setNewState] = useState({
    StateName: "",
    StatePhotoUrl: "",
    Packages: [],
  })
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredStates, setFilteredStates] = useState([])
  const [viewMode, setViewMode] = useState("grid") // grid or list

  useEffect(() => {
    if (allStateData) {
      setFilteredStates(
        allStateData.filter(state => 
          state.StateName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }, [searchTerm, allStateData])

  const closeStateModal = () => {
    setShowStateModal(false)
    setNewState({ StateName: "", StatePhotoUrl: "", Packages: [] })
  }

  const openStateModal = () => {
    setShowStateModal(true)
  }

  const addCountry = async () => {
    try {
      setLoading(true)
      await addNew(newState)
      setNewState({ StateName: "", StatePhotoUrl: "", Packages: [] })
      setShowStateModal(false)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id, name) => {
    setModal({
      message: `Are you sure you want to delete ${name}?`,
      onConfirm: () => {
        deleteState(id)
        setModal(null)
      },
      onCancel: () => setModal(null),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-600 font-medium">Processing...</span>
      </div>
    )
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
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-6 mb-6 border border-green-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-green-700 font-bold text-2xl flex items-center">
              <Globe className="mr-2 h-6 w-6 text-green-600" />
              Destination States
            </h3>
            <p className="text-gray-600 mt-1">Manage your travel destinations</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <button 
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-l-lg border border-r-0 ${viewMode === "grid" 
                  ? "bg-green-600 text-white border-green-600" 
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-r-lg border ${viewMode === "list" 
                  ? "bg-green-600 text-white border-green-600" 
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
            <button
              onClick={openStateModal}
              className="bg-green-600 text-white rounded-lg px-6 py-2.5 hover:bg-green-700 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center"
              disabled={loading}
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New State
            </button>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search states..."
            className="pl-10 pr-4 py-3 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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

      {filteredStates?.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
          <div className="flex flex-col items-center justify-center">
            <MapPin className="h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-lg mb-2">No states found</p>
            <p className="text-gray-400 mb-4">
              {searchTerm ? "Try a different search term" : "Add your first state to get started"}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="text-green-600 hover:text-green-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStates?.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 group"
            >
              <div 
                className="h-40 bg-gray-200 relative overflow-hidden"
                onClick={() => openModal(item?.StatePhotoUrl)}
              >
                <img
                  src={item?.StatePhotoUrl || "/placeholder.svg"}
                  alt={`${item?.StateName} thumbnail`}
                  className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(item._id);
                  }}
                  className="absolute bottom-3 right-3 p-2 bg-white/90 text-blue-600 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-blue-600 hover:text-white"
                  title="View details"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 
                      className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-green-600 transition-colors flex items-center"
                      onClick={() => setSelectedId(item._id)}
                    >
                      <MapPin className="w-4 h-4 mr-1 text-green-600 flex-shrink-0" />
                      {item?.StateName}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {item?.Packages?.length || 0} packages available
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleDelete(item._id, item.StateName)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Delete state"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <button
                    onClick={() => setSelectedId(item._id)}
                    className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                  >
                    View Details
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                  
                  <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
            <div className="col-span-6 md:col-span-5">State</div>
            <div className="col-span-3 md:col-span-4 hidden md:block">Packages</div>
            <div className="col-span-3 md:col-span-2">Status</div>
            <div className="col-span-3 md:col-span-1 text-right">Actions</div>
          </div>
          
          {filteredStates?.map((item, idx) => (
            <div 
              key={idx} 
              className={`grid grid-cols-12 gap-4 p-4 items-center ${idx !== filteredStates.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}
            >
              <div className="col-span-6 md:col-span-5 flex items-center">
                <div 
                  className="w-12 h-12 rounded-md overflow-hidden mr-3 flex-shrink-0 border border-gray-200"
                  onClick={() => openModal(item?.StatePhotoUrl)}
                >
                  <img
                    src={item?.StatePhotoUrl || "/placeholder.svg"}
                    alt={`${item?.StateName} thumbnail`}
                    className="w-full h-full object-cover cursor-pointer"
                  />
                </div>
                <div>
                  <h3 
                    className="font-medium text-gray-800 cursor-pointer hover:text-green-600 transition-colors"
                    onClick={() => setSelectedId(item._id)}
                  >
                    {item?.StateName}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5 md:hidden">
                    {item?.Packages?.length || 0} packages
                  </p>
                </div>
              </div>
              
              <div className="col-span-3 md:col-span-4 hidden md:block">
                <div className="flex items-center">
                  <span className="text-gray-700">{item?.Packages?.length || 0} packages</span>
                  {item?.Packages?.length > 0 && (
                    <div className="ml-2 flex -space-x-2">
                      {[...Array(Math.min(3, item?.Packages?.length))].map((_, i) => (
                        <div key={i} className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                          P
                        </div>
                      ))}
                      {item?.Packages?.length > 3 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                          +{item?.Packages?.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="col-span-3 md:col-span-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-green-600"></span>
                  Active
                </span>
              </div>
              
              <div className="col-span-3 md:col-span-1 flex items-center justify-end gap-1">
                <button
                  onClick={() => setSelectedId(item._id)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item._id, item.StateName)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                  title="Delete state"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
