import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../api/products'
import { ApiError, getAuthToken } from '../api/client'
import type { ProductDetail } from '../types/product'
import { useLocation } from 'react-router-dom'
import { addFavorite, getFavorites, removeFavorite } from '../api/favorites'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [product, setProduct] = useState<ProductDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<'not-found' | 'error' | null>(null)
  const [favorite, setFavorite] = useState(false)
  const [saving, setSaving] = useState(false)
  const [activeImage, setActiveImage] = useState<string | null>(null)
  const location = useLocation()
  const from = location.state?.from

  useEffect(() => {
    if (!id) return

    let cancelled = false
    setLoading(true)
    setError(null)
    setProduct(null)

    getProductById(id)
      .then((result) => {
        if (!cancelled) {
          setProduct(result)
          setActiveImage(result.thumbnail)
        }
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

  useEffect(() => {
    if (!id || !getAuthToken()) {
      setFavorite(false)
      return
    }

    let cancelled = false
    getFavorites()
      .then((items) => {
        if (!cancelled) setFavorite(items.some((item) => item.productId === Number(id)))
      })
      .catch(() => {
        if (!cancelled) setFavorite(false)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  async function toggleFavorite() {
    if (!id || !getAuthToken()) {
      navigate('/login')
      return
    }

    setSaving(true)
    try {
      if (favorite) {
        await removeFavorite(Number(id))
      } else {
        await addFavorite(Number(id))
      }
      setFavorite((value) => !value)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button onClick={() => navigate(from ?? '/')} className="text-lg font-medium text-sky-700 hover:text-sky-800">&larr; Back</button>

      {loading && <p className="mt-4 text-slate-600">Loading product...</p>}

      {!loading && error === 'not-found' && <p className="mt-4 text-slate-600">Product not found.</p>}

      {!loading && error === 'error' && <p className="mt-4 text-rose-500">Could not load this product. Please try again.</p>}

      {!loading && !error && product && (
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-sky-100 bg-white p-3 shadow-2xl shadow-sky-100/60">
            <div className="overflow-hidden rounded-2xl">
              <img src={activeImage ?? product.thumbnail} alt={product.title} className="aspect-square w-full object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {product.images.map((img) => (
                  <button
                    key={img}
                    className={`overflow-hidden rounded-xl border ${activeImage === img ? 'border-sky-300 ring-2 ring-sky-200/50' : 'border-sky-100 hover:border-sky-200'}`}
                    onClick={() => setActiveImage(img)}
                    type="button"
                  >
                    <img src={img} alt="" className="h-20 w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-sky-100 bg-white p-6 shadow-2xl shadow-sky-100/60">
            <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{product.category}</p>
            <p className="text-2xl font-bold text-sky-700">${product.price.toFixed(2)}</p>
            <p className="text-sm text-slate-600">Rating: {product.rating} / 5</p>
            <p className="text-sm text-slate-600">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
            <p className="text-slate-700">{product.description}</p>
            <button
              className="mt-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-sky-200 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={toggleFavorite}
              disabled={saving}
            >
              {favorite ? 'Remove from favorites' : 'Add to favorites'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
