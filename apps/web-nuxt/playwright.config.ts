import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright E2E 测试配置
 *
 * 配置端到端测试环境，支持多浏览器测试和无障碍检查。
 */
export default defineConfig({
  // 测试目录
  testDir: './tests/e2e',

  // 测试执行超时（毫秒）
  timeout: 30 * 1000,

  // 预期断言超时
  expect: {
    timeout: 5000,
  },

  // 并行执行
  fullyParallel: true,

  // CI 环境下禁止重试，本地允许 1 次
  retries: process.env.CI ? 0 : 1,

  // 并发工作线程数
  workers: process.env.CI ? 1 : undefined,

  // 报告配置
  reporter: [
    ['html', { outputFolder: 'tests/e2e-report' }],
    ['list'],
  ],

  // 全局配置
  use: {
    // 基础 URL
    baseURL: 'http://localhost:3000',

    // 浏览器视口
    viewport: { width: 1280, height: 720 },

    // 截图策略：仅失败时
    screenshot: 'only-on-failure',

    // 录制视频：仅失败时
    video: 'retain-on-failure',

    // 跟踪：首次重试时记录
    trace: 'on-first-retry',
  },

  // 浏览器项目配置
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // 移动端测试
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // 本地开发服务器配置
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
