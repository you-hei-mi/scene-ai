// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
  },

  ui: {
    icons: ['lucide', 'heroicons', 'tabler'],
  },

  runtimeConfig: {
    apiSecret: '',
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4090',
      appName: 'BuildingAI',
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4090',
        changeOrigin: true,
      },
      '/consoleapi': {
        target: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4090',
        changeOrigin: true,
      },
    },
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      title: 'BuildingAI',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'BuildingAI - AI Agent Platform' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
})
