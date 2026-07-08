<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">对话管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">对话记录</p>
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

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
      <span class="ml-3 text-slate-500">加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-600 dark:text-red-300 mt-1">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm" @click="fetchRecords">重试</button>
    </div>

    <template v-else>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总对话数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalConversations.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:message-square" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日对话</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ stats.todayConversations.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:calendar" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总消息数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalMessages.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:message-circle" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">活跃用户</p>
            <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{{ stats.activeUsers.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:users" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
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
            placeholder="搜索用户/对话标题..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="agentFilter" :options="agentOptions" class="w-44" />
        <USelect v-model="timeRangeFilter" :options="timeRangeOptions" class="w-40" />
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
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">用户</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">对话标题</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">Agent</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">消息数</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-40">最后活跃</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500 w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              @click="viewConversation(record)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar :text="record.userName.charAt(0)" size="sm" />
                  <div>
                    <div class="font-medium text-sm text-slate-900 dark:text-white">{{ record.userName }}</div>
                    <div class="text-xs text-slate-500">{{ record.userEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-slate-900 dark:text-white max-w-xs truncate">{{ record.title }}</div>
              </td>
              <td class="px-6 py-4">
                <UBadge variant="secondary" size="sm">
                  {{ record.agentName }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ record.messageCount }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ record.lastActive }}</td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2" @click.stop>
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="查看详情" icon="lucide:eye" @click="viewConversation(record)" />
                    <UDropdownMenuItem label="导出对话" icon="lucide:download" @click="exportConversation(record)" />
                    <UDropdownMenuItem label="删除对话" icon="lucide:trash-2" color="red" @click="deleteConversation(record)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredRecords.length === 0" class="text-center py-12">
        <UIcon name="lucide:message-square" class="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <p class="text-slate-500">未找到匹配的对话记录</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ totalRecords }} 条对话记录
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass px-3 py-1.5 text-sm" :disabled="currentPage <= 1" @click="currentPage = Math.max(1, currentPage - 1)">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm font-medium text-slate-900 dark:text-white">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass px-3 py-1.5 text-sm" :disabled="currentPage >= totalPages" @click="currentPage = Math.min(totalPages, currentPage + 1)">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UDialog v-model="showDetailDialog" :title="`对话详情 - ${viewingRecord?.title || ''}`" size="xl">
      <div class="space-y-4">
        <div class="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">用户:</span>
            <span class="text-sm font-medium text-slate-900 dark:text-white">{{ viewingRecord?.userName }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">Agent:</span>
            <UBadge variant="secondary" size="sm">{{ viewingRecord?.agentName }}</UBadge>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">消息数:</span>
            <span class="text-sm font-medium text-slate-900 dark:text-white">{{ viewingRecord?.messageCount }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm text-slate-500">时间:</span>
            <span class="text-sm text-slate-900 dark:text-white">{{ viewingRecord?.lastActive }}</span>
          </div>
        </div>
        <div v-if="loadingDetail" class="flex items-center justify-center py-8">
          <UIcon name="lucide:loader-2" class="w-6 h-6 animate-spin text-primary" />
          <span class="ml-3 text-slate-500">加载对话详情...</span>
        </div>
        <div v-else class="border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
          <div
            v-for="(msg, index) in conversationMessages"
            :key="index"
            class="p-4"
            :class="msg.role === 'user' ? 'bg-slate-50 dark:bg-slate-700/30' : 'bg-white dark:bg-slate-800'"
          >
            <div class="flex items-start gap-3">
              <div
                class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                :class="msg.role === 'user' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'"
              >
                <UIcon
                  :name="msg.role === 'user' ? 'lucide:user' : 'lucide:bot'"
                  class="w-4 h-4"
                  :class="msg.role === 'user' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-xs font-medium text-slate-900 dark:text-white">
                    {{ msg.role === 'user' ? viewingRecord?.userName : viewingRecord?.agentName }}
                  </span>
                  <span class="text-xs text-slate-400">{{ msg.time }}</span>
                </div>
                <p class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{{ msg.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDetailDialog = false">关闭</button>
        <button class="btn-glass btn-glass--primary" @click="exportConversation(viewingRecord!)">
          <UIcon name="lucide:download" class="w-4 h-4" />
          导出对话
        </button>
      </template>
    </UDialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getChatRecords, getChatDetail, deleteChat } from '~/composables/api/system'
import type { ChatRecord as ApiChatRecord } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface ChatRecord {
  id: string
  userId: string
  userName: string
  userEmail: string
  title: string
  agentId: string
  agentName: string
  messageCount: number
  lastActive: string
  createdAt: string
}

interface ConversationMessage {
  role: 'user' | 'assistant'
  content: string
  time: string
}

const loading = ref(true)
const loadingDetail = ref(false)
const error = ref('')
const activeTab = ref('record')
const searchKeyword = ref('')
const agentFilter = ref('all')
const timeRangeFilter = ref('all')
const currentPage = ref(1)
const pageSize = 10
const totalRecords = ref(0)
const showDetailDialog = ref(false)
const viewingRecord = ref<ChatRecord | null>(null)

const tabs = [
  { key: 'record', label: '对话记录', icon: 'lucide:message-square' },
  { key: 'config', label: '对话配置', icon: 'lucide:settings' },
]

const agentOptions = [
  { label: '全部 Agent', value: 'all' },
  { label: '通用助手', value: 'general' },
  { label: '代码专家', value: 'coding' },
  { label: '文案大师', value: 'writing' },
  { label: '数据分析师', value: 'analysis' },
  { label: 'GPT-4o', value: 'gpt4o' },
]

const timeRangeOptions = [
  { label: '不限时间', value: 'all' },
  { label: '今天', value: 'today' },
  { label: '最近 7 天', value: '7days' },
  { label: '最近 30 天', value: '30days' },
  { label: '最近 90 天', value: '90days' },
]

const records = ref<ChatRecord[]>([])

const conversationMessages = ref<ConversationMessage[]>([])

function mapApiRecord(api: ApiChatRecord): ChatRecord {
  return {
    id: api.id,
    userId: api.user?.id || '',
    userName: api.user?.name || '',
    userEmail: '',
    title: api.title,
    agentId: '',
    agentName: api.agentName,
    messageCount: api.messageCount,
    lastActive: api.lastActive,
    createdAt: api.lastActive,
  }
}

const stats = computed(() => ({
  totalConversations: totalRecords.value,
  todayConversations: records.value.filter(r => {
    const today = new Date().toISOString().split('T')[0]
    return r.lastActive.startsWith(today)
  }).length,
  totalMessages: records.value.reduce((sum, r) => sum + r.messageCount, 0),
  activeUsers: new Set(records.value.map(r => r.userId)).size,
}))

const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize) || 1)

const filteredRecords = computed(() => {
  let result = [...records.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      r =>
        r.userName.toLowerCase().includes(kw) ||
        r.userEmail.toLowerCase().includes(kw) ||
        r.title.toLowerCase().includes(kw) ||
        r.agentName.toLowerCase().includes(kw)
    )
  }

  if (agentFilter.value !== 'all') {
    result = result.filter(r => r.agentId === agentFilter.value || r.agentName === agentOptions.find(o => o.value === agentFilter.value)?.label)
  }

  const now = new Date()
  if (timeRangeFilter.value === 'today') {
    const today = now.toISOString().split('T')[0]
    result = result.filter(r => r.lastActive.startsWith(today))
  } else if (timeRangeFilter.value === '7days') {
    result = result.filter(r => {
      const d = new Date(r.lastActive).getTime()
      return (now.getTime() - d) <= 7 * 24 * 60 * 60 * 1000
    })
  } else if (timeRangeFilter.value === '30days') {
    result = result.filter(r => {
      const d = new Date(r.lastActive).getTime()
      return (now.getTime() - d) <= 30 * 24 * 60 * 60 * 1000
    })
  } else if (timeRangeFilter.value === '90days') {
    result = result.filter(r => {
      const d = new Date(r.lastActive).getTime()
      return (now.getTime() - d) <= 90 * 24 * 60 * 60 * 1000
    })
  }

  result.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())

  return result
})

async function fetchRecords() {
  loading.value = true
  error.value = ''
  try {
    const data = await getChatRecords({ page: currentPage.value, pageSize })
    if (data) {
      records.value = (data.items || []).map(mapApiRecord)
      totalRecords.value = data.total || 0
    }
  } catch (e: any) {
    error.value = e.message || '加载对话记录失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchRecords()
})

function resetFilters() {
  searchKeyword.value = ''
  agentFilter.value = 'all'
  timeRangeFilter.value = 'all'
  currentPage.value = 1
}

async function viewConversation(record: ChatRecord) {
  viewingRecord.value = record
  showDetailDialog.value = true
  loadingDetail.value = true
  try {
    const data = await getChatDetail(record.id)
    if (data?.messages) {
      conversationMessages.value = data.messages.map((m: any) => ({
        role: m.role || 'user',
        content: m.content || '',
        time: m.time || '',
      }))
    } else {
      conversationMessages.value = []
    }
  } catch (e: any) {
    conversationMessages.value = []
  } finally {
    loadingDetail.value = false
  }
}

function exportConversation(record: ChatRecord) {
  console.log('导出对话:', record.id)
}

async function deleteConversation(record: ChatRecord) {
  try {
    await deleteChat(record.id)
    const index = records.value.findIndex(r => r.id === record.id)
    if (index > -1) {
      records.value.splice(index, 1)
      totalRecords.value = Math.max(0, totalRecords.value - 1)
    }
  } catch (e: any) {
    error.value = e.message || '删除对话失败'
  }
}
</script>