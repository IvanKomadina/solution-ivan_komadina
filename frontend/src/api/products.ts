import { apiGet } from './client'
import type { PagedResult, ProductDetail, ProductFilters, ProductListItem } from '../types/product'

export function getProducts(page: number, pageSize: number, filters: ProductFilters = {}) {
  const params = new URLSearchParams({ page: String(page), pageSize: String(pageSize) })

  if (filters.category) params.set('category', filters.category)
  if (filters.minPrice !== undefined) params.set('minPrice', String(filters.minPrice))
  if (filters.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice))
  if (filters.searchTerm) params.set('search', filters.searchTerm)

  return apiGet<PagedResult<ProductListItem>>(`/products?${params.toString()}`)
}

export function getProductById(id: string) {
  return apiGet<ProductDetail>(`/products/${id}`)
}

export function getCategories() {
  return apiGet<string[]>('/products/categories')
}
