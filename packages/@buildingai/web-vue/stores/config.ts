import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ThemeConfig {
  mode: 'light' | 'dark' | 'system'
  accentColor: string
}

interface AppConfig {
  language: string
  theme: ThemeConfig
  notifications: boolean
  autoSave: boolean
}

export const useConfigStore = defineStore('config', () => {
  const config = ref<AppConfig>({
    language: 'zh-CN',
    theme: {
      mode: 'system',
      accentColor: 'blue',
    },
    notifications: true,
    autoSave: true,
  })

  function setLanguage(language: string) {
    config.value.language = language
    localStorage.setItem('language', language)
  }

  function setThemeMode(mode: ThemeConfig['mode']) {
    config.value.theme.mode = mode
    localStorage.setItem('themeMode', mode)
  }

  function setAccentColor(color: string) {
    config.value.theme.accentColor = color
    localStorage.setItem('accentColor', color)
  }

  function toggleNotifications() {
    config.value.notifications = !config.value.notifications
    localStorage.setItem('notifications', String(config.value.notifications))
  }

  function toggleAutoSave() {
    config.value.autoSave = !config.value.autoSave
    localStorage.setItem('autoSave', String(config.value.autoSave))
  }

  function loadFromStorage() {
    const language = localStorage.getItem('language')
    const themeMode = localStorage.getItem('themeMode') as ThemeConfig['mode'] | null
    const accentColor = localStorage.getItem('accentColor')
    const notifications = localStorage.getItem('notifications')
    const autoSave = localStorage.getItem('autoSave')

    if (language) config.value.language = language
    if (themeMode) config.value.theme.mode = themeMode
    if (accentColor) config.value.theme.accentColor = accentColor
    if (notifications !== null) config.value.notifications = notifications === 'true'
    if (autoSave !== null) config.value.autoSave = autoSave === 'true'
  }

  return {
    config,
    setLanguage,
    setThemeMode,
    setAccentColor,
    toggleNotifications,
    toggleAutoSave,
    loadFromStorage,
  }
})
