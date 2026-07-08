/**
 * 模拟注册接口
 *
 * 由于当前环境中后端 NestJS 服务与数据库未运行，
 * 此接口提供模拟的注册响应，用于前端页面效果验证。
 */

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.username || !body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: '所有字段都不能为空',
    })
  }

  // 模拟注册成功响应
  return {
    code: 0,
    message: '注册成功',
    data: {
      id: Date.now(),
      username: body.username,
      email: body.email,
      createdAt: new Date().toISOString(),
    },
  }
})
