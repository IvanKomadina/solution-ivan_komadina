import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ApiError, getAuthToken } from '../api/client'
import { getFavorites, removeFavorite, type FavoriteProduct } from '../api/favorites'

export function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const location = useLocation()

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    if (!getAuthToken()) {
      setFavorites([])
      setError('Please sign in to view favorites.')
      setLoading(false)
      return
    }

    getFavorites()
      .then((data) => {
        if (!cancelled) setFavorites(data)
      })
      .catch((err) => {
        if (cancelled) return
        if (err instanceof ApiError && err.status === 401) {
          setError('Your session expired. Please sign in again.')
        } else {
          setError('Could not load favorites right now.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-semibold text-white">Your favorites</h1>
      {loading && <p className="mt-4 text-slate-300">Loading favorites...</p>}
      {!loading && error && <p className="mt-4 text-red-300">{error}</p>}
      {!loading && !error && favorites.length === 0 && <p className="mt-4 text-slate-300">No favorites yet.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((favorite) => (
          <div key={favorite.productId} className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-white/20">
            <Link to={`/products/${favorite.productId}`} state={{ from: location.pathname + location.search }} className="group block">
              <img src={favorite.thumbnail} alt={favorite.title} className="h-44 w-full object-cover" />
              <div className="p-4">
                <h2 className="font-semibold text-white transition group-hover:text-emerald-200">{favorite.title}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-300">{favorite.description}</p>
              </div>
            </Link>
            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-4">
              <span className="font-semibold text-emerald-300">${favorite.price.toFixed(2)}</span>
              <button
                className="rounded-full border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-medium text-rose-100 hover:bg-rose-500/20 hover:text-white"
                onClick={async () => {
                  await removeFavorite(favorite.productId)
                  setFavorites((items) => items.filter((item) => item.productId !== favorite.productId))
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
