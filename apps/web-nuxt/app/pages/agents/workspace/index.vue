<template>
  <div class="min-h-screen">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">Agent 工作台</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">管理您的所有智能体</p>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="relative flex-1 sm:flex-none">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="keyword"
            placeholder="搜索智能体..."
            class="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <select
          v-model="statusFilter"
          class="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        >
          <option value="all">全部状态</option>
          <option value="draft">草稿</option>
          <option value="published">已发布</option>
          <option value="archived">已归档</option>
        </select>
      </div>
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <button class="btn-glass" @click="handleImport">
          <UIcon name="lucide:download" class="w-4 h-4" />
          导入
        </button>
        <button class="btn-glass btn-glass--primary" @click="handleCreateAgent">
          <UIcon name="lucide:plus" class="w-4 h-4" />
          创建智能体
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="agent in filteredAgents"
        :key="agent.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1"
        @click="handleOpenAgent(agent)"
      >
        <div class="flex items-start gap-4 mb-4">
          <div
            class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
            :style="{ background: getAgentGradient(agent.category) }"
          >
            <UIcon :name="getAgentIcon(agent.category)" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-slate-900 dark:text-white truncate transition-colors group-hover:text-primary">
              {{ agent.name }}
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
              {{ agent.description }}
            </p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              :class="[
                'px-2.5 py-1 rounded-full text-xs font-medium',
                agent.status === 'published'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  : agent.status === 'archived'
                    ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
              ]"
            >
              {{ statusLabel(agent.status) }}
            </span>
            <span class="text-xs text-slate-400">{{ agent.category }}</span>
          </div>
          <span class="text-xs text-slate-400">{{ formatDate(agent.lastModified) }}</span>
        </div>
      </div>
    </div>

    <div v-if="filteredAgents.length === 0" class="text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
        <UIcon name="lucide:search-x" class="w-10 h-10 text-slate-400" />
      </div>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">未找到智能体</h3>
      <p class="text-slate-600 dark:text-slate-400">尝试使用其他关键词或筛选条件</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

interface WorkspaceAgent {
  id: string
  name: string
  description: string
  category: string
  status: 'draft' | 'published' | 'archived'
  lastModified: string
}

const keyword = ref('')
const statusFilter = ref('all')

const agents = ref<WorkspaceAgent[]>([
  {
    id: '1',
    name: '通用 AI 助手',
    description: '一个功能全面的通用 AI 助手，可以回答各种问题、提供建议和帮助解决问题。',
    category: '通用',
    status: 'published',
    lastModified: '2024-06-25 14:30',
  },
  {
    id: '2',
    name: '代码助手 Pro',
    description: '专业的编程助手，支持多种编程语言，可以帮你写代码、调试、优化和解释代码。',
    category: '编程',
    status: 'published',
    lastModified: '2024-06-24 10:15',
  },
  {
    id: '3',
    name: '写作助手',
    description: '帮助你进行各类写作，包括文章、邮件、报告、创意写作等。',
    category: '写作',
    status: 'draft',
    lastModified: '2024-06-23 16:45',
  },
  {
    id: '4',
    name: '翻译专家',
    description: '多语言翻译助手，支持中英日韩法德等多种语言互译。',
    category: '翻译',
    status: 'published',
    lastModified: '2024-06-22 09:00',
  },
  {
    id: '5',
    name: '数据分析助手',
    description: '专业的数据分析助手，帮助你分析数据、生成报告、制作可视化图表。',
    category: '数据',
    status: 'archived',
    lastModified: '2024-06-20 11:20',
  },
  {
    id: '6',
    name: '产品经理助手',
    description: '产品经理专属助手，帮助写需求文档、用户故事、竞品分析、产品规划等。',
    category: '产品',
    status: 'draft',
    lastModified: '2024-06-18 08:30',
  },
])

const filteredAgents = computed(() => {
  let result = [...agents.value]

  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(
      a => a.name.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw)
    )
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(a => a.status === statusFilter.value)
  }

  return result
})

const categoryGradients: Record<string, string> = {
  '通用': 'linear-gradient(135deg, #3b82f6, #06b6d4)',
  '编程': 'linear-gradient(135deg, #16a34a, #22c55e)',
  '写作': 'linear-gradient(135deg, #a855f7, #d946ef)',
  '翻译': 'linear-gradient(135deg, #f97316, #f59e0b)',
  '数据': 'linear-gradient(135deg, #06b6d4, #22d3ee)',
  '产品': 'linear-gradient(135deg, #ec4899, #f43f5e)',
}

const categoryIcons: Record<string, string> = {
  '通用': 'lucide:bot',
  '编程': 'lucide:code',
  '写作': 'lucide:pen',
  '翻译': 'lucide:languages',
  '数据': 'lucide:bar-chart',
  '产品': 'lucide:lightbulb',
}

function getAgentGradient(category: string): string {
  return categoryGradients[category] || 'linear-gradient(135deg, #6366f1, #8b5cf6)'
}

function getAgentIcon(category: string): string {
  return categoryIcons[category] || 'lucide:bot'
}

function statusLabel(status: string): string {
  const map: Record<string, string> = { draft: '草稿', published: '已发布', archived: '已归档' }
  return map[status] || status
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return '今天'
  if (days === 1) return '昨天'
  if (days < 7) return `${days} 天前`
  return dateStr.split(' ')[0]
}

function handleCreateAgent() {
  navigateTo('/agents')
}

function handleImport() {
  navigateTo('/agents')
}

function handleOpenAgent(agent: WorkspaceAgent) {
  navigateTo(`/agents/${agent.id}`)
}
</script>