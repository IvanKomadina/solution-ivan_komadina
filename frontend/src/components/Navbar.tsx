import { Link } from 'react-router-dom'

type Props = {
  signedIn: boolean
  onSignOut: () => void
}

export function Navbar({ signedIn, onSignOut }: Props) {
  return (
    <header className="border-b border-sky-100 bg-white/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-xl font-semibold tracking-wide text-slate-900"
        >
          <span>Product Catalog</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            to="/"
            className="rounded-full border border-sky-100 bg-sky-100 px-4 py-2.5 font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-200 hover:text-slate-900"
          >
            Products
          </Link>

          {signedIn && (
            <Link
              to="/favorites"
              className="rounded-full border border-sky-100 bg-sky-100 px-4 py-2.5 font-medium text-slate-700 hover:border-sky-200 hover:bg-sky-200 hover:text-slate-900"
            >
              Favorites
            </Link>
          )}

          {signedIn ? (
            <button
              className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 font-semibold text-white shadow-lg shadow-sky-200 hover:shadow-sky-300"
              onClick={onSignOut}
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 px-4 py-2.5 font-semibold text-white shadow-lg shadow-sky-200 hover:shadow-sky-300"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
