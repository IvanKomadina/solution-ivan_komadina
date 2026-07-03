import { apiGet } from './client'
import type { PagedResult, ProductDetail, ProductListItem } from '../types/product'

export function getProducts(page: number, pageSize: number) {
  return apiGet<PagedResult<ProductListItem>>(`/products?page=${page}&pageSize=${pageSize}`)
}

export function getProductById(id: string) {
  return apiGet<ProductDetail>(`/products/${id}`)
}