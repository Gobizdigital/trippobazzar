"use client"

import { useState } from "react"
import SubNavCountry from "./SubNavCountry.jsx"
import CountryPakages from "./CountryPakages.jsx"
import StealDealPakage from "./StealDealPakage.jsx"
import PopulerActivity from "./PopulerActivity.jsx"
import useFetch from "../../../hooks/useFetch.jsx"
import { useParams } from "react-router-dom"
import Loader from "../Loader.jsx"
import SrchDestinationCountry from "../SerchDestinationCountry/SrchDestinationCountry.jsx"
import { useSearch } from "../../../context/SearchContext"
import FilterBox from "../FilterBox/FilterBox.jsx"

function StateDestinationPage() {
  const { continent, country, state } = useParams()
  const [showModal, setShowModal] = useState(false)
  const toggleModal = () => setShowModal(!showModal)

  const { filterProp } = useSearch()

  const { data, loading, error } = useFetch(`https://trippo-bazzar-backend.vercel.app/api/state/name/${state}`)

  if (loading) {
    return <Loader />
  }

  // Helper function to check if any filters are active
  const isFilterActive = () => {
    const { range, checkboxes, selectPreferences, reviews } = filterProp

    // Check if any checkbox is selected
    if (Object.values(checkboxes).some((value) => value)) return true

    // Check if any select preference is active
    if (Object.values(selectPreferences).some((value) => value)) return true

    if (range !== "0") return true

    // Check if reviews filter is active
    if (reviews !== "0") return true

    return false
  }

  // Helper function to get all possible prices for a package
  const getPackagePrices = (pkg) => {
    const prices = []

    // Add direct price if available
    if (pkg.price && pkg.price > 0) {
      prices.push(pkg.price)
    }

    // Add all basePrice values from pricing array
    if (pkg.pricing && pkg.pricing.length > 0) {
      pkg.pricing.forEach((pricingOption) => {
        if (pricingOption.basePrice && pricingOption.basePrice > 0) {
          // Add the basePrice directly
          prices.push(pricingOption.basePrice)

          // If not perPerson and has guestCount, also add the total price
          if (!pricingOption.perPerson && pricingOption.guestCount && pricingOption.guestCount > 1) {
            prices.push(pricingOption.basePrice * pricingOption.guestCount)
          }
        }
      })
    }

    return prices
  }

  // Check if a package matches a price range
  const matchesPriceRange = (pkg, minPrice, maxPrice) => {
    const prices = getPackagePrices(pkg)

    // If no valid prices found, it can't match
    if (prices.length === 0) return false

    // Check if any of the package's prices fall within the range
    return prices.some((price) => price >= minPrice && price <= maxPrice)
  }

  const filterPackages = () => {
    if (!data || !data.Packages) return []

    if (!isFilterActive()) return data.Packages

    return data.Packages.filter((pkg) => {
      const prices = getPackagePrices(pkg)

      // If there are no valid prices, exclude this package
      if (prices.length === 0) return false

      // Price Range Filter
      const selectedPriceRanges = []
      if (filterProp.checkboxes.lessThan50000) selectedPriceRanges.push({ min: 0, max: 50000 })
      if (filterProp.checkboxes.between500000And1000000) selectedPriceRanges.push({ min: 50000, max: 100000 })
      if (filterProp.checkboxes.between1000000And1500000) selectedPriceRanges.push({ min: 100000, max: 150000 })
      if (filterProp.checkboxes.moreThan1500000)
        selectedPriceRanges.push({ min: 150000, max: Number.POSITIVE_INFINITY })

      // If price ranges are selected, check if any of the package's prices match any range
      if (selectedPriceRanges.length > 0) {
        const anyPriceMatches = selectedPriceRanges.some((range) => matchesPriceRange(pkg, range.min, range.max))
        if (!anyPriceMatches) return false
      }

      // Days Filter
      const range = Number.parseInt(filterProp.range, 10)
      if (range > 0) {
        const daysMatch = pkg.description ? pkg.description.match(/(\d+)\s*Days/i) : null
        const packageDays = daysMatch ? Number.parseInt(daysMatch[1], 10) : null

        if (!packageDays || packageDays !== range) return false
      }

      // Reviews Filter
      const reviews = Number.parseInt(filterProp.reviews, 10)
      if (reviews > 0) {
        // If package doesn't have reviews or has lower rating than filter, exclude it
        if (!pkg.reviews || pkg.reviews < reviews) return false
      }

      // Preferences Filter
      const preferences = filterProp.selectPreferences
      const whatsIncluded = pkg.whatsIncluded || []

      if (
        (preferences.hotelstay && !whatsIncluded.includes("Hotel")) ||
        (preferences.meals && !whatsIncluded.includes("Food")) ||
        (preferences.localtransport && !whatsIncluded.includes("Car")) ||
        (preferences.sightseeing && !whatsIncluded.includes("Explore"))
      ) {
        return false
      }

      // Package passed all filters
      return true
    })
  }

  const filteredPackages = filterPackages()

  return (
    <div className="mx-auto max-w-[1920px] h-full">
      <SrchDestinationCountry url={data?.StatePhotoUrl} />
      <SubNavCountry toggleModal={toggleModal} />
      <FilterBox showModal={showModal} onClose={toggleModal} />
      <CountryPakages data={filteredPackages} error={error} continent={continent} country={country} state={state} />
      <StealDealPakage />
      <PopulerActivity />
    </div>
  )
}

export default StateDestinationPage
