import { Link, useLocation } from 'react-router-dom'
import type { ProductListItem } from '../types/product'

export function ProductCard({ product }: { product: ProductListItem }) {
  const location = useLocation()
  return (
    <Link
      to={`/products/${product.id}`}
      state={{ from: location.pathname + location.search }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 shadow-xl shadow-black/10 hover:border-sky-300/30 hover:bg-white/10"
    >
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/70 to-transparent" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <h3 className="truncate text-sm font-semibold text-white group-hover:text-sky-100">{product.title}</h3>
        <p className="line-clamp-2 flex-1 text-xs leading-5 text-slate-300">{product.shortDescription}</p>
        <div className="mt-1 inline-flex w-fit rounded-full bg-sky-300/10 px-3 py-1 text-sm font-semibold text-sky-100">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </Link>
  )
}
