import { apiGet, apiDelete, getApiBaseURL, getToken } from './client'

interface Conversation {
  id: string
  title: string
  agentId?: string
  updatedAt: string
  createdAt: string
}

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

class ChatService {
  /**
   * 发送聊天消息（SSE 流式响应）
   * 返回一个 Response 对象，调用方负责读取流
   */
  async sendMessage(content: string, agentId?: string, conversationId?: string): Promise<Response> {
    const baseURL = getApiBaseURL()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return fetch(`${baseURL}/api/ai-chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        modelId: agentId,
        conversationId: conversationId || undefined,
        messages: [{ role: 'user', content }],
      }),
    })
  }

  /** 获取聊天对话列表 */
  async getHistory(agentId?: string, limit?: number): Promise<Conversation[]> {
    return apiGet<Conversation[]>('/api/ai-conversations', {
      query: { agentId, limit: limit || 20 },
    })
  }

  /** 获取对话详情（含消息） */
  async getConversation(id: string): Promise<{ messages: Message[] }> {
    return apiGet<{ messages: Message[] }>(`/api/ai-conversations/${id}`)
  }

  /** 删除对话 */
  async deleteConversation(id: string): Promise<void> {
    await apiDelete(`/api/ai-conversations/${id}`)
  }
}

export default new ChatService()