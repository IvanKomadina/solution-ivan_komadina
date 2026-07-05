import { useEffect, useState } from 'react'
import { getCategories } from '../api/products'
import { useDebounce } from '../hooks/useDebounce'
import type { ProductFilters } from '../types/product'

interface Props {
  filters: ProductFilters
  onChange: (filters: ProductFilters) => void
}

export function ProductFiltersBar({ filters, onChange }: Props) {
  const [categories, setCategories] = useState<string[]>([])
  const [minPriceInput, setMinPriceInput] = useState(filters.minPrice?.toString() ?? '')
  const [maxPriceInput, setMaxPriceInput] = useState(filters.maxPrice?.toString() ?? '')
  const [searchInput, setSearchInput] = useState(filters.searchTerm ?? '')
  const debouncedSearch = useDebounce(searchInput, 400)

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  // Keep local input in sync if filters change externally (e.g. "Clear filters", browser back/forward)
  useEffect(() => {
    setSearchInput(filters.searchTerm ?? '')
  }, [filters.searchTerm])

  useEffect(() => {
    if (debouncedSearch === (filters.searchTerm ?? '')) return
    onChange({ ...filters, searchTerm: debouncedSearch || undefined })
  }, [debouncedSearch])

  function handleCategoryChange(category: string) {
    onChange({ ...filters, category: category || undefined })
  }

  function commitMinPrice() {
    const parsed = minPriceInput === '' ? undefined : Number(minPriceInput)
    onChange({ ...filters, minPrice: Number.isNaN(parsed) ? undefined : parsed })
  }

  function commitMaxPrice() {
    const parsed = maxPriceInput === '' ? undefined : Number(maxPriceInput)
    onChange({ ...filters, maxPrice: Number.isNaN(parsed) ? undefined : parsed })
  }

  const hasActiveFilters =
    filters.category || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.searchTerm

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:items-end mb-4">
      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label htmlFor="search" className="text-xs text-gray-500">Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search by name..."
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full sm:w-48"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-1 w-full sm:w-auto">
        <label htmlFor="category" className="text-xs text-gray-500">Category</label>
        <select
          id="category"
          className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full sm:w-auto"
          value={filters.category ?? ''}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 w-full sm:w-auto">
        <div className="flex flex-col gap-1 flex-1 sm:flex-none">
          <label htmlFor="minPrice" className="text-xs text-gray-500">Min price</label>
          <input
            id="minPrice"
            type="number"
            min={0}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full sm:w-24"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            onBlur={commitMinPrice}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 sm:flex-none">
          <label htmlFor="maxPrice" className="text-xs text-gray-500">Max price</label>
          <input
            id="maxPrice"
            type="number"
            min={0}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm w-full sm:w-24"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            onBlur={commitMaxPrice}
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          className="text-sm text-blue-600 hover:underline text-left sm:text-center"
          onClick={() => {
            setMinPriceInput('')
            setMaxPriceInput('')
            setSearchInput('')
            onChange({})
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}