import { apiRequest } from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
  dummyJsonUserId: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatarUrl?: string | null
}

export function login(request: LoginRequest) {
  return apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  })
}
