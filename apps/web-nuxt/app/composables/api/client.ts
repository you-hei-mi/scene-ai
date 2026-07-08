import type { UseFetchOptions } from 'nuxt/app'

const { public: { apiBaseUrl } } = useRuntimeConfig()

/** 后端统一响应格式 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
  timestamp?: number
  path?: string
}

/**
 * 发送 API 请求并自动解包响应 data
 * 后端 TransformInterceptor 将响应包装为 { code, data, message } 格式
 * 成功时 code === 0，返回 data 字段
 */
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

  // 解析响应 JSON
  const result: ApiResponse<T> = await response.json().catch(() => {
    throw new Error(`接口响应解析失败: ${response.statusText}`)
  })

  // 检查业务状态码
  if (result.code !== 0 && result.code !== 200) {
    throw new Error(result.message || `请求失败 (${result.code})`)
  }

  return result.data
}

/**
 * 获取 baseURL（用于 SSE 等场景）
 */
export function getApiBaseUrl(): string {
  return apiBaseUrl
}

/**
 * 获取当前 token
 */
export function getToken(): string | null {
  return useCookie('token').value
}

/**
 * Nuxt useFetch 封装（自动解包）
 */
export function useApi<T = any>(
  url: string,
  options: UseFetchOptions<T> = {},
) {
  const token = useCookie('token').value
  const headers: Record<string, string> = token ? {
    Authorization: `Bearer ${token}`,
  } : {}

  return useFetch<ApiResponse<T>>(`${apiBaseUrl}${url}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers as Record<string, string>),
    },
    // 自动转换响应，解包 data
    transform: (data: ApiResponse<T>) => {
      if (data.code !== 0 && data.code !== 200) {
        throw new Error(data.message || '请求失败')
      }
      return data.data
    },
  })
}

/**
 * 公共 API 请求辅助函数
 */
export async function apiGet<T = any>(url: string, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, { method: 'GET', ...options })
}

export async function apiPost<T = any>(url: string, body?: any, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
}

export async function apiPatch<T = any>(url: string, body?: any, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, {
    method: 'PATCH',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
}

export async function apiPut<T = any>(url: string, body?: any, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
    ...options,
  })
}

export async function apiDelete<T = any>(url: string, options?: RequestInit): Promise<T> {
  return apiClient<T>(url, { method: 'DELETE', ...options })
}
