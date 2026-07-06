import type { Message } from '../types'

class ChatService {
  async sendMessage(content: string, agentId?: string): Promise<Message> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    return {
      id: Date.now().toString(),
      content: '这是模拟的 AI 回复。实际应用中会调用后端 API。',
      isUser: false,
      timestamp: new Date().toLocaleString('zh-CN'),
    }
  }

  async getHistory(agentId?: string, limit?: number): Promise<Message[]> {
    await new Promise(resolve => setTimeout(resolve, 500))
    return [
      { id: '1', content: '你好！', isUser: true, timestamp: '2024-01-15 10:00' },
      { id: '2', content: '你好！我是你的 AI 助手。', isUser: false, timestamp: '2024-01-15 10:00' },
    ]
  }

  async clearHistory(agentId?: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 200))
  }
}

export default new ChatService()
