<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">订单管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">充值订单</p>
      </div>
    </div>

    <div class="mb-6">
      <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
        <NuxtLink
          to="/admin/order/membership"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          会员订单
        </NuxtLink>
        <NuxtLink
          to="/admin/order/recharge"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
        >
          充值订单
        </NuxtLink>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading && orders.length === 0" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-4">
        <UIcon name="lucide:loader-2" class="w-10 h-10 text-primary animate-spin" />
        <p class="text-slate-500 text-sm">正在加载充值订单数据...</p>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchOrders">重试</button>
    </div>

    <div v-if="!loading || orders.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总充值订单</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalOrders }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:wallet" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日充值</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.todayOrders }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:calendar-check" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">本月充值总额</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ stats.monthlyTotal.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:trending-up" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">赠送总额</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ stats.totalBonus.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
            <UIcon name="lucide:gift" class="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading || orders.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-56">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchOrderNo"
            placeholder="搜索订单号..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div class="relative w-48">
          <UIcon name="lucide:user" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchUser"
            placeholder="搜索用户..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="statusFilter" :options="statusOptions" class="w-36" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <div v-if="!loading || orders.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">订单号</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">用户</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">充值金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">赠送金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">实付金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">支付方式</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">时间</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="text-sm font-mono text-slate-900 dark:text-white">{{ order.orderNo }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <UAvatar :text="order.userName.charAt(0)" size="sm" />
                  <div>
                    <div class="font-medium text-sm text-slate-900 dark:text-white">{{ order.userName }}</div>
                    <div class="text-xs text-slate-500">{{ order.userEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-slate-900 dark:text-white">¥{{ order.rechargeAmount.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-green-600 dark:text-green-400">+¥{{ order.bonusAmount.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-slate-900 dark:text-white">¥{{ order.paidAmount.toFixed(2) }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-600 dark:text-slate-400">{{ order.paymentMethod }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="getStatusDotClass(order.status)"
                  ></span>
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ order.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:wallet" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的充值订单</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredOrders.length }} 条充值订单
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getRechargeOrders } from '~/composables/api/order-finance-access'

definePageMeta({
  layout: 'console',
})

type RechargeStatus = 'completed' | 'pending' | 'failed' | 'cancelled'

interface RechargeOrder {
  id: string
  orderNo: string
  userName: string
  userEmail: string
  rechargeAmount: number
  bonusAmount: number
  paidAmount: number
  paymentMethod: string
  status: RechargeStatus
  createdAt: string
}

const searchOrderNo = ref('')
const searchUser = ref('')
const statusFilter = ref('all')
const currentPage = ref(1)
const loading = ref(true)
const error = ref<string | null>(null)

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已完成', value: 'completed' },
  { label: '待支付', value: 'pending' },
  { label: '已失败', value: 'failed' },
  { label: '已取消', value: 'cancelled' },
]

const orders = ref<RechargeOrder[]>([])

async function fetchOrders() {
  loading.value = true
  error.value = null
  try {
    const result = await getRechargeOrders({ page: 1, pageSize: 100 })
    orders.value = (result.items || []).map((item) => {
      const apiStatusMap: Record<string, RechargeStatus> = {
        paid: 'completed',
        pending: 'pending',
        refunded: 'failed',
        cancelled: 'cancelled',
      }
      return {
        id: item.id,
        orderNo: item.orderNo,
        userName: item.username,
        userEmail: '',
        rechargeAmount: item.amount,
        bonusAmount: item.giftAmount,
        paidAmount: item.actualAmount,
        paymentMethod: item.paymentMethod,
        status: apiStatusMap[item.status] || 'pending',
        createdAt: item.createdAt,
      }
    })
  } catch (e: any) {
    error.value = e.message || '获取充值订单数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchOrders()
})

const stats = computed(() => ({
  totalOrders: orders.value.length,
  todayOrders: orders.value.filter(o => {
    const today = new Date().toISOString().slice(0, 10)
    return o.createdAt.startsWith(today)
  }).length,
  monthlyTotal: orders.value
    .filter(o => {
      const now = new Date()
      const month = now.toISOString().slice(0, 7)
      return o.status === 'completed' && o.createdAt.startsWith(month)
    })
    .reduce((sum, o) => sum + o.rechargeAmount, 0),
  totalBonus: orders.value
    .filter(o => o.status === 'completed')
    .reduce((sum, o) => sum + o.bonusAmount, 0),
}))

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / 10) || 1)

const filteredOrders = computed(() => {
  let result = [...orders.value]

  if (searchOrderNo.value.trim()) {
    const kw = searchOrderNo.value.toLowerCase()
    result = result.filter(o => o.orderNo.toLowerCase().includes(kw))
  }

  if (searchUser.value.trim()) {
    const kw = searchUser.value.toLowerCase()
    result = result.filter(
      o =>
        o.userName.toLowerCase().includes(kw) ||
        o.userEmail.toLowerCase().includes(kw)
    )
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(o => o.status === statusFilter.value)
  }

  result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  return result
})

function getStatusText(status: RechargeStatus): string {
  const map: Record<RechargeStatus, string> = {
    completed: '已完成',
    pending: '待支付',
    failed: '已失败',
    cancelled: '已取消',
  }
  return map[status]
}

function getStatusClass(status: RechargeStatus): string {
  const map: Record<RechargeStatus, string> = {
    completed: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    cancelled: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
  }
  return map[status]
}

function getStatusDotClass(status: RechargeStatus): string {
  const map: Record<RechargeStatus, string> = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
    cancelled: 'bg-gray-400',
  }
  return map[status]
}

function resetFilters() {
  searchOrderNo.value = ''
  searchUser.value = ''
  statusFilter.value = 'all'
  currentPage.value = 1
}
</script>