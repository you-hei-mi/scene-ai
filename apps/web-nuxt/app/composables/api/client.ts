import type { UseFetchOptions } from 'nuxt/app'

const { public: { apiBaseUrl } } = useRuntimeConfig()

export async function apiClient<T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const fullUrl = `${apiBaseUrl}${url}`

  const token = useCookie('token').value

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(fullUrl, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }))
    throw new Error(error.message || `Request failed with status ${response.status}`)
  }

  return response.json()
}

export function useApi<T = any>(
  url: string,
  options: UseFetchOptions<T> = {},
) {
  const token = useCookie('token').value
  const headers: Record<string, string> = token ? {
    Authorization: `Bearer ${token}`,
  } : {}

  return useFetch<T>(`${apiBaseUrl}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
  })
}
