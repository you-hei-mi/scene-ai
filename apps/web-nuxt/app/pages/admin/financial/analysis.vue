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
          @click="activeRange = range.id"
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

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">会员订阅</span>
            <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ formatMoney(68200) }}</span>
          </div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-sm text-slate-500">充值金额</span>
            <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ formatMoney(45600) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-slate-500">其他收入</span>
            <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ formatMoney(13200) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
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
import { ref, computed } from 'vue'

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
const currentMonth = 7

const activeRangeLabel = computed(() => {
  return timeRanges.find(r => r.id === activeRange.value)?.label || ''
})

const stats = computed(() => {
  const dataMap: Record<TimeRange, {
    totalRevenue: number
    totalRevenueChange: number
    monthRevenue: number
    monthRevenueChange: number
    monthExpense: number
    monthExpenseChange: number
    netProfit: number
    netProfitChange: number
  }> = {
    '7days': {
      totalRevenue: 1526800,
      totalRevenueChange: 8.5,
      monthRevenue: 28540,
      monthRevenueChange: 12.3,
      monthExpense: 12300,
      monthExpenseChange: 5.2,
      netProfit: 16240,
      netProfitChange: 18.6,
    },
    '30days': {
      totalRevenue: 1526800,
      totalRevenueChange: 8.5,
      monthRevenue: 127000,
      monthRevenueChange: 12.3,
      monthExpense: 45600,
      monthExpenseChange: 5.2,
      netProfit: 81400,
      netProfitChange: 18.6,
    },
    '90days': {
      totalRevenue: 1526800,
      totalRevenueChange: 15.8,
      monthRevenue: 385000,
      monthRevenueChange: 18.5,
      monthExpense: 128000,
      monthExpenseChange: 8.6,
      netProfit: 257000,
      netProfitChange: 22.4,
    },
    'year': {
      totalRevenue: 1526800,
      totalRevenueChange: 28.5,
      monthRevenue: 1526800,
      monthRevenueChange: 28.5,
      monthExpense: 586000,
      monthExpenseChange: 12.8,
      netProfit: 940800,
      netProfitChange: 35.2,
    },
  }
  return dataMap[activeRange.value]
})

const revenueTrendData = computed(() => {
  const dataMap: Record<TimeRange, Array<{ label: string; value: number }>> = {
    '7days': [
      { label: '7/1', value: 18600 },
      { label: '7/2', value: 22400 },
      { label: '7/3', value: 19800 },
      { label: '7/4', value: 25600 },
      { label: '7/5', value: 21300 },
      { label: '7/6', value: 15800 },
      { label: '7/7', value: 12700 },
    ],
    '30days': [
      { label: '第1周', value: 98600 },
      { label: '第2周', value: 122400 },
      { label: '第3周', value: 108500 },
      { label: '第4周', value: 127000 },
    ],
    '90days': [
      { label: '5月', value: 298000 },
      { label: '6月', value: 345000 },
      { label: '7月', value: 385000 },
    ],
    'year': [
      { label: '1月', value: 98000 },
      { label: '2月', value: 112000 },
      { label: '3月', value: 135000 },
      { label: '4月', value: 128000 },
      { label: '5月', value: 298000 },
      { label: '6月', value: 345000 },
      { label: '7月', value: 385000 },
    ],
  }
  return dataMap[activeRange.value]
})

const maxRevenueValue = computed(() => Math.max(...revenueTrendData.value.map(d => d.value), 1))

const incomeCategories = computed<IncomeCategory[]>(() => {
  const total = 127000
  return [
    { name: '会员订阅', value: 68200, percentage: Math.round((68200 / total) * 100), color: '#6366f1', colorLight: '#a5b4fc' },
    { name: '充值金额', value: 45600, percentage: Math.round((45600 / total) * 100), color: '#8b5cf6', colorLight: '#c4b5fd' },
    { name: '其他收入', value: 13200, percentage: Math.round((13200 / total) * 100), color: '#06b6d4', colorLight: '#67e8f9' },
  ]
})

const monthlyData = ref<MonthlyRecord[]>([
  { month: 1, revenue: 98200, expense: 38500, profit: 59700, growthRate: 0 },
  { month: 2, revenue: 112500, expense: 42100, profit: 70400, growthRate: 14.6 },
  { month: 3, revenue: 135800, expense: 48600, profit: 87200, growthRate: 20.7 },
  { month: 4, revenue: 128400, expense: 45200, profit: 83200, growthRate: -5.4 },
  { month: 5, revenue: 298000, expense: 98500, profit: 199500, growthRate: 132.1 },
  { month: 6, revenue: 345000, expense: 112800, profit: 232200, growthRate: 15.8 },
  { month: 7, revenue: 127000, expense: 45600, profit: 81400, growthRate: 12.3 },
])

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