<template>
  <div style="background: var(--bg-deep); min-height: 100vh">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-gradient text-2xl font-bold">模型管理</h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary)">管理系统可用的 AI 模型和提供商配置</p>
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

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">模型总数</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ stats.totalModels }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(59, 130, 246, 0.12)">
            <UIcon name="lucide:brain" class="w-6 h-6" style="color: #3b82f6" />
          </div>
        </div>
      </div>
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">已启用</p>
            <p class="text-2xl font-bold mt-1" style="color: #22c55e">{{ stats.enabled }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(34, 197, 94, 0.12)">
            <UIcon name="lucide:check-circle" class="w-6 h-6" style="color: #22c55e" />
          </div>
        </div>
      </div>
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">提供商数量</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ stats.providers }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(168, 85, 247, 0.12)">
            <UIcon name="lucide:building-2" class="w-6 h-6" style="color: #a855f7" />
          </div>
        </div>
      </div>
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">今日调用</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ stats.todayCalls.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(249, 115, 22, 0.12)">
            <UIcon name="lucide:activity" class="w-6 h-6" style="color: #f97316" />
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="glass-card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <UInput v-model="searchKeyword" placeholder="搜索模型名称..." class="w-64">
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4" style="color: var(--text-secondary)" />
          </template>
        </UInput>
        <USelect v-model="providerFilter" :options="providerOptions" class="w-44" />
        <USelect v-model="typeFilter" :options="typeOptions" class="w-40" />
        <USelect v-model="statusFilter" :options="statusOptions" class="w-36" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <!-- 模型列表表格 -->
    <div class="glass-card" style="padding: 0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border)">
              <th class="text-left px-4 py-3 text-sm font-medium w-12" style="color: var(--text-secondary)">
                <UCheckbox />
              </th>
              <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">模型</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-32" style="color: var(--text-secondary)">提供商</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-28" style="color: var(--text-secondary)">类型</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-36" style="color: var(--text-secondary)">上下文长度</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-32" style="color: var(--text-secondary)">输入价格</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-32" style="color: var(--text-secondary)">输出价格</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-24" style="color: var(--text-secondary)">状态</th>
              <th class="text-right px-4 py-3 text-sm font-medium w-24" style="color: var(--text-secondary)">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="model in filteredModels"
              :key="model.id"
              style="border-bottom: 1px solid var(--glass-border)"
              :style="model === filteredModels[filteredModels.length - 1] ? { borderBottom: 'none' } : {}"
            >
              <td class="px-4 py-3">
                <UCheckbox />
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 rounded-lg flex items-center justify-center"
                    :style="{
                      background: {
                        openai: 'rgba(34, 197, 94, 0.12)',
                        anthropic: 'rgba(249, 115, 22, 0.12)',
                        google: 'rgba(59, 130, 246, 0.12)',
                        deepseek: 'rgba(168, 85, 247, 0.12)',
                        zhipu: 'rgba(6, 182, 212, 0.12)',
                        qwen: 'rgba(99, 102, 241, 0.12)',
                        moonshot: 'rgba(236, 72, 153, 0.12)',
                        local: 'rgba(107, 114, 128, 0.12)'
                      }[model.provider]
                    }"
                  >
                    <UIcon
                      :name="getProviderIcon(model.provider)"
                      class="w-5 h-5"
                      :style="{
                        color: {
                          openai: '#22c55e',
                          anthropic: '#f97316',
                          google: '#3b82f6',
                          deepseek: '#a855f7',
                          zhipu: '#06b6d4',
                          qwen: '#6366f1',
                          moonshot: '#ec4899',
                          local: '#6b7280'
                        }[model.provider]
                      }"
                    />
                  </div>
                  <div>
                    <div class="font-medium text-sm" style="color: var(--text-primary)">{{ model.name }}</div>
                    <div class="text-xs" style="color: var(--text-secondary)">{{ model.modelId }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3">
                <span class="text-sm" style="color: var(--text-primary)">{{ model.providerName }}</span>
              </td>
              <td class="px-4 py-3">
                <UBadge :variant="getTypeBadgeVariant(model.type)" size="sm">
                  {{ getTypeText(model.type) }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-secondary)">
                {{ formatContextLength(model.contextLength) }}
              </td>
              <td class="px-4 py-3 text-sm">
                <span style="color: var(--text-secondary)">¥{{ model.inputPrice }}</span>
                <span class="text-xs" style="color: var(--text-secondary)">/M tokens</span>
              </td>
              <td class="px-4 py-3 text-sm">
                <span style="color: var(--text-secondary)">¥{{ model.outputPrice }}</span>
                <span class="text-xs" style="color: var(--text-secondary)">/M tokens</span>
              </td>
              <td class="px-4 py-3">
                <label class="inline-flex items-center cursor-pointer">
                  <UCheckbox :modelValue="model.enabled" @change="toggleModel(model)" />
                </label>
              </td>
              <td class="px-4 py-3 text-right">
                <UDropdownMenu>
                  <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem">
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

      <!-- 空状态 -->
      <div v-if="filteredModels.length === 0" class="text-center py-12">
        <UIcon name="lucide:brain-circuit" class="w-12 h-12 mx-auto mb-3" style="color: var(--text-secondary)" />
        <p style="color: var(--text-secondary)">未找到匹配的模型</p>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-4 py-3" style="border-top: 1px solid var(--glass-border)">
        <div class="text-sm" style="color: var(--text-secondary)">
          共 {{ totalModels }} 个模型
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.5rem">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm" style="color: var(--text-primary)">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.5rem">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑模型对话框 -->
    <UDialog v-model="showAddDialog" :title="editingModel ? '编辑模型' : '添加模型'" size="xl">
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">模型名称</label>
            <UInput v-model="formData.name" placeholder="输入模型显示名称" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">模型 ID</label>
            <UInput v-model="formData.modelId" placeholder="例如: gpt-4" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">提供商</label>
            <USelect v-model="formData.provider" :options="providerSelectOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">模型类型</label>
            <USelect v-model="formData.type" :options="typeSelectOptions" />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">上下文长度</label>
            <UInput v-model.number="formData.contextLength" placeholder="例如: 128000" type="number" />
            <p class="text-xs mt-1" style="color: var(--text-secondary)">最大 token 数量</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">最大输出长度</label>
            <UInput v-model.number="formData.maxOutput" placeholder="例如: 4096" type="number" />
            <p class="text-xs mt-1" style="color: var(--text-secondary)">单次输出最大 token 数</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">输入价格 (元/M tokens)</label>
            <UInput v-model.number="formData.inputPrice" placeholder="例如: 0.15" type="number" step="0.01" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">输出价格 (元/M tokens)</label>
            <UInput v-model.number="formData.outputPrice" placeholder="例如: 0.6" type="number" step="0.01" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">模型描述</label>
          <UTextarea v-model="formData.description" placeholder="输入模型描述信息" rows="3" />
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.enabled" />
            <span class="text-sm" style="color: var(--text-primary)">启用模型</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.isDefault" />
            <span class="text-sm" style="color: var(--text-primary)">设为默认</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.supportVision" />
            <span class="text-sm" style="color: var(--text-primary)">支持视觉</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.supportStreaming" />
            <span class="text-sm" style="color: var(--text-primary)">支持流式输出</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showAddDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveModel">{{ editingModel ? '保存' : '添加' }}</button>
      </template>
    </UDialog>

    <!-- 测试模型对话框 -->
    <UDialog v-model="showTestDialog" :title="`测试模型 - ${testingModel?.name || ''}`" size="lg">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">测试输入</label>
          <UTextarea v-model="testInput" placeholder="输入测试问题..." rows="4" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">模型响应</label>
          <div class="glass-panel min-h-32 p-4" style="background: var(--glass-bg-1)">
            <p v-if="testResponse" class="text-sm whitespace-pre-wrap" style="color: var(--text-primary)">{{ testResponse }}</p>
            <p v-else-if="isTesting" class="text-sm" style="color: var(--text-secondary)">正在测试...</p>
            <p v-else class="text-sm" style="color: var(--text-secondary)">点击下方按钮开始测试</p>
          </div>
        </div>
        <div v-if="testResult" class="grid grid-cols-3 gap-4">
          <div class="text-center">
            <p class="text-xs" style="color: var(--text-secondary)">输入 tokens</p>
            <p class="text-lg font-bold" style="color: var(--text-primary)">{{ testResult.inputTokens }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs" style="color: var(--text-secondary)">输出 tokens</p>
            <p class="text-lg font-bold" style="color: var(--text-primary)">{{ testResult.outputTokens }}</p>
          </div>
          <div class="text-center">
            <p class="text-xs" style="color: var(--text-secondary)">响应时间</p>
            <p class="text-lg font-bold" style="color: var(--text-primary)">{{ testResult.duration }}ms</p>
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

/**
 * 模型类型
 */
type ModelType = 'chat' | 'completion' | 'embedding' | 'image' | 'audio'

/**
 * 模型提供商
 */
type ModelProvider = 'openai' | 'anthropic' | 'google' | 'deepseek' | 'zhipu' | 'qwen' | 'moonshot' | 'local'

/**
 * 模型接口定义
 */
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

/**
 * 测试结果接口
 */
interface TestResult {
  inputTokens: number
  outputTokens: number
  duration: number
}

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 提供商筛选
 */
const providerFilter = ref('all')

/**
 * 类型筛选
 */
const typeFilter = ref('all')

/**
 * 状态筛选
 */
const statusFilter = ref('all')

/**
 * 当前页码
 */
const currentPage = ref(1)

/**
 * 是否显示添加对话框
 */
const showAddDialog = ref(false)

/**
 * 是否显示测试对话框
 */
const showTestDialog = ref(false)

/**
 * 正在编辑的模型
 */
const editingModel = ref<ModelItem | null>(null)

/**
 * 正在测试的模型
 */
const testingModel = ref<ModelItem | null>(null)

/**
 * 测试输入
 */
const testInput = ref('')

/**
 * 测试响应
 */
const testResponse = ref('')

/**
 * 是否正在测试
 */
const isTesting = ref(false)

/**
 * 测试结果
 */
const testResult = ref<TestResult | null>(null)

/**
 * 提供商筛选选项
 */
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

/**
 * 类型筛选选项
 */
const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '对话模型', value: 'chat' },
  { label: '补全模型', value: 'completion' },
  { label: 'Embedding', value: 'embedding' },
  { label: '图像模型', value: 'image' },
  { label: '音频模型', value: 'audio' },
]

/**
 * 状态筛选选项
 */
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已启用', value: 'enabled' },
  { label: '已禁用', value: 'disabled' },
]

/**
 * 提供商选择选项（表单用）
 */
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

/**
 * 类型选择选项（表单用）
 */
const typeSelectOptions = [
  { label: '对话模型', value: 'chat' },
  { label: '补全模型', value: 'completion' },
  { label: 'Embedding 模型', value: 'embedding' },
  { label: '图像模型', value: 'image' },
  { label: '音频模型', value: 'audio' },
]

/**
 * 表单数据
 */
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

/**
 * 模拟模型数据
 */
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

/**
 * 统计数据
 */
const stats = computed(() => ({
  totalModels: models.value.length,
  enabled: models.value.filter(m => m.enabled).length,
  providers: new Set(models.value.map(m => m.provider)).size,
  todayCalls: 125847,
}))

/**
 * 总模型数
 */
const totalModels = computed(() => filteredModels.value.length)

/**
 * 总页数
 */
const totalPages = computed(() => Math.ceil(totalModels.value / 20) || 1)

/**
 * 筛选后的模型列表
 */
const filteredModels = computed(() => {
  let result = [...models.value]

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      m =>
        m.name.toLowerCase().includes(kw) ||
        m.modelId.toLowerCase().includes(kw) ||
        m.description.toLowerCase().includes(kw)
    )
  }

  // 提供商筛选
  if (providerFilter.value !== 'all') {
    result = result.filter(m => m.provider === providerFilter.value)
  }

  // 类型筛选
  if (typeFilter.value !== 'all') {
    result = result.filter(m => m.type === typeFilter.value)
  }

  // 状态筛选
  if (statusFilter.value === 'enabled') {
    result = result.filter(m => m.enabled)
  } else if (statusFilter.value === 'disabled') {
    result = result.filter(m => !m.enabled)
  }

  return result
})

/**
 * 格式化上下文长度
 * @param length - 长度值
 * @returns 格式化后的字符串
 */
function formatContextLength(length: number): string {
  if (length >= 1000000) {
    return (length / 1000000).toFixed(0) + 'M'
  }
  if (length >= 1000) {
    return (length / 1000).toFixed(0) + 'K'
  }
  return length.toString()
}

/**
 * 获取模型类型文本
 * @param type - 模型类型
 * @returns 类型显示文本
 */
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

/**
 * 获取类型徽章样式变体
 * @param type - 模型类型
 * @returns UBadge variant
 */
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

/**
 * 获取提供商图标
 * @param provider - 提供商
 * @returns 图标名称
 */
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

/**
 * 获取提供商图标背景色
 * @param provider - 提供商
 * @returns CSS 类名
 */
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

/**
 * 获取提供商图标颜色
 * @param provider - 提供商
 * @returns CSS 类名
 */
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

/**
 * 重置所有筛选条件
 */
function resetFilters() {
  searchKeyword.value = ''
  providerFilter.value = 'all'
  typeFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}

/**
 * 切换模型启用状态
 * @param model - 模型
 */
function toggleModel(model: ModelItem) {
  model.enabled = !model.enabled
}

/**
 * 编辑模型
 * @param model - 模型
 */
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

/**
 * 测试模型
 * @param model - 模型
 */
function testModel(model: ModelItem) {
  testingModel.value = model
  testInput.value = '你好，请简单介绍一下你自己。'
  testResponse.value = ''
  testResult.value = null
  showTestDialog.value = true
}

/**
 * 运行测试
 */
async function runTest() {
  if (!testingModel.value || !testInput.value.trim()) return

  isTesting.value = true
  testResponse.value = ''
  testResult.value = null

  // 模拟测试过程
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

/**
 * 删除模型
 * @param model - 模型
 */
function deleteModel(model: ModelItem) {
  const index = models.value.findIndex(m => m.id === model.id)
  if (index > -1) {
    models.value.splice(index, 1)
  }
}

/**
 * 保存模型
 */
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

/**
 * 重置表单
 */
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

/**
 * 同步模型
 */
function syncModels() {
  console.log('同步模型列表')
}
</script>
