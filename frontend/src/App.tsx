import { Link, Route, Routes } from 'react-router-dom'
import { ProductListPage } from './pages/ProductListPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { LoginPage } from './pages/LoginPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { useEffect, useState } from 'react'
import { clearAuthToken, getAuthToken } from './api/client'

function Shell() {
  const [signedIn, setSignedIn] = useState(Boolean(getAuthToken()))

  useEffect(() => {
    const sync = () => setSignedIn(Boolean(getAuthToken()))
    window.addEventListener('storage', sync)
    window.addEventListener('auth-changed', sync as EventListener)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('auth-changed', sync as EventListener)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <Link to="/" className="text-lg font-semibold tracking-wide">Product Catalog</Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link to="/favorites" className="rounded-full border border-white/10 px-3 py-1.5 hover:bg-white/5">Favorites</Link>
            {signedIn ? (
              <button
                className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-900"
                onClick={() => {
                  clearAuthToken()
                  setSignedIn(false)
                  window.dispatchEvent(new Event('auth-changed'))
                }}
              >
                Sign out
              </button>
            ) : (
              <Link to="/login" className="rounded-full bg-white px-3 py-1.5 font-medium text-slate-900">Sign in</Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage onSignedIn={() => setSignedIn(true)} />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default Shell
