<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">财务管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">余额明细</p>
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
        <p class="text-slate-500 text-sm">正在加载余额数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchBalances">重试</button>
    </div>

    <div v-if="!loading" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">用户总余额</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(summary.totalBalance) }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:wallet" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">累计充值总额</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(summary.totalRecharge) }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:arrow-down-circle" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">累计消费总额</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ formatMoney(summary.totalConsume) }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:arrow-up-circle" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchKeyword"
            placeholder="搜索用户/ID..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="balanceRange" :options="balanceRangeOptions" class="w-40" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <div v-if="!loading" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">用户</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">当前余额</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">累计充值</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">累计消费</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">最后变动时间</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in filteredUsers"
              :key="user.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              @click="openHistoryDialog(user)"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar :text="user.nickname?.charAt(0) || user.username.charAt(0)" size="sm" />
                  <div>
                    <div class="font-medium text-sm text-slate-900 dark:text-white">{{ user.nickname || user.username }}</div>
                    <div class="text-xs text-slate-500">ID: {{ user.id }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm font-semibold text-primary">¥{{ user.balance.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm text-slate-700 dark:text-slate-300">¥{{ user.totalRecharge.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="text-sm text-slate-700 dark:text-slate-300">¥{{ user.totalConsume.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ user.lastChangeTime }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="btn-glass text-sm px-3 py-1.5" @click.stop="openHistoryDialog(user)">
                  <UIcon name="lucide:history" class="w-3.5 h-3.5" />
                  明细
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredUsers.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:wallet" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的用户余额记录</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredUsers.length }} 条记录
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm font-medium text-slate-900 dark:text-white">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UDialog v-model="showHistoryDialog" :title="`余额变动明细 - ${selectedUser?.nickname || selectedUser?.username}`" size="lg">
      <div v-if="historyLoading" class="flex items-center justify-center py-10">
        <UIcon name="lucide:loader-2" class="w-8 h-8 text-primary animate-spin" />
      </div>
      <div v-else-if="historyError" class="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <p class="text-sm text-red-600">{{ historyError }}</p>
      </div>
      <template v-else>
        <div class="mb-4 flex items-center gap-4">
          <div class="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p class="text-xs text-slate-500">当前余额</p>
            <p class="text-xl font-bold text-primary">{{ selectedUser ? '¥' + selectedUser.balance.toFixed(2) : '—' }}</p>
          </div>
          <div class="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p class="text-xs text-slate-500">累计充值</p>
            <p class="text-xl font-bold text-green-600 dark:text-green-400">{{ selectedUser ? '¥' + selectedUser.totalRecharge.toFixed(2) : '—' }}</p>
          </div>
          <div class="flex-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
            <p class="text-xs text-slate-500">累计消费</p>
            <p class="text-xl font-bold text-orange-600 dark:text-orange-400">{{ selectedUser ? '¥' + selectedUser.totalConsume.toFixed(2) : '—' }}</p>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th class="text-left px-4 py-3 text-sm font-medium text-slate-500">时间</th>
                <th class="text-left px-4 py-3 text-sm font-medium text-slate-500">类型</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-slate-500">金额</th>
                <th class="text-right px-4 py-3 text-sm font-medium text-slate-500">变动后余额</th>
                <th class="text-left px-4 py-3 text-sm font-medium text-slate-500">备注</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in balanceHistory"
                :key="record.id"
                class="border-b border-slate-200 dark:border-slate-700"
              >
                <td class="px-4 py-3 text-sm text-slate-500">{{ record.time }}</td>
                <td class="px-4 py-3">
                  <span
                    class="inline-flex items-center gap-1 text-sm"
                    :class="record.type === 'recharge' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'"
                  >
                    <UIcon :name="record.type === 'recharge' ? 'lucide:arrow-down-circle' : 'lucide:arrow-up-circle'" class="w-3.5 h-3.5" />
                    {{ record.type === 'recharge' ? '充值' : record.type === 'consume' ? '消费' : '退款' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <span
                    class="text-sm font-medium"
                    :class="record.amount >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                  >
                    {{ record.amount >= 0 ? '+' : '' }}¥{{ record.amount.toFixed(2) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-right">
                  <span class="text-sm text-slate-700 dark:text-slate-300">¥{{ record.afterBalance.toFixed(2) }}</span>
                </td>
                <td class="px-4 py-3 text-sm text-slate-500">{{ record.remark }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="balanceHistory.length === 0" class="text-center py-8">
          <p class="text-sm text-slate-400">暂无变动记录</p>
        </div>
      </template>
      <template #footer>
        <button class="btn-glass" @click="showHistoryDialog = false">关闭</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getBalanceDetails, getBalanceChanges } from '~/composables/api/order-finance-access'

definePageMeta({
  layout: 'console',
})

interface BalanceRecord {
  id: string
  time: string
  type: 'recharge' | 'consume' | 'refund'
  amount: number
  afterBalance: number
  remark: string
}

interface UserBalance {
  id: string
  username: string
  nickname: string
  balance: number
  totalRecharge: number
  totalConsume: number
  lastChangeTime: string
}

const activeTab = ref('balance')
const searchKeyword = ref('')
const balanceRange = ref('all')
const currentPage = ref(1)
const showHistoryDialog = ref(false)
const selectedUser = ref<UserBalance | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const historyLoading = ref(false)
const historyError = ref<string | null>(null)

const tabs = [
  { key: 'analysis', label: '财务分析', icon: 'lucide:bar-chart-3' },
  { key: 'balance', label: '余额明细', icon: 'lucide:wallet' },
]

const balanceRangeOptions = [
  { label: '全部余额', value: 'all' },
  { label: '余额 > 0', value: 'positive' },
  { label: '余额 = 0', value: 'zero' },
  { label: '余额 > 100', value: 'high' },
]

const users = ref<UserBalance[]>([])

async function fetchBalances() {
  loading.value = true
  error.value = null
  try {
    const result = await getBalanceDetails({ page: 1, pageSize: 100 })
    users.value = (result.items || []).map((item) => ({
      id: item.userId,
      username: item.username,
      nickname: item.username,
      balance: item.currentBalance,
      totalRecharge: item.totalRecharge,
      totalConsume: item.totalConsume,
      lastChangeTime: item.lastChangeTime,
    }))
  } catch (e: any) {
    error.value = e.message || '获取余额数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBalances()
})

const summary = computed(() => {
  const totalBalance = users.value.reduce((s, u) => s + u.balance, 0)
  const totalRecharge = users.value.reduce((s, u) => s + u.totalRecharge, 0)
  const totalConsume = users.value.reduce((s, u) => s + u.totalConsume, 0)
  return { totalBalance, totalRecharge, totalConsume }
})

const filteredUsers = computed(() => {
  let result = [...users.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      u =>
        u.username.toLowerCase().includes(kw) ||
        u.nickname.toLowerCase().includes(kw) ||
        u.id.includes(kw)
    )
  }

  if (balanceRange.value === 'positive') {
    result = result.filter(u => u.balance > 0)
  } else if (balanceRange.value === 'zero') {
    result = result.filter(u => u.balance === 0)
  } else if (balanceRange.value === 'high') {
    result = result.filter(u => u.balance > 100)
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / 10) || 1)

const balanceHistory = ref<BalanceRecord[]>([])

async function openHistoryDialog(user: UserBalance) {
  selectedUser.value = user
  showHistoryDialog.value = true
  historyLoading.value = true
  historyError.value = null
  balanceHistory.value = []
  try {
    const changes = await getBalanceChanges(user.id)
    balanceHistory.value = (changes || []).map((item) => ({
      id: item.id,
      time: item.createdAt,
      type: item.type === 'gift' ? 'recharge' : item.type as BalanceRecord['type'],
      amount: item.amount,
      afterBalance: item.balance,
      remark: item.description,
    }))
  } catch (e: any) {
    historyError.value = e.message || '获取变动记录失败'
  } finally {
    historyLoading.value = false
  }
}

function resetFilters() {
  searchKeyword.value = ''
  balanceRange.value = 'all'
  currentPage.value = 1
}

function formatMoney(num: number): string {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  }
  return num.toLocaleString()
}
</script>