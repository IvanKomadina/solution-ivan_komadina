import { apiGet } from './client'
import type { PagedResult, ProductListItem } from '../types/product'

export function getProducts(page: number, pageSize: number) {
  return apiGet<PagedResult<ProductListItem>>(`/products?page=${page}&pageSize=${pageSize}`)
}