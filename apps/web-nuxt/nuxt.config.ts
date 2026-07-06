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
    // 压缩输出
    compressPublicAssets: true,
  },

  /**
   * 路由级渲染与缓存策略
   * - 静态页面使用 SWR 缓存
   * - 动态页面使用 SSR
   * - 交互密集型页面使用客户端渲染
   */
  routeRules: {
    // 首页使用 SWR 缓存，60秒后重新验证
    '/': { swr: 60 },
    // 登录/注册页使用 SWR 缓存
    '/login': { swr: 300 },
    '/register': { swr: 300 },
    // 帮助和定价页面使用 SWR 缓存
    '/help': { swr: 300 },
    '/pricing': { swr: 300 },
    // 后台管理页面使用 SSR（需要实时数据）
    '/admin/**': { ssr: true },
    // 对话页面使用客户端渲染（交互密集型）
    '/chat': { ssr: false },
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
        // 预连接到 API 服务器，减少 DNS 查询时间
        { name: 'format-detection', content: 'telephone=no' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        // 预连接到 Google Fonts
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      ],
    },
    // 页面过渡动画
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },

  // 实验性功能
  experimental: {
    // 启用组件自动导入
    componentIslands: true,
  },

  // Vite 构建优化
  vite: {
    build: {
      // chunk 大小警告阈值
      chunkSizeWarningLimit: 1000,
    },
  },
})
