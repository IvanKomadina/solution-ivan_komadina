import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getProducts } from '../api/products'
import type { PagedResult, ProductFilters, ProductListItem } from '../types/product'
import { ProductCard } from '../components/ProductCard'
import { ProductFiltersBar } from '../components/ProductFiltersBar'

const PAGE_SIZE = 12

export function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page') ?? '1')
  const filters: ProductFilters = {
    category: searchParams.get('category') ?? undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
  }

  const [data, setData] = useState<PagedResult<ProductListItem> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
  }, [page, filters.category, filters.minPrice, filters.maxPrice])

  function updateFilters(newFilters: ProductFilters) {
    const params = new URLSearchParams()
    params.set('page', '1') // reset to page 1 whenever filters change

    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.minPrice !== undefined) params.set('minPrice', String(newFilters.minPrice))
    if (newFilters.maxPrice !== undefined) params.set('maxPrice', String(newFilters.maxPrice))

    setSearchParams(params)
  }

  function goToPage(newPage: number) {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(newPage))
    setSearchParams(params)
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Products</h1>

      <ProductFiltersBar filters={filters} onChange={updateFilters} />

      {loading && <p className="text-gray-500">Loading products...</p>}

      {!loading && error && <p className="text-red-600">{error}</p>}

      {!loading && !error && data && data.items.length === 0 && (
        <p className="text-gray-500">No products found.</p>
      )}

      {!loading && !error && data && data.items.length > 0 && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40"
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40"
              onClick={() => goToPage(Math.min(data.totalPages, page + 1))}
              disabled={page >= data.totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}