<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <header class="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div class="flex items-center gap-4">
        <button class="btn-glass p-2 hover:bg-slate-100 dark:hover:bg-slate-800" @click="navigateTo('/agents')">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
        </button>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
          <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="font-display font-bold text-slate-900 dark:text-white">{{ currentAgent?.name || '智能体详情' }}</h1>
          <p class="text-xs text-slate-500">{{ currentAgent?.model }}</p>
        </div>
        <UBadge
          :class="[
            'ml-2 px-3 py-1 rounded-full text-xs font-medium',
            currentAgent?.status === 'published' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
          ]"
        >
          {{ statusText }}
        </UBadge>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-glass" @click="handlePreview">
          <UIcon name="lucide:eye" class="w-4 h-4" />
          预览
        </button>
        <button 
          class="btn-glass btn-glass--primary" 
          @click="handlePublish" 
          :disabled="currentAgent?.status === 'published'"
          :class="{ 'opacity-50 cursor-not-allowed': currentAgent?.status === 'published' }"
        >
          <UIcon name="lucide:upload" class="w-4 h-4" />
          发布
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-52 border-r border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <nav class="p-3">
          <ul class="space-y-1">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary dark:from-primary/20 dark:to-accent/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-4xl mx-auto p-6 sm:p-8">
          <div v-if="activeTab === 'config'" class="space-y-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">智能体配置</h2>
            </div>
            
            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">基础信息</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">智能体名称</label>
                    <input
                      v-model="editForm.name"
                      placeholder="输入智能体名称"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">描述</label>
                    <textarea
                      v-model="editForm.description"
                      placeholder="描述这个智能体的功能和用途"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">可见性</label>
                    <USelect v-model="editForm.visibility" :options="visibilityOptions" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">角色设定</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">系统提示词 (System Prompt)</label>
                    <textarea
                      v-model="editForm.prompt"
                      placeholder="定义智能体的角色、行为准则、回答风格等..."
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[140px] resize-vertical font-mono text-sm"
                    ></textarea>
                    <p class="text-xs text-slate-500 mt-2">
                      提示词会影响智能体的所有回复，建议仔细编写
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">模型设置</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">选择模型</label>
                    <USelect v-model="editForm.model" :options="modelOptions" />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                      温度: <span class="text-primary font-bold">{{ editForm.temperature }}</span>
                    </label>
                    <input
                      type="range"
                      v-model.number="editForm.temperature"
                      min="0"
                      max="2"
                      step="0.1"
                      class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                    />
                    <div class="flex justify-between text-xs text-slate-500 mt-2">
                      <span>精确</span>
                      <span>创意</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">关联知识库</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="space-y-3">
                  <div
                    v-for="kb in selectedKnowledgeBases"
                    :key="kb.id"
                    class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50"
                  >
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <UIcon name="lucide:database" class="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">{{ kb.name }}</div>
                        <div class="text-xs text-slate-500">{{ kb.docs }} 篇文档</div>
                      </div>
                    </div>
                    <button class="p-2 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors" @click="removeKnowledgeBase(kb.id)">
                      <UIcon name="lucide:x" class="w-4 h-4 text-slate-500" />
                    </button>
                  </div>
                  <button 
                    class="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700/50 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2"
                    @click="showKbDialog = true"
                  >
                    <UIcon name="lucide:plus" class="w-4 h-4" />
                    添加知识库
                  </button>
                </div>
              </div>
            </section>

            <div class="flex justify-end gap-3 pt-4">
              <button class="btn-glass px-6" @click="resetForm">
                重置
              </button>
              <button class="btn-glass btn-glass--primary px-6" @click="handleSave" :disabled="saving">
                <span v-if="saving" class="inline-flex items-center gap-2">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  保存中...
                </span>
                <span v-else>保存配置</span>
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'chat'" class="h-[calc(100vh-12rem)]">
            <div class="bg-white dark:bg-slate-800 rounded-2xl h-full flex flex-col shadow-sm border border-slate-100 dark:border-slate-700">
              <div class="px-4 py-3 text-center text-sm font-medium text-slate-500 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                调试模式 - 在此测试智能体效果
              </div>
              <div class="flex-1 overflow-y-auto p-4 space-y-4">
                <div v-for="msg in chatMessages" :key="msg.id" class="flex gap-3">
                  <div
                    :class="[
                      'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0',
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-primary to-accent text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    ]"
                  >
                    <UIcon :name="msg.role === 'user' ? 'lucide:user' : 'lucide:bot'" class="w-5 h-5" />
                  </div>
                  <div class="flex-1 max-w-[75%]">
                    <div class="font-medium text-sm text-slate-900 dark:text-white mb-1">{{ msg.role === 'user' ? '我' : currentAgent?.name }}</div>
                    <div class="px-4 py-3 rounded-2xl text-sm text-slate-700 dark:text-slate-300" :class="msg.role === 'user' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-700'">
                      {{ msg.content }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <div class="flex gap-3">
                  <input
                    v-model="chatInput"
                    placeholder="输入消息测试智能体..."
                    class="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  />
                  <button class="btn-glass btn-glass--primary px-6" @click="sendChatMessage" :disabled="!chatInput.trim()">
                    发送
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'publish'" class="space-y-8">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">发布与分享</h2>
            </div>
            
            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">发布状态</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-slate-900 dark:text-white">当前状态</div>
                    <div class="text-sm text-slate-500 mt-1">
                      {{ currentAgent?.status === 'published' ? '已发布 - 所有人可见' : '草稿 - 仅自己可见' }}
                    </div>
                  </div>
                  <button
                    :class="[
                      'px-5 py-2.5 rounded-xl font-medium transition-all',
                      currentAgent?.status === 'published' 
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        : 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
                    ]"
                    @click="togglePublish"
                  >
                    {{ currentAgent?.status === 'published' ? '取消发布' : '立即发布' }}
                  </button>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">分享链接</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div class="space-y-3">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">公开访问链接</label>
                    <div class="flex gap-3">
                      <input
                        :value="shareUrl"
                        readonly
                        class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button class="btn-glass px-5" @click="copyShareUrl">
                        复制
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">使用统计</h3>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div class="text-3xl font-bold text-primary">{{ formatNumber(currentAgent?.usageCount || 0) }}</div>
                  <div class="text-sm text-slate-500 mt-2">使用次数</div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div class="text-3xl font-bold text-green-500">{{ formatNumber(currentAgent?.likes || 0) }}</div>
                  <div class="text-sm text-slate-500 mt-2">点赞数</div>
                </div>
                <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
                  <div class="text-3xl font-bold text-blue-500">98.5%</div>
                  <div class="text-sm text-slate-500 mt-2">满意度</div>
                </div>
              </div>
            </section>
          </div>

          <div v-if="activeTab === 'logs'" class="space-y-6">
            <div class="flex items-center gap-4 mb-6">
              <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 class="font-display text-2xl font-bold text-slate-900 dark:text-white">对话日志</h2>
            </div>
            
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <div v-if="logs.length === 0" class="text-center py-16">
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                  <UIcon name="lucide:file-text" class="w-8 h-8 text-slate-400" />
                </div>
                <p class="text-slate-500">暂无对话日志</p>
              </div>
              <div v-else class="divide-y divide-slate-200 dark:divide-slate-700">
                <div
                  v-for="log in logs"
                  :key="log.id"
                  class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition-colors"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-medium text-slate-900 dark:text-white">{{ log.user }}</span>
                    <span class="text-xs text-slate-500">{{ log.time }}</span>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ log.preview }}</p>
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
          :class="[
            'flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all',
            isKbSelected(kb.id) ? 'bg-primary/10 dark:bg-primary/20 border border-primary/30' : 'bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 hover:border-primary/30'
          ]"
          @click="addKnowledgeBase(kb)"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <UIcon name="lucide:database" class="w-5 h-5 text-primary" />
            </div>
            <div>
              <div class="font-medium text-slate-900 dark:text-white">{{ kb.name }}</div>
              <div class="text-xs text-slate-500">{{ kb.docs }} 篇文档</div>
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
