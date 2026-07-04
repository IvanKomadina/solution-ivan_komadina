const BASE_URL = import.meta.env.VITE_API_BASE_URL

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

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`)

  if (!response.ok) {
    throw new ApiError(response.status, `Request failed: ${response.status} ${response.statusText}`)
  }

  const envelope = (await response.json()) as ServiceResponseEnvelope<T>
  return envelope.data
}