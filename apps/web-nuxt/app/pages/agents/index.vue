<template>
  <div style="background: var(--bg-deep); min-height: 100vh">
    <header style="border-bottom: 1px solid var(--glass-border); background: var(--glass-bg-nav)">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--accent-soft-bg)">
            <UIcon name="lucide:bot" class="w-5 h-5" style="color: var(--accent-soft-text)" />
          </div>
          <span class="font-display font-semibold text-lg" style="color: var(--text-primary)">BuildingAI Agents</span>
        </div>
        <div class="flex items-center gap-3">
          <input
            v-model="keyword"
            placeholder="搜索智能体..."
            style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; padding-left: 2.25rem; color: var(--text-primary); outline: none; width: 16rem; font-size: 0.875rem;"
          />
          <UIcon name="lucide:search" class="w-4 h-4 absolute" style="color: var(--text-secondary); margin-left: 0.75rem; pointer-events: none;" />
          <button class="btn-glass btn-glass--primary" @click="handleCreate" style="display: inline-flex; align-items: center; gap: 0.375rem;">
            <UIcon name="lucide:plus" class="w-4 h-4" />
            创建智能体
          </button>
          <NuxtLink to="/chat">
            <button class="btn-glass" style="display: inline-flex; align-items: center; gap: 0.375rem;">
              <UIcon name="lucide:message-square" class="w-4 h-4" />
              对话
            </button>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="font-display text-3xl font-bold mb-2 text-gradient">智能体广场</h1>
        <p style="color: var(--text-secondary)">发现和使用各种专业的 AI 智能体</p>
      </div>

      <div class="flex gap-2 mb-6 flex-wrap">
        <button
          v-for="tag in tags"
          :key="tag.id"
          :class="selectedTagId === tag.id ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          style="padding: 0.25rem 0.75rem; font-size: 0.875rem;"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </button>
      </div>

      <div v-if="agentStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="i in 8" :key="i" class="glass-card p-4 animate-pulse">
          <div class="space-y-3">
            <div class="h-12 w-12 rounded-lg" style="background: var(--glass-bg-1)"></div>
            <div class="h-5 w-2/3 rounded" style="background: var(--glass-bg-1)"></div>
            <div class="h-4 w-full rounded" style="background: var(--glass-bg-1)"></div>
            <div class="h-4 w-5/6 rounded" style="background: var(--glass-bg-1)"></div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <div
          v-for="agent in filteredAgents"
          :key="agent.id"
          class="glass-card p-4 cursor-pointer group"
          style="transition: all 0.2s;"
          @click="handleSelectAgent(agent)"
        >
          <div class="flex items-start gap-3 mb-3">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              :style="{ background: ({ '通用': '#3b82f6', '编程': '#16a34a', '写作': '#a855f7', '翻译': '#f97316', '数据': '#06b6d4', '产品': '#ec4899' } as Record<string, string>)[agent.tags[0]] || 'var(--accent-bright)' }"
            >
              <UIcon name="lucide:bot" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold truncate" style="color: var(--text-primary); transition: color 0.2s;">
                {{ agent.name }}
              </h3>
              <div class="flex items-center gap-2 text-xs mt-0.5" style="color: var(--text-secondary)">
                <UIcon name="lucide:zap" class="w-3 h-3" />
                <span class="truncate">{{ agent.model }}</span>
              </div>
            </div>
          </div>
          <p class="text-sm line-clamp-2 mb-3 min-h-[40px]" style="color: var(--text-secondary)">
            {{ agent.description }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex gap-1">
              <UBadge
                v-for="tag in agent.tags.slice(0, 2)"
                :key="tag"
                variant="secondary"
                size="sm"
              >
                {{ tag }}
              </UBadge>
            </div>
            <div class="flex items-center gap-3 text-xs" style="color: var(--text-secondary)">
              <span class="flex items-center gap-1">
                <UIcon name="lucide:message-circle" class="w-3 h-3" />
                {{ formatNumber(agent.usageCount || 0) }}
              </span>
              <span class="flex items-center gap-1">
                <UIcon name="lucide:heart" class="w-3 h-3" />
                {{ formatNumber(agent.likes || 0) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filteredAgents.length === 0 && !agentStore.loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style="background: var(--glass-bg-1)">
          <UIcon name="lucide:search-x" class="w-8 h-8" style="color: var(--text-secondary)" />
        </div>
        <h3 class="text-lg font-medium mb-2" style="color: var(--text-primary)">未找到智能体</h3>
        <p style="color: var(--text-secondary)">尝试使用其他关键词或标签搜索</p>
      </div>
    </div>

    <UDialog v-model:open="showCreateDialog" title="创建智能体">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">智能体名称</label>
          <input
            v-model="newAgent.name"
            placeholder="给你的智能体起个名字"
            style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">描述</label>
          <textarea
            v-model="newAgent.description"
            placeholder="简单描述一下这个智能体的用途"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; outline: none; min-height: 80px; background: var(--glass-bg-1); color: var(--text-primary); resize: vertical;"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">可见性</label>
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

const agentStore = useAgentStore()
const toast = useToast()
const route = useRoute()

const keyword = ref('')
const selectedTagId = ref<string | null>(null)
const showCreateDialog = ref(false)

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

onMounted(() => {
  agentStore.fetchAgents()
})
</script>
