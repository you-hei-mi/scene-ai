<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">装修中心</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">Agent装修</p>
      </div>
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

    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="lucide:star" class="w-5 h-5 text-amber-500" />
          精选 Agent
        </h2>
        <span class="text-xs text-slate-500">拖拽卡片可调整排序</span>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="agent in featuredAgents"
          :key="agent.id"
          class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-500/30 overflow-hidden transition-all duration-300 hover:shadow-lg group cursor-grab active:cursor-grabbing"
          draggable="true"
          @dragstart="onFeaturedDragStart($event, agent)"
          @dragover.prevent="onFeaturedDragOver($event, agent)"
          @drop="onFeaturedDrop($event, agent)"
          @dragend="onFeaturedDragEnd"
        >
          <div class="relative">
            <div class="h-32 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
              <UIcon :name="agent.icon" class="w-14 h-14" :class="agent.iconColor" />
            </div>
            <div class="absolute top-2 left-2">
              <span class="inline-flex items-center gap-1 bg-amber-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                <UIcon name="lucide:star" class="w-3 h-3 fill-current" />
                精选
              </span>
            </div>
          </div>
          <div class="p-4">
            <h3 class="font-semibold text-sm text-slate-900 dark:text-white">{{ agent.name }}</h3>
            <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ agent.description }}</p>
            <div class="flex items-center justify-between mt-3">
              <span class="text-xs text-slate-400">{{ agent.usageCount.toLocaleString() }} 次使用</span>
              <div class="flex items-center gap-2">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    :checked="agent.displayed"
                    @change="toggleFeaturedDisplay(agent)"
                  />
                  <div class="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <button class="btn-glass p-2" @click="editAgent(agent)">
                  <UIcon name="lucide:edit" class="w-4 h-4" />
                </button>
              </div>
            </div>
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
            placeholder="搜索 Agent..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="categoryFilter" :options="categoryOptions" class="w-40" />
        <USelect v-model="statusFilter" :options="statusOptions" class="w-36" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <UIcon name="lucide:bot" class="w-5 h-5 text-purple-500" />
          全部 Agent
        </h2>
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <UIcon name="lucide:grip-vertical" class="w-4 h-4" />
          拖拽卡片可调整排序
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="agent in filteredAgents"
          :key="agent.id"
          class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 group cursor-grab active:cursor-grabbing"
          draggable="true"
          @dragstart="onDragStart($event, agent)"
          @dragover.prevent="onDragOver($event, agent)"
          @drop="onDrop($event, agent)"
          @dragend="onDragEnd"
        >
          <div class="h-32 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center">
            <UIcon :name="agent.icon" class="w-14 h-14" :class="agent.iconColor" />
          </div>
          <div class="p-4">
            <div class="flex items-start justify-between mb-2">
              <div>
                <h3 class="font-semibold text-sm text-slate-900 dark:text-white">{{ agent.name }}</h3>
                <p class="text-xs text-slate-500 mt-1 line-clamp-2">{{ agent.description }}</p>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xs px-2 py-1 rounded-lg" :class="getCategoryBadgeClass(agent.category)">
                {{ getCategoryText(agent.category) }}
              </span>
              <div class="flex items-center gap-2">
                <label class="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    class="sr-only peer"
                    :checked="agent.displayed"
                    @change="toggleDisplay(agent)"
                  />
                  <div class="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
                <button class="btn-glass p-2" @click="editAgent(agent)">
                  <UIcon name="lucide:edit" class="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredAgents.length === 0" class="text-center py-12">
        <UIcon name="lucide:bot" class="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <p class="text-slate-500">未找到匹配的 Agent</p>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">排序配置</h2>
        <p class="text-sm mt-1 text-slate-500">配置 Agent 在首页的展示排序规则</p>
      </div>
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">默认排序方式</label>
          <USelect v-model="sortConfig.defaultSort" :options="sortOptions" />
        </div>
        <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
          <div>
            <h3 class="font-medium text-sm text-slate-900 dark:text-white">优先展示精选 Agent</h3>
            <p class="text-xs mt-0.5 text-slate-500">精选 Agent 始终排在列表最前面</p>
          </div>
          <UCheckbox :modelValue="sortConfig.prioritizeFeatured" @change="sortConfig.prioritizeFeatured = !sortConfig.prioritizeFeatured" />
        </div>
        <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
          <div>
            <h3 class="font-medium text-sm text-slate-900 dark:text-white">按使用热度加权</h3>
            <p class="text-xs mt-0.5 text-slate-500">使用次数较多的 Agent 自动提升排序</p>
          </div>
          <UCheckbox :modelValue="sortConfig.weightByUsage" @change="sortConfig.weightByUsage = !sortConfig.weightByUsage" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">每页显示数量</label>
          <USelect v-model="sortConfig.perPage" :options="perPageOptions" />
        </div>
        <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button class="btn-glass">重置</button>
          <button class="btn-glass btn-glass--primary" @click="saveSortConfig">
            <UIcon name="lucide:save" class="w-4 h-4" />
            保存排序配置
          </button>
        </div>
      </div>
    </div>

    <UDialog v-model="showEditDialog" :title="`编辑 Agent - ${editingAgent?.name || ''}`" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Agent 名称</label>
          <UInput v-model="editForm.name" placeholder="输入 Agent 名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Agent 描述</label>
          <UTextarea v-model="editForm.description" placeholder="输入 Agent 描述" rows="2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">分类</label>
          <USelect v-model="editForm.category" :options="agentCategoryOptions" />
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="editForm.displayed" />
            <span class="text-sm text-slate-700 dark:text-slate-300">首页展示</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="editForm.featured" />
            <span class="text-sm text-slate-700 dark:text-slate-300">精选推荐</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showEditDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveEditAgent">保存</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

interface AgentItem {
  id: string
  name: string
  description: string
  icon: string
  iconColor: string
  category: 'general' | 'coding' | 'writing' | 'analysis' | 'creative' | 'other'
  displayed: boolean
  featured: boolean
  usageCount: number
  sortOrder: number
}

type AgentCategory = 'general' | 'coding' | 'writing' | 'analysis' | 'creative' | 'other'

interface SortConfig {
  defaultSort: string
  prioritizeFeatured: boolean
  weightByUsage: boolean
  perPage: number
}

const activeTab = ref('agents')
const searchKeyword = ref('')
const categoryFilter = ref('all')
const statusFilter = ref('all')
const showEditDialog = ref(false)
const editingAgent = ref<AgentItem | null>(null)
const dragItem = ref<AgentItem | null>(null)
const featuredDragItem = ref<AgentItem | null>(null)

const tabs = [
  { key: 'apps', label: '应用装修', icon: 'lucide:layout-grid' },
  { key: 'layout', label: '布局装修', icon: 'lucide:panel-top' },
  { key: 'agents', label: 'Agent装修', icon: 'lucide:bot' },
]

const categoryOptions = [
  { label: '全部分类', value: 'all' },
  { label: '通用助手', value: 'general' },
  { label: '编程开发', value: 'coding' },
  { label: '写作助手', value: 'writing' },
  { label: '数据分析', value: 'analysis' },
  { label: '创意设计', value: 'creative' },
  { label: '其他', value: 'other' },
]

const agentCategoryOptions = [
  { label: '通用助手', value: 'general' },
  { label: '编程开发', value: 'coding' },
  { label: '写作助手', value: 'writing' },
  { label: '数据分析', value: 'analysis' },
  { label: '创意设计', value: 'creative' },
  { label: '其他', value: 'other' },
]

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已展示', value: 'displayed' },
  { label: '已隐藏', value: 'hidden' },
]

const sortOptions = [
  { label: '手动排序', value: 'manual' },
  { label: '按使用次数', value: 'usage' },
  { label: '按创建时间', value: 'created' },
  { label: '按名称', value: 'name' },
]

const perPageOptions = [
  { label: '8 个', value: 8 },
  { label: '12 个', value: 12 },
  { label: '16 个', value: 16 },
  { label: '20 个', value: 20 },
  { label: '24 个', value: 24 },
]

const editForm = ref({
  name: '',
  description: '',
  category: 'other' as AgentCategory,
  displayed: true,
  featured: false,
})

const sortConfig = reactive<SortConfig>({
  defaultSort: 'manual',
  prioritizeFeatured: true,
  weightByUsage: false,
  perPage: 12,
})

const agents = ref<AgentItem[]>([
  {
    id: '1',
    name: '通用助手',
    description: '全能型 AI 助手，可处理各类任务',
    icon: 'lucide:sparkles',
    iconColor: 'text-purple-500 dark:text-purple-400',
    category: 'general',
    displayed: true,
    featured: true,
    usageCount: 15820,
    sortOrder: 1,
  },
  {
    id: '2',
    name: '代码专家',
    description: '精通多种编程语言，提供代码审查和优化建议',
    icon: 'lucide:code-2',
    iconColor: 'text-green-500 dark:text-green-400',
    category: 'coding',
    displayed: true,
    featured: true,
    usageCount: 12450,
    sortOrder: 2,
  },
  {
    id: '3',
    name: '文案大师',
    description: '擅长各类文案写作，从营销文案到技术文档',
    icon: 'lucide:pen',
    iconColor: 'text-blue-500 dark:text-blue-400',
    category: 'writing',
    displayed: true,
    featured: true,
    usageCount: 8930,
    sortOrder: 3,
  },
  {
    id: '4',
    name: '数据分析师',
    description: '专业的数据分析和可视化解读',
    icon: 'lucide:bar-chart-3',
    iconColor: 'text-orange-500 dark:text-orange-400',
    category: 'analysis',
    displayed: true,
    featured: true,
    usageCount: 6720,
    sortOrder: 4,
  },
  {
    id: '5',
    name: '创意设计师',
    description: '提供创意灵感和设计建议',
    icon: 'lucide:palette',
    iconColor: 'text-pink-500 dark:text-pink-400',
    category: 'creative',
    displayed: true,
    featured: false,
    usageCount: 4510,
    sortOrder: 5,
  },
  {
    id: '6',
    name: '翻译专家',
    description: '支持 50+ 语言的专业翻译',
    icon: 'lucide:languages',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    category: 'general',
    displayed: true,
    featured: false,
    usageCount: 7890,
    sortOrder: 6,
  },
  {
    id: '7',
    name: '知识问答',
    description: '基于知识库的精准问答',
    icon: 'lucide:brain',
    iconColor: 'text-indigo-500 dark:text-indigo-400',
    category: 'general',
    displayed: true,
    featured: false,
    usageCount: 10200,
    sortOrder: 7,
  },
  {
    id: '8',
    name: '法律顾问',
    description: '法律条文查询和案例分析',
    icon: 'lucide:scale',
    iconColor: 'text-amber-500 dark:text-amber-400',
    category: 'analysis',
    displayed: false,
    featured: false,
    usageCount: 2340,
    sortOrder: 8,
  },
])

const featuredAgents = computed(() => {
  return agents.value.filter(a => a.featured).sort((a, b) => a.sortOrder - b.sortOrder)
})

const filteredAgents = computed(() => {
  let result = [...agents.value].filter(a => !a.featured).sort((a, b) => a.sortOrder - b.sortOrder)

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(a => a.name.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw))
  }

  if (categoryFilter.value !== 'all') {
    result = result.filter(a => a.category === categoryFilter.value)
  }

  if (statusFilter.value === 'displayed') {
    result = result.filter(a => a.displayed)
  } else if (statusFilter.value === 'hidden') {
    result = result.filter(a => !a.displayed)
  }

  return result
})

function getCategoryText(category: AgentCategory): string {
  const map: Record<AgentCategory, string> = {
    general: '通用',
    coding: '编程',
    writing: '写作',
    analysis: '分析',
    creative: '创意',
    other: '其他',
  }
  return map[category]
}

function getCategoryBadgeClass(category: AgentCategory): string {
  const map: Record<AgentCategory, string> = {
    general: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    coding: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    writing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    analysis: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    creative: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    other: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  }
  return map[category]
}

function toggleDisplay(agent: AgentItem) {
  agent.displayed = !agent.displayed
}

function toggleFeaturedDisplay(agent: AgentItem) {
  agent.displayed = !agent.displayed
}

function editAgent(agent: AgentItem) {
  editingAgent.value = agent
  editForm.value = {
    name: agent.name,
    description: agent.description,
    category: agent.category,
    displayed: agent.displayed,
    featured: agent.featured,
  }
  showEditDialog.value = true
}

function saveEditAgent() {
  if (editingAgent.value) {
    editingAgent.value.name = editForm.value.name
    editingAgent.value.description = editForm.value.description
    editingAgent.value.category = editForm.value.category
    editingAgent.value.displayed = editForm.value.displayed
    editingAgent.value.featured = editForm.value.featured
  }
  showEditDialog.value = false
  editingAgent.value = null
}

function resetFilters() {
  searchKeyword.value = ''
  categoryFilter.value = 'all'
  statusFilter.value = 'all'
}

function saveSortConfig() {
  console.log('保存排序配置:', JSON.parse(JSON.stringify(sortConfig)))
}

function onDragStart(event: DragEvent, agent: AgentItem) {
  dragItem.value = agent
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', agent.id)
  }
}

function onDragOver(event: DragEvent, agent: AgentItem) {
  if (!dragItem.value || dragItem.value.id === agent.id) return
  const fromIndex = agents.value.findIndex(a => a.id === dragItem.value!.id)
  const toIndex = agents.value.findIndex(a => a.id === agent.id)
  if (fromIndex !== -1 && toIndex !== -1) {
    const [moved] = agents.value.splice(fromIndex, 1)
    agents.value.splice(toIndex, 0, moved)
    agents.value.forEach((a, i) => { a.sortOrder = i + 1 })
  }
}

function onDrop(event: DragEvent, _agent: AgentItem) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDragEnd() {
  dragItem.value = null
}

function onFeaturedDragStart(event: DragEvent, agent: AgentItem) {
  featuredDragItem.value = agent
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', agent.id)
  }
}

function onFeaturedDragOver(event: DragEvent, agent: AgentItem) {
  if (!featuredDragItem.value || featuredDragItem.value.id === agent.id) return
  const featured = agents.value.filter(a => a.featured)
  const fromIndex = featured.findIndex(a => a.id === featuredDragItem.value!.id)
  const toIndex = featured.findIndex(a => a.id === agent.id)
  if (fromIndex !== -1 && toIndex !== -1) {
    // Reorder sort orders within featured agents
    const fromGlobal = agents.value.findIndex(a => a.id === featuredDragItem.value!.id)
    const toGlobal = agents.value.findIndex(a => a.id === agent.id)
    if (fromGlobal !== -1 && toGlobal !== -1) {
      const [moved] = agents.value.splice(fromGlobal, 1)
      agents.value.splice(toGlobal, 0, moved)
      agents.value.forEach((a, i) => { a.sortOrder = i + 1 })
    }
  }
}

function onFeaturedDrop(event: DragEvent, _agent: AgentItem) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onFeaturedDragEnd() {
  featuredDragItem.value = null
}
</script>