<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <header class="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex-shrink-0">
      <div class="flex items-center gap-4">
        <button class="btn-glass p-2" @click="handleBack">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
        </button>
        <div class="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
          <UIcon name="lucide:bot" class="w-4 h-4 text-white" />
        </div>
        <div>
          <h1 class="font-semibold text-slate-900 dark:text-white">{{ agentInfo.name }}</h1>
          <p class="text-xs text-slate-500">{{ agentInfo.model }}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">
          调试模式
        </span>
      </div>
    </header>

    <div class="flex-1 overflow-y-auto">
      <div class="max-w-3xl mx-auto py-6 px-4">
        <div v-if="messages.length === 0" class="text-center py-20">
          <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-8 bg-gradient-to-br from-primary/10 to-accent/10">
            <UIcon name="lucide:message-square" class="w-10 h-10 text-primary" />
          </div>
          <h2 class="text-2xl font-bold mb-3 text-slate-900 dark:text-white">{{ agentInfo.name }}</h2>
          <p class="text-slate-500 dark:text-slate-400 mb-10">{{ agentInfo.description }}</p>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
            <div
              v-for="suggestion in suggestions"
              :key="suggestion.text"
              class="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-xl p-4 cursor-pointer hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 text-left"
              @click="sendMessage(suggestion.text)"
            >
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <UIcon :name="suggestion.icon" class="w-4 h-4 text-primary" />
                </div>
                <div>
                  <div class="font-medium text-sm text-slate-900 dark:text-white">{{ suggestion.text }}</div>
                  <div class="text-xs text-slate-500 mt-0.5">{{ suggestion.desc }}</div>
                </div>
              </div>
            </div>
          </div>
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
                {{ msg.role === 'user' ? '我' : agentInfo.name }}
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
            placeholder="输入消息..."
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
          AI 可能会犯错，请核实重要信息
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

const route = useRoute()

const agentId = computed(() => route.params.id as string)

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
  model: 'DeepSeek V3',
  description: '一个功能全面的通用 AI 助手，可以回答各种问题、提供建议和帮助解决问题。',
})

const suggestions = [
  { text: '帮我写一段 Python 代码', desc: '生成代码示例', icon: 'lucide:code' },
  { text: '解释一下量子计算', desc: '获取知识解答', icon: 'lucide:lightbulb' },
  { text: '翻译这段英文', desc: '语言翻译助手', icon: 'lucide:languages' },
  { text: '帮我写一封邮件', desc: '写作辅助工具', icon: 'lucide:mail' },
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
      content: `这是来自【${agentInfo.value.name}】的回复：\n\n我已经收到您的问题"${content}"，正在为您处理...\n\n（这是调试模式的模拟回复，实际环境中会连接到真实的 AI 接口）`,
    }
    messages.value.push(assistantMessage)
  }, 1500)
}

function handleSend() {
  sendMessage(inputValue.value)
}

function handleBack() {
  navigateTo(`/agents/${agentId.value}`)
}
</script>