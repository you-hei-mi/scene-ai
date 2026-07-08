<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <header class="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex-shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
          <UIcon name="lucide:bot" class="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 class="font-semibold text-slate-900 dark:text-white">{{ agentInfo.name }}</h1>
          <p class="text-xs text-slate-500">{{ agentInfo.description }}</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-glass p-2 text-xs" @click="handleNewChat">
          <UIcon name="lucide:plus" class="w-3 h-3" />
        </button>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto py-6 px-4">
        <div v-if="messages.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 bg-gradient-to-br from-primary/10 to-accent/10">
            <UIcon name="lucide:message-square" class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{{ agentInfo.name }}</h2>
          <p class="text-slate-500 dark:text-slate-400">{{ agentInfo.description }}</p>
        </div>

        <div v-else class="space-y-6">
          <div
            v-for="msg in messages"
            :key="msg.id"
            class="flex gap-3"
          >
            <div
              :class="[
                'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                msg.role === 'user'
                  ? 'bg-gradient-to-br from-primary to-accent text-white'
                  : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              ]"
            >
              <UIcon :name="msg.role === 'user' ? 'lucide:user' : 'lucide:bot'" class="w-5 h-5" />
            </div>
            <div class="flex-1 max-w-[75%]">
              <div class="font-medium text-sm text-slate-900 dark:text-white mb-1">
                {{ msg.role === 'user' ? '访客' : agentInfo.name }}
              </div>
              <div
                :class="[
                  'px-4 py-3 rounded-2xl text-sm',
                  msg.role === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                ]"
              >
                {{ msg.content }}
              </div>
            </div>
          </div>

          <div v-if="isTyping" class="flex gap-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-200 dark:bg-slate-700">
              <UIcon name="lucide:bot" class="w-5 h-5 text-slate-700 dark:text-slate-300" />
            </div>
            <div class="flex-1 max-w-[75%]">
              <div class="font-medium text-sm text-slate-900 dark:text-white mb-1">{{ agentInfo.name }}</div>
              <div class="px-4 py-3 rounded-2xl bg-slate-100 dark:bg-slate-700">
                <span class="inline-flex gap-1">
                  <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 0ms"></span>
                  <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 150ms"></span>
                  <span class="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style="animation-delay: 300ms"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl p-4 flex-shrink-0">
      <div class="max-w-3xl mx-auto">
        <div class="flex gap-3">
          <input
            v-model="inputValue"
            placeholder="发送消息..."
            :disabled="isTyping"
            class="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            @keydown.enter="handleSend"
          />
          <button
            class="btn-glass btn-glass--primary px-6"
            :disabled="!inputValue.trim() || isTyping"
            @click="handleSend"
          >
            <UIcon name="lucide:send" class="w-4 h-4" />
          </button>
        </div>
        <p class="text-xs text-center mt-3 text-slate-400 dark:text-slate-500">
          由 {{ agentInfo.name }} 提供支持
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: false,
})

const route = useRoute()

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const inputValue = ref('')
const messages = ref<ChatMessage[]>([])
const isTyping = ref(false)

const agentInfo = ref({
  name: '通用 AI 助手',
  description: '一个功能全面的通用 AI 助手，可以回答各种问题、提供建议和帮助解决问题。',
})

const mockConversations: ChatMessage[] = [
  { id: '1', role: 'assistant', content: '您好！我是通用 AI 助手，有什么可以帮您的吗？' },
  { id: '2', role: 'user', content: '你好，我想了解一下人工智能的发展趋势' },
  { id: '3', role: 'assistant', content: '好的！以下是当前人工智能的一些主要发展趋势：\n\n1. **大语言模型持续演进** - 模型能力不断提升，应用场景更加广泛\n2. **多模态AI成为主流** - 文本、图像、语音等多模态融合\n3. **AI Agent框架快速发展** - 自主决策和执行能力增强\n4. **边缘AI部署** - 模型本地化运行，降低延迟保护隐私\n5. **AI安全与对齐** - 更加注重AI的安全性和可控性\n\n您对哪个方向特别感兴趣？我可以深入展开。' },
  { id: '4', role: 'user', content: '能详细说说 AI Agent 吗？' },
  { id: '5', role: 'assistant', content: '当然可以！AI Agent（智能体）是指能够自主感知环境、做出决策并执行行动的AI系统。\n\n**核心特征：**\n- 自主性：能够独立完成任务\n- 反应性：能够感知环境变化并做出响应\n- 主动性：能够主动采取行动达成目标\n- 社交性：能够与其他Agent或人类交互\n\n**应用场景：**\n- 自动化工作流\n- 智能客服\n- 代码生成与调试\n- 数据分析与报告\n\n目前主流的AI Agent框架包括 LangChain、AutoGPT、MetaGPT 等。' },
]

function sendMessage(content: string) {
  if (!content.trim() || isTyping.value) return

  const userMessage: ChatMessage = {
    id: Date.now().toString(),
    role: 'user',
    content,
  }

  messages.value.push(userMessage)
  inputValue.value = ''
  isTyping.value = true

  setTimeout(() => {
    isTyping.value = false
    const assistantMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `感谢您的提问！关于"${content}"，我来为您解答：\n\n这是一个很好的问题。作为通用 AI 助手，我会尽力提供准确、有帮助的回答。\n\n（这是模拟回复，实际环境中会连接到真实的 AI 接口）`,
    }
    messages.value.push(assistantMessage)
  }, 1500)
}

function handleSend() {
  sendMessage(inputValue.value)
}

function handleNewChat() {
  messages.value = []
  inputValue.value = ''
}
</script>