/**
 * 全局错误处理 composable
 * 提供统一的错误提示、加载状态管理
 */
import { ref } from 'vue'
import { useToast } from '#imports'

export interface ErrorState {
  message: string
  code?: number
  timestamp?: number
}

export function useErrorHandler() {
  const loading = ref(false)
  const error = ref<ErrorState | null>(null)
  const toast = useToast()

  /**
   * 包装异步操作，自动管理 loading 和 error 状态
   */
  async function withErrorHandling<T>(
    fn: () => Promise<T>,
    options?: {
      errorMessage?: string
      silent?: boolean
      onSuccess?: (data: T) => void
      onError?: (err: Error) => void
    },
  ): Promise<T | undefined> {
    loading.value = true
    error.value = null

    try {
      const result = await fn()
      options?.onSuccess?.(result)
      return result
    } catch (err: any) {
      const message = options?.errorMessage || err.message || '操作失败，请稍后重试'
      error.value = {
        message,
        code: err.code,
        timestamp: Date.now(),
      }

      if (!options?.silent) {
        toast.add({
          title: '操作失败',
          description: message,
          color: 'error',
          icon: 'lucide:alert-circle',
        })
      }

      options?.onError?.(err)
      return undefined
    } finally {
      loading.value = false
    }
  }

  /**
   * 清除错误状态
   */
  function clearError() {
    error.value = null
  }

  /**
   * 处理 API 错误并返回用户友好的消息
   */
  function handleApiError(err: any): string {
    if (err?.message) {
      // 常见错误消息映射
      const errorMap: Record<string, string> = {
        'Unauthorized': '登录已过期，请重新登录',
        'Forbidden': '没有权限执行此操作',
        'Not Found': '请求的资源不存在',
        'Network Error': '网络连接失败，请检查网络',
        'Failed to fetch': '网络请求失败，请检查后端服务是否运行',
        'Request failed with status': '服务器响应异常',
      }

      for (const [key, value] of Object.entries(errorMap)) {
        if (err.message.includes(key)) {
          return value
        }
      }
      return err.message
    }
    return '未知错误'
  }

  return {
    loading,
    error,
    withErrorHandling,
    clearError,
    handleApiError,
  }
}