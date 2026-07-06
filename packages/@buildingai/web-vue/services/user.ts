import type { User } from '../types'

class UserService {
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      token: 'mock-jwt-token',
      user: {
        id: '1',
        username: 'testuser',
        nickname: '测试用户',
        email,
        role: 'user',
      },
    }
  }

  async register(data: { username: string; email: string; password: string }): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      id: Date.now().toString(),
      username: data.username,
      nickname: data.username,
      email: data.email,
      role: 'user',
    }
  }

  async getProfile(): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: '1',
      username: 'testuser',
      nickname: '测试用户',
      email: 'test@example.com',
      role: 'user',
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 300))
    return {
      id: '1',
      username: data.username || 'testuser',
      nickname: data.nickname || '测试用户',
      email: data.email || 'test@example.com',
      role: 'user',
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300))
  }
}

export default new UserService()
