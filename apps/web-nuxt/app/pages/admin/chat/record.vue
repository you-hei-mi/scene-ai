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
          共 {{ filteredRecords.length }} 条对话记录
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
        <div class="border border-slate-200 dark:border-slate-700 rounded-xl divide-y divide-slate-200 dark:divide-slate-700 max-h-96 overflow-y-auto">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

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

const activeTab = ref('record')
const searchKeyword = ref('')
const agentFilter = ref('all')
const timeRangeFilter = ref('all')
const currentPage = ref(1)
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

const records = ref<ChatRecord[]>([
  {
    id: '1',
    userId: 'u1',
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    title: 'Python 函数优化建议',
    agentId: 'a2',
    agentName: '代码专家',
    messageCount: 24,
    lastActive: '2026-07-07 14:30',
    createdAt: '2026-07-07 09:00',
  },
  {
    id: '2',
    userId: 'u2',
    userName: '李四',
    userEmail: 'lisi@example.com',
    title: '产品文案润色',
    agentId: 'a3',
    agentName: '文案大师',
    messageCount: 18,
    lastActive: '2026-07-07 13:15',
    createdAt: '2026-07-07 10:00',
  },
  {
    id: '3',
    userId: 'u3',
    userName: '王五',
    userEmail: 'wangwu@example.com',
    title: '销售数据分析',
    agentId: 'a4',
    agentName: '数据分析师',
    messageCount: 32,
    lastActive: '2026-07-07 11:45',
    createdAt: '2026-07-06 14:00',
  },
  {
    id: '4',
    userId: 'u1',
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    title: 'React 组件设计模式',
    agentId: 'a2',
    agentName: '代码专家',
    messageCount: 15,
    lastActive: '2026-07-07 10:20',
    createdAt: '2026-07-07 08:30',
  },
  {
    id: '5',
    userId: 'u4',
    userName: '赵六',
    userEmail: 'zhaoliu@example.com',
    title: '日常问答',
    agentId: 'a1',
    agentName: '通用助手',
    messageCount: 8,
    lastActive: '2026-07-07 09:00',
    createdAt: '2026-07-07 07:00',
  },
  {
    id: '6',
    userId: 'u5',
    userName: '孙七',
    userEmail: 'sunqi@example.com',
    title: 'Logo 设计思路',
    agentId: 'a5',
    agentName: '创意设计师',
    messageCount: 12,
    lastActive: '2026-07-06 18:30',
    createdAt: '2026-07-06 16:00',
  },
  {
    id: '7',
    userId: 'u2',
    userName: '李四',
    userEmail: 'lisi@example.com',
    title: '英文邮件翻译',
    agentId: 'a6',
    agentName: '翻译专家',
    messageCount: 6,
    lastActive: '2026-07-06 16:00',
    createdAt: '2026-07-06 15:00',
  },
  {
    id: '8',
    userId: 'u6',
    userName: '周八',
    userEmail: 'zhouba@example.com',
    title: '合同条款咨询',
    agentId: 'a8',
    agentName: '法律顾问',
    messageCount: 20,
    lastActive: '2026-07-06 14:00',
    createdAt: '2026-07-06 10:00',
  },
  {
    id: '9',
    userId: 'u7',
    userName: '吴九',
    userEmail: 'wujiu@example.com',
    title: '数据库优化方案',
    agentId: 'a2',
    agentName: '代码专家',
    messageCount: 28,
    lastActive: '2026-07-05 17:30',
    createdAt: '2026-07-05 09:00',
  },
  {
    id: '10',
    userId: 'u8',
    userName: '郑十',
    userEmail: 'zhengshi@example.com',
    title: '市场调研报告',
    agentId: 'a4',
    agentName: '数据分析师',
    messageCount: 35,
    lastActive: '2026-07-05 15:00',
    createdAt: '2026-07-04 11:00',
  },
  {
    id: '11',
    userId: 'u1',
    userName: '张三',
    userEmail: 'zhangsan@example.com',
    title: 'API 接口设计',
    agentId: 'a2',
    agentName: '代码专家',
    messageCount: 42,
    lastActive: '2026-07-04 10:00',
    createdAt: '2026-07-03 14:00',
  },
  {
    id: '12',
    userId: 'u3',
    userName: '王五',
    userEmail: 'wangwu@example.com',
    title: '年度总结报告',
    agentId: 'a3',
    agentName: '文案大师',
    messageCount: 16,
    lastActive: '2026-07-03 09:30',
    createdAt: '2026-07-02 08:00',
  },
])

const conversationMessages = ref<ConversationMessage[]>([
  { role: 'user', content: '你好，请帮我优化一下这段 Python 代码的性能。', time: '14:00' },
  { role: 'assistant', content: '你好！很高兴能帮助你优化代码。请把代码发给我，我会分析并给出优化建议。', time: '14:01' },
  { role: 'user', content: 'def process_data(items):\n    result = []\n    for item in items:\n        if item.status == "active":\n            result.append(item)\n    return result', time: '14:02' },
  { role: 'assistant', content: '我看到了这段代码。主要优化建议：\n\n1. **使用列表推导式**：可以提升性能和可读性\n2. **考虑使用生成器**：如果数据量大，可以节省内存\n\n优化后的代码：\n```python\ndef process_data(items):\n    return [item for item in items if item.status == "active"]\n```\n\n如果需要处理大量数据，可以使用生成器：\n```python\ndef process_data(items):\n    return (item for item in items if item.status == "active")\n```\n\n还有其他需要优化的吗？', time: '14:03' },
  { role: 'user', content: '谢谢！还有一个关于数据库查询的问题...', time: '14:05' },
  { role: 'assistant', content: '当然，请说。我会帮你分析数据库查询的性能问题。', time: '14:05' },
])

const stats = computed(() => ({
  totalConversations: records.value.length,
  todayConversations: records.value.filter(r => r.lastActive.startsWith('2026-07-07')).length,
  totalMessages: records.value.reduce((sum, r) => sum + r.messageCount, 0),
  activeUsers: new Set(records.value.map(r => r.userId)).size,
}))

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / 10) || 1)

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

  if (timeRangeFilter.value === 'today') {
    result = result.filter(r => r.lastActive.startsWith('2026-07-07'))
  } else if (timeRangeFilter.value === '7days') {
    result = result.filter(r => {
      const d = new Date(r.lastActive).getTime()
      const now = new Date('2026-07-07').getTime()
      return (now - d) <= 7 * 24 * 60 * 60 * 1000
    })
  } else if (timeRangeFilter.value === '30days') {
    result = result.filter(r => {
      const d = new Date(r.lastActive).getTime()
      const now = new Date('2026-07-07').getTime()
      return (now - d) <= 30 * 24 * 60 * 60 * 1000
    })
  } else if (timeRangeFilter.value === '90days') {
    result = result.filter(r => {
      const d = new Date(r.lastActive).getTime()
      const now = new Date('2026-07-07').getTime()
      return (now - d) <= 90 * 24 * 60 * 60 * 1000
    })
  }

  result.sort((a, b) => new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime())

  return result
})

function resetFilters() {
  searchKeyword.value = ''
  agentFilter.value = 'all'
  timeRangeFilter.value = 'all'
  currentPage.value = 1
}

function viewConversation(record: ChatRecord) {
  viewingRecord.value = record
  showDetailDialog.value = true
}

function exportConversation(record: ChatRecord) {
  console.log('导出对话:', record.id)
}

function deleteConversation(record: ChatRecord) {
  const index = records.value.findIndex(r => r.id === record.id)
  if (index > -1) {
    records.value.splice(index, 1)
  }
}
</script>