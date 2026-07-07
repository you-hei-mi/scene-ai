<template>
  <div style="background: var(--bg-deep); min-height: 100vh">
    <!-- 页面标题和时间范围选择 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-gradient text-2xl font-bold">数据分析</h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary)">系统运营数据分析和趋势报表</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="range in timeRanges"
          :key="range.id"
          :class="activeRange === range.id ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          style="font-size: 0.875rem; padding: 0.25rem 0.75rem"
          @click="activeRange = range.id"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <!-- 总对话数 -->
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">总对话数</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ formatNumber(stats.totalChats) }}</p>
            <p class="text-xs mt-1 flex items-center gap-1" :style="{ color: stats.totalChatsChange >= 0 ? '#22c55e' : '#ef4444' }">
              <UIcon :name="stats.totalChatsChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.totalChatsChange >= 0 ? '+' : '' }}{{ stats.totalChatsChange }}% 环比
            </p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(59, 130, 246, 0.12)">
            <UIcon name="lucide:message-square" class="w-6 h-6" style="color: #3b82f6" />
          </div>
        </div>
      </div>

      <!-- 活跃用户 -->
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">活跃用户</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ formatNumber(stats.activeUsers) }}</p>
            <p class="text-xs mt-1 flex items-center gap-1" :style="{ color: stats.activeUsersChange >= 0 ? '#22c55e' : '#ef4444' }">
              <UIcon :name="stats.activeUsersChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.activeUsersChange >= 0 ? '+' : '' }}{{ stats.activeUsersChange }}% 环比
            </p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(34, 197, 94, 0.12)">
            <UIcon name="lucide:users" class="w-6 h-6" style="color: #22c55e" />
          </div>
        </div>
      </div>

      <!-- Token 消耗 -->
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">Token 消耗</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ formatNumber(stats.tokenUsage) }}</p>
            <p class="text-xs mt-1 flex items-center gap-1" :style="{ color: stats.tokenUsageChange >= 0 ? '#22c55e' : '#ef4444' }">
              <UIcon :name="stats.tokenUsageChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.tokenUsageChange >= 0 ? '+' : '' }}{{ stats.tokenUsageChange }}% 环比
            </p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(168, 85, 247, 0.12)">
            <UIcon name="lucide:coins" class="w-6 h-6" style="color: #a855f7" />
          </div>
        </div>
      </div>

      <!-- 平均响应时间 -->
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">平均响应时间</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ stats.avgResponseTime }}<span class="text-sm font-normal ml-1" style="color: var(--text-secondary)">ms</span></p>
            <p class="text-xs mt-1 flex items-center gap-1" :style="{ color: stats.avgResponseTimeChange <= 0 ? '#22c55e' : '#ef4444' }">
              <UIcon :name="stats.avgResponseTimeChange <= 0 ? 'lucide:trending-down' : 'lucide:trending-up'" class="w-3 h-3" />
              {{ stats.avgResponseTimeChange >= 0 ? '+' : '' }}{{ stats.avgResponseTimeChange }}% 环比
            </p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(249, 115, 22, 0.12)">
            <UIcon name="lucide:timer" class="w-6 h-6" style="color: #f97316" />
          </div>
        </div>
      </div>
    </div>

    <!-- 对话趋势图表 -->
    <div class="glass-card p-4 mb-6">
      <div class="mb-4 flex items-center justify-between">
        <h3 class="font-semibold" style="color: var(--text-primary)">对话趋势</h3>
        <UBadge variant="secondary" size="sm">{{ activeRangeLabel }}</UBadge>
      </div>
      <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
        <div
          v-for="(item, index) in chatTrendData"
          :key="index"
          class="flex-1 flex flex-col items-center gap-2 group"
        >
          <div class="relative w-full flex flex-col items-center justify-end h-full">
            <span class="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity" style="color: var(--text-secondary)">
              {{ formatNumber(item.value) }}
            </span>
            <div
              class="w-full rounded-t transition-all"
              style="background: var(--accent-soft-bg)"
              :style="{ height: (item.value / maxChatTrendValue) * 100 + '%' }"
            ></div>
          </div>
          <span class="text-xs" style="color: var(--text-secondary)">{{ item.label }}</span>
        </div>
      </div>
    </div>

    <!-- 模型使用分布和用户活跃度 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 模型使用分布 -->
      <div class="glass-card p-4">
        <div class="mb-4">
          <h3 class="font-semibold" style="color: var(--text-primary)">模型使用分布</h3>
        </div>
        <div class="space-y-4">
          <div v-for="model in modelUsage" :key="model.name">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2">
                <UIcon name="lucide:brain" class="w-4 h-4" style="color: var(--text-secondary)" />
                <span class="text-sm font-medium" style="color: var(--text-primary)">{{ model.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm" style="color: var(--text-secondary)">{{ formatNumber(model.calls) }} 次</span>
                <span class="text-sm font-medium" style="color: var(--text-primary)">{{ model.percentage }}%</span>
              </div>
            </div>
            <div class="h-2 rounded-full overflow-hidden" style="background: var(--glass-bg-1)">
              <div
                class="h-full rounded-full transition-all"
                :style="{
                  width: model.percentage + '%',
                  background: { 'bg-blue-500': '#3b82f6', 'bg-orange-500': '#f97316', 'bg-purple-500': '#a855f7', 'bg-green-500': '#22c55e', 'bg-cyan-500': '#06b6d4' }[model.color]
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户活跃度分布 -->
      <div class="glass-card p-4">
        <div class="mb-4">
          <h3 class="font-semibold" style="color: var(--text-primary)">用户活跃度分布</h3>
        </div>
        <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
          <div
            v-for="(item, index) in userActivityData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2 group"
          >
            <div class="relative w-full flex flex-col items-center justify-end h-full">
              <span class="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity" style="color: var(--text-secondary)">
                {{ formatNumber(item.value) }}
              </span>
              <div
                class="w-full rounded-t transition-all"
                style="background: rgba(34, 197, 94, 0.2)"
                :style="{ height: (item.value / maxUserActivityValue) * 100 + '%' }"
              ></div>
            </div>
            <span class="text-xs" style="color: var(--text-secondary)">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门 Agent 排行 -->
    <div class="glass-card" style="padding: 0">
      <div class="mb-4 flex items-center justify-between" style="padding: 1rem 1rem 0 1rem">
        <h3 class="font-semibold" style="color: var(--text-primary)">热门 Agent 排行</h3>
        <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.75rem">
          查看全部
        </button>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border)">
              <th class="text-left px-4 py-3 text-sm font-medium w-16" style="color: var(--text-secondary)">排名</th>
              <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">Agent 名称</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-32" style="color: var(--text-secondary)">使用次数</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-28" style="color: var(--text-secondary)">满意度</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-32" style="color: var(--text-secondary)">活跃趋势</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(agent, index) in topAgents"
              :key="agent.id"
              style="border-bottom: 1px solid var(--glass-border)"
              :style="index === topAgents.length - 1 ? { borderBottom: 'none' } : {}"
            >
              <td class="px-4 py-3">
                <div
                  class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  :style="{
                    background: index === 0 ? 'rgba(234, 179, 8, 0.12)' : index === 1 ? 'rgba(107, 114, 128, 0.12)' : index === 2 ? 'rgba(249, 115, 22, 0.12)' : 'var(--glass-bg-1)',
                    color: index === 0 ? '#ca8a04' : index === 1 ? '#6b7280' : index === 2 ? '#ea580c' : 'var(--text-secondary)'
                  }"
                >
                  {{ index + 1 }}
                </div>
              </td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style="background: var(--accent-soft-bg)">
                    <UIcon name="lucide:bot" class="w-5 h-5" style="color: var(--accent-soft-text)" />
                  </div>
                  <div>
                    <div class="font-medium text-sm" style="color: var(--text-primary)">{{ agent.name }}</div>
                    <div class="text-xs" style="color: var(--text-secondary)">{{ agent.category }}</div>
                  </div>
                </div>
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-primary)">{{ formatNumber(agent.usageCount) }}</td>
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium" style="color: var(--text-primary)">{{ agent.satisfaction }}%</span>
                  <UIcon name="lucide:star" class="w-3.5 h-3.5" style="color: #eab308" />
                </div>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center gap-1 text-sm"
                  :style="{ color: agent.trend >= 0 ? '#22c55e' : '#ef4444' }"
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
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 时间范围类型
 */
type TimeRange = 'today' | '7days' | '30days' | '90days'

/**
 * 当前激活的时间范围
 */
const activeRange = ref<TimeRange>('7days')

/**
 * 时间范围选项
 */
const timeRanges = [
  { id: 'today' as const, label: '今天' },
  { id: '7days' as const, label: '7天' },
  { id: '30days' as const, label: '30天' },
  { id: '90days' as const, label: '90天' },
]

/**
 * 当前激活的时间范围标签
 */
const activeRangeLabel = computed(() => {
  return timeRanges.find(r => r.id === activeRange.value)?.label || ''
})

/**
 * 统计数据（根据时间范围变化）
 */
const stats = computed(() => {
  const dataMap: Record<TimeRange, {
    totalChats: number
    totalChatsChange: number
    activeUsers: number
    activeUsersChange: number
    tokenUsage: number
    tokenUsageChange: number
    avgResponseTime: number
    avgResponseTimeChange: number
  }> = {
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
  return dataMap[activeRange.value]
})

/**
 * 对话趋势数据（根据时间范围变化）
 */
const chatTrendData = computed(() => {
  const dataMap: Record<TimeRange, Array<{ label: string, value: number }>> = {
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
  return dataMap[activeRange.value]
})

/**
 * 用户活跃度分布数据（按时间段）
 */
const userActivityData = ref([
  { label: '00-04', value: 320 },
  { label: '04-08', value: 580 },
  { label: '08-12', value: 2850 },
  { label: '12-16', value: 3520 },
  { label: '16-20', value: 4280 },
  { label: '20-24', value: 2680 },
])

/**
 * 对话趋势最大值
 */
const maxChatTrendValue = computed(() => Math.max(...chatTrendData.value.map(d => d.value)))

/**
 * 用户活跃度最大值
 */
const maxUserActivityValue = computed(() => Math.max(...userActivityData.value.map(d => d.value)))

/**
 * 模型使用分布数据
 */
const modelUsage = ref([
  { name: 'GPT-4o', calls: 85620, percentage: 35, color: 'bg-blue-500' },
  { name: 'Claude 3.5 Sonnet', calls: 62480, percentage: 26, color: 'bg-orange-500' },
  { name: 'DeepSeek V3', calls: 45320, percentage: 18, color: 'bg-purple-500' },
  { name: 'Gemini 1.5 Pro', calls: 32150, percentage: 13, color: 'bg-green-500' },
  { name: '通义千问 Plus', calls: 18260, percentage: 8, color: 'bg-cyan-500' },
])

/**
 * 热门 Agent 排行数据
 */
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

/**
 * 格式化数字显示
 * @param num - 数值
 * @returns 格式化后的字符串
 */
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

/**
 * 获取排名对应的背景样式
 * @param index - 排名索引（0 起）
 * @returns Tailwind CSS 类名
 */
function getRankBg(index: number): string {
  const bgMap: Record<number, string> = {
    0: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    1: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    2: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  }
  return { background: 'var(--glass-bg-1)', color: 'var(--text-secondary)' }
}
</script>
