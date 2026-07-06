import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  const sidebarCollapsed = ref(false)
  const currentTheme = ref<'light' | 'dark' | 'system'>('system')

  const isSidebarCollapsed = computed(() => sidebarCollapsed.value)

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  function setTheme(theme: 'light' | 'dark' | 'system') {
    currentTheme.value = theme
  }

  return {
    sidebarCollapsed,
    currentTheme,
    isSidebarCollapsed,
    toggleSidebar,
    setTheme,
  }
})
