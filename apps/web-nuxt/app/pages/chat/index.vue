<template>
  <div class="flex h-full bg-white dark:bg-slate-900">
    <ChatSidebar
      v-if="!sidebarCollapsed"
      :conversations="conversations"
      :active-id="activeConversationId"
      @select="handleSelectConversation"
      @new="handleNewConversation"
      @delete="handleDeleteConversation"
      @toggle-sidebar="sidebarCollapsed = true"
    />

    <div class="flex-1 flex flex-col min-w-0">
      <div class="h-14 flex items-center px-4 gap-3 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl">
        <button
          v-if="sidebarCollapsed"
          class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
          @click="sidebarCollapsed = false"
        >
          <UIcon name="lucide:panel-left" class="w-5 h-5 text-slate-600 dark:text-slate-300" />
        </button>
        <div class="flex-1 flex items-center justify-center">
          <h1 class="font-semibold text-slate-900 dark:text-white">
            {{ currentConversation?.title || '新对话' }}
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <ModelSelector
            :model="currentModel"
            @change="handleModelChange"
          />
        </div>
      </div>

      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white/50 dark:from-slate-900/50 dark:to-slate-800/50"
      >
        <div class="max-w-3xl mx-auto py-6 px-4">
          <div v-if="messages.length === 0" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 bg-gradient-to-br from-primary/10 to-accent/10">
              <UIcon name="lucide:message-square" class="w-10 h-10 text-primary" />
            </div>
            <h2 class="text-2xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">有什么我可以帮您的？</h2>
            <p class="text-slate-500 dark:text-slate-400 mb-10">输入您的问题，开始与 AI 对话</p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              <div
                v-for="suggestion in suggestions"
                :key="suggestion.title"
                class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl p-5 cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 text-left"
                @click="sendMessage(suggestion.title)"
              >
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <UIcon :name="suggestion.icon" class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div class="font-semibold text-slate-900 dark:text-white mb-1">{{ suggestion.title }}</div>
                    <div class="text-sm text-slate-500 dark:text-slate-400">{{ suggestion.desc }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-else class="space-y-6">
            <ChatMessage
              v-for="message in messages"
              :key="message.id"
              :message="message"
            />
          </div>

          <div v-if="isTyping" class="mt-6">
            <ChatMessage
              :message="{
                id: 'typing',
                role: 'assistant',
                content: '',
                isTyping: true,
              }"
            />
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4">
        <div class="max-w-3xl mx-auto">
          <ChatInput
            v-model="inputValue"
            :disabled="isTyping"
            @send="handleSend"
            @stop="handleStop"
          />
          <p class="text-xs text-center mt-3 text-slate-400 dark:text-slate-500">
            AI 可能会犯错，请核实重要信息
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

definePageMeta({
  layout: 'console',
})

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  isTyping?: boolean
}

interface Conversation {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date
}

const userStore = useUserStore()
const toast = useToast()

const sidebarCollapsed = ref(false)
const inputValue = ref('')
const messages = ref<ChatMessage[]>([])
const isTyping = ref(false)
const messagesContainer = ref<HTMLElement>()
const activeConversationId = ref<string | null>(null)
const currentModel = ref('deepseek-chat')

const conversations = ref<Conversation[]>([
  {
    id: '1',
    title: '欢迎使用 BuildingAI',
    lastMessage: '您好！有什么我可以帮您的？',
    updatedAt: new Date(),
  },
])

const suggestions = [
  {
    title: '帮我写一段 Python 代码',
    desc: '生成代码示例',
    icon: 'lucide:code',
  },
  {
    title: '解释一下量子计算',
    desc: '获取知识解答',
    icon: 'lucide:lightbulb',
  },
  {
    title: '翻译这段英文',
    desc: '语言翻译助手',
    icon: 'lucide:languages',
  },
  {
    title: '帮我写一封邮件',
    desc: '写作辅助工具',
    icon: 'lucide:mail',
  },
]

const currentConversation = ref<Conversation | null>(null)

watch(activeConversationId, (id) => {
  currentConversation.value = conversations.value.find(c => c.id === id) || null
})

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

async function sendMessage(content: string) {
  if (!content.trim() || isTyping.value) return

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content,
    timestamp: new Date(),
  }

  messages.value.push(userMessage)
  inputValue.value = ''
  isTyping.value = true
  scrollToBottom()

  try {
    const response = await mockAssistantResponse(content)
    isTyping.value = false
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    }
    messages.value.push(assistantMessage)
    scrollToBottom()
  } catch (error: any) {
    isTyping.value = false
    toast.add({
      title: '发送失败',
      description: error.message,
      color: 'red',
    })
  }
}

function mockAssistantResponse(userMessage: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        `我收到了您的消息："${userMessage}"\n\n这是一个演示回复。在实际开发中，这里会连接到真实的 AI 接口。\n\n**功能特性：**\n- 流式输出支持\n- Markdown 渲染\n- 代码高亮\n- 多轮对话上下文`
      )
    }, 1000)
  })
}

function handleSend() {
  sendMessage(inputValue.value)
}

function handleStop() {
  isTyping.value = false
}

function handleSelectConversation(id: string) {
  activeConversationId.value = id
  messages.value = [
    {
      id: '1',
      role: 'assistant',
      content: '您好！有什么我可以帮您的？',
      timestamp: new Date(),
    },
  ]
}

function handleNewConversation() {
  const newConv: Conversation = {
    id: Date.now().toString(),
    title: '新对话',
    updatedAt: new Date(),
  }
  conversations.value.unshift(newConv)
  activeConversationId.value = newConv.id
  messages.value = []
}

function handleDeleteConversation(id: string) {
  const index = conversations.value.findIndex(c => c.id === id)
  if (index > -1) {
    conversations.value.splice(index, 1)
    if (activeConversationId.value === id) {
      activeConversationId.value = conversations.value[0]?.id || null
      messages.value = []
    }
  }
}

function handleModelChange(model: string) {
  currentModel.value = model
}
</script>
