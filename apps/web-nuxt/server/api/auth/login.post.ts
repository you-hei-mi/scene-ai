/**
 * 模拟登录接口
 *
 * 由于当前环境中后端 NestJS 服务与数据库未运行，
 * 此接口提供模拟的登录响应，用于前端页面效果验证。
 */

const MOCK_TOKEN = 'mock-jwt-token-for-preview-only'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: '用户名和密码不能为空',
    })
  }

  // 模拟登录成功响应
  return {
    code: 0,
    message: '登录成功',
    data: {
      accessToken: MOCK_TOKEN,
      user: {
        id: 1,
        username: body.username,
        nickname: body.username,
        email: 'demo@buildingai.local',
        avatar: null,
        role: 'admin',
        createdAt: new Date().toISOString(),
      },
    },
  }
})
