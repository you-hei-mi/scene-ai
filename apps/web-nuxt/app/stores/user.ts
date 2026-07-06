import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  id: string
  username: string
  email: string
  avatar?: string
  nickname?: string
}

export const useUserStore = defineStore('user', () => {
  const token = ref<string | null>(null)
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!token.value)

  function setToken(newToken: string) {
    token.value = newToken
    if (import.meta.client) {
      localStorage.setItem('access_token', newToken)
    }
  }

  function setUserInfo(info: UserInfo) {
    userInfo.value = info
  }

  function logout() {
    token.value = null
    userInfo.value = null
    if (import.meta.client) {
      localStorage.removeItem('access_token')
    }
  }

  function initFromStorage() {
    if (import.meta.client) {
      const savedToken = localStorage.getItem('access_token')
      if (savedToken) {
        token.value = savedToken
      }
    }
  }

  return {
    token,
    userInfo,
    isLoggedIn,
    setToken,
    setUserInfo,
    logout,
    initFromStorage,
  }
})
