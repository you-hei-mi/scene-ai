/**
 * API 客户端基础配置
 *
 * 提供统一的 $fetch 封装，处理认证、错误和响应格式
 */
import { $fetch, type FetchOptions } from 'ofetch'

let _baseURL = 'http://localhost:4090'
let _tokenGetter: (() => string | null) | null = null

/** 设置 API 基础 URL */
export function setApiBaseURL(url: string) {
  _baseURL = url
}

/** 获取 API 基础 URL */
export function getApiBaseURL(): string {
  return _baseURL
}

/** 设置 token 获取函数 */
export function setTokenGetter(getter: () => string | null) {
  _tokenGetter = getter
}

/** 获取当前 token */
export function getToken(): string | null {
  return _tokenGetter?.() ?? null
}

/** 构建带认证的请求头 */
function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...extra }
  const token = _tokenGetter?.()
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/** 统一的 API 响应格式 */
export interface ApiResponse<T = any> {
  code: number
  data: T
  message: string
}

/**
 * 发送 API 请求并自动解包响应 data
 */
export async function apiFetch<T = any>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { headers, ...rest } = options as any

  const response = await $fetch<ApiResponse<T>>(url, {
    baseURL: _baseURL,
    headers: buildHeaders(headers),
    ...rest,
  })

  if (response.code !== 0 && response.code !== 200) {
    throw new Error(response.message || '请求失败')
  }

  return response.data
}

/**
 * GET 请求
 */
export function apiGet<T = any>(url: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(url, { method: 'GET', ...options })
}

/**
 * POST 请求
 */
export function apiPost<T = any>(url: string, body?: any, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(url, { method: 'POST', body, ...options })
}

/**
 * PATCH 请求
 */
export function apiPatch<T = any>(url: string, body?: any, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(url, { method: 'PATCH', body, ...options })
}

/**
 * DELETE 请求
 */
export function apiDelete<T = any>(url: string, options?: FetchOptions): Promise<T> {
  return apiFetch<T>(url, { method: 'DELETE', ...options })
}