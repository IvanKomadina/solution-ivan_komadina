import { Link } from 'react-router-dom'
import type { ProductListItem } from '../types/product'

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      to={`/products/${product.id}`}
      state={{ from: location.pathname + location.search }}
      className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:bg-white/10"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="h-44 w-full object-cover"
        loading="lazy"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-1 p-4">
        <h3 className="truncate text-sm font-semibold text-white">{product.title}</h3>
        <p className="line-clamp-2 flex-1 text-xs text-slate-300">{product.shortDescription}</p>
        <p className="mt-2 text-sm font-semibold text-emerald-300">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
