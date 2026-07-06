import { ref } from 'vue'

interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
}

interface UseToastReturn {
  toasts: ref<ToastMessage[]>
  show: (type: ToastMessage['type'], message: string) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
  remove: (id: string) => void
}

export default function useToast(): UseToastReturn {
  const toasts = ref<ToastMessage[]>([])

  function show(type: ToastMessage['type'], message: string) {
    const id = Date.now().toString()
    toasts.value.push({ id, type, message })

    setTimeout(() => {
      remove(id)
    }, 3000)
  }

  function success(message: string) {
    show('success', message)
  }

  function error(message: string) {
    show('error', message)
  }

  function warning(message: string) {
    show('warning', message)
  }

  function info(message: string) {
    show('info', message)
  }

  function remove(id: string) {
    const index = toasts.value.findIndex(t => t.id === id)
    if (index > -1) {
      toasts.value.splice(index, 1)
    }
  }

  return {
    toasts,
    show,
    success,
    error,
    warning,
    info,
    remove,
  }
}
