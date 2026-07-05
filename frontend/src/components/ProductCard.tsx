import { Link } from 'react-router-dom'
import type { ProductListItem } from '../types/product'

export function ProductCard({ product }: { product: ProductListItem }) {
  return (
    <Link
      to={`/products/${product.id}`}
      state={{ from: location.pathname + location.search }}
      className="flex flex-col rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow bg-white"
    >
      <img
        src={product.thumbnail}
        alt={product.title}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-3 flex flex-col gap-1 flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-1">{product.title}</h3>
        <p className="text-gray-500 text-xs line-clamp-2 flex-1">{product.shortDescription}</p>
        <p className="font-semibold text-sm mt-1">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}