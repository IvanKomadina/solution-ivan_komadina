import { apiRequest } from './client'

export interface FavoriteProduct {
  productId: number
  title: string
  description: string
  category: string
  price: number
  thumbnail: string
}

export function getFavorites() {
  return apiRequest<FavoriteProduct[]>('/favorites')
}

export function addFavorite(productId: number) {
  return apiRequest<void>(`/favorites/${productId}`, { method: 'POST' })
}

export function removeFavorite(productId: number) {
  return apiRequest<void>(`/favorites/${productId}`, { method: 'DELETE' })
}
