export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()

  if (import.meta.client) {
    userStore.initFromStorage()
  }

  const publicRoutes = ['/login', '/register', '/forgot-password', '/install']

  if (!publicRoutes.includes(to.path) && !userStore.isLoggedIn) {
    return navigateTo('/login')
  }

  if (to.path === '/login' && userStore.isLoggedIn) {
    return navigateTo('/chat')
  }
})
