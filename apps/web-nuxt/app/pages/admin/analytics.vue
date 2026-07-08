<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">数据分析</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">系统运营数据分析和趋势报表</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="range in timeRanges"
          :key="range.id"
          :class="activeRange === range.id ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          class="text-sm px-3 py-1.5"
          @click="activeRange = range.id"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p class="text-sm text-slate-500">正在加载分析数据...</p>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-triangle" class="w-5 h-5 text-red-500 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">数据加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}，已使用本地缓存数据。</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchAnalyticsData">重试</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总对话数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ formatNumber(stats.totalChats) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.totalChatsChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.totalChatsChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.totalChatsChange >= 0 ? '+' : '' }}{{ stats.totalChatsChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:message-square" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">活跃用户</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ formatNumber(stats.activeUsers) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.activeUsersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.activeUsersChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.activeUsersChange >= 0 ? '+' : '' }}{{ stats.activeUsersChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:users" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">Token 消耗</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ formatNumber(stats.tokenUsage) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.tokenUsageChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.tokenUsageChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.tokenUsageChange >= 0 ? '+' : '' }}{{ stats.tokenUsageChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:coins" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">平均响应时间</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.avgResponseTime }}<span class="text-sm font-normal ml-1 text-slate-500">ms</span></p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.avgResponseTimeChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.avgResponseTimeChange <= 0 ? 'lucide:trending-down' : 'lucide:trending-up'" class="w-3 h-3" />
              {{ stats.avgResponseTimeChange >= 0 ? '+' : '' }}{{ stats.avgResponseTimeChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:timer" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 mb-8">
      <div class="mb-6 flex items-center justify-between">
        <h3 class="font-semibold text-lg text-slate-900 dark:text-white">对话趋势</h3>
        <UBadge variant="secondary" size="sm">{{ activeRangeLabel }}</UBadge>
      </div>
      <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
        <div
          v-for="(item, index) in chatTrendData"
          :key="index"
          class="flex-1 flex flex-col items-center gap-2 group"
        >
          <div class="relative w-full flex flex-col items-center justify-end h-full">
            <span class="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
              {{ formatNumber(item.value) }}
            </span>
            <div
              class="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
              style="background: linear-gradient(to top, #6366f1, #8b5cf6)"
              :style="{ height: (item.value / maxChatTrendValue) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-xs text-slate-500">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div class="mb-6">
          <h3 class="font-semibold text-lg text-slate-900 dark:text-white">模型使用分布</h3>
        </div>
        <div class="space-y-4">
          <div v-for="model in modelUsage" :key="model.name">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2">
                <UIcon name="lucide:brain" class="w-4 h-4 text-slate-400" />
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ model.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-500">{{ formatNumber(model.calls) }} 次</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ model.percentage }}%</span>
              </div>
            </div>
            <div class="h-2.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{
                  width: model.percentage + '%',
                  background: { 'bg-blue-500': 'linear-gradient(90deg, #3b82f6, #60a5fa)', 'bg-orange-500': 'linear-gradient(90deg, #f97316, #fb923c)', 'bg-purple-500': 'linear-gradient(90deg, #a855f7, #d8b4fe)', 'bg-green-500': 'linear-gradient(90deg, #22c55e, #4ade80)', 'bg-cyan-500': 'linear-gradient(90deg, #06b6d4, #22d3ee)' }[model.color]
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div class="mb-6">
          <h3 class="font-semibold text-lg text-slate-900 dark:text-white">用户活跃度分布</h3>
        </div>
        <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
          <div
            v-for="(item, index) in userActivityData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2 group"
          >
            <div class="relative w-full flex flex-col items-center justify-end h-full">
              <span class="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                {{ formatNumber(item.value) }}
              </span>
              <div
                class="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style="background: linear-gradient(to top, #22c55e, #4ade80)"
                :style="{ height: (item.value / maxUserActivityValue) * 100 + '%' }"
              ></div>
            </div>
            <span class="text-xs text-slate-500">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="mb-4 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <h3 class="font-semibold text-lg text-slate-900 dark:text-white">热门 Agent 排行</h3>
        <button class="btn-glass text-sm px-4 py-2">
          查看全部
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-16">排名</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">Agent 名称</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">使用次数</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-28">满意度</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-32">活跃趋势</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(agent, index) in topAgents"
              :key="agent.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  :class="index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' : index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'"
                >
                  {{ index + 1 }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-primary/20 to-accent/20">
                    <UIcon name="lucide:bot" class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div class="font-medium text-sm text-slate-900 dark:text-white">{{ agent.name }}</div>
                    <div class="text-xs text-slate-500">{{ agent.category }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">{{ formatNumber(agent.usageCount) }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-slate-900 dark:text-white">{{ agent.satisfaction }}%</span>
                  <UIcon name="lucide:star" class="w-3.5 h-3.5 text-yellow-500" />
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1 text-sm"
                  :class="agent.trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  <UIcon :name="agent.trend >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3.5 h-3.5" />
                  {{ agent.trend >= 0 ? '+' : '' }}{{ agent.trend }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getDashboardData } from '~/composables/api/core'

definePageMeta({
  layout: 'console',
})

type TimeRange = 'today' | '7days' | '30days' | '90days'

const loading = ref(false)
const error = ref<string | null>(null)

const activeRange = ref<TimeRange>('7days')

const timeRanges = [
  { id: 'today' as const, label: '今天' },
  { id: '7days' as const, label: '7天' },
  { id: '30days' as const, label: '30天' },
  { id: '90days' as const, label: '90天' },
]

const activeRangeLabel = computed(() => {
  return timeRanges.find(r => r.id === activeRange.value)?.label || ''
})

interface StatsEntry {
  totalChats: number
  totalChatsChange: number
  activeUsers: number
  activeUsersChange: number
  tokenUsage: number
  tokenUsageChange: number
  avgResponseTime: number
  avgResponseTimeChange: number
}

const defaultStatsMap: Record<TimeRange, StatsEntry> = {
  today: {
    totalChats: 3842,
    totalChatsChange: 8.3,
    activeUsers: 1256,
    activeUsersChange: 5.2,
    tokenUsage: 45800000,
    tokenUsageChange: 12.5,
    avgResponseTime: 1280,
    avgResponseTimeChange: -3.5,
  },
  '7days': {
    totalChats: 24560,
    totalChatsChange: 12.5,
    activeUsers: 5680,
    activeUsersChange: 8.6,
    tokenUsage: 325000000,
    tokenUsageChange: 15.2,
    avgResponseTime: 1320,
    avgResponseTimeChange: -5.8,
  },
  '30days': {
    totalChats: 102480,
    totalChatsChange: 18.6,
    activeUsers: 12580,
    activeUsersChange: 10.3,
    tokenUsage: 1348000000,
    tokenUsageChange: 22.4,
    avgResponseTime: 1356,
    avgResponseTimeChange: -8.2,
  },
  '90days': {
    totalChats: 285640,
    totalChatsChange: 25.8,
    activeUsers: 18920,
    activeUsersChange: 15.6,
    tokenUsage: 3856000000,
    tokenUsageChange: 30.2,
    avgResponseTime: 1402,
    avgResponseTimeChange: -12.5,
  },
}

const apiStats = ref<StatsEntry | null>(null)

const stats = computed(() => {
  if (apiStats.value) {
    return apiStats.value
  }
  return defaultStatsMap[activeRange.value]
})

const defaultChatTrendMap: Record<TimeRange, Array<{ label: string, value: number }>> = {
  today: [
    { label: '00:00', value: 120 },
    { label: '04:00', value: 80 },
    { label: '08:00', value: 450 },
    { label: '10:00', value: 680 },
    { label: '12:00', value: 820 },
    { label: '14:00', value: 760 },
    { label: '16:00', value: 590 },
    { label: '18:00', value: 480 },
    { label: '20:00', value: 720 },
    { label: '22:00', value: 380 },
  ],
  '7days': [
    { label: '周一', value: 3200 },
    { label: '周二', value: 3800 },
    { label: '周三', value: 4200 },
    { label: '周四', value: 3900 },
    { label: '周五', value: 4500 },
    { label: '周六', value: 2800 },
    { label: '周日', value: 2160 },
  ],
  '30days': [
    { label: '第1周', value: 18600 },
    { label: '第2周', value: 22400 },
    { label: '第3周', value: 25800 },
    { label: '第4周', value: 35680 },
  ],
  '90days': [
    { label: '第1月', value: 68400 },
    { label: '第2月', value: 85200 },
    { label: '第3月', value: 132040 },
  ],
}

const apiChatTrend = ref<Array<{ label: string, value: number }> | null>(null)

const chatTrendData = computed(() => {
  if (apiChatTrend.value) {
    return apiChatTrend.value
  }
  return defaultChatTrendMap[activeRange.value]
})

const userActivityData = ref([
  { label: '00-04', value: 320 },
  { label: '04-08', value: 580 },
  { label: '08-12', value: 2850 },
  { label: '12-16', value: 3520 },
  { label: '16-20', value: 4280 },
  { label: '20-24', value: 2680 },
])

const maxChatTrendValue = computed(() => Math.max(...chatTrendData.value.map(d => d.value)))

const maxUserActivityValue = computed(() => Math.max(...userActivityData.value.map(d => d.value)))

const modelUsage = ref([
  { name: 'GPT-4o', calls: 85620, percentage: 35, color: 'bg-blue-500' },
  { name: 'Claude 3.5 Sonnet', calls: 62480, percentage: 26, color: 'bg-orange-500' },
  { name: 'DeepSeek V3', calls: 45320, percentage: 18, color: 'bg-purple-500' },
  { name: 'Gemini 1.5 Pro', calls: 32150, percentage: 13, color: 'bg-green-500' },
  { name: '通义千问 Plus', calls: 18260, percentage: 8, color: 'bg-cyan-500' },
])

const topAgents = ref([
  {
    id: '1',
    name: '代码助手',
    category: '编程开发',
    usageCount: 28560,
    satisfaction: 96,
    trend: 18.5,
  },
  {
    id: '2',
    name: '翻译专家',
    category: '翻译',
    usageCount: 21340,
    satisfaction: 94,
    trend: 12.3,
  },
  {
    id: '3',
    name: '文案大师',
    category: '写作',
    usageCount: 18620,
    satisfaction: 92,
    trend: 8.6,
  },
  {
    id: '4',
    name: '数据分析师',
    category: '数据分析',
    usageCount: 15480,
    satisfaction: 91,
    trend: -2.5,
  },
  {
    id: '5',
    name: '客服小助手',
    category: '客服',
    usageCount: 12380,
    satisfaction: 89,
    trend: 5.2,
  },
])

function getDaysParam(range: TimeRange): number {
  const map: Record<TimeRange, number> = {
    today: 1,
    '7days': 7,
    '30days': 30,
    '90days': 90,
  }
  return map[range]
}

async function fetchAnalyticsData() {
  loading.value = true
  error.value = null
  try {
    const days = getDaysParam(activeRange.value)
    const data = await getDashboardData({
      userDays: days,
      tokenDays: days,
      revenueDays: days,
    })

    // 尝试从 API 响应中提取数据
    if (data) {
      if (data.stats) {
        apiStats.value = {
          totalChats: data.stats.totalChats ?? data.totalChats ?? defaultStatsMap[activeRange.value].totalChats,
          totalChatsChange: data.stats.totalChatsChange ?? data.totalChatsChange ?? defaultStatsMap[activeRange.value].totalChatsChange,
          activeUsers: data.stats.activeUsers ?? data.activeUsers ?? defaultStatsMap[activeRange.value].activeUsers,
          activeUsersChange: data.stats.activeUsersChange ?? data.activeUsersChange ?? defaultStatsMap[activeRange.value].activeUsersChange,
          tokenUsage: data.stats.tokenUsage ?? data.tokenUsage ?? defaultStatsMap[activeRange.value].tokenUsage,
          tokenUsageChange: data.stats.tokenUsageChange ?? data.tokenUsageChange ?? defaultStatsMap[activeRange.value].tokenUsageChange,
          avgResponseTime: data.stats.avgResponseTime ?? data.avgResponseTime ?? defaultStatsMap[activeRange.value].avgResponseTime,
          avgResponseTimeChange: data.stats.avgResponseTimeChange ?? data.avgResponseTimeChange ?? defaultStatsMap[activeRange.value].avgResponseTimeChange,
        }
      }

      if (data.chatTrend && Array.isArray(data.chatTrend)) {
        apiChatTrend.value = data.chatTrend
      }

      if (data.modelUsage && Array.isArray(data.modelUsage)) {
        modelUsage.value = data.modelUsage
      }

      if (data.topAgents && Array.isArray(data.topAgents)) {
        topAgents.value = data.topAgents
      }

      if (data.userActivity && Array.isArray(data.userActivity)) {
        userActivityData.value = data.userActivity
      }
    }
  } catch (err: any) {
    const message = err?.message || err?.statusMessage || '网络请求失败'
    error.value = message
    // 降级使用本地 mock 数据
    apiStats.value = null
    apiChatTrend.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchAnalyticsData()
})

function formatNumber(num: number): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(2) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}
</script>