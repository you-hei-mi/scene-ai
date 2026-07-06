import type { UseFetchOptions } from 'nuxt/app'

export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> = {}
) {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  return useFetch(url, {
    baseURL: config.public.apiBaseUrl,
    ...options,
    headers: {
      ...options.headers,
      ...(userStore.token ? { Authorization: `Bearer ${userStore.token}` } : {}),
    },
    onResponse({ response }) {
      const data = response._data as ApiResponse<T>
      if (data && data.code !== 0 && data.code !== 200) {
        throw new Error(data.message || '请求失败')
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        userStore.logout()
        navigateTo('/login')
      }
    },
  })
}

export function useApiPost<T>(url: string, body: any, options: UseFetchOptions<ApiResponse<T>> = {}) {
  return useApiFetch<T>(url, {
    method: 'POST',
    body,
    ...options,
  })
}

export function useApiGet<T>(url: string, options: UseFetchOptions<ApiResponse<T>> = {}) {
  return useApiFetch<T>(url, {
    method: 'GET',
    ...options,
  })
}
