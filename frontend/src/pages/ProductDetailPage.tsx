import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProductById } from '../api/products'
import { ApiError } from '../api/client'
import type { ProductDetail } from '../types/product'

export function ProductDetailPage() {
    const { id } = useParams<{ id: string }>()
    const [product, setProduct] = useState<ProductDetail | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<'not-found' | 'error' | null>(null)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError(null)
    setProduct(null)

    getProductById(id)
      .then((result) => {
        if (!cancelled) setProduct(result)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 404) {
          setError('not-found')
        } else {
          setError('error')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link to="/" className="text-sm text-blue-600 hover:underline">
        &larr; Back to products
      </Link>

      {loading && <p className="text-gray-500 mt-4">Loading product...</p>}

      {!loading && error === 'not-found' && (
        <p className="text-gray-500 mt-4">Product not found.</p>
      )}

      {!loading && error === 'error' && (
        <p className="text-red-600 mt-4">Could not load this product. Please try again.</p>
      )}

      {!loading && !error && product && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full rounded-lg object-cover"
            />
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-2 overflow-x-auto">
                {product.images.map((img) => (
                  <img
                    key={img}
                    src={img}
                    alt=""
                    className="w-16 h-16 object-cover rounded border border-gray-200 shrink-0"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-xl font-semibold">{product.title}</h1>
            <p className="text-sm text-gray-500">{product.brand} &middot; {product.category}</p>
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Rating: {product.rating} / 5</p>
            <p className="text-sm text-gray-600">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>
            <p className="text-gray-700 mt-2">{product.description}</p>
          </div>
        </div>
      )}
    </div>
  )
}