<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">模型管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理系统可用的 AI 模型和提供商配置</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-glass" @click="syncModels">
          <UIcon name="lucide:refresh-cw" class="w-4 h-4" />
          同步模型
        </button>
        <button class="btn-glass btn-glass--primary" @click="showAddDialog = true">
          <UIcon name="lucide:plus" class="w-4 h-4" />
          添加模型
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">模型总数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalModels }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:brain" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">已启用</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ stats.enabled }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:check-circle" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">提供商数量</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.providers }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:building-2" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日调用</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.todayCalls.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:activity" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            v-model="searchKeyword" 
            placeholder="搜索模型名称..." 
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="providerFilter" :options="providerOptions" class="w-44" />
        <USelect v-model="typeFilter" :options="typeOptions" class="w-40" />
        <USelect v-model="statusFilter" :options="statusOptions" class="w-36" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-12">
                <UCheckbox />
              </th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">模型</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">提供商</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-28">类型</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-36">上下文长度</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">输入价格</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">输出价格</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">状态</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500 w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="model in filteredModels"
              :key="model.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <UCheckbox />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center"
                    :class="getProviderIconBg(model.provider)"
                  >
                    <UIcon
                      :name="getProviderIcon(model.provider)"
                      class="w-5 h-5"
                      :class="getProviderIconColor(model.provider)"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-sm text-slate-900 dark:text-white">{{ model.name }}</div>
                    <div class="text-xs text-slate-500">{{ model.modelId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-900 dark:text-white">{{ model.providerName }}</span>
              </td>
              <td class="px-6 py-4">
                <UBadge :variant="getTypeBadgeVariant(model.type)" size="sm">
                  {{ getTypeText(model.type) }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ formatContextLength(model.contextLength) }}</td>
              <td class="px-6 py-4 text-sm">
                <span class="text-slate-900 dark:text-white">¥{{ model.inputPrice }}</span>
                <span class="text-xs text-slate-500">/M tokens</span>
              </td>
              <td class="px-6 py-4 text-sm">
                <span class="text-slate-900 dark:text-white">¥{{ model.outputPrice }}</span>
                <span class="text-xs text-slate-500">/M tokens</span>
              </td>
              <td class="px-6 py-4">
                <label class="inline-flex items-center cursor-pointer">
                  <UCheckbox :modelValue="model.enabled" @change="toggleModel(model)" />
                </label>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑模型" icon="lucide:edit" @click="editModel(model)" />
                    <UDropdownMenuItem label="测试模型" icon="lucide:play" @click="testModel(model)" />
                    <UDropdownMenuItem
                      v-if="model.enabled"
                      label="禁用模型"
                      icon="lucide:ban"
                      @click="toggleModel(model)"
                    />
                    <UDropdownMenuItem
                      v-else
                      label="启用模型"
                      icon="lucide:check"
                      color="green"
                      @click="toggleModel(model)"
                    />
                    <UDropdownMenuItem label="删除模型" icon="lucide:trash-2" color="red" @click="deleteModel(model)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredModels.length === 0" class="text-center py-12">
        <UIcon name="lucide:brain-circuit" class="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <p class="text-slate-500">未找到匹配的模型</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ totalModels }} 个模型
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm font-medium text-slate-900 dark:text-white">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UDialog v-model="showAddDialog" :title="editingModel ? '编辑模型' : '添加模型'" size="xl">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">模型名称</label>
            <UInput v-model="formData.name" placeholder="输入模型显示名称" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">模型 ID</label>
            <UInput v-model="formData.modelId" placeholder="例如: gpt-4" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">提供商</label>
            <USelect v-model="formData.provider" :options="providerSelectOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">模型类型</label>
            <USelect v-model="formData.type" :options="typeSelectOptions" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">上下文长度</label>
            <UInput v-model.number="formData.contextLength" placeholder="例如: 128000" type="number" />
            <p class="text-xs mt-1 text-slate-500">最大 token 数量</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">最大输出长度</label>
            <UInput v-model.number="formData.maxOutput" placeholder="例如: 4096" type="number" />
            <p class="text-xs mt-1 text-slate-500">单次输出最大 token 数</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">输入价格 (元/M tokens)</label>
            <UInput v-model.number="formData.inputPrice" placeholder="例如: 0.15" type="number" step="0.01" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">输出价格 (元/M tokens)</label>
            <UInput v-model.number="formData.outputPrice" placeholder="例如: 0.6" type="number" step="0.01" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">模型描述</label>
          <UTextarea v-model="formData.description" placeholder="输入模型描述信息" rows="3" />
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.enabled" />
            <span class="text-sm text-slate-900 dark:text-white">启用模型</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.isDefault" />
            <span class="text-sm text-slate-900 dark:text-white">设为默认</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.supportVision" />
            <span class="text-sm text-slate-900 dark:text-white">支持视觉</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.supportStreaming" />
            <span class="text-sm text-slate-900 dark:text-white">支持流式输出</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showAddDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveModel">{{ editingModel ? '保存' : '添加' }}</button>
      </template>
    </UDialog>

    <UDialog v-model="showTestDialog" :title="`测试模型 - ${testingModel?.name || ''}`" size="lg">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">测试输入</label>
          <UTextarea v-model="testInput" placeholder="输入测试问题..." rows="4" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-900 dark:text-white">模型响应</label>
          <div class="bg-slate-100 dark:bg-slate-700 min-h-32 p-4 rounded-xl">
            <p v-if="testResponse" class="text-sm whitespace-pre-wrap text-slate-900 dark:text-white">{{ testResponse }}</p>
            <p v-else-if="isTesting" class="text-sm text-slate-500">正在测试...</p>
            <p v-else class="text-sm text-slate-500">点击下方按钮开始测试</p>
          </div>
        </div>
        <div v-if="testResult" class="grid grid-cols-3 gap-4">
          <div class="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <p class="text-xs text-slate-500">输入 tokens</p>
            <p class="text-lg font-bold text-slate-900 dark:text-white mt-1">{{ testResult.inputTokens }}</p>
          </div>
          <div class="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <p class="text-xs text-slate-500">输出 tokens</p>
            <p class="text-lg font-bold text-slate-900 dark:text-white mt-1">{{ testResult.outputTokens }}</p>
          </div>
          <div class="text-center p-4 bg-slate-100 dark:bg-slate-700 rounded-xl">
            <p class="text-xs text-slate-500">响应时间</p>
            <p class="text-lg font-bold text-slate-900 dark:text-white mt-1">{{ testResult.duration }}ms</p>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showTestDialog = false">关闭</button>
        <button class="btn-glass btn-glass--primary" @click="runTest" :disabled="isTesting || !testInput.trim()">
          <UIcon name="lucide:play" class="w-4 h-4" />
          运行测试
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

type ModelType = 'chat' | 'completion' | 'embedding' | 'image' | 'audio'
type ModelProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'zhipu' | 'qwen' | 'moonshot' | 'local'

interface ModelItem {
  id: string
  name: string
  modelId: string
  provider: ModelProvider
  providerName: string
  type: ModelType
  contextLength: number
  maxOutput: number
  inputPrice: number
  outputPrice: number
  description: string
  enabled: boolean
  isDefault: boolean
  supportVision: boolean
  supportStreaming: boolean
  createdAt: string
}

interface TestResult {
  inputTokens: number
  outputTokens: number
  duration: number
}

const searchKeyword = ref('')
const providerFilter = ref('all')
const typeFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const showAddDialog = ref(false)
const showTestDialog = ref(false)
const editingModel = ref<ModelItem | null>(null)
const testingModel = ref<ModelItem | null>(null)
const testInput = ref('')
const testResponse = ref('')
const isTesting = ref(false)
const testResult = ref<TestResult | null>(null)

const providerOptions = [
  { label: '全部提供商', value: 'all' },
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'Google', value: 'google' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: '智谱 AI', value: 'zhipu' },
  { label: '通义千问', value: 'qwen' },
  { label: 'Moonshot', value: 'moonshot' },
  { label: '本地模型', value: 'local' },
]

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '对话模型', value: 'chat' },
  { label: '补全模型', value: 'completion' },
  { label: 'Embedding', value: 'embedding' },
  { label: '图像模型', value: 'image' },
  { label: '音频模型', value: 'audio' },
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '已禁用', value: 'disabled' },
]

const providerSelectOptions = [
  { label: 'OpenAI', value: 'openai' },
  { label: 'Anthropic', value: 'anthropic' },
  { label: 'Google', value: 'google' },
  { label: 'DeepSeek', value: 'deepseek' },
  { label: '智谱 AI', value: 'zhipu' },
  { label: '通义千问', value: 'qwen' },
  { label: 'Moonshot', value: 'moonshot' },
  { label: '本地模型', value: 'local' },
]

const typeSelectOptions = [
  { label: '对话模型', value: 'chat' },
  { label: '补全模型', value: 'completion' },
  { label: 'Embedding 模型', value: 'embedding' },
  { label: '图像模型', value: 'image' },
  { label: '音频模型', value: 'audio' },
]

const formData = ref({
  name: '',
  modelId: '',
  provider: 'openai' as ModelProvider,
  type: 'chat' as ModelType,
  contextLength: 128000,
  maxOutput: 4096,
  inputPrice: 0,
  outputPrice: 0,
  description: '',
  enabled: true,
  isDefault: false,
  supportVision: false,
  supportStreaming: true,
})

const models = ref<ModelItem[]>([
  {
    id: '1',
    name: 'GPT-4o',
    modelId: 'gpt-4o',
    provider: 'openai',
    providerName: 'OpenAI',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0.15,
    outputPrice: 0.6,
    description: 'OpenAI 最新的多模态模型，支持文本和图像输入',
    enabled: true,
    isDefault: true,
    supportVision: true,
    supportStreaming: true,
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'GPT-4 Turbo',
    modelId: 'gpt-4-turbo',
    provider: 'openai',
    providerName: 'OpenAI',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0.1,
    outputPrice: 0.3,
    description: 'GPT-4 高速版本，性价比更高',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: true,
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    name: 'Claude 3.5 Sonnet',
    modelId: 'claude-3-5-sonnet-20240620',
    provider: 'anthropic',
    providerName: 'Anthropic',
    type: 'chat',
    contextLength: 200000,
    maxOutput: 8192,
    inputPrice: 0.2,
    outputPrice: 0.8,
    description: 'Anthropic 最新模型，擅长长文本处理和代码生成',
    enabled: true,
    isDefault: false,
    supportVision: true,
    supportStreaming: true,
    createdAt: '2024-02-15',
  },
  {
    id: '4',
    name: 'Claude 3 Opus',
    modelId: 'claude-3-opus-20240229',
    provider: 'anthropic',
    providerName: 'Anthropic',
    type: 'chat',
    contextLength: 200000,
    maxOutput: 4096,
    inputPrice: 0.75,
    outputPrice: 3.0,
    description: 'Anthropic 旗舰模型，最强推理能力',
    enabled: false,
    isDefault: false,
    supportVision: true,
    supportStreaming: true,
    createdAt: '2024-02-15',
  },
  {
    id: '5',
    name: 'Gemini 1.5 Pro',
    modelId: 'gemini-1.5-pro',
    provider: 'google',
    providerName: 'Google',
    type: 'chat',
    contextLength: 1000000,
    maxOutput: 8192,
    inputPrice: 0.25,
    outputPrice: 0.75,
    description: 'Google 旗舰模型，支持超长上下文',
    enabled: true,
    isDefault: false,
    supportVision: true,
    supportStreaming: true,
    createdAt: '2024-03-01',
  },
  {
    id: '6',
    name: 'DeepSeek V3',
    modelId: 'deepseek-chat',
    provider: 'deepseek',
    providerName: 'DeepSeek',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0.03,
    outputPrice: 0.08,
    description: '深度求索最新对话模型，性价比极高',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: true,
    createdAt: '2024-03-10',
  },
  {
    id: '7',
    name: 'GLM-4',
    modelId: 'glm-4',
    provider: 'zhipu',
    providerName: '智谱 AI',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0.05,
    outputPrice: 0.1,
    description: '智谱 AI 第四代大语言模型',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: true,
    createdAt: '2024-02-01',
  },
  {
    id: '8',
    name: '通义千问 Plus',
    modelId: 'qwen-plus',
    provider: 'qwen',
    providerName: '通义千问',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0.04,
    outputPrice: 0.08,
    description: '阿里云通义千问增强版模型',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: true,
    createdAt: '2024-02-20',
  },
  {
    id: '9',
    name: 'Moonshot V1.5',
    modelId: 'moonshot-v1-128k',
    provider: 'moonshot',
    providerName: 'Moonshot',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0.06,
    outputPrice: 0.12,
    description: '月之暗面超长上下文模型',
    enabled: false,
    isDefault: false,
    supportVision: false,
    supportStreaming: true,
    createdAt: '2024-03-05',
  },
  {
    id: '10',
    name: 'text-embedding-3-large',
    modelId: 'text-embedding-3-large',
    provider: 'openai',
    providerName: 'OpenAI',
    type: 'embedding',
    contextLength: 8191,
    maxOutput: 3072,
    inputPrice: 0.013,
    outputPrice: 0,
    description: 'OpenAI 最新的 Embedding 模型，3072 维度',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: false,
    createdAt: '2024-01-01',
  },
  {
    id: '11',
    name: 'DALL-E 3',
    modelId: 'dall-e-3',
    provider: 'openai',
    providerName: 'OpenAI',
    type: 'image',
    contextLength: 4000,
    maxOutput: 1,
    inputPrice: 0.04,
    outputPrice: 0,
    description: 'OpenAI 图像生成模型',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: false,
    createdAt: '2024-01-01',
  },
  {
    id: '12',
    name: 'Whisper',
    modelId: 'whisper-1',
    provider: 'openai',
    providerName: 'OpenAI',
    type: 'audio',
    contextLength: 0,
    maxOutput: 0,
    inputPrice: 0.006,
    outputPrice: 0,
    description: 'OpenAI 语音识别模型',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: false,
    createdAt: '2024-01-01',
  },
])

const stats = computed(() => ({
  totalModels: models.value.length,
  enabled: models.value.filter(m => m.enabled).length,
  providers: new Set(models.value.map(m => m.provider)).size,
  todayCalls: 125847,
}))

const totalModels = computed(() => filteredModels.value.length)
const totalPages = computed(() => Math.ceil(totalModels.value / 20) || 1)

const filteredModels = computed(() => {
  let result = [...models.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      m =>
        m.name.toLowerCase().includes(kw) ||
        m.modelId.toLowerCase().includes(kw) ||
        m.description.toLowerCase().includes(kw)
    )
  }

  if (providerFilter.value !== 'all') {
    result = result.filter(m => m.provider === providerFilter.value)
  }

  if (typeFilter.value !== 'all') {
    result = result.filter(m => m.type === typeFilter.value)
  }

  if (statusFilter.value === 'enabled') {
    result = result.filter(m => m.enabled)
  } else if (statusFilter.value === 'disabled') {
    result = result.filter(m => !m.enabled)
  }

  return result
})

function formatContextLength(length: number): string {
  if (length >= 1000000) {
    return (length / 1000000).toFixed(0) + 'M'
  }
  if (length >= 1000) {
    return (length / 1000).toFixed(0) + 'K'
  }
  return length.toString()
}

function getTypeText(type: ModelType): string {
  const map: Record<ModelType, string> = {
    chat: '对话',
    completion: '补全',
    embedding: 'Embedding',
    image: '图像',
    audio: '音频',
  }
  return map[type]
}

function getTypeBadgeVariant(type: ModelType): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<ModelType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    chat: 'default',
    completion: 'secondary',
    embedding: 'outline',
    image: 'secondary',
    audio: 'outline',
  }
  return map[type]
}

function getProviderIcon(provider: ModelProvider): string {
  const map: Record<ModelProvider, string> = {
    openai: 'lucide:sparkles',
    anthropic: 'lucide:brain',
    google: 'lucide:chrome',
    deepseek: 'lucide:search',
    zhipu: 'lucide:zap',
    qwen: 'lucide:cloud',
    moonshot: 'lucide:moon',
    local: 'lucide:server',
  }
  return map[provider]
}

function getProviderIconBg(provider: ModelProvider): string {
  const map: Record<ModelProvider, string> = {
    openai: 'bg-green-100 dark:bg-green-900/30',
    anthropic: 'bg-orange-100 dark:bg-orange-900/30',
    google: 'bg-blue-100 dark:bg-blue-900/30',
    deepseek: 'bg-purple-100 dark:bg-purple-900/30',
    zhipu: 'bg-cyan-100 dark:bg-cyan-900/30',
    qwen: 'bg-indigo-100 dark:bg-indigo-900/30',
    moonshot: 'bg-pink-100 dark:bg-pink-900/30',
    local: 'bg-gray-100 dark:bg-gray-800',
  }
  return map[provider]
}

function getProviderIconColor(provider: ModelProvider): string {
  const map: Record<ModelProvider, string> = {
    openai: 'text-green-600 dark:text-green-400',
    anthropic: 'text-orange-600 dark:text-orange-400',
    google: 'text-blue-600 dark:text-blue-400',
    deepseek: 'text-purple-600 dark:text-purple-400',
    zhipu: 'text-cyan-600 dark:text-cyan-400',
    qwen: 'text-indigo-600 dark:text-indigo-400',
    moonshot: 'text-pink-600 dark:text-pink-400',
    local: 'text-gray-600 dark:text-gray-400',
  }
  return map[provider]
}

function resetFilters() {
  searchKeyword.value = ''
  providerFilter.value = 'all'
  typeFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}

function toggleModel(model: ModelItem) {
  model.enabled = !model.enabled
}

function editModel(model: ModelItem) {
  editingModel.value = model
  formData.value = {
    name: model.name,
    modelId: model.modelId,
    provider: model.provider,
    type: model.type,
    contextLength: model.contextLength,
    maxOutput: model.maxOutput,
    inputPrice: model.inputPrice,
    outputPrice: model.outputPrice,
    description: model.description,
    enabled: model.enabled,
    isDefault: model.isDefault,
    supportVision: model.supportVision,
    supportStreaming: model.supportStreaming,
  }
  showAddDialog.value = true
}

function testModel(model: ModelItem) {
  testingModel.value = model
  testInput.value = '你好，请简单介绍一下你自己。'
  testResponse.value = ''
  testResult.value = null
  showTestDialog.value = true
}

async function runTest() {
  if (!testingModel.value || !testInput.value.trim()) return

  isTesting.value = true
  testResponse.value = ''
  testResult.value = null

  await new Promise(resolve => setTimeout(resolve, 1500))

  testResponse.value = `你好！我是 ${testingModel.value.name}，由 ${testingModel.value.providerName} 开发的 AI 模型。

我可以帮助你：
• 回答各种问题
• 进行对话交流
• 辅助写作和创作
• 分析和总结内容

有什么我可以帮助你的吗？`

  testResult.value = {
    inputTokens: testInput.value.length,
    outputTokens: testResponse.value.length,
    duration: 1523,
  }

  isTesting.value = false
}

function deleteModel(model: ModelItem) {
  const index = models.value.findIndex(m => m.id === model.id)
  if (index > -1) {
    models.value.splice(index, 1)
  }
}

function saveModel() {
  if (editingModel.value) {
    const model = models.value.find(m => m.id === editingModel.value!.id)
    if (model) {
      model.name = formData.value.name
      model.modelId = formData.value.modelId
      model.provider = formData.value.provider
      model.type = formData.value.type
      model.contextLength = formData.value.contextLength
      model.maxOutput = formData.value.maxOutput
      model.inputPrice = formData.value.inputPrice
      model.outputPrice = formData.value.outputPrice
      model.description = formData.value.description
      model.enabled = formData.value.enabled
      model.isDefault = formData.value.isDefault
      model.supportVision = formData.value.supportVision
      model.supportStreaming = formData.value.supportStreaming
    }
  } else {
    const providerOption = providerSelectOptions.find(p => p.value === formData.value.provider)
    const newModel: ModelItem = {
      id: Date.now().toString(),
      name: formData.value.name,
      modelId: formData.value.modelId,
      provider: formData.value.provider,
      providerName: providerOption?.label || formData.value.provider,
      type: formData.value.type,
      contextLength: formData.value.contextLength,
      maxOutput: formData.value.maxOutput,
      inputPrice: formData.value.inputPrice,
      outputPrice: formData.value.outputPrice,
      description: formData.value.description,
      enabled: formData.value.enabled,
      isDefault: formData.value.isDefault,
      supportVision: formData.value.supportVision,
      supportStreaming: formData.value.supportStreaming,
      createdAt: new Date().toISOString().split('T')[0],
    }
    models.value.unshift(newModel)
  }

  showAddDialog.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    name: '',
    modelId: '',
    provider: 'openai',
    type: 'chat',
    contextLength: 128000,
    maxOutput: 4096,
    inputPrice: 0,
    outputPrice: 0,
    description: '',
    enabled: true,
    isDefault: false,
    supportVision: false,
    supportStreaming: true,
  }
  editingModel.value = null
}

function syncModels() {
  console.log('同步模型列表')
}
</script>