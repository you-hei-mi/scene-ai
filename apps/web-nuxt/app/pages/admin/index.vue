<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">仪表盘</h1>
      <p class="text-muted-foreground text-sm mt-1">系统运营数据概览</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">总用户数</p>
            <p class="text-2xl font-bold mt-1">{{ stats.totalUsers }}</p>
            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +12.5% 较上周
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon name="lucide:users" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">今日对话</p>
            <p class="text-2xl font-bold mt-1">{{ stats.todayChats }}</p>
            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +8.3% 较昨日
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <UIcon name="lucide:message-square" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">智能体数量</p>
            <p class="text-2xl font-bold mt-1">{{ stats.totalAgents }}</p>
            <p class="text-xs text-green-600 mt-1 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +5.2% 较上周
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <UIcon name="lucide:bot" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </UCard>

      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">知识库文档</p>
            <p class="text-2xl font-bold mt-1">{{ stats.totalDocuments }}</p>
            <p class="text-xs text-yellow-600 mt-1 flex items-center gap-1">
              <UIcon name="lucide:trending-down" class="w-3 h-3" />
              -2.1% 较上周
            </p>
          </div>
          <div class="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
            <UIcon name="lucide:database" class="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 图表区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- 对话趋势 -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">对话趋势</h3>
        </template>
        <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
          <div
            v-for="(item, index) in chatTrendData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <div
              class="w-full bg-primary/20 rounded-t transition-all hover:bg-primary/30"
              :style="{ height: (item.value / maxChatValue) * 100 + '%' }"
            ></div>
            <span class="text-xs text-muted-foreground">{{ item.label }}</span>
          </div>
        </div>
      </UCard>

      <!-- 用户增长 -->
      <UCard>
        <template #header>
          <h3 class="font-semibold">用户增长</h3>
        </template>
        <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
          <div
            v-for="(item, index) in userGrowthData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2"
          >
            <div
              class="w-full bg-green-500/20 rounded-t transition-all hover:bg-green-500/30"
              :style="{ height: (item.value / maxUserValue) * 100 + '%' }"
            ></div>
            <span class="text-xs text-muted-foreground">{{ item.label }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 最近活动和系统状态 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 最近活动 -->
      <div class="lg:col-span-2">
        <UCard>
          <template #header>
            <h3 class="font-semibold">最近活动</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/30"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                :class="getActivityIconBg(activity.type)"
              >
                <UIcon :name="getActivityIcon(activity.type)" class="w-4 h-4 text-white" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium">{{ activity.title }}</p>
                <p class="text-xs text-muted-foreground mt-0.5">{{ activity.description }}</p>
              </div>
              <span class="text-xs text-muted-foreground flex-shrink-0">{{ activity.time }}</span>
            </div>
          </div>
        </UCard>
      </div>

      <!-- 系统状态 -->
      <div>
        <UCard>
          <template #header>
            <h3 class="font-semibold">系统状态</h3>
          </template>
          <div class="space-y-4">
            <div
              v-for="service in systemStatus"
              :key="service.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-2">
                <span
                  class="w-2 h-2 rounded-full"
                  :class="service.status === 'online' ? 'bg-green-500' : 'bg-red-500'"
                ></span>
                <span class="text-sm">{{ service.name }}</span>
              </div>
              <span class="text-xs text-muted-foreground">{{ service.latency }}</span>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-border">
            <h4 class="font-medium text-sm mb-3">资源使用</h4>
            <div class="space-y-3">
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-muted-foreground">CPU</span>
                  <span>{{ resourceUsage.cpu }}%</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-primary rounded-full transition-all"
                    :style="{ width: resourceUsage.cpu + '%' }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-muted-foreground">内存</span>
                  <span>{{ resourceUsage.memory }}%</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-green-500 rounded-full transition-all"
                    :style="{ width: resourceUsage.memory + '%' }"
                  ></div>
                </div>
              </div>
              <div>
                <div class="flex justify-between text-sm mb-1">
                  <span class="text-muted-foreground">存储</span>
                  <span>{{ resourceUsage.disk }}%</span>
                </div>
                <div class="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    class="h-full bg-orange-500 rounded-full transition-all"
                    :style="{ width: resourceUsage.disk + '%' }"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </UCard>
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
 * 仪表盘统计数据
 */
const stats = ref({
  totalUsers: 12580,
  todayChats: 3842,
  totalAgents: 256,
  totalDocuments: 5680,
})

/**
 * 对话趋势数据（近7天）
 */
const chatTrendData = ref([
  { label: '周一', value: 2400 },
  { label: '周二', value: 2800 },
  { label: '周三', value: 3200 },
  { label: '周四', value: 2900 },
  { label: '周五', value: 3500 },
  { label: '周六', value: 2100 },
  { label: '周日', value: 1800 },
])

/**
 * 用户增长数据（近6个月）
 */
const userGrowthData = ref([
  { label: '1月', value: 8000 },
  { label: '2月', value: 9200 },
  { label: '3月', value: 10500 },
  { label: '4月', value: 11200 },
  { label: '5月', value: 12000 },
  { label: '6月', value: 12580 },
])

/**
 * 计算对话趋势最大值，用于图表高度比例计算
 */
const maxChatValue = computed(() => Math.max(...chatTrendData.value.map(d => d.value)))

/**
 * 计算用户增长最大值，用于图表高度比例计算
 */
const maxUserValue = computed(() => Math.max(...userGrowthData.value.map(d => d.value)))

/**
 * 最近活动列表
 */
const recentActivities = ref([
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
])

/**
 * 系统服务状态
 */
const systemStatus = ref([
  { name: 'API 服务', status: 'online', latency: '23ms' },
  { name: '数据库', status: 'online', latency: '12ms' },
  { name: 'Redis', status: 'online', latency: '3ms' },
  { name: '向量引擎', status: 'online', latency: '45ms' },
  { name: '邮件服务', status: 'online', latency: '89ms' },
])

/**
 * 资源使用情况
 */
const resourceUsage = ref({
  cpu: 45,
  memory: 62,
  disk: 78,
})

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
