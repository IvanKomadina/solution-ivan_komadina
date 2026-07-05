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

  function titleCase(label: string) {
    return label
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:justify-center">
        <div className="flex w-full flex-col gap-2 lg:max-w-sm">
          <label htmlFor="search" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search by name..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <div className="flex w-full flex-col gap-2 lg:w-60">
          <label htmlFor="category" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Category</label>
          <select
            id="category"
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20"
            value={filters.category ?? ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{titleCase(c)}</option>
            ))}
          </select>
        </div>

        <div className="flex w-full gap-3 sm:w-auto">
          <div className="flex flex-1 flex-col gap-2 sm:flex-none">
            <label htmlFor="minPrice" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Min price</label>
            <input
              id="minPrice"
              type="number"
              min={0}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20 sm:w-32"
              value={minPriceInput}
              onChange={(e) => setMinPriceInput(e.target.value)}
              onBlur={commitMinPrice}
            />
          </div>

          <div className="flex flex-1 flex-col gap-2 sm:flex-none">
            <label htmlFor="maxPrice" className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Max price</label>
            <input
              id="maxPrice"
              type="number"
              min={0}
              className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-sky-300 focus:ring-2 focus:ring-sky-300/20 sm:w-32"
              value={maxPriceInput}
              onChange={(e) => setMaxPriceInput(e.target.value)}
              onBlur={commitMaxPrice}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <button
            className="inline-flex items-center justify-center self-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100 lg:self-end"
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
    </div>
  )
}
