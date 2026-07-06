import { ref } from 'vue'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

interface UseChatReturn {
  messages: ref<Message[]>
  loading: ref<boolean>
  error: ref<string | null>
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

export default function useChat(): UseChatReturn {
  const messages = ref<Message[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function sendMessage(content: string) {
    loading.value = true
    error.value = null

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date().toLocaleString('zh-CN'),
    }
    messages.value.push(userMessage)

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '这是模拟的 AI 回复。在实际应用中，这里会调用后端 API 获取真实的 AI 响应。',
        isUser: false,
        timestamp: new Date().toLocaleString('zh-CN'),
      }
      messages.value.push(aiMessage)
    } catch (err) {
      error.value = '发送消息失败，请重试'
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
  }
}
