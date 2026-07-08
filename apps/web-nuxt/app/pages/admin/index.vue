<template>
  <div class="min-h-screen">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <span class="text-sm text-slate-500">加载仪表盘数据...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-if="error && !loading" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div class="flex items-center gap-3">
        <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
        <div>
          <p class="text-sm font-medium text-red-700 dark:text-red-400">数据加载失败</p>
          <p class="text-xs text-red-600 dark:text-red-500 mt-1">{{ error }}，已显示默认数据</p>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">仪表盘</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">系统运营数据概览</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总用户数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalUsers.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +12.5% 较上周
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:users" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日对话</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.todayChats.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +8.3% 较昨日
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:message-square" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">智能体数量</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalAgents }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +5.2% 较上周
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:bot" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">知识库文档</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalDocuments.toLocaleString() }}</p>
            <p class="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-down" class="w-3 h-3" />
              -2.1% 较上周
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:database" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white">对话趋势</h3>
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-primary"></span>
            <span class="text-xs text-slate-500">近7天</span>
          </div>
        </div>
        <div class="h-64 flex items-end justify-between gap-3 px-2">
          <div
            v-for="(item, index) in chatTrendData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-3"
          >
            <div
              class="w-full rounded-t-xl bg-gradient-to-t from-primary to-primary-light transition-all duration-500 hover:from-primary-dark hover:to-primary"
              :style="{ height: (item.value / maxChatValue) * 200 + 'px' }"
            ></div>
            <span class="text-xs text-slate-500">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between mb-6">
          <h3 class="font-semibold text-slate-900 dark:text-white">用户增长</h3>
          <div class="flex gap-2">
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
            <span class="text-xs text-slate-500">近6月</span>
          </div>
        </div>
        <div class="h-64 flex items-end justify-between gap-3 px-2">
          <div
            v-for="(item, index) in userGrowthData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-3"
          >
            <div
              class="w-full rounded-t-xl bg-gradient-to-t from-green-500 to-green-400 transition-all duration-500 hover:from-green-600 hover:to-green-500"
              :style="{ height: (item.value / maxUserValue) * 200 + 'px' }"
            ></div>
            <span class="text-xs text-slate-500">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-6">最近活动</h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 hover:border-primary/30 transition-colors"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  getActivityIconBg(activity.type)
                ]"
              >
                <UIcon :name="getActivityIcon(activity.type)" class="w-5 h-5 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-slate-900 dark:text-white">{{ activity.title }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ activity.description }}</p>
              </div>
              <span class="text-xs text-slate-400 flex-shrink-0">{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-6">系统状态</h3>
          <div class="space-y-4">
            <div
              v-for="service in systemStatus"
              :key="service.name"
              class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'w-2 h-2 rounded-full',
                    service.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                  ]"
                ></span>
                <span class="text-sm text-slate-900 dark:text-white">{{ service.name }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ service.latency }}</span>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-semibold text-sm text-slate-900 dark:text-white mb-4">资源使用</h4>
            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-500">CPU</span>
                  <span class="font-medium text-slate-900 dark:text-white">{{ resourceUsage.cpu }}%</span>
                </div>
                <div class="h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                    :style="{ width: resourceUsage.cpu + '%' }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-500">内存</span>
                  <span class="font-medium text-slate-900 dark:text-white">{{ resourceUsage.memory }}%</span>
                </div>
                <div class="h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-500"
                    :style="{ width: resourceUsage.memory + '%' }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-2">
                  <span class="text-slate-500">存储</span>
                  <span class="font-medium text-slate-900 dark:text-white">{{ resourceUsage.disk }}%</span>
                </div>
                <div class="h-2.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div
                    class="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500"
                    :style="{ width: resourceUsage.disk + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

// ====== 加载与错误状态 ======
const loading = ref(true)
const error = ref<string | null>(null)

// ====== 默认 Mock 数据（API 失败时的回退值） ======
const defaultStats = {
  totalUsers: 12580,
  todayChats: 3842,
  totalAgents: 256,
  totalDocuments: 5680,
}

const defaultChatTrendData = [
  { label: '周一', value: 2400 },
  { label: '周二', value: 2800 },
  { label: '周三', value: 3200 },
  { label: '周四', value: 2900 },
  { label: '周五', value: 3500 },
  { label: '周六', value: 2100 },
  { label: '周日', value: 1800 },
]

const defaultUserGrowthData = [
  { label: '1月', value: 8000 },
  { label: '2月', value: 9200 },
  { label: '3月', value: 10500 },
  { label: '4月', value: 11200 },
  { label: '5月', value: 12000 },
  { label: '6月', value: 12580 },
]

const defaultRecentActivities = [
  {
    id: '1',
    type: 'user',
    title: '新用户注册',
    description: 'user_001@example.com 完成注册',
    time: '5 分钟前',
  },
  {
    id: '2',
    type: 'agent',
    title: '智能体发布',
    description: '用户张三发布了新智能体「代码助手」',
    time: '15 分钟前',
  },
  {
    id: '3',
    type: 'dataset',
    title: '知识库创建',
    description: '团队「产品部」创建了新知识库',
    time: '1 小时前',
  },
  {
    id: '4',
    type: 'system',
    title: '系统更新',
    description: '系统已更新至 v26.1.1 版本',
    time: '3 小时前',
  },
  {
    id: '5',
    type: 'user',
    title: '会员升级',
    description: '用户李四升级为专业版会员',
    time: '5 小时前',
  },
]

const defaultSystemStatus = [
  { name: 'API 服务', status: 'online', latency: '23ms' },
  { name: '数据库', status: 'online', latency: '12ms' },
  { name: 'Redis', status: 'online', latency: '3ms' },
  { name: '向量引擎', status: 'online', latency: '45ms' },
  { name: '邮件服务', status: 'online', latency: '89ms' },
]

const defaultResourceUsage = {
  cpu: 45,
  memory: 62,
  disk: 78,
}

// ====== 响应式数据（初始化为默认值） ======
const stats = ref({ ...defaultStats })
const chatTrendData = ref([...defaultChatTrendData])
const userGrowthData = ref([...defaultUserGrowthData])
const recentActivities = ref([...defaultRecentActivities])
const systemStatus = ref([...defaultSystemStatus])
const resourceUsage = ref({ ...defaultResourceUsage })

// ====== 计算属性 ======
const maxChatValue = computed(() => Math.max(...chatTrendData.value.map(d => d.value)))
const maxUserValue = computed(() => Math.max(...userGrowthData.value.map(d => d.value)))

// ====== 数据获取 ======
onMounted(async () => {
  try {
    const data = await getDashboardData()
    if (data) {
      // 映射统计数据
      if (data.stats) {
        stats.value = {
          totalUsers: data.stats.totalUsers ?? defaultStats.totalUsers,
          todayChats: data.stats.todayChats ?? defaultStats.todayChats,
          totalAgents: data.stats.totalAgents ?? defaultStats.totalAgents,
          totalDocuments: data.stats.totalDocuments ?? defaultStats.totalDocuments,
        }
      }

      // 映射对话趋势数据
      if (data.chatTrendData && Array.isArray(data.chatTrendData) && data.chatTrendData.length > 0) {
        chatTrendData.value = data.chatTrendData.map((item: any) => ({
          label: item.label ?? '',
          value: item.value ?? 0,
        }))
      }

      // 映射用户增长数据
      if (data.userGrowthData && Array.isArray(data.userGrowthData) && data.userGrowthData.length > 0) {
        userGrowthData.value = data.userGrowthData.map((item: any) => ({
          label: item.label ?? '',
          value: item.value ?? 0,
        }))
      }

      // 映射最近活动
      if (data.recentActivities && Array.isArray(data.recentActivities) && data.recentActivities.length > 0) {
        recentActivities.value = data.recentActivities.map((item: any) => ({
          id: item.id ?? '',
          type: item.type ?? '',
          title: item.title ?? '',
          description: item.description ?? '',
          time: item.time ?? '',
        }))
      }

      // 映射系统状态
      if (data.systemStatus && Array.isArray(data.systemStatus) && data.systemStatus.length > 0) {
        systemStatus.value = data.systemStatus.map((item: any) => ({
          name: item.name ?? '',
          status: item.status ?? 'online',
          latency: item.latency ?? '',
        }))
      }

      // 映射资源使用
      if (data.resourceUsage) {
        resourceUsage.value = {
          cpu: data.resourceUsage.cpu ?? defaultResourceUsage.cpu,
          memory: data.resourceUsage.memory ?? defaultResourceUsage.memory,
          disk: data.resourceUsage.disk ?? defaultResourceUsage.disk,
        }
      }
    }
  } catch (err: any) {
    error.value = err.message || '获取仪表盘数据失败，已显示默认数据'
  } finally {
    loading.value = false
  }
})

// ====== 工具函数 ======
/**
 * 获取活动类型对应的图标
 * @param type - 活动类型
 * @returns 图标名称
 */
function getActivityIcon(type: string): string {
  const iconMap: Record<string, string> = {
    user: 'lucide:user-plus',
    agent: 'lucide:bot',
    dataset: 'lucide:database',
    system: 'lucide:settings',
  }
  return iconMap[type] || 'lucide:bell'
}

/**
 * 获取活动类型对应的图标背景色
 * @param type - 活动类型
 * @returns Tailwind CSS 类名
 */
function getActivityIconBg(type: string): string {
  const bgMap: Record<string, string> = {
    user: 'bg-blue-500',
    agent: 'bg-purple-500',
    dataset: 'bg-green-500',
    system: 'bg-orange-500',
  }
  return bgMap[type] || 'bg-gray-500'
}
</script>