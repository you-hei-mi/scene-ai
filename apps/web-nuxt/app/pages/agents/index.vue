<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border">
      <div class="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <UIcon name="lucide:bot" class="w-5 h-5 text-primary" />
          </div>
          <span class="font-semibold text-lg">BuildingAI Agents</span>
        </div>
        <div class="flex items-center gap-3">
          <UInput
            v-model="keyword"
            placeholder="搜索智能体..."
            class="w-64"
          >
            <template #leading>
              <UIcon name="lucide:search" class="w-4 h-4 text-muted-foreground" />
            </template>
          </UInput>
          <UButton @click="handleCreate">
            <template #icon>
              <UIcon name="lucide:plus" class="w-4 h-4" />
            </template>
            创建智能体
          </UButton>
          <NuxtLink to="/chat">
            <UButton variant="ghost">
              <template #icon>
                <UIcon name="lucide:message-square" class="w-4 h-4" />
              </template>
              对话
            </UButton>
          </NuxtLink>
        </div>
      </div>
    </header>

    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">智能体广场</h1>
        <p class="text-muted-foreground">发现和使用各种专业的 AI 智能体</p>
      </div>

      <div class="flex gap-2 mb-6 flex-wrap">
        <UButton
          v-for="tag in tags"
          :key="tag.id"
          :variant="selectedTagId === tag.id ? 'solid' : 'outline'"
          size="sm"
          @click="toggleTag(tag.id)"
        >
          {{ tag.name }}
        </UButton>
      </div>

      <div v-if="agentStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <UCard v-for="i in 8" :key="i" class="animate-pulse">
          <div class="space-y-3">
            <div class="h-12 w-12 rounded-lg bg-muted"></div>
            <div class="h-5 w-2/3 bg-muted rounded"></div>
            <div class="h-4 w-full bg-muted rounded"></div>
            <div class="h-4 w-5/6 bg-muted rounded"></div>
          </div>
        </UCard>
      </div>

      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
      >
        <UCard
          v-for="agent in filteredAgents"
          :key="agent.id"
          class="cursor-pointer hover:border-primary transition-all hover:shadow-md group"
          @click="handleSelectAgent(agent)"
        >
          <div class="flex items-start gap-3 mb-3">
            <div
              class="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              :class="getAvatarBg(agent.tags[0])"
            >
              <UIcon name="lucide:bot" class="w-6 h-6 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="font-semibold truncate group-hover:text-primary transition-colors">
                {{ agent.name }}
              </h3>
              <div class="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <UIcon name="lucide:zap" class="w-3 h-3" />
                <span class="truncate">{{ agent.model }}</span>
              </div>
            </div>
          </div>
          <p class="text-sm text-muted-foreground line-clamp-2 mb-3 min-h-[40px]">
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
            <div class="flex items-center gap-3 text-xs text-muted-foreground">
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
        </UCard>
      </div>

      <div v-if="filteredAgents.length === 0 && !agentStore.loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <UIcon name="lucide:search-x" class="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 class="text-lg font-medium mb-2">未找到智能体</h3>
        <p class="text-muted-foreground">尝试使用其他关键词或标签搜索</p>
      </div>
    </div>

    <UDialog v-model:open="showCreateDialog" title="创建智能体">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5">智能体名称</label>
          <UInput v-model="newAgent.name" placeholder="给你的智能体起个名字" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">描述</label>
          <textarea
            v-model="newAgent.description"
            placeholder="简单描述一下这个智能体的用途"
            class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[80px]"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">可见性</label>
          <USelect v-model="newAgent.visibility" :options="visibilityOptions" />
        </div>
      </div>
      <template #footer>
        <UButton variant="outline" @click="showCreateDialog = false">
          取消
        </UButton>
        <UButton @click="handleConfirmCreate">
          创建
        </UButton>
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
