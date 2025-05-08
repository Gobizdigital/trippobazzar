"use client"

import { X, Search, PlusCircle, MapPin, ChevronDown, Check, Image } from "lucide-react"
import { useRef, useState, useEffect } from "react"

export default function LocationModal({
  type, // e.g., "continent", "country", "state"
  handleSelectionChange,
  addLocation,
  list,
  newLocation,
  setNewLocation,
  closeModal,
}) {
  const modalRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredList, setFilteredList] = useState(list || [])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imagePreview, setImagePreview] = useState("")

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
  }

  const currentConfig = config[type]

  useEffect(() => {
    if (list) {
      setFilteredList(
        list.filter((item) => item[currentConfig.displayKey].toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }
  }, [searchTerm, list, currentConfig.displayKey])

  useEffect(() => {
    // Set image preview when URL changes
    if (newLocation[currentConfig.photoUrlKey] && newLocation[currentConfig.photoUrlKey].trim() !== "") {
      setImagePreview(newLocation[currentConfig.photoUrlKey])
    } else {
      setImagePreview("")
    }
  }, [newLocation, currentConfig.photoUrlKey])

  const handleItemSelect = (item) => {
    if (type !== "state") {
      const isAlreadySelected = newLocation[currentConfig.listLabel]?.some((selected) => selected._id === item._id)

      if (!isAlreadySelected) {
        setNewLocation({
          ...newLocation,
          [currentConfig.listLabel]: [...(newLocation[currentConfig.listLabel] || []), item],
        })
      }
    }
  }

  const removeSelectedItem = (itemId) => {
    setNewLocation({
      ...newLocation,
      [currentConfig.listLabel]: newLocation[currentConfig.listLabel].filter((item) => item._id !== itemId),
    })
  }

  const handleClickOutside = (e) => {
    if (isDropdownOpen && !e.target.closest(".search-dropdown")) {
      setIsDropdownOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div
      onClick={(e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
          closeModal()
        }
      }}
      className="fixed inset-0 flex justify-center items-center bg-black/60 backdrop-blur-sm z-50 p-4"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden transition-all duration-300 transform"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{currentConfig.title}</h2>
            <button onClick={closeModal} className="text-white hover:bg-white/20 rounded-full p-2 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-emerald-100 mt-1 text-sm">Fill in the details below to add a new {type.toLowerCase()}</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Name Input */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
              {currentConfig.namePlaceholder}
            </label>
            <input
              type="text"
              placeholder={`Enter ${currentConfig.namePlaceholder.toLowerCase()}`}
              value={newLocation[currentConfig.nameKey]}
              onChange={(e) =>
                setNewLocation({
                  ...newLocation,
                  [currentConfig.nameKey]: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none shadow-sm"
            />
          </div>

          {/* Photo URL Input with Preview */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-medium text-gray-700">
              <Image className="w-4 h-4 mr-2 text-emerald-500" />
              {currentConfig.photoPlaceholder}
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder={`Enter ${currentConfig.photoPlaceholder.toLowerCase()}`}
                value={newLocation[currentConfig.photoUrlKey]}
                onChange={(e) =>
                  setNewLocation({
                    ...newLocation,
                    [currentConfig.photoUrlKey]: e.target.value,
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none shadow-sm"
              />
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-2 relative">
                <div className="relative rounded-lg overflow-hidden border border-gray-200 w-full h-32">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = "https://via.placeholder.com/400x200?text=Invalid+Image+URL"
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <span className="text-white text-xs p-2">Image Preview</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Select */}
          {type !== "state" && list && (
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <ChevronDown className="w-4 h-4 mr-2 text-emerald-500" />
                Select {currentConfig.listLabel}
              </label>
              <div className="relative search-dropdown">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${currentConfig.listLabel}`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsDropdownOpen(true)}
                    className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 outline-none shadow-sm"
                  />
                  <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>

                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredList.length > 0 ? (
                      filteredList.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => {
                            handleItemSelect(item)
                            setSearchTerm("")
                          }}
                          className="px-4 py-2.5 hover:bg-emerald-50 cursor-pointer flex items-center justify-between border-b border-gray-100 last:border-0"
                        >
                          <span>{item[currentConfig.displayKey]}</span>
                          <PlusCircle className="w-5 h-5 text-emerald-500" />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {searchTerm ? "No results found" : "Type to search"}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Selected Items */}
          {type !== "state" && newLocation[currentConfig.listLabel]?.length > 0 && (
            <div className="space-y-2">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <Check className="w-4 h-4 mr-2 text-emerald-500" />
                Selected {currentConfig.listLabel}
              </label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[60px]">
                {newLocation[currentConfig.listLabel]?.map((item) => {
                  const selectedItem = list?.find((listItem) => listItem._id === item._id) || item

                  return (
                    <div
                      key={item._id}
                      className="inline-flex items-center bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm group transition-all hover:bg-emerald-200"
                    >
                      <span>{selectedItem[currentConfig.displayKey]}</span>
                      <button
                        onClick={() => removeSelectedItem(item._id)}
                        className="ml-1.5 text-emerald-600 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-5 flex justify-end gap-3 border-t">
          <button
            onClick={closeModal}
            className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={addLocation}
            disabled={!newLocation[currentConfig.nameKey]}
            className={`px-5 py-2.5 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition-colors font-medium flex items-center ${
              !newLocation[currentConfig.nameKey] ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        </div>
      </div>
    </div>
  )
}
