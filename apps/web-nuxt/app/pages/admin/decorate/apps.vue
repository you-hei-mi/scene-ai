<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">装修中心</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">应用装修</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="showAddDialog = true">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        添加应用
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

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchKeyword"
            placeholder="搜索应用名称..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="categoryFilter" :options="categoryOptions" class="w-40" />
        <div class="flex-1"></div>
        <div class="flex items-center gap-2 text-sm text-slate-500">
          <UIcon name="lucide:grip-vertical" class="w-4 h-4" />
          拖拽卡片可调整排序
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="app in filteredApps"
        :key="app.id"
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 group cursor-grab active:cursor-grabbing"
        draggable="true"
        @dragstart="onDragStart($event, app)"
        @dragover.prevent="onDragOver($event, app)"
        @drop="onDrop($event, app)"
        @dragend="onDragEnd"
      >
        <div class="h-40 bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center relative overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
            <span class="text-white text-xs font-medium px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm">点击编辑</span>
          </div>
          <UIcon :name="app.icon" class="w-16 h-16" :class="app.iconColor" />
        </div>
        <div class="p-4">
          <div class="flex items-start justify-between mb-3">
            <div>
              <h3 class="font-semibold text-sm text-slate-900 dark:text-white">{{ app.name }}</h3>
              <p class="text-xs text-slate-500 mt-1">{{ app.description }}</p>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs px-2 py-1 rounded-lg" :class="getCategoryBadgeClass(app.category)">
              {{ getCategoryText(app.category) }}
            </span>
            <div class="flex items-center gap-2">
              <label class="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  class="sr-only peer"
                  :checked="app.displayed"
                  @change="toggleDisplay(app)"
                />
                <div class="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
              </label>
              <button class="btn-glass p-2" @click="editApp(app)">
                <UIcon name="lucide:edit" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredApps.length === 0" class="text-center py-16">
      <UIcon name="lucide:layout-grid" class="w-14 h-14 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
      <p class="text-slate-500 text-lg">未找到匹配的应用</p>
      <p class="text-slate-400 text-sm mt-1">调整搜索条件或添加新应用</p>
    </div>

    <UDialog v-model="showAddDialog" title="添加应用" size="lg">
      <div class="space-y-4">
        <div class="relative">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="addSearchKeyword"
            placeholder="搜索可用应用..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
          <div
            v-for="item in availableApps"
            :key="item.id"
            class="flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer"
            :class="isAppSelected(item.id)
              ? 'border-primary bg-primary/5 dark:bg-primary/10'
              : 'border-slate-200 dark:border-slate-700 hover:border-primary/30 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
            @click="toggleAppSelection(item)"
          >
            <UIcon :name="item.icon" class="w-8 h-8 flex-shrink-0" :class="item.iconColor" />
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-slate-900 dark:text-white truncate">{{ item.name }}</p>
              <p class="text-xs text-slate-500 truncate">{{ item.description }}</p>
            </div>
            <UIcon
              v-if="isAppSelected(item.id)"
              name="lucide:check-circle"
              class="w-5 h-5 text-primary flex-shrink-0"
            />
            <UIcon
              v-else
              name="lucide:circle"
              class="w-5 h-5 text-slate-300 dark:text-slate-600 flex-shrink-0"
            />
          </div>
        </div>
        <div v-if="availableApps.length === 0" class="text-center py-8">
          <p class="text-slate-500">没有可添加的应用</p>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showAddDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="confirmAddApps" :disabled="selectedAppIds.length === 0">
          确认添加 ({{ selectedAppIds.length }})
        </button>
      </template>
    </UDialog>

    <UDialog v-model="showEditDialog" :title="`编辑应用 - ${editingApp?.name || ''}`" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">应用名称</label>
          <UInput v-model="editForm.name" placeholder="输入应用名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">应用描述</label>
          <UTextarea v-model="editForm.description" placeholder="输入应用描述" rows="2" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">分类</label>
          <USelect v-model="editForm.category" :options="categorySelectOptions" />
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
        <button class="btn-glass btn-glass--primary" @click="saveEditApp">保存</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

interface DecorateApp {
  id: string
  name: string
  description: string
  icon: string
  iconColor: string
  category: 'chat' | 'agent' | 'knowledge' | 'tool' | 'other'
  displayed: boolean
  featured: boolean
  sortOrder: number
}

interface AvailableApp {
  id: string
  name: string
  description: string
  icon: string
  iconColor: string
  category: 'chat' | 'agent' | 'knowledge' | 'tool' | 'other'
}

type AppCategory = 'chat' | 'agent' | 'knowledge' | 'tool' | 'other'

const activeTab = ref('apps')
const searchKeyword = ref('')
const categoryFilter = ref('all')
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const addSearchKeyword = ref('')
const selectedAppIds = ref<string[]>([])
const editingApp = ref<DecorateApp | null>(null)
const dragItem = ref<DecorateApp | null>(null)

const tabs = [
  { key: 'apps', label: '应用装修', icon: 'lucide:layout-grid' },
  { key: 'layout', label: '布局装修', icon: 'lucide:panel-top' },
  { key: 'agents', label: 'Agent装修', icon: 'lucide:bot' },
]

const categoryOptions = [
  { label: '全部分类', value: 'all' },
  { label: '对话应用', value: 'chat' },
  { label: '智能体', value: 'agent' },
  { label: '知识库', value: 'knowledge' },
  { label: '工具', value: 'tool' },
  { label: '其他', value: 'other' },
]

const categorySelectOptions = [
  { label: '对话应用', value: 'chat' },
  { label: '智能体', value: 'agent' },
  { label: '知识库', value: 'knowledge' },
  { label: '工具', value: 'tool' },
  { label: '其他', value: 'other' },
]

const editForm = ref({
  name: '',
  description: '',
  category: 'other' as AppCategory,
  displayed: true,
  featured: false,
})

const apps = ref<DecorateApp[]>([
  {
    id: '1',
    name: 'AI 对话助手',
    description: '通用智能对话应用，支持多模型切换',
    icon: 'lucide:message-square',
    iconColor: 'text-blue-500 dark:text-blue-400',
    category: 'chat',
    displayed: true,
    featured: true,
    sortOrder: 1,
  },
  {
    id: '2',
    name: '代码助手',
    description: 'AI 编程辅助，代码生成与审查',
    icon: 'lucide:code-2',
    iconColor: 'text-green-500 dark:text-green-400',
    category: 'tool',
    displayed: true,
    featured: true,
    sortOrder: 2,
  },
  {
    id: '3',
    name: '知识库管理',
    description: '文档上传、检索与管理',
    icon: 'lucide:database',
    iconColor: 'text-orange-500 dark:text-orange-400',
    category: 'knowledge',
    displayed: true,
    featured: false,
    sortOrder: 3,
  },
  {
    id: '4',
    name: '智能体中心',
    description: '创建和管理 AI Agent',
    icon: 'lucide:bot',
    iconColor: 'text-purple-500 dark:text-purple-400',
    category: 'agent',
    displayed: true,
    featured: true,
    sortOrder: 4,
  },
  {
    id: '5',
    name: '数据分析',
    description: '数据可视化与智能分析',
    icon: 'lucide:bar-chart-3',
    iconColor: 'text-pink-500 dark:text-pink-400',
    category: 'tool',
    displayed: true,
    featured: false,
    sortOrder: 5,
  },
  {
    id: '6',
    name: '图片生成',
    description: 'AI 图像生成与编辑工具',
    icon: 'lucide:image',
    iconColor: 'text-cyan-500 dark:text-cyan-400',
    category: 'tool',
    displayed: false,
    featured: false,
    sortOrder: 6,
  },
])

const availableApps = computed(() => {
  const existingIds = new Set(apps.value.map(a => a.id))
  const allAvailable: AvailableApp[] = [
    { id: '7', name: '语音转文字', description: '音频转文字转录服务', icon: 'lucide:mic', iconColor: 'text-rose-500 dark:text-rose-400', category: 'tool' },
    { id: '8', name: '文档翻译', description: '多语言文档翻译工具', icon: 'lucide:languages', iconColor: 'text-indigo-500 dark:text-indigo-400', category: 'tool' },
    { id: '9', name: '视频分析', description: '视频内容智能分析', icon: 'lucide:video', iconColor: 'text-amber-500 dark:text-amber-400', category: 'tool' },
    { id: '10', name: '客服助手', description: '智能客服对话机器人', icon: 'lucide:headphones', iconColor: 'text-emerald-500 dark:text-emerald-400', category: 'chat' },
    { id: '11', name: '写作助手', description: 'AI 写作辅助与润色', icon: 'lucide:pen', iconColor: 'text-violet-500 dark:text-violet-400', category: 'tool' },
    { id: '12', name: 'MCP 工具市场', description: 'MCP 协议工具安装与管理', icon: 'lucide:plug', iconColor: 'text-teal-500 dark:text-teal-400', category: 'tool' },
  ]

  let result = allAvailable.filter(a => !existingIds.has(a.id))
  if (addSearchKeyword.value.trim()) {
    const kw = addSearchKeyword.value.toLowerCase()
    result = result.filter(a => a.name.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw))
  }
  return result
})

const filteredApps = computed(() => {
  let result = [...apps.value].sort((a, b) => a.sortOrder - b.sortOrder)

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(a => a.name.toLowerCase().includes(kw) || a.description.toLowerCase().includes(kw))
  }

  if (categoryFilter.value !== 'all') {
    result = result.filter(a => a.category === categoryFilter.value)
  }

  return result
})

function getCategoryText(category: AppCategory): string {
  const map: Record<AppCategory, string> = {
    chat: '对话',
    agent: '智能体',
    knowledge: '知识库',
    tool: '工具',
    other: '其他',
  }
  return map[category]
}

function getCategoryBadgeClass(category: AppCategory): string {
  const map: Record<AppCategory, string> = {
    chat: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    agent: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    knowledge: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
    tool: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    other: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
  }
  return map[category]
}

function toggleDisplay(app: DecorateApp) {
  app.displayed = !app.displayed
}

function editApp(app: DecorateApp) {
  editingApp.value = app
  editForm.value = {
    name: app.name,
    description: app.description,
    category: app.category,
    displayed: app.displayed,
    featured: app.featured,
  }
  showEditDialog.value = true
}

function saveEditApp() {
  if (editingApp.value) {
    editingApp.value.name = editForm.value.name
    editingApp.value.description = editForm.value.description
    editingApp.value.category = editForm.value.category
    editingApp.value.displayed = editForm.value.displayed
    editingApp.value.featured = editForm.value.featured
  }
  showEditDialog.value = false
  editingApp.value = null
}

function isAppSelected(id: string): boolean {
  return selectedAppIds.value.includes(id)
}

function toggleAppSelection(item: AvailableApp) {
  const idx = selectedAppIds.value.indexOf(item.id)
  if (idx > -1) {
    selectedAppIds.value.splice(idx, 1)
  } else {
    selectedAppIds.value.push(item.id)
  }
}

function confirmAddApps() {
  const maxOrder = apps.value.length > 0 ? Math.max(...apps.value.map(a => a.sortOrder)) : 0
  const allAvailable: AvailableApp[] = [
    { id: '7', name: '语音转文字', description: '音频转文字转录服务', icon: 'lucide:mic', iconColor: 'text-rose-500 dark:text-rose-400', category: 'tool' },
    { id: '8', name: '文档翻译', description: '多语言文档翻译工具', icon: 'lucide:languages', iconColor: 'text-indigo-500 dark:text-indigo-400', category: 'tool' },
    { id: '9', name: '视频分析', description: '视频内容智能分析', icon: 'lucide:video', iconColor: 'text-amber-500 dark:text-amber-400', category: 'tool' },
    { id: '10', name: '客服助手', description: '智能客服对话机器人', icon: 'lucide:headphones', iconColor: 'text-emerald-500 dark:text-emerald-400', category: 'chat' },
    { id: '11', name: '写作助手', description: 'AI 写作辅助与润色', icon: 'lucide:pen', iconColor: 'text-violet-500 dark:text-violet-400', category: 'tool' },
    { id: '12', name: 'MCP 工具市场', description: 'MCP 协议工具安装与管理', icon: 'lucide:plug', iconColor: 'text-teal-500 dark:text-teal-400', category: 'tool' },
  ]

  selectedAppIds.value.forEach((id, index) => {
    const template = allAvailable.find(a => a.id === id)
    if (template) {
      const newApp: DecorateApp = {
        ...template,
        id: Date.now().toString() + '_' + index,
        displayed: true,
        featured: false,
        sortOrder: maxOrder + index + 1,
      }
      apps.value.push(newApp)
    }
  })

  selectedAppIds.value = []
  showAddDialog.value = false
}

function onDragStart(event: DragEvent, app: DecorateApp) {
  dragItem.value = app
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', app.id)
  }
}

function onDragOver(event: DragEvent, app: DecorateApp) {
  if (!dragItem.value || dragItem.value.id === app.id) return
  const fromIndex = apps.value.findIndex(a => a.id === dragItem.value!.id)
  const toIndex = apps.value.findIndex(a => a.id === app.id)
  if (fromIndex !== -1 && toIndex !== -1) {
    const [moved] = apps.value.splice(fromIndex, 1)
    apps.value.splice(toIndex, 0, moved)
    apps.value.forEach((a, i) => { a.sortOrder = i + 1 })
  }
}

function onDrop(event: DragEvent, _app: DecorateApp) {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

function onDragEnd() {
  dragItem.value = null
}
</script>