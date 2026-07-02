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