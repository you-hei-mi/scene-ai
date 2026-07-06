/**
 * Vitest 全局设置文件
 *
 * 在所有测试运行前执行，用于初始化测试环境。
 */

/**
 * 模拟 useRuntimeConfig
 * 提供测试环境下的运行时配置
 */
vi.stubGlobal('useRuntimeConfig', () => ({
  public: {
    apiBaseUrl: 'http://localhost:4090',
    appName: 'BuildingAI',
  },
}))

/**
 * 模拟 useUserStore
 * 提供测试环境下的用户状态
 */
vi.stubGlobal('useUserStore', () => ({
  token: 'mock-token',
  user: {
    id: '1',
    username: 'testuser',
    nickname: '测试用户',
    email: 'test@example.com',
  },
  isLoggedIn: true,
  logout: vi.fn(),
}))
