const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5090/api'

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

interface ServiceResponseEnvelope<T> {
  data: T
  success: boolean
  message?: string | null
  statusCode: number
}

export function getAuthToken() {
  return localStorage.getItem('pc_token')
}

export function setAuthToken(token: string) {
  localStorage.setItem('pc_token', token)
}

export function clearAuthToken() {
  localStorage.removeItem('pc_token')
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiRequest<T>(path)
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')

  const token = getAuthToken()
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers,
  })

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status} ${response.statusText}`)
  }

  const envelope = (await response.json()) as ServiceResponseEnvelope<T>
  return envelope.data
}
