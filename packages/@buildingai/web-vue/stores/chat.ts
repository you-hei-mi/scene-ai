import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Message {
  id: string
  content: string
  isUser: boolean
  timestamp: string
}

export const useChatStore = defineStore('chat', () => {
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
        content: '这是模拟的 AI 回复。实际应用中会调用后端 API。',
        isUser: false,
        timestamp: new Date().toLocaleString('zh-CN'),
      }
      messages.value.push(aiMessage)
    } catch (err) {
      error.value = '发送失败'
    } finally {
      loading.value = false
    }
  }

  function clearMessages() {
    messages.value = []
  }

  function removeMessage(id: string) {
    const index = messages.value.findIndex(m => m.id === id)
    if (index > -1) {
      messages.value.splice(index, 1)
    }
  }

  return {
    messages,
    loading,
    error,
    sendMessage,
    clearMessages,
    removeMessage,
  }
})
