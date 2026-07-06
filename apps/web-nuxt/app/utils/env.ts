/**
 * 环境配置工具
 *
 * 统一管理开发、测试、生产环境的配置差异。
 */

/**
 * 环境类型
 */
type Environment = 'development' | 'staging' | 'production'

/**
 * 环境配置接口
 */
interface EnvConfig {
  /** 环境名称 */
  name: Environment
  /** 是否开发环境 */
  isDev: boolean
  /** 是否生产环境 */
  isProd: boolean
  /** 是否测试环境 */
  isStaging: boolean
  /** API 基础 URL */
  apiBaseUrl: string
  /** 应用名称 */
  appName: string
  /** 是否启用模拟数据 */
  mockData: boolean
  /** 是否启用开发者工具 */
  devTools: boolean
}

/**
 * 获取当前环境
 */
function getEnvironment(): Environment {
  const nodeEnv = process.env.NODE_ENV || 'development'
  return nodeEnv as Environment
}

/**
 * 当前环境配置
 */
export const envConfig: EnvConfig = {
  name: getEnvironment(),
  isDev: getEnvironment() === 'development',
  isProd: getEnvironment() === 'production',
  isStaging: getEnvironment() === 'staging',
  apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4090',
  appName: process.env.NUXT_PUBLIC_APP_NAME || 'BuildingAI',
  mockData: process.env.NUXT_PUBLIC_MOCK_DATA === 'true',
  devTools: process.env.NODE_ENV !== 'production',
}

/**
 * 组合式函数：获取环境配置
 */
export function useEnv() {
  return envConfig
}

/**
 * 日志工具（根据环境决定是否输出）
 */
export const logger = {
  /**
   * 输出调试日志（仅开发环境）
   */
  debug: (...args: any[]) => {
    if (envConfig.isDev) {
      console.debug('[DEBUG]', ...args)
    }
  },
  /**
   * 输出信息日志（仅开发和测试环境）
   */
  info: (...args: any[]) => {
    if (!envConfig.isProd) {
      console.info('[INFO]', ...args)
    }
  },
  /**
   * 输出警告日志（所有环境）
   */
  warn: (...args: any[]) => {
    console.warn('[WARN]', ...args)
  },
  /**
   * 输出错误日志（所有环境）
   */
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args)
  },
}
