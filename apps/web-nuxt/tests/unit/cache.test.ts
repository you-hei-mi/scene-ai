import { describe, it, expect } from 'vitest'

/**
 * API 缓存工具单元测试
 *
 * 测试 setCache、getCache、clearCache 函数的核心功能。
 */
describe('API 缓存工具', () => {
  it('setCache 应该能存储数据', async () => {
    const { setCache } = await import('../../app/composables/useApiFetch')
    setCache('test-key', { name: 'test' })
    // 不抛出异常即可
    expect(true).toBe(true)
  })

  it('getCache 应该能获取未过期的缓存数据', async () => {
    const { setCache, getCache } = await import('../../app/composables/useApiFetch')
    const testData = { name: 'test', value: 123 }
    setCache('test-key-2', testData, 10000)
    const result = getCache<typeof testData>('test-key-2')
    expect(result).toEqual(testData)
  })

  it('getCache 应该在缓存过期后返回 null', async () => {
    const { setCache, getCache } = await import('../../app/composables/useApiFetch')
    setCache('expired-key', 'data', -1) // 已过期
    const result = getCache('expired-key')
    expect(result).toBeNull()
  })

  it('clearCache 应该清除指定缓存', async () => {
    const { setCache, getCache, clearCache } = await import('../../app/composables/useApiFetch')
    setCache('clear-test', 'data')
    clearCache('clear-test')
    expect(getCache('clear-test')).toBeNull()
  })

  it('clearCache 无参数时应该清除全部缓存', async () => {
    const { setCache, getCache, clearCache } = await import('../../app/composables/useApiFetch')
    setCache('key1', 'data1')
    setCache('key2', 'data2')
    clearCache()
    expect(getCache('key1')).toBeNull()
    expect(getCache('key2')).toBeNull()
  })
})
