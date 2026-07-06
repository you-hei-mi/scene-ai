<template>
  <div class="flex h-full">
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
      <div class="h-12 border-b border-border flex items-center px-4 gap-2">
        <UButton
          v-if="sidebarCollapsed"
          variant="ghost"
          size="sm"
          icon="lucide:panel-left"
          @click="sidebarCollapsed = false"
        />
        <div class="flex-1 flex items-center justify-center">
          <h1 class="font-medium">
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
        class="flex-1 overflow-y-auto"
      >
        <div class="max-w-3xl mx-auto py-6 px-4">
          <div v-if="messages.length === 0" class="text-center py-20">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
              <UIcon name="lucide:message-square" class="w-8 h-8 text-primary" />
            </div>
            <h2 class="text-2xl font-semibold mb-2">有什么我可以帮您的？</h2>
            <p class="text-muted-foreground mb-8">输入您的问题，开始与 AI 对话</p>
            <div class="grid grid-cols-2 gap-4 max-w-lg mx-auto">
              <UCard
                v-for="suggestion in suggestions"
                :key="suggestion.title"
                class="cursor-pointer hover:border-primary transition-colors text-left"
                @click="sendMessage(suggestion.title)"
              >
                <div class="flex items-start gap-3">
                  <UIcon :name="suggestion.icon" class="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div class="font-medium mb-1">{{ suggestion.title }}</div>
                    <div class="text-sm text-muted-foreground">{{ suggestion.desc }}</div>
                  </div>
                </div>
              </UCard>
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

      <div class="border-t border-border p-4">
        <div class="max-w-3xl mx-auto">
          <ChatInput
            v-model="inputValue"
            :disabled="isTyping"
            @send="handleSend"
            @stop="handleStop"
          />
          <p class="text-xs text-center text-muted-foreground mt-2">
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
