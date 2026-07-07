<template>
  <div style="background: var(--bg-deep); height: 100vh; display: flex; flex-direction: column;">
    <header class="h-14 flex items-center justify-between px-4" style="border-bottom: 1px solid var(--glass-border); background: var(--glass-bg-nav)">
      <div class="flex items-center gap-3">
        <button class="btn-glass" style="padding: 0.25rem 0.5rem; font-size: 0.875rem; display: inline-flex; align-items: center; gap: 0.25rem;" @click="navigateTo('/agents')">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
          返回
        </button>
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background: var(--accent-soft-bg)">
          <UIcon name="lucide:bot" class="w-5 h-5" style="color: var(--accent-soft-text)" />
        </div>
        <div>
          <h1 class="font-display font-semibold" style="color: var(--text-primary)">{{ currentAgent?.name || '智能体详情' }}</h1>
          <p class="text-xs" style="color: var(--text-secondary)">{{ currentAgent?.model }}</p>
        </div>
        <UBadge
          :variant="currentAgent?.status === 'published' ? 'default' : 'outline'"
          size="sm"
        >
          {{ statusText }}
        </UBadge>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-glass" style="display: inline-flex; align-items: center; gap: 0.25rem;" @click="handlePreview">
          <UIcon name="lucide:eye" class="w-4 h-4" />
          预览
        </button>
        <button class="btn-glass btn-glass--primary" style="display: inline-flex; align-items: center; gap: 0.25rem;" @click="handlePublish" :disabled="currentAgent?.status === 'published'">
          <UIcon name="lucide:upload" class="w-4 h-4" />
          发布
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-56" style="border-right: 1px solid var(--glass-border); background: var(--glass-bg-1)">
        <nav class="p-2">
          <ul class="space-y-1">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors"
              :style="activeTab === tab.id ? { background: 'var(--nav-active-bg)', color: 'var(--text-primary)' } : { color: 'var(--text-secondary)' }"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-6">
          <!-- 配置页 -->
          <div v-if="activeTab === 'config'">
            <h2 class="font-display text-xl font-semibold mb-6" style="color: var(--text-primary)">智能体配置</h2>
            
            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">基础信息</h3>
              <div class="glass-card p-4">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">智能体名称</label>
                    <input
                      v-model="editForm.name"
                      placeholder="输入智能体名称"
                      style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">描述</label>
                    <textarea
                      v-model="editForm.description"
                      placeholder="描述这个智能体的功能和用途"
                      style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; outline: none; min-height: 80px; background: var(--glass-bg-1); color: var(--text-primary); resize: none;"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">可见性</label>
                    <USelect v-model="editForm.visibility" :options="visibilityOptions" />
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">角色设定</h3>
              <div class="glass-card p-4">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">系统提示词 (System Prompt)</label>
                    <textarea
                      v-model="editForm.prompt"
                      placeholder="定义智能体的角色、行为准则、回答风格等..."
                      style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; outline: none; min-height: 120px; background: var(--glass-bg-1); color: var(--text-primary); resize: vertical; font-family: monospace; font-size: 0.875rem;"
                    ></textarea>
                    <p class="text-xs mt-1" style="color: var(--text-secondary)">
                      提示词会影响智能体的所有回复，建议仔细编写
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">模型设置</h3>
              <div class="glass-card p-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">选择模型</label>
                    <USelect v-model="editForm.model" :options="modelOptions" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">
                      温度: {{ editForm.temperature }}
                    </label>
                    <input
                      type="range"
                      v-model.number="editForm.temperature"
                      min="0"
                      max="2"
                      step="0.1"
                      class="w-full"
                    />
                    <div class="flex justify-between text-xs" style="color: var(--text-secondary)">
                      <span>精确</span>
                      <span>创意</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">关联知识库</h3>
              <div class="glass-card p-4">
                <div class="space-y-3">
                  <div
                    v-for="kb in selectedKnowledgeBases"
                    :key="kb.id"
                    class="flex items-center justify-between p-3 rounded-lg"
                    style="border: 1px solid var(--glass-border)"
                  >
                    <div class="flex items-center gap-3">
                      <UIcon name="lucide:database" class="w-5 h-5" style="color: var(--accent-soft-text)" />
                      <div>
                        <div class="font-medium" style="color: var(--text-primary)">{{ kb.name }}</div>
                        <div class="text-xs" style="color: var(--text-secondary)">{{ kb.docs }} 篇文档</div>
                      </div>
                    </div>
                    <button class="btn-glass" style="padding: 0.25rem 0.5rem; font-size: 0.875rem;" @click="removeKnowledgeBase(kb.id)">
                      <UIcon name="lucide:x" class="w-4 h-4" />
                    </button>
                  </div>
                  <button class="btn-glass w-full" style="display: inline-flex; align-items: center; justify-content: center; gap: 0.25rem;" @click="showKbDialog = true">
                    <UIcon name="lucide:plus" class="w-4 h-4" />
                    添加知识库
                  </button>
                </div>
              </div>
            </section>

            <div class="flex justify-end gap-3">
              <button class="btn-glass" @click="resetForm">
                重置
              </button>
              <button class="btn-glass btn-glass--primary" @click="handleSave" :disabled="saving">
                <span v-if="saving" class="inline-flex items-center gap-1">
                  <span class="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                  保存中...
                </span>
                <span v-else>保存配置</span>
              </button>
            </div>
          </div>

          <!-- 对话页 -->
          <div v-if="activeTab === 'chat'" class="h-[calc(100vh-8rem)]">
            <div class="rounded-lg h-full flex flex-col" style="border: 1px solid var(--glass-border); background: var(--glass-bg-2)">
              <div class="p-3 text-center text-sm" style="border-bottom: 1px solid var(--glass-border); color: var(--text-secondary)">
                调试模式 - 在此测试智能体效果
              </div>
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div v-for="msg in chatMessages" :key="msg.id" class="flex gap-3">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    :style="msg.role === 'user' ? { background: 'var(--accent-bright)', color: 'white' } : { background: 'var(--glass-bg-1)', color: 'var(--text-primary)' }"
                  >
                    <UIcon :name="msg.role === 'user' ? 'lucide:user' : 'lucide:bot'" class="w-4 h-4" />
                  </div>
                  <div class="flex-1">
                    <div class="font-medium text-sm mb-1" style="color: var(--text-primary)">{{ msg.role === 'user' ? '我' : currentAgent?.name }}</div>
                    <div class="text-sm" style="color: var(--text-primary)">{{ msg.content }}</div>
                  </div>
                </div>
              </div>
              <div class="p-3" style="border-top: 1px solid var(--glass-border)">
                <div class="flex gap-2">
                  <input
                    v-model="chatInput"
                    placeholder="输入消息测试智能体..."
                    style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; flex: 1;"
                  />
                  <button class="btn-glass btn-glass--primary" @click="sendChatMessage" :disabled="!chatInput.trim()">
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 发布页 -->
          <div v-if="activeTab === 'publish'">
            <h2 class="font-display text-xl font-semibold mb-6" style="color: var(--text-primary)">发布与分享</h2>
            
            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">发布状态</h3>
              <div class="glass-card p-4">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium" style="color: var(--text-primary)">当前状态</div>
                    <div class="text-sm mt-1" style="color: var(--text-secondary)">
                      {{ currentAgent?.status === 'published' ? '已发布 - 所有人可见' : '草稿 - 仅自己可见' }}
                    </div>
                  </div>
                  <button
                    :class="currentAgent?.status === 'published' ? 'btn-glass' : 'btn-glass btn-glass--primary'"
                    @click="togglePublish"
                  >
                    {{ currentAgent?.status === 'published' ? '取消发布' : '立即发布' }}
                  </button>
                </div>
              </div>
            </section>

            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">分享链接</h3>
              <div class="glass-card p-4">
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">公开访问链接</label>
                    <div class="flex gap-2">
                      <input
                        :value="shareUrl"
                        readonly
                        style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-secondary); outline: none; flex: 1;"
                      />
                      <button class="btn-glass" @click="copyShareUrl">
                        复制
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-medium mb-4" style="color: var(--text-primary)">使用统计</h3>
              <div class="grid grid-cols-3 gap-4">
                <div class="glass-card p-4 text-center">
                  <div class="text-3xl font-bold" style="color: var(--accent-soft-text)">{{ formatNumber(currentAgent?.usageCount || 0) }}</div>
                  <div class="text-sm mt-1" style="color: var(--text-secondary)">使用次数</div>
                </div>
                <div class="glass-card p-4 text-center">
                  <div class="text-3xl font-bold" style="color: #22c55e">{{ formatNumber(currentAgent?.likes || 0) }}</div>
                  <div class="text-sm mt-1" style="color: var(--text-secondary)">点赞数</div>
                </div>
                <div class="glass-card p-4 text-center">
                  <div class="text-3xl font-bold" style="color: #3b82f6">98.5%</div>
                  <div class="text-sm mt-1" style="color: var(--text-secondary)">满意度</div>
                </div>
              </div>
            </section>
          </div>

          <!-- 日志页 -->
          <div v-if="activeTab === 'logs'">
            <h2 class="font-display text-xl font-semibold mb-6" style="color: var(--text-primary)">对话日志</h2>
            <div class="glass-card p-4">
              <div v-if="logs.length === 0" class="text-center py-12">
                <UIcon name="lucide:file-text" class="w-12 h-12 mx-auto mb-3" style="color: var(--text-secondary)" />
                <p style="color: var(--text-secondary)">暂无对话日志</p>
              </div>
              <div v-else class="space-y-3">
                <div
                  v-for="log in logs"
                  :key="log.id"
                  class="p-3 rounded-lg cursor-pointer"
                  style="border: 1px solid var(--glass-border); transition: background 0.2s;"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium" style="color: var(--text-primary)">{{ log.user }}</span>
                    <span class="text-xs" style="color: var(--text-secondary)">{{ log.time }}</span>
                  </div>
                  <p class="text-sm line-clamp-2" style="color: var(--text-secondary)">{{ log.preview }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UDialog v-model:open="showKbDialog" title="选择知识库">
      <div class="space-y-3 max-h-96 overflow-y-auto">
        <div
          v-for="kb in availableKnowledgeBases"
          :key="kb.id"
          class="flex items-center justify-between p-3 rounded-lg cursor-pointer"
          style="border: 1px solid var(--glass-border); transition: background 0.2s;"
          @click="addKnowledgeBase(kb)"
        >
          <div class="flex items-center gap-3">
            <UIcon name="lucide:database" class="w-5 h-5" style="color: var(--accent-soft-text)" />
            <div>
              <div class="font-medium" style="color: var(--text-primary)">{{ kb.name }}</div>
              <div class="text-xs" style="color: var(--text-secondary)">{{ kb.docs }} 篇文档</div>
            </div>
          </div>
          <UCheckbox :model-value="isKbSelected(kb.id)" :label="''" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showKbDialog = false">
          取消
        </button>
        <button class="btn-glass btn-glass--primary" @click="showKbDialog = false">
          确定
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const agentStore = useAgentStore()
const toast = useToast()
const route = useRoute()

const agentId = computed(() => route.params.id as string)
const currentAgent = computed(() => agentStore.currentAgent)

const activeTab = ref('config')
const saving = ref(false)
const showKbDialog = ref(false)

const tabs = [
  { id: 'config', label: '配置', icon: 'lucide:settings' },
  { id: 'chat', label: '对话调试', icon: 'lucide:message-square' },
  { id: 'publish', label: '发布与分享', icon: 'lucide:upload' },
  { id: 'logs', label: '对话日志', icon: 'lucide:file-text' },
]

const visibilityOptions = [
  { label: '私密 - 仅自己可见', value: 'private' },
  { label: '团队 - 团队成员可见', value: 'team' },
  { label: '公开 - 所有人可见', value: 'public' },
]

const modelOptions = [
  { label: 'DeepSeek V3', value: 'deepseek-chat' },
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { label: 'Claude Sonnet', value: 'claude-sonnet' },
  { label: '通义千问 Plus', value: 'qwen-plus' },
]

const editForm = ref({
  name: '',
  description: '',
  visibility: 'private' as string,
  prompt: '',
  model: 'deepseek-chat',
  temperature: 0.7,
})

const chatInput = ref('')
const chatMessages = ref<any[]>([])

const selectedKnowledgeBases = ref([
  { id: 'kb1', name: '产品文档库', docs: 156 },
])

const availableKnowledgeBases = ref([
  { id: 'kb1', name: '产品文档库', docs: 156 },
  { id: 'kb2', name: '技术知识库', docs: 342 },
  { id: 'kb3', name: 'FAQ 常见问题', docs: 89 },
  { id: 'kb4', name: '客户服务手册', docs: 67 },
  { id: 'kb5', name: '培训资料', docs: 234 },
])

const logs = ref([
  { id: '1', user: '张三', time: '2024-06-25 14:30', preview: '帮我写一份产品需求文档...' },
  { id: '2', user: '李四', time: '2024-06-25 10:15', preview: '这个功能怎么实现？' },
  { id: '3', user: '王五', time: '2024-06-24 16:45', preview: '解释一下微服务架构...' },
])

const statusText = computed(() => {
  const map: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    archived: '已归档',
  }
  return map[currentAgent.value?.status || 'draft']
})

const shareUrl = computed(() => {
  return `https://buildingai.cc/a/${agentId.value}`
})

function formatNumber(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

function resetForm() {
  if (currentAgent.value) {
    editForm.value = {
      name: currentAgent.value.name,
      description: currentAgent.value.description,
      visibility: currentAgent.value.visibility,
      prompt: currentAgent.value.prompt || '',
      model: currentAgent.value.model,
      temperature: currentAgent.value.temperature,
    }
  }
}

async function handleSave() {
  if (!editForm.value.name.trim()) {
    toast.add({ title: '请输入智能体名称', color: 'yellow' })
    return
  }
  
  saving.value = true
  try {
    await agentStore.updateAgent(agentId.value, editForm.value)
    toast.add({ title: '保存成功', color: 'green' })
  } finally {
    saving.value = false
  }
}

function handlePreview() {
  toast.add({ title: '预览功能开发中', color: 'blue' })
}

async function handlePublish() {
  await agentStore.updateAgent(agentId.value, { status: 'published' })
  toast.add({ title: '发布成功', color: 'green' })
}

function togglePublish() {
  const newStatus = currentAgent.value?.status === 'published' ? 'draft' : 'published'
  agentStore.updateAgent(agentId.value, { status: newStatus as any })
  toast.add({
    title: newStatus === 'published' ? '已发布' : '已取消发布',
    color: 'green',
  })
}

function copyShareUrl() {
  navigator.clipboard.writeText(shareUrl.value)
  toast.add({ title: '链接已复制', color: 'green' })
}

function isKbSelected(id: string) {
  return selectedKnowledgeBases.value.some(kb => kb.id === id)
}

function addKnowledgeBase(kb: any) {
  if (!isKbSelected(kb.id)) {
    selectedKnowledgeBases.value.push(kb)
  }
}

function removeKnowledgeBase(id: string) {
  const index = selectedKnowledgeBases.value.findIndex(kb => kb.id === id)
  if (index > -1) {
    selectedKnowledgeBases.value.splice(index, 1)
  }
}

function sendChatMessage() {
  if (!chatInput.value.trim()) return
  
  chatMessages.value.push({
    id: Date.now().toString(),
    role: 'user',
    content: chatInput.value,
  })
  
  const userMsg = chatInput.value
  chatInput.value = ''
  
  setTimeout(() => {
    chatMessages.value.push({
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `这是来自【${currentAgent.value?.name}】的回复：\n\n我已经收到您的问题"${userMsg}"，正在为您处理...\n\n（这是调试模式的模拟回复）`,
    })
  }, 800)
}

watch(agentId, (id) => {
  if (id) {
    agentStore.fetchAgentDetail(id)
  }
}, { immediate: true })

watch(currentAgent, (agent) => {
  if (agent) {
    editForm.value = {
      name: agent.name,
      description: agent.description,
      visibility: agent.visibility,
      prompt: agent.prompt || '',
      model: agent.model,
      temperature: agent.temperature,
    }
  }
}, { immediate: true })

onMounted(() => {
  if (agentId.value) {
    agentStore.fetchAgentDetail(agentId.value)
  }
})
</script>
