import type { User } from '../types'
import { apiGet, apiPost } from './client'

interface AuthResponse {
  token: string
  user: User
}

class UserService {
  /** 用户登录 */
  async login(username: string, password: string): Promise<AuthResponse> {
    return apiPost<AuthResponse>('/api/auth/login', {
      username,
      password,
      terminal: 1, // PC
    })
  }

  /** 用户注册 */
  async register(data: {
    username: string
    email: string
    password: string
    confirmPassword: string
  }): Promise<{ user: User }> {
    return apiPost<{ user: User }>('/api/auth/register', {
      ...data,
      terminal: 1, // PC
    })
  }

  /** 获取当前用户信息 */
  async getProfile(): Promise<User> {
    return apiGet<User>('/api/user/info')
  }

  /** 更新用户信息（单个字段） */
  async updateProfile(data: { field: string; value: string }): Promise<{ user: User }> {
    return apiPatch<{ user: User }>('/api/user/update-field', data)
  }

  /** 修改密码 */
  async changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Promise<void> {
    await apiPost('/api/auth/change-password', {
      oldPassword,
      newPassword,
      confirmPassword,
    })
  }

  /** 退出登录 */
  async logout(): Promise<void> {
    await apiPost('/api/auth/logout')
  }
}

export default new UserService()