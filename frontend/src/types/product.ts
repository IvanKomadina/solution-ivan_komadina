export interface ProductListItem {
  id: number
  title: string
  thumbnail: string
  price: number
  shortDescription: string
}

export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface ProductDetail {
  id: number
  title: string
  description: string
  category: string
  price: number
  rating: number
  stock: number
  brand: string
  thumbnail: string
  images: string[]
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
}