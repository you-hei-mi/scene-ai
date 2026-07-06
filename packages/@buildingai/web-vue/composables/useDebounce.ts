import { ref } from 'vue'

export default function useDebounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
  const timer = ref<ReturnType<typeof setTimeout> | null>(null)

  const debouncedFn = ((...args: unknown[]) => {
    if (timer.value) {
      clearTimeout(timer.value)
    }
    timer.value = setTimeout(() => {
      fn(...args)
    }, delay)
  }) as T

  return debouncedFn
}
