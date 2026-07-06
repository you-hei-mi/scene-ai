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
    // 压缩输出
    compressPublicAssets: true,
  },

  // 生产环境 API 代理配置
  // routeRules.proxy 在 Nitro 生产构建和开发模式下均生效
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
    // API 代理到后端服务（仅在配置了真实后端地址时启用）
    // 当前环境未运行 NestJS 后端，故禁用 proxy，由 server routes 或前端直接请求处理
    // '/api/**': {
    //   proxy: (process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4090') + '/api/**',
    // },
    // '/consoleapi/**': {
    //   proxy: (process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4090') + '/consoleapi/**',
    // },
  },



  imports: {
    dirs: ['stores'],
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
