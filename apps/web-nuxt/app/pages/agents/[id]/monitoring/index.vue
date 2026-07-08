<template>
  <div class="min-h-screen">
    <div class="mb-6">
      <button class="btn-glass p-2" @click="handleBack">
        <UIcon name="lucide:arrow-left" class="w-4 h-4" />
      </button>
    </div>

    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">Agent 监控</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">实时监控智能体的运行状态与性能指标</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日调用</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.todayCalls.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +12.5% 较昨日
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:phone-call" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">活跃用户</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.activeUsers.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +8.3% 较昨日
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:users" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">平均延迟</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.avgLatency }}ms</p>
            <p class="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +15ms 较昨日
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:clock" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">错误率</p>
            <p class="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{{ stats.errorRate }}%</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-down" class="w-3 h-3" />
              -0.5% 较昨日
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
            <UIcon name="lucide:alert-triangle" class="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-slate-900 dark:text-white">调用量趋势</h3>
            <div class="flex gap-2">
              <span class="w-3 h-3 rounded-full bg-primary"></span>
              <span class="text-xs text-slate-500">近24小时</span>
            </div>
          </div>
          <div class="h-64 flex items-end justify-between gap-2 px-2">
            <div
              v-for="(item, index) in chartData"
              :key="index"
              class="flex-1 flex flex-col items-center gap-2"
            >
              <div
                class="w-full rounded-t-lg bg-gradient-to-t from-primary to-primary-light hover:from-primary-dark hover:to-primary transition-all duration-300"
                :style="{ height: (item.value / maxChartValue) * 200 + 'px' }"
              ></div>
              <span class="text-xs text-slate-400">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 class="font-semibold text-slate-900 dark:text-white mb-4">最近调用</h3>
          <div class="space-y-3">
            <div
              v-for="call in recentCalls"
              :key="call.id"
              class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
            >
              <div
                :class="[
                  'w-2 h-2 rounded-full flex-shrink-0',
                  call.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                ]"
              ></div>
              <div class="flex-1 min-w-0">
                <div class="text-sm text-slate-900 dark:text-white truncate">{{ call.prompt }}</div>
                <div class="text-xs text-slate-500 mt-0.5">{{ call.time }} · {{ call.duration }}ms</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

const route = useRoute()

const agentId = computed(() => route.params.id as string)

const stats = ref({
  todayCalls: 3842,
  activeUsers: 156,
  avgLatency: 342,
  errorRate: 1.5,
})

const chartData = ref([
  { label: '00:00', value: 120 },
  { label: '03:00', value: 80 },
  { label: '06:00', value: 150 },
  { label: '09:00', value: 320 },
  { label: '10:00', value: 280 },
  { label: '11:00', value: 350 },
  { label: '12:00', value: 420 },
  { label: '13:00', value: 380 },
  { label: '14:00', value: 450 },
  { label: '15:00', value: 410 },
  { label: '16:00', value: 360 },
  { label: '17:00', value: 300 },
  { label: '18:00', value: 260 },
  { label: '19:00', value: 200 },
  { label: '20:00', value: 180 },
  { label: '21:00', value: 160 },
  { label: '22:00', value: 140 },
  { label: '23:00', value: 130 },
])

const maxChartValue = computed(() => Math.max(...chartData.value.map(d => d.value)))

const recentCalls = ref([
  { id: '1', prompt: '帮我写一份产品需求文档', time: '14:30', duration: 856, status: 'success' },
  { id: '2', prompt: '搜索最新的 AI 趋势', time: '14:28', duration: 1234, status: 'success' },
  { id: '3', prompt: '执行 Python 代码计算', time: '14:25', duration: 234, status: 'success' },
  { id: '4', prompt: '解释一下微服务架构', time: '13:50', duration: 2100, status: 'success' },
  { id: '5', prompt: '翻译一段英文文档', time: '12:15', duration: 567, status: 'success' },
  { id: '6', prompt: '读取上传的文件内容', time: '11:40', duration: 89, status: 'error' },
  { id: '7', prompt: 'API 调用：获取天气数据', time: '10:05', duration: 345, status: 'success' },
  { id: '8', prompt: '帮我写一个冒泡排序', time: '09:20', duration: 1200, status: 'success' },
])

function handleBack() {
  navigateTo(`/agents/${agentId.value}`)
}
</script>