<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <header class="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
              <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
            </div>
            <span class="font-display font-bold text-lg text-slate-900 dark:text-white">BuildingAI Agents</span>
          </div>
          <div class="flex items-center gap-3">
            <div class="relative">
              <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                v-model="keyword"
                placeholder="搜索智能体..."
                class="w-64 pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button class="btn-glass btn-glass--primary" @click="handleCreate">
              <UIcon name="lucide:plus" class="w-4 h-4" />
              创建智能体
            </button>
            <NuxtLink to="/chat">
              <button class="btn-glass">
                <UIcon name="lucide:message-square" class="w-4 h-4" />
                对话
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="error" class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
        <UIcon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
        <div class="flex-1">
          <p class="text-sm font-medium text-amber-800 dark:text-amber-300">{{ error }}</p>
          <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">当前显示的是本地缓存数据，部分功能可能受限</p>
        </div>
        <button class="text-xs text-amber-700 dark:text-amber-300 underline hover:no-underline flex-shrink-0" @click="fetchAgentList">
          重试
        </button>
      </div>

      <div class="mb-8">
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-4xl font-bold text-slate-900 dark:text-white">智能体广场</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">发现和使用各种专业的 AI 智能体</p>
      </div>

      <div class="flex flex-wrap gap-2 mb-8">
        <button
          v-for="tag in tags"
          :key="tag.id"
          :class="[
            'px-4 py-2 rounded-full text-sm font-medium transition-all duration-200',
            selectedTagId === tag.id
              ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50 hover:text-primary'
          ]"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>

      <div v-if="agentStore.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
          <div class="space-y-4">
            <div class="h-14 w-14 rounded-xl bg-slate-100 dark:bg-slate-700"></div>
            <div class="h-5 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
            <div class="h-4 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
            <div class="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="agent in filteredAgents"
          :key="agent.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 hover:-translate-y-1"
          @click="handleSelectAgent(agent)"
        >
          <div class="flex items-start gap-4 mb-4">
            <div
              class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
              :style="{ background: ({ '通用': 'linear-gradient(135deg, #3b82f6, #06b6d4)', '编程': 'linear-gradient(135deg, #16a34a, #22c55e)', '写作': 'linear-gradient(135deg, #a855f7, #d946ef)', '翻译': 'linear-gradient(135deg, #f97316, #f59e0b)', '数据': 'linear-gradient(135deg, #06b6d4, #22d3ee)', '产品': 'linear-gradient(135deg, #ec4899, #f43f5e)' } as Record<string, string>)[agent.tags[0]] || 'linear-gradient(135deg, #6366f1, #8b5cf6)' }"
            >
              <UIcon name="lucide:bot" class="w-7 h-7 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold text-slate-900 dark:text-white truncate transition-colors group-hover:text-primary">
                {{ agent.name }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <UIcon name="lucide:zap" class="w-3 h-3 text-amber-500" />
                <span class="truncate">{{ agent.model }}</span>
              </div>
            </div>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
            {{ agent.description }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <span
                v-for="tag in agent.tags.slice(0, 2)"
                :key="tag"
                class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              >
                {{ tag }}
              </span>
            </div>
            <div class="flex items-center gap-4 text-xs text-slate-500">
              <span class="flex items-center gap-1.5">
                <UIcon name="lucide:message-circle" class="w-3.5 h-3.5" />
                {{ formatNumber(agent.usageCount || 0) }}
              </span>
              <span class="flex items-center gap-1.5">
                <UIcon name="lucide:heart" class="w-3.5 h-3.5" />
                {{ formatNumber(agent.likes || 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredAgents.length === 0 && !agentStore.loading" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <UIcon name="lucide:search-x" class="w-10 h-10 text-slate-400" />
        </div>
        <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">未找到智能体</h3>
        <p class="text-slate-600 dark:text-slate-400">尝试使用其他关键词或标签搜索</p>
      </div>
    </div>

    <UDialog v-model:open="showCreateDialog" title="创建智能体">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">智能体名称</label>
          <input
            v-model="newAgent.name"
            placeholder="给你的智能体起个名字"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">描述</label>
          <textarea
            v-model="newAgent.description"
            placeholder="简单描述一下这个智能体的用途"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] resize-none"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">可见性</label>
          <USelect v-model="newAgent.visibility" :options="visibilityOptions" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showCreateDialog = false">
          取消
        </button>
        <button class="btn-glass btn-glass--primary" @click="handleConfirmCreate">
          创建
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMyAgents } from '~/composables/api/core'

const agentStore = useAgentStore()
const toast = useToast()
const route = useRoute()

const keyword = ref('')
const selectedTagId = ref<string | null>(null)
const showCreateDialog = ref(false)
const error = ref<string | null>(null)

const newAgent = ref({
  name: '',
  description: '',
  visibility: 'private',
})

const tags = ref([
  { id: 'all', name: '全部' },
  { id: 'general', name: '通用' },
  { id: 'coding', name: '编程' },
  { id: 'writing', name: '写作' },
  { id: 'translation', name: '翻译' },
  { id: 'data', name: '数据' },
  { id: 'product', name: '产品' },
])

const visibilityOptions = [
  { label: '私密', value: 'private' },
  { label: '团队可见', value: 'team' },
  { label: '公开', value: 'public' },
]

const filteredAgents = computed(() => {
  let result = [...agentStore.agents]
  
  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(
      a => a.name.toLowerCase().includes(kw) ||
           a.description.toLowerCase().includes(kw)
    )
  }
  
  if (selectedTagId.value && selectedTagId.value !== 'all') {
    const tagName = tags.value.find(t => t.id === selectedTagId.value)?.name
    if (tagName) {
      result = result.filter(a => a.tags.includes(tagName))
    }
  }
  
  return result
})

function getAvatarBg(tag: string) {
  const colors: Record<string, string> = {
    '通用': 'bg-blue-500',
    '编程': 'bg-green-600',
    '写作': 'bg-purple-500',
    '翻译': 'bg-orange-500',
    '数据': 'bg-cyan-500',
    '产品': 'bg-pink-500',
  }
  return colors[tag] || 'bg-primary'
}

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function toggleTag(tagId: string) {
  selectedTagId.value = selectedTagId.value === tagId ? null : tagId
}

function handleCreate() {
  newAgent.value = { name: '', description: '', visibility: 'private' }
  showCreateDialog.value = true
}

async function handleConfirmCreate() {
  if (!newAgent.value.name.trim()) {
    toast.add({ title: '请输入智能体名称', color: 'yellow' })
    return
  }
  
  const agent = await agentStore.createAgent(newAgent.value)
  showCreateDialog.value = false
  toast.add({ title: '创建成功', color: 'green' })
  
  if (agent) {
    navigateTo(`/agents/${agent.id}`)
  }
}

function handleSelectAgent(agent: any) {
  navigateTo(`/agents/${agent.id}`)
}

async function fetchAgentList() {
  error.value = null
  agentStore.loading = true
  try {
    const result = await getMyAgents()
    const apiItems = result?.items ?? []
    const mappedAgents = apiItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      avatar: item.avatar,
      tags: item.tags ?? [],
      model: item.modelName || 'unknown',
      prompt: item.rolePrompt,
      temperature: 0.7,
      visibility: item.publishedToSquare ? 'public' : 'private',
      status: 'published',
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now()),
      usageCount: item.userCount ?? 0,
      likes: 0,
      author: item.creatorName ? { id: '', name: item.creatorName } : undefined,
    }))
    agentStore.agents = mappedAgents
    agentStore.total = mappedAgents.length
  } catch (e: any) {
    error.value = `加载智能体列表失败: ${e.message || '网络异常'}`  + '，已切换到本地缓存数据'
    agentStore.initMockData()
  } finally {
    agentStore.loading = false
  }
}

onMounted(() => {
  fetchAgentList()
})
</script>