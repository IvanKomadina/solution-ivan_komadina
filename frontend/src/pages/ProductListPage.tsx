import { useEffect, useState } from 'react'
import { getProducts } from '../api/products'
import type { PagedResult, ProductListItem } from '../types/product'
import { ProductCard } from '../components/ProductCard'

const PAGE_SIZE = 12

export function ProductListPage() {
  const [data, setData] = useState<PagedResult<ProductListItem> | null>(null)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    getProducts(page, PAGE_SIZE)
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
  }, [page])

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Products</h1>

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
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {data.page} of {data.totalPages}
            </span>
            <button
              className="px-3 py-1.5 rounded border border-gray-300 disabled:opacity-40"
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
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