import { Route, Routes, useNavigate } from 'react-router-dom'
import { ProductListPage } from './pages/ProductListPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { LoginPage } from './pages/LoginPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { useEffect, useState } from 'react'
import { clearAuthToken, getAuthToken } from './api/client'
import { Navbar } from './components/Navbar'

function Shell() {
  const [signedIn, setSignedIn] = useState(Boolean(getAuthToken()))
  const navigate = useNavigate()

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
    <div className="min-h-screen bg-transparent text-slate-900">
      <Navbar
        signedIn={signedIn}
        onSignOut={() => {
          clearAuthToken()
          setSignedIn(false)
          window.dispatchEvent(new Event('auth-changed'))
          navigate('/')
        }}
      />

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
