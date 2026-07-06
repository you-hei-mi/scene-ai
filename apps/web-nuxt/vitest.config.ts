import { defineVitestConfig } from '@nuxt/test-utils/config'

/**
 * Vitest 配置文件
 *
 * 配置单元测试环境，使用 jsdom 模拟浏览器环境，
 * 自动导入 Nuxt 组件和 composables。
 */
export default defineVitestConfig({
  test: {
    // 测试环境配置
    environment: 'nuxt',
    // 包含的测试文件
    include: ['tests/unit/**/*.test.ts'],
    // 排除的文件
    exclude: ['node_modules', 'dist', '.output', 'tests/e2e'],
    // 覆盖率配置
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      reportsDirectory: './tests/coverage',
      // 覆盖率阈值
      thresholds: {
        statements: 60,
        branches: 60,
        functions: 60,
        lines: 60,
      },
    },
    // 全局设置
    globals: true,
    // 设置文件
    setupFiles: ['./tests/unit/setup.ts'],
  },
})
