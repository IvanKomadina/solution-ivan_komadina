import { useEffect, useState } from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import { getProducts } from '../api/products'
import type { PagedResult, ProductFilters, ProductListItem } from '../types/product'
import { ProductCard } from '../components/ProductCard'
import { ProductFiltersBar } from '../components/ProductFiltersBar'
import { useScrollRestoration } from '../hooks/useScrollRestoration'

const PAGE_SIZE = 12

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page') ?? '1')
  const filters: ProductFilters = {
    category: searchParams.get('category') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    searchTerm: searchParams.get('search') ?? undefined,
  }

  const [data, setData] = useState<PagedResult<ProductListItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const location = useLocation()
  const scrollKey = location.pathname + location.search
  useScrollRestoration(scrollKey, !loading && !error)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getProducts(page, PAGE_SIZE, filters)
      .then((result) => {
        if (!cancelled) setData(result)
      })
      .catch(() => {
        if (!cancelled) setError('Could not load products. Please try again.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters.category, filters.minPrice, filters.maxPrice, filters.searchTerm])
  
  function updateFilters(newFilters: ProductFilters) {
    const params = new URLSearchParams()
    params.set('page', '1')

    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.minPrice !== undefined) params.set('minPrice', String(newFilters.minPrice))
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', String(newFilters.maxPrice))
    if (newFilters.searchTerm) params.set('search', newFilters.searchTerm)
    setSearchParams(params)
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="mt-6">
        <ProductFiltersBar filters={filters} onChange={updateFilters} />
      </div>

      {loading && <p className="mt-6 text-slate-300">Loading products...</p>}

      {!loading && error && <p className="mt-6 text-red-300">{error}</p>}

      {!loading && !error && data && data.items.length === 0 && (
        <p className="mt-6 text-slate-300">No products found.</p>
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-center">
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-sky-300/40 hover:bg-sky-300/10 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => goToPage(Math.max(1, page - 1))} disabled={page <= 1}>Previous</button>
            <span className="text-sm text-slate-300">Page {data.page} of {data.totalPages}</span>
            <button className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:border-sky-300/40 hover:bg-sky-300/10 disabled:cursor-not-allowed disabled:opacity-40" onClick={() => goToPage(Math.min(data.totalPages, page + 1))} disabled={page >= data.totalPages}>Next</button>
          </div>
        </>
      )}
    </div>
  )
}
