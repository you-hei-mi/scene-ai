<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">财务管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">财务分析</p>
      </div>
      <div class="flex items-center gap-2">
        <button
          v-for="range in timeRanges"
          :key="range.id"
          :class="activeRange === range.id ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          class="text-sm px-3 py-1.5"
          @click="activeRange = range.id; fetchStats()"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <div class="flex items-center gap-2 mb-6 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-fit">
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

    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="lucide:loader-2" class="w-10 h-10 text-primary animate-spin" />
        <p class="text-slate-500 text-sm">正在加载财务数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchStats">重试</button>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总收入</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(stats.totalRevenue) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.totalRevenueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.totalRevenueChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.totalRevenueChange >= 0 ? '+' : '' }}{{ stats.totalRevenueChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:dollar-sign" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">本月收入</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(stats.monthRevenue) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.monthRevenueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.monthRevenueChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.monthRevenueChange >= 0 ? '+' : '' }}{{ stats.monthRevenueChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:calendar" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">本月支出</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(stats.monthExpense) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.monthExpenseChange <= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.monthExpenseChange <= 0 ? 'lucide:trending-down' : 'lucide:trending-up'" class="w-3 h-3" />
              {{ stats.monthExpenseChange >= 0 ? '+' : '' }}{{ stats.monthExpenseChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-red-100 dark:bg-red-900/30">
            <UIcon name="lucide:arrow-up-right" class="w-7 h-7 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">净利润</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(stats.netProfit) }}</p>
            <p class="text-xs mt-2 flex items-center gap-1" :class="stats.netProfitChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
              <UIcon :name="stats.netProfitChange >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3 h-3" />
              {{ stats.netProfitChange >= 0 ? '+' : '' }}{{ stats.netProfitChange }}% 环比
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:trending-up" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      <div class="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div class="mb-6 flex items-center justify-between">
          <h3 class="font-semibold text-lg text-slate-900 dark:text-white">收入趋势</h3>
          <UBadge variant="secondary" size="sm">{{ activeRangeLabel }}</UBadge>
        </div>
        <div class="h-64 flex items-end justify-between gap-2 px-4 py-8">
          <div
            v-for="(item, index) in revenueTrendData"
            :key="index"
            class="flex-1 flex flex-col items-center gap-2 group"
          >
            <div class="relative w-full flex flex-col items-center justify-end h-full">
              <span class="text-xs mb-1 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                ¥{{ formatMoney(item.value) }}
              </span>
              <div
                class="w-full rounded-t-lg transition-all duration-500 hover:opacity-80"
                style="background: linear-gradient(to top, #6366f1, #8b5cf6)"
                :style="{ height: (item.value / maxRevenueValue) * 100 + '%' }"
              ></div>
            </div>
            <span class="text-xs text-slate-500">{{ item.label }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div class="mb-6">
          <h3 class="font-semibold text-lg text-slate-900 dark:text-white">收入分类占比</h3>
        </div>
        <div class="space-y-5">
          <div v-for="cat in incomeCategories" :key="cat.name">
            <div class="flex items-center justify-between mb-1.5">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full" :style="{ background: cat.color }"></div>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ cat.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm text-slate-500">¥{{ formatMoney(cat.value) }}</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ cat.percentage }}%</span>
              </div>
            </div>
            <div class="h-2.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <div
                class="h-full rounded-full transition-all duration-500"
                :style="{ width: cat.percentage + '%', background: `linear-gradient(90deg, ${cat.color}, ${cat.colorLight})` }"
              ></div>
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
          <div v-for="cat in incomeCategories" :key="cat.name" class="flex items-center justify-between mb-2 last:mb-0">
            <span class="text-sm text-slate-500">{{ cat.name }}</span>
            <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ formatMoney(cat.value) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="mb-4 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
        <h3 class="font-semibold text-lg text-slate-900 dark:text-white">月度对比表</h3>
        <UBadge variant="secondary" size="sm">{{ currentYear }}</UBadge>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">月份</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">收入</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">支出</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">净利润</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">环比增长</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(month, index) in monthlyData"
              :key="month.month"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              :class="index === currentMonth - 1 ? 'bg-primary/5 dark:bg-primary/10' : ''"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-sm text-slate-900 dark:text-white">{{ month.month }}月</span>
                  <span v-if="index === currentMonth - 1" class="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">本月</span>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ formatMoney(month.revenue) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm text-slate-500">¥{{ formatMoney(month.expense) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-medium" :class="month.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                  ¥{{ formatMoney(month.profit) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <span
                  class="inline-flex items-center gap-1 text-sm"
                  :class="month.growthRate >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  <UIcon :name="month.growthRate >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" class="w-3.5 h-3.5" />
                  {{ month.growthRate >= 0 ? '+' : '' }}{{ month.growthRate }}%
                </span>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr class="bg-slate-50 dark:bg-slate-700/50 font-medium">
              <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">合计</td>
              <td class="px-6 py-4 text-right text-sm text-slate-900 dark:text-white">¥{{ formatMoney(monthlyTotal.revenue) }}</td>
              <td class="px-6 py-4 text-right text-sm text-slate-900 dark:text-white">¥{{ formatMoney(monthlyTotal.expense) }}</td>
              <td class="px-6 py-4 text-right text-sm" :class="monthlyTotal.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                ¥{{ formatMoney(monthlyTotal.profit) }}
              </td>
              <td class="px-6 py-4 text-right"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getFinancialStats } from '~/composables/api/order-finance-access'

definePageMeta({
  layout: 'console',
})

type TimeRange = '7days' | '30days' | '90days' | 'year'

interface MonthlyRecord {
  month: number
  revenue: number
  expense: number
  profit: number
  growthRate: number
}

interface IncomeCategory {
  name: string
  value: number
  percentage: number
  color: string
  colorLight: string
}

const activeTab = ref('analysis')
const activeRange = ref<TimeRange>('30days')
const loading = ref(true)
const error = ref<string | null>(null)

const tabs = [
  { key: 'analysis', label: '财务分析', icon: 'lucide:bar-chart-3' },
  { key: 'balance', label: '余额明细', icon: 'lucide:wallet' },
]

const timeRanges = [
  { id: '7days' as const, label: '7天' },
  { id: '30days' as const, label: '30天' },
  { id: '90days' as const, label: '90天' },
  { id: 'year' as const, label: '全年' },
]

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const activeRangeLabel = computed(() => {
  return timeRanges.find(r => r.id === activeRange.value)?.label || ''
})

const apiStats = ref<{
  totalRevenue: number
  monthlyRevenue: number
  monthlyExpense: number
  netProfit: number
  revenueTrend: { month: string; revenue: number; expense: number; profit: number }[]
  revenueByCategory: { category: string; amount: number; percentage: number }[]
} | null>(null)

const periodMap: Record<TimeRange, string> = {
  '7days': 'week',
  '30days': 'month',
  '90days': 'quarter',
  'year': 'year',
}

async function fetchStats() {
  loading.value = true
  error.value = null
  try {
    const data = await getFinancialStats(periodMap[activeRange.value])
    apiStats.value = data
  } catch (e: any) {
    error.value = e.message || '获取财务数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStats()
})

const stats = computed(() => {
  const d = apiStats.value
  if (!d) {
    return {
      totalRevenue: 0,
      totalRevenueChange: 0,
      monthRevenue: 0,
      monthRevenueChange: 0,
      monthExpense: 0,
      monthExpenseChange: 0,
      netProfit: 0,
      netProfitChange: 0,
    }
  }
  return {
    totalRevenue: d.totalRevenue,
    totalRevenueChange: 0,
    monthRevenue: d.monthlyRevenue,
    monthRevenueChange: 0,
    monthExpense: d.monthlyExpense,
    monthExpenseChange: 0,
    netProfit: d.netProfit,
    netProfitChange: 0,
  }
})

const revenueTrendData = computed(() => {
  const d = apiStats.value
  if (!d || !d.revenueTrend || d.revenueTrend.length === 0) {
    return [{ label: '暂无数据', value: 0 }]
  }
  return d.revenueTrend.map((item) => ({
    label: item.month,
    value: item.revenue,
  }))
})

const maxRevenueValue = computed(() => Math.max(...revenueTrendData.value.map(d => d.value), 1))

const categoryColors = [
  { color: '#6366f1', colorLight: '#a5b4fc' },
  { color: '#8b5cf6', colorLight: '#c4b5fd' },
  { color: '#06b6d4', colorLight: '#67e8f9' },
  { color: '#f59e0b', colorLight: '#fcd34d' },
  { color: '#10b981', colorLight: '#6ee7b7' },
]

const incomeCategories = computed<IncomeCategory[]>(() => {
  const d = apiStats.value
  if (!d || !d.revenueByCategory || d.revenueByCategory.length === 0) {
    return []
  }
  return d.revenueByCategory.map((cat, idx) => {
    const c = categoryColors[idx % categoryColors.length]
    return {
      name: cat.category,
      value: cat.amount,
      percentage: Math.round(cat.percentage),
      color: c.color,
      colorLight: c.colorLight,
    }
  })
})

const monthlyData = computed<MonthlyRecord[]>(() => {
  const d = apiStats.value
  if (!d || !d.revenueTrend || d.revenueTrend.length === 0) {
    return []
  }
  return d.revenueTrend.map((item, idx, arr) => {
    const prev = idx > 0 ? arr[idx - 1] : null
    const growthRate = prev && prev.revenue > 0
      ? Math.round(((item.revenue - prev.revenue) / prev.revenue) * 1000) / 10
      : 0
    const monthNum = parseInt(item.month.replace(/[^0-9]/g, ''), 10) || (idx + 1)
    return {
      month: monthNum,
      revenue: item.revenue,
      expense: item.expense,
      profit: item.profit,
      growthRate,
    }
  })
})

const monthlyTotal = computed(() => {
  return monthlyData.value.reduce(
    (acc, m) => ({
      revenue: acc.revenue + m.revenue,
      expense: acc.expense + m.expense,
      profit: acc.profit + m.profit,
    }),
    { revenue: 0, expense: 0, profit: 0 }
  )
})

function formatMoney(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}
</script>