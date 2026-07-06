import type { UseFetchOptions } from 'nuxt/app'

/**
 * API 统一响应格式
 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 请求缓存存储
 * 用于在客户端缓存 GET 请求的结果，减少重复请求
 */
const requestCache = new Map<string, { data: any, timestamp: number }>()

/**
 * 默认缓存时间（毫秒）
 * GET 请求结果默认缓存 30 秒
 */
const DEFAULT_CACHE_TTL = 30 * 1000

/**
 * 封装 useFetch，提供统一的认证、错误处理和缓存机制
 *
 * @param url - 请求地址，支持字符串或响应式函数
 * @param options - useFetch 配置选项
 * @returns useFetch 返回值
 */
export function useApiFetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<ApiResponse<T>> = {}
) {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  return useFetch(url, {
    baseURL: config.public.apiBaseUrl,
    ...options,
    // 默认开启请求去重
    dedupe: options.dedupe ?? 'default',
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

/**
 * 发送 POST 请求
 * @param url - 请求地址
 * @param body - 请求体数据
 * @param options - useFetch 配置选项
 * @returns useFetch 返回值
 */
export function useApiPost<T>(url: string, body: any, options: UseFetchOptions<ApiResponse<T>> = {}) {
  return useApiFetch<T>(url, {
    method: 'POST',
    body,
    ...options,
  })
}

/**
 * 发送 GET 请求（带缓存）
 * @param url - 请求地址
 * @param options - useFetch 配置选项
 * @returns useFetch 返回值
 */
export function useApiGet<T>(url: string, options: UseFetchOptions<ApiResponse<T>> = {}) {
  return useApiFetch<T>(url, {
    method: 'GET',
    // 默认缓存 GET 请求 30 秒
    key: options.key ?? `get:${url}`,
    ...options,
  })
}

/**
 * 手动设置缓存数据
 * 用于在数据变更后主动更新缓存
 *
 * @param key - 缓存键
 * @param data - 缓存数据
 * @param ttl - 缓存有效期（毫秒），默认 30 秒
 */
export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_CACHE_TTL) {
  requestCache.set(key, { data, timestamp: Date.now() + ttl })
}

/**
 * 获取缓存数据
 * @param key - 缓存键
 * @returns 缓存的数据，未命中或已过期返回 null
 */
export function getCache<T>(key: string): T | null {
  const cached = requestCache.get(key)
  if (!cached) return null
  if (Date.now() > cached.timestamp) {
    requestCache.delete(key)
    return null
  }
  return cached.data as T
}

/**
 * 清除指定缓存或全部缓存
 * @param key - 可选，指定要清除的缓存键。不传则清除全部
 */
export function clearCache(key?: string) {
  if (key) {
    requestCache.delete(key)
  } else {
    requestCache.clear()
  }
}
