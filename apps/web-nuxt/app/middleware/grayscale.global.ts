/**
 * 灰度发布中间件
 *
 * 根据用户 ID 或配置比例，决定用户是否进入新版本。
 * 支持按用户比例灰度、按用户 ID 白名单、按 IP 白名单。
 *
 * 使用方式：在 nuxt.config.ts 的 routeRules 中配置，或在页面中使用 useGrayscale()
 */

/**
 * 灰度配置接口
 */
interface GrayscaleConfig {
  /** 是否启用灰度 */
  enabled: boolean
  /** 灰度比例（0-100） */
  percentage: number
  /** 用户 ID 白名单（不受比例限制） */
  whitelistUserIds: string[]
  /** IP 白名单 */
  whitelistIps: string[]
  /** 版本标识 */
  version: string
}

/**
 * 灰度配置（从环境变量读取）
 */
const grayscaleConfig: GrayscaleConfig = {
  enabled: process.env.NUXT_PUBLIC_GRAYSCALE_ENABLED === 'true',
  percentage: parseInt(process.env.NUXT_PUBLIC_GRAYSCALE_PERCENTAGE || '0'),
  whitelistUserIds: process.env.NUXT_PUBLIC_GRAYSCALE_WHITELIST_USERS
    ? process.env.NUXT_PUBLIC_GRAYSCALE_WHITELIST_USERS.split(',')
    : [],
  whitelistIps: process.env.NUXT_PUBLIC_GRAYSCALE_WHITELIST_IPS
    ? process.env.NUXT_PUBLIC_GRAYSCALE_WHITELIST_IPS.split(',')
    : [],
  version: process.env.NUXT_PUBLIC_GRAYSCALE_VERSION || 'v2',
}

/**
 * 判断用户是否在灰度范围内
 *
 * @param userId - 用户 ID（可选）
 * @param ip - 用户 IP（可选）
 * @returns 是否在灰度范围内
 */
export function isInGrayscale(userId?: string, ip?: string): boolean {
  // 如果灰度未启用，所有用户都进入新版本
  if (!grayscaleConfig.enabled) {
    return true
  }

  // IP 白名单检查
  if (ip && grayscaleConfig.whitelistIps.includes(ip)) {
    return true
  }

  // 用户 ID 白名单检查
  if (userId && grayscaleConfig.whitelistUserIds.includes(userId)) {
    return true
  }

  // 根据比例计算
  if (!userId) {
    return false
  }

  // 使用用户 ID 的哈希值计算比例
  const hash = userId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const percentage = (hash % 100) + 1

  return percentage <= grayscaleConfig.percentage
}

/**
 * 组合式函数：获取灰度状态
 *
 * @returns 灰度状态对象
 */
export function useGrayscale() {
  const userStore = useUserStore()
  const userId = userStore.user?.id
  const enabled = ref(isInGrayscale(userId))
  const version = ref(grayscaleConfig.version)

  return {
    /** 是否在灰度范围内 */
    enabled,
    /** 当前版本 */
    version,
    /** 灰度配置 */
    config: grayscaleConfig,
    /** 更新灰度状态 */
    refresh: () => {
      enabled.value = isInGrayscale(userId)
    },
  }
}

/**
 * 服务器端灰度检查中间件
 */
export default defineNuxtRouteMiddleware((to, from) => {
  const config = grayscaleConfig

  if (!config.enabled) {
    return
  }

  // 获取用户 ID（从 session 或 token）
  const userId = useCookie('user_id').value

  if (!isInGrayscale(userId)) {
    // 重定向到旧版本或显示提示
    return navigateTo('/')
  }
})
