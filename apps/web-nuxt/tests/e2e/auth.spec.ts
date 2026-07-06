import { test, expect } from '@playwright/test'

/**
 * 认证流程 E2E 测试
 *
 * 测试用户登录、注册和登出流程。
 */
test.describe('认证流程', () => {
  /**
   * 登录页面应该正确渲染
   */
  test('登录页面应该显示标题和表单', async ({ page }) => {
    await page.goto('/login')

    // 验证页面标题
    await expect(page.locator('h1, h2, h3').first()).toBeVisible()

    // 验证表单存在
    await expect(page.locator('input[type="text"], input[type="email"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()

    // 验证提交按钮存在
    await expect(page.getByRole('button')).toBeVisible()
  })

  /**
   * 未填写信息时不应提交
   */
  test('空表单不应提交', async ({ page }) => {
    await page.goto('/login')

    // 点击登录按钮
    const submitButton = page.getByRole('button').last()
    await submitButton.click()

    // 应该还在登录页
    await expect(page).toHaveURL(/\/login/)
  })

  /**
   * 注册页面应该正确渲染
   */
  test('注册页面应该显示表单', async ({ page }) => {
    await page.goto('/register')

    // 验证页面元素存在
    await expect(page.locator('input')).toHaveCount(3) // 用户名、邮箱、密码
  })
})

/**
 * 导航功能 E2E 测试
 */
test.describe('导航功能', () => {
  /**
   * 未登录用户应重定向到登录页
   */
  test('未登录访问受保护页面应重定向', async ({ page }) => {
    await page.goto('/chat')
    await expect(page).toHaveURL(/\/login/)
  })

  /**
   * 首页应该正确加载
   */
  test('首页应该正确加载', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/BuildingAI/)
  })
})

/**
 * 页面可访问性测试（标签 @a11y）
 */
test.describe('无障碍检查 @a11y', () => {
  /**
   * 登录页应该有正确的标签关联
   */
  test('登录页面表单应该有无障碍标签', async ({ page }) => {
    await page.goto('/login')

    // 检查是否有 label 或 aria-label
    const inputs = page.locator('input')
    const count = await inputs.count()

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i)
      const hasLabel = await input.getAttribute('aria-label')
        || await input.getAttribute('placeholder')
        || await page.locator('label').filter({ has: input }).count()

      expect(hasLabel).toBeTruthy()
    }
  })

  /**
   * 页面应该支持键盘导航
   */
  test('页面应该支持 Tab 键导航', async ({ page }) => {
    await page.goto('/login')

    // 按 Tab 键应该能聚焦到可交互元素
    await page.keyboard.press('Tab')
    const focused = await page.evaluate(() => document.activeElement?.tagName)
    expect(['INPUT', 'BUTTON', 'A', 'TEXTAREA']).toContain(focused)
  })
})
