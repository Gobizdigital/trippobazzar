"use client"

import { useEffect, useMemo, useState } from "react"
import { FaStar } from "react-icons/fa"
import { IoCloseOutline } from "react-icons/io5"
import { useSearch } from "../../../context/SearchContext"

export default function FilterBox({ onClose, style, showModal }) {
  const [isVisible, setIsVisible] = useState(showModal)
  const { filterProp, setFilterProp } = useSearch()

  const checkboxOptions = [
    { name: "lessThan50000", label: "Less than ₹50,000" },
    { name: "between500000And1000000", label: "₹5,00,000 - ₹10,00,000" },
    { name: "between1000000And1500000", label: "₹10,00,000 - ₹15,00,000" },
    { name: "moreThan1500000", label: "More than ₹15,00,000" },
  ]

  const checkboxPreferences = [
    { name: "hotelstay", label: "Hotel stay" },
    { name: "meals", label: "Meals" },
    { name: "localtransport", label: "Local transport" },
    { name: "sightseeing", label: "Sightseeing" },
  ]

  const flightInclusive = [
    { value: "withoutflight", label: "Without Flight" },
    { value: "withflight", label: "With Flight" },
  ]

  const ThemePreferences = [
    { name: "architecture", label: "Architecture" },
    { name: "artsandentertainment", label: "Arts and Entertainment" },
    { name: "history", label: "History" },
    { name: "inventions", label: "Inventions" },
    { name: "religion", label: "Religion" },
    { name: "music", label: "Music" },
    { name: "sports", label: "Sports" },
  ]

  const handleChange = (event, type) => {
    const { name, value, checked } = event.target
    setFilterProp((prevValues) => {
      switch (type) {
        case "checkbox":
          return {
            ...prevValues,
            checkboxes: {
              ...prevValues.checkboxes,
              [name]: checked,
            },
          }
        case "preferences":
          return {
            ...prevValues,
            selectPreferences: {
              ...prevValues.selectPreferences,
              [name]: checked,
            },
          }
        case "theme":
          return {
            ...prevValues,
            themePreferences: {
              ...prevValues.themePreferences,
              [name]: checked,
            },
          }
        case "range":
          return {
            ...prevValues,
            range: value,
          }
        case "sort":
          return {
            ...prevValues,
            sortBy: value,
          }
        case "visa":
          return {
            ...prevValues,
            visaIncluded: checked,
          }
        case "reviews":
          return {
            ...prevValues,
            reviews: value,
          }
        default:
          return prevValues
      }
    })
  }

  const sliderBackground = useMemo(() => {
    const sliderValue = filterProp.range
    const percentage = ((sliderValue - 0) / (10 - 0)) * 100
    return `linear-gradient(90deg, #59cfd8 ${percentage}%, #ccc ${percentage}%)`
  }, [filterProp.range])

  const getReviewBackground = useMemo(() => {
    const ReviewValue = filterProp.reviews
    const percentage = ((ReviewValue - 0) / (5 - 0)) * 100
    return `linear-gradient(to right, #03B58B ${percentage}%, #ddd ${percentage}%)`
  }, [filterProp.reviews])

  const handleSubmit = (event) => {
    event.preventDefault()
    setFilterProp((prev) => ({ ...prev, ...filterProp }))
    onClose()
  }

  const resetButton = () => {
    setFilterProp({
      range: "0",
      checkboxes: {
        lessThan50000: false,
        between500000And1000000: false,
        between1000000And1500000: false,
        moreThan1500000: false,
      },
      reviews: "0",
      sortBy: "withoutflight",
      visaIncluded: false,
      selectPreferences: {
        hotelstay: false,
        meals: false,
        localtransport: false,
        sightseeing: false,
      },
      themePreferences: {
        architecture: false,
        artsandentertainment: false,
        history: false,
        inventions: false,
        religion: false,
        music: false,
        sports: false,
      },
    })
  }

  useEffect(() => {
    if (showModal) {
      setIsVisible(true)
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden"
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 300)
      // Re-enable body scrolling when modal is closed
      document.body.style.overflow = "auto"
      return () => clearTimeout(timeout)
    }
  }, [showModal])

  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center overflow-hidden"
      style={{
        opacity: showModal ? 1 : 0,
        visibility: showModal ? "visible" : "hidden",
        transition: "opacity 300ms ease-in-out, visibility 300ms ease-in-out",
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-3xl mx-auto my-6 h-[90vh] flex flex-col">
        <div className="bg-white rounded-lg shadow-xl flex flex-col h-full overflow-hidden">
          <form onSubmit={handleSubmit} className="flex flex-col h-full">
            {/* Modal Header - Fixed at top */}
            <div className="sticky top-0 z-10 bg-white py-4 px-6 flex justify-between items-center border-b shadow-sm">
              <h2 className="text-xl font-bold uppercase text-gray-800">Filters</h2>
              <button type="button" onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <IoCloseOutline className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-8">
                {/* Duration Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-medium text-lg mb-4 text-gray-800">Duration</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={filterProp.range}
                      onChange={(e) => handleChange(e, "range")}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: sliderBackground,
                        WebkitAppearance: "none",
                      }}
                    />
                    <p className="text-gray-600 mt-2 font-medium">{filterProp.range} days</p>
                  </div>
                </div>

                {/* Budget Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-medium text-lg mb-4 text-gray-800">Budget</h3>
                  <div className="space-y-3">
                    {checkboxOptions.map((option, idx) => (
                      <div className="flex items-center justify-between" key={idx}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              name={option.name}
                              checked={filterProp.checkboxes[option.name]}
                              onChange={(e) => handleChange(e, "checkbox")}
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors"></div>
                            <div className="absolute text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                        <p className="text-gray-500 text-sm">(23)</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Reviews Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-medium text-lg mb-4 text-gray-800">Customer Reviews</h3>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={filterProp.reviews}
                      onChange={(e) => handleChange(e, "reviews")}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: getReviewBackground,
                        WebkitAppearance: "none",
                      }}
                    />
                    <div className="flex items-center gap-1 mt-2">
                      <p className="text-lg font-medium">{filterProp.reviews}</p>
                      <FaStar className="text-yellow-400 text-lg" />
                    </div>
                  </div>
                </div>

                {/* Flight Inclusive Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-medium text-lg mb-4 text-gray-800">Flight Inclusive</h3>
                  <div className="flex flex-wrap gap-6">
                    {flightInclusive.map((option) => (
                      <label className="flex items-center gap-3 cursor-pointer" key={option.value}>
                        <div className="relative flex items-center">
                          <input
                            type="radio"
                            name="sortBy"
                            value={option.value}
                            checked={filterProp.sortBy === option.value}
                            onChange={(e) => handleChange(e, "sort")}
                            className="peer sr-only"
                          />
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-checked:border-teal-500"></div>
                          <div className="absolute w-3 h-3 bg-teal-500 rounded-full left-1 top-1 opacity-0 peer-checked:opacity-100"></div>
                        </div>
                        <span className="text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Additional Options */}
                <div className="pb-6 border-b border-gray-200">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center">
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        name="visa"
                        checked={filterProp.visaIncluded}
                        onChange={(e) => handleChange(e, "visa")}
                      />
                      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors"></div>
                      <div className="absolute text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="text-gray-700">Include packages with visa services</span>
                  </label>
                </div>

                {/* Preferences Section */}
                <div className="pb-6 border-b border-gray-200">
                  <h3 className="font-medium text-lg mb-4 text-gray-800">Select Preferences To Include</h3>
                  <div className="space-y-3">
                    {checkboxPreferences.map((option, idx) => (
                      <div className="flex items-center justify-between" key={idx}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              name={option.name}
                              checked={filterProp.selectPreferences[option.name]}
                              onChange={(e) => handleChange(e, "preferences")}
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors"></div>
                            <div className="absolute text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Themes Section */}
                <div className="pb-6">
                  <h3 className="font-medium text-lg mb-4 text-gray-800">Themes</h3>
                  <div className="space-y-3">
                    {ThemePreferences.map((option, idx) => (
                      <div className="flex items-center justify-between" key={idx}>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              name={option.name}
                              checked={filterProp.themePreferences[option.name]}
                              onChange={(e) => handleChange(e, "theme")}
                            />
                            <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-teal-500 peer-checked:border-teal-500 transition-colors"></div>
                            <div className="absolute text-white left-0.5 top-0.5 opacity-0 peer-checked:opacity-100">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <span className="text-gray-700">{option.label}</span>
                        </label>
                        <p className="text-gray-500 text-sm">(23)</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Fixed at bottom */}
            <div className="sticky bottom-0 z-10 bg-gray-50 px-6 py-4 flex justify-between items-center border-t shadow-inner">
              <button
                type="button"
                onClick={resetButton}
                className="text-teal-600 font-medium hover:text-teal-800 transition-colors"
              >
                Clear All
              </button>
              <button
                type="submit"
                className="bg-teal-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-teal-600 transition-colors shadow-sm"
              >
                Apply Filter
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
