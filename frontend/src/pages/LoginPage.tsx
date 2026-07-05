import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { setAuthToken } from '../api/client'

export function LoginPage({ onSignedIn }: { onSignedIn: () => void }) {
  const [username, setUsername] = useState('emilys')
  const [password, setPassword] = useState('emilyspass')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await login({ username, password })
      setAuthToken(result.token)
      window.dispatchEvent(new Event('auth-changed'))
      onSignedIn()
      navigate('/favorites')
    } catch {
      setError('Login failed. Check your DummyJSON credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-3xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-300">Use your DummyJSON username and password to get a JWT for favorites.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
        <label className="mb-4 block text-sm">
          <span className="mb-1 block text-slate-300">Username</span>
          <input className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-300" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className="mb-4 block text-sm">
          <span className="mb-1 block text-slate-300">Password</span>
          <input type="password" className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none focus:border-emerald-300" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        {error && <p className="mb-4 text-sm text-red-300">{error}</p>}
        <button disabled={loading} className="w-full rounded-xl bg-emerald-300 px-4 py-3 font-semibold text-slate-950 disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
