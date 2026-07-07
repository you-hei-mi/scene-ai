<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">对话管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">对话配置</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="saveConfig">
        <UIcon name="lucide:save" class="w-4 h-4" />
        保存配置
      </button>
    </div>

    <div class="flex items-center gap-2 mb-8 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        :class="activeTab === tab.key
          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'"
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="w-4 h-4 inline-block mr-1.5" />
        {{ tab.label }}
      </button>
    </div>

    <div class="space-y-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">默认模型</h2>
          <p class="text-sm mt-1 text-slate-500">选择对话默认使用的 AI 模型</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">默认对话模型</label>
            <USelect v-model="chatConfig.defaultModel" :options="modelOptions" />
            <p class="text-xs mt-1 text-slate-500">新建对话时默认使用的模型</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">备选模型 1</label>
              <USelect v-model="chatConfig.fallbackModel1" :options="fallbackModelOptions" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">备选模型 2</label>
              <USelect v-model="chatConfig.fallbackModel2" :options="fallbackModelOptions" />
            </div>
          </div>
          <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">允许用户切换模型</h3>
              <p class="text-xs mt-0.5 text-slate-500">用户可在对话中切换其他可用模型</p>
            </div>
            <UCheckbox :modelValue="chatConfig.allowModelSwitch" @change="chatConfig.allowModelSwitch = !chatConfig.allowModelSwitch" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">上下文长度</h2>
          <p class="text-sm mt-1 text-slate-500">配置对话上下文窗口大小</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">最大上下文长度 (tokens)</label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                :min="1000"
                :max="128000"
                :step="1000"
                v-model.number="chatConfig.maxContextLength"
                class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span class="text-sm font-mono font-medium text-slate-900 dark:text-white w-20 text-right">
                {{ formatNumber(chatConfig.maxContextLength) }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>1K</span>
              <span>32K</span>
              <span>64K</span>
              <span>128K</span>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">最大输出长度 (tokens)</label>
            <USelect v-model="chatConfig.maxOutputLength" :options="outputLengthOptions" />
            <p class="text-xs mt-1 text-slate-500">单次回复的最大 token 数量</p>
          </div>
          <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">启用上下文压缩</h3>
              <p class="text-xs mt-0.5 text-slate-500">当对话超过上下文限制时自动压缩历史消息</p>
            </div>
            <UCheckbox :modelValue="chatConfig.enableContextCompression" @change="chatConfig.enableContextCompression = !chatConfig.enableContextCompression" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">跨对话记忆</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许 Agent 记住同一用户的历史对话</p>
            </div>
            <UCheckbox :modelValue="chatConfig.enableMemory" @change="chatConfig.enableMemory = !chatConfig.enableMemory" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">温度参数</h2>
          <p class="text-sm mt-1 text-slate-500">调整模型输出的随机性和创造性</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">温度 (Temperature)</label>
            <div class="flex items-center gap-4">
              <input
                type="range"
                :min="0"
                :max="2"
                :step="0.1"
                v-model.number="chatConfig.temperature"
                class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
              />
              <span class="text-sm font-mono font-medium text-slate-900 dark:text-white w-12 text-right">
                {{ chatConfig.temperature.toFixed(1) }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-slate-400 mt-1">
              <span>精确 (0)</span>
              <span>平衡 (1)</span>
              <span>创造 (2)</span>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Top P (核采样)</label>
              <div class="flex items-center gap-4">
                <input
                  type="range"
                  :min="0"
                  :max="1"
                  :step="0.05"
                  v-model.number="chatConfig.topP"
                  class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span class="text-sm font-mono font-medium text-slate-900 dark:text-white w-12 text-right">
                  {{ chatConfig.topP.toFixed(2) }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">频率惩罚 (Frequency Penalty)</label>
              <div class="flex items-center gap-4">
                <input
                  type="range"
                  :min="-2"
                  :max="2"
                  :step="0.1"
                  v-model.number="chatConfig.frequencyPenalty"
                  class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span class="text-sm font-mono font-medium text-slate-900 dark:text-white w-12 text-right">
                  {{ chatConfig.frequencyPenalty.toFixed(1) }}
                </span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">存在惩罚 (Presence Penalty)</label>
              <div class="flex items-center gap-4">
                <input
                  type="range"
                  :min="-2"
                  :max="2"
                  :step="0.1"
                  v-model.number="chatConfig.presencePenalty"
                  class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-primary"
                />
                <span class="text-sm font-mono font-medium text-slate-900 dark:text-white w-12 text-right">
                  {{ chatConfig.presencePenalty.toFixed(1) }}
                </span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">重复惩罚 (Repetition Penalty)</label>
              <USelect v-model="chatConfig.repetitionPenalty" :options="repetitionPenaltyOptions" />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">系统提示词</h2>
          <p class="text-sm mt-1 text-slate-500">配置全局系统提示词，影响所有对话的基础行为</p>
        </div>
        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">全局系统提示词</label>
            <UTextarea
              v-model="chatConfig.systemPrompt"
              placeholder="输入全局系统提示词..."
              rows="6"
            />
            <p class="text-xs mt-1 text-slate-500">
              此提示词将应用于所有对话的基础上下文。支持变量: {'{'}user_name{'}'}, {'{'}current_date{'}'}, {'{'}agent_name{'}'}
            </p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">欢迎语</label>
            <UInput v-model="chatConfig.welcomeMessage" placeholder="输入新对话的欢迎语" />
            <p class="text-xs mt-1 text-slate-500">新建对话时自动发送的首条消息</p>
          </div>
          <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">启用流式输出</h3>
              <p class="text-xs mt-0.5 text-slate-500">以打字机效果逐字显示回复</p>
            </div>
            <UCheckbox :modelValue="chatConfig.enableStreaming" @change="chatConfig.enableStreaming = !chatConfig.enableStreaming" />
          </div>
          <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">显示引用来源</h3>
              <p class="text-xs mt-0.5 text-slate-500">在回复中标注知识库引用来源</p>
            </div>
            <UCheckbox :modelValue="chatConfig.showCitations" @change="chatConfig.showCitations = !chatConfig.showCitations" />
          </div>
          <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">启用内容审核</h3>
              <p class="text-xs mt-0.5 text-slate-500">对输入和输出内容进行安全审核</p>
            </div>
            <UCheckbox :modelValue="chatConfig.enableModeration" @change="chatConfig.enableModeration = !chatConfig.enableModeration" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">启用对话评分</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许用户对回复进行点赞/点踩</p>
            </div>
            <UCheckbox :modelValue="chatConfig.enableRating" @change="chatConfig.enableRating = !chatConfig.enableRating" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4">
        <button class="btn-glass" @click="resetConfig">
          <UIcon name="lucide:rotate-ccw" class="w-4 h-4" />
          恢复默认
        </button>
        <button class="btn-glass btn-glass--primary" @click="saveConfig">
          <UIcon name="lucide:save" class="w-4 h-4" />
          保存配置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

definePageMeta({
  layout: 'console',
})

interface ChatConfig {
  defaultModel: string
  fallbackModel1: string
  fallbackModel2: string
  allowModelSwitch: boolean
  maxContextLength: number
  maxOutputLength: number
  enableContextCompression: boolean
  enableMemory: boolean
  temperature: number
  topP: number
  frequencyPenalty: number
  presencePenalty: number
  repetitionPenalty: string
  systemPrompt: string
  welcomeMessage: string
  enableStreaming: boolean
  showCitations: boolean
  enableModeration: boolean
  enableRating: boolean
}

const activeTab = 'config'

const tabs = [
  { key: 'record', label: '对话记录', icon: 'lucide:message-square' },
  { key: 'config', label: '对话配置', icon: 'lucide:settings' },
]

const modelOptions = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
  { label: 'Claude 3 Opus', value: 'claude-3-opus' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
  { label: 'DeepSeek V3', value: 'deepseek-chat' },
  { label: 'GLM-4', value: 'glm-4' },
  { label: '通义千问 Plus', value: 'qwen-plus' },
  { label: 'Moonshot V1.5', value: 'moonshot-v1-128k' },
]

const fallbackModelOptions = [
  { label: '无', value: 'none' },
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-4 Turbo', value: 'gpt-4-turbo' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
  { label: 'DeepSeek V3', value: 'deepseek-chat' },
  { label: 'GLM-4', value: 'glm-4' },
  { label: '通义千问 Plus', value: 'qwen-plus' },
]

const outputLengthOptions = [
  { label: '512 tokens', value: 512 },
  { label: '1024 tokens', value: 1024 },
  { label: '2048 tokens', value: 2048 },
  { label: '4096 tokens (推荐)', value: 4096 },
  { label: '8192 tokens', value: 8192 },
  { label: '16384 tokens', value: 16384 },
]

const repetitionPenaltyOptions = [
  { label: '关闭', value: 'off' },
  { label: '轻度 (1.1)', value: '1.1' },
  { label: '中度 (1.2)', value: '1.2' },
  { label: '重度 (1.5)', value: '1.5' },
]

const defaultConfig: ChatConfig = {
  defaultModel: 'gpt-4o',
  fallbackModel1: 'claude-3-5-sonnet',
  fallbackModel2: 'none',
  allowModelSwitch: true,
  maxContextLength: 32000,
  maxOutputLength: 4096,
  enableContextCompression: true,
  enableMemory: false,
  temperature: 0.7,
  topP: 0.9,
  frequencyPenalty: 0,
  presencePenalty: 0,
  repetitionPenalty: '1.1',
  systemPrompt: '你是一个专业、友好的 AI 助手。你的回答应该准确、简洁、有帮助。当你不确定时，请诚实地说明。请使用与用户相同的语言进行回复。',
  welcomeMessage: '你好！我是你的 AI 助手，有什么可以帮助你的吗？',
  enableStreaming: true,
  showCitations: true,
  enableModeration: true,
  enableRating: true,
}

const chatConfig = reactive<ChatConfig>({ ...defaultConfig })

function formatNumber(num: number): string {
  if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

function resetConfig() {
  Object.assign(chatConfig, { ...defaultConfig })
}

function saveConfig() {
  console.log('保存对话配置:', JSON.parse(JSON.stringify(chatConfig)))
}
</script>