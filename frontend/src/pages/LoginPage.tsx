import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth'
import { setAuthToken } from '../api/client'

export function LoginPage({ onSignedIn }: { onSignedIn: () => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
      navigate('/')
    } catch {
      setError('Login failed. Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-12">
      <div>
        <h1 className="text-center text-3xl font-semibold text-slate-900">Sign in</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-sky-100 bg-white/90 p-6 shadow-2xl shadow-sky-100/60 backdrop-blur">
        <label className="mb-4 block text-sm">
          <span className="mb-1 block text-slate-600">Username</span>
          <input className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200/50" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="john_doe" />
        </label>
        <label className="mb-4 block text-sm">
          <span className="mb-1 block text-slate-600">Password</span>
          <input type="password" className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200/50" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" />
        </label>
        {error && <p className="mb-4 text-sm text-rose-500">{error}</p>}
        <button disabled={loading} className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-3 font-semibold text-white shadow-lg shadow-sky-200 disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
