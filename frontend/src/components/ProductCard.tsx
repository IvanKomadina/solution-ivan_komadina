import { Link, useLocation } from 'react-router-dom'
import type { ProductListItem } from '../types/product'

export function ProductCard({ product }: { product: ProductListItem }) {
  const location = useLocation()
  return (
    <Link
      to={`/products/${product.id}`}
      state={{ from: location.pathname + location.search }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-lg shadow-sky-100/60 hover:border-sky-200"
    >
      <div>
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-48 w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
        <h3 className="truncate text-sm font-semibold text-slate-900 group-hover:text-sky-700">{product.title}</h3>
        <p className="line-clamp-2 flex-1 text-xs leading-5 text-slate-600">{product.shortDescription}</p>
        <div className="mt-1 inline-flex w-fit rounded-full bg-sky-100 px-3 py-1 text-sm font-semibold text-sky-700">
          ${product.price.toFixed(2)}
        </div>
      </div>
    </Link>
  )
}
