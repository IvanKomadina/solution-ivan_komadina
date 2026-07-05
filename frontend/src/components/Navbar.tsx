import { Link } from 'react-router-dom'

type Props = {
  signedIn: boolean
  onSignOut: () => void
}

export function Navbar({ signedIn, onSignOut }: Props) {
  return (
    <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-5">
        <Link
          to="/"
          className="inline-flex items-center gap-3 text-xl font-semibold tracking-wide text-white"
        >
          <span>Product Catalog</span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          {signedIn && (
            <Link
              to="/favorites"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2.5 font-medium text-white hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100"
            >
              Favorites
            </Link>
          )}

          {signedIn ? (
            <button
              className="rounded-full bg-gradient-to-r from-sky-300 to-cyan-200 px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30"
              onClick={onSignOut}
            >
              Sign out
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-white px-4 py-2.5 font-semibold text-slate-950 shadow-lg shadow-black/20 hover:bg-sky-100"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
