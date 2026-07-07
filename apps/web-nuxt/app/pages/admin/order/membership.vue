<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">订单管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">会员订单</p>
      </div>
    </div>

    <div class="mb-6">
      <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
        <NuxtLink
          to="/admin/order/membership"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
        >
          会员订单
        </NuxtLink>
        <NuxtLink
          to="/admin/order/recharge"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          充值订单
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总订单数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalOrders.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:receipt" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日订单</p>
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
            <p class="text-sm text-slate-500">本月收入</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ stats.monthlyRevenue.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:trending-up" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">退款中</p>
            <p class="text-3xl font-bold text-orange-600 dark:text-orange-400 mt-2">{{ stats.refunding }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:rotate-ccw" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
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
        <div class="relative w-52">
          <UIcon name="lucide:calendar" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="dateRange"
            type="text"
            placeholder="选择时间范围"
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
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
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">订单号</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">用户</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">套餐</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">支付方式</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">时间</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors cursor-pointer"
              @click="openOrderDetail(order)"
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
                <span class="text-sm text-slate-900 dark:text-white">{{ order.planName }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-semibold text-slate-900 dark:text-white">¥{{ order.amount.toFixed(2) }}</span>
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
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2" @click.stop>
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="查看详情" icon="lucide:eye" @click="openOrderDetail(order)" />
                    <UDropdownMenuItem
                      v-if="order.status === 'pending'"
                      label="确认收款"
                      icon="lucide:check-circle"
                      color="green"
                    />
                    <UDropdownMenuItem
                      v-if="order.status === 'refunding'"
                      label="处理退款"
                      icon="lucide:rotate-ccw"
                      color="orange"
                    />
                    <UDropdownMenuItem label="导出订单" icon="lucide:download" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredOrders.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:receipt" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的订单</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredOrders.length }} 条订单
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

    <UDialog v-model="showDetailDialog" title="订单详情" size="lg">
      <div v-if="selectedOrder" class="space-y-6">
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white">订单信息</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">订单号</span>
                <span class="font-mono text-slate-900 dark:text-white">{{ selectedOrder.orderNo }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">订单状态</span>
                <span :class="getStatusTextClass(selectedOrder.status)">{{ getStatusText(selectedOrder.status) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">下单时间</span>
                <span class="text-slate-900 dark:text-white">{{ selectedOrder.createdAt }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">支付时间</span>
                <span class="text-slate-900 dark:text-white">{{ selectedOrder.paidAt || '—' }}</span>
              </div>
            </div>
          </div>
          <div class="space-y-3">
            <h4 class="text-sm font-semibold text-slate-900 dark:text-white">用户信息</h4>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">用户名称</span>
                <span class="text-slate-900 dark:text-white">{{ selectedOrder.userName }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">联系邮箱</span>
                <span class="text-slate-900 dark:text-white">{{ selectedOrder.userEmail }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-slate-500">联系电话</span>
                <span class="text-slate-900 dark:text-white">{{ selectedOrder.userPhone || '未填写' }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">套餐信息</h4>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <div class="flex justify-between items-center">
              <div>
                <p class="font-medium text-slate-900 dark:text-white">{{ selectedOrder.planName }}</p>
                <p class="text-xs text-slate-500 mt-1">{{ selectedOrder.planDuration }} · {{ selectedOrder.planDescription }}</p>
              </div>
              <span class="text-xl font-bold text-slate-900 dark:text-white">¥{{ selectedOrder.amount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-700 pt-6">
          <h4 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">支付信息</h4>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">支付方式</span>
              <span class="text-slate-900 dark:text-white">{{ selectedOrder.paymentMethod }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-slate-500">交易流水号</span>
              <span class="font-mono text-slate-900 dark:text-white">{{ selectedOrder.transactionId }}</span>
            </div>
            <div v-if="selectedOrder.couponCode" class="flex justify-between text-sm">
              <span class="text-slate-500">优惠券</span>
              <span class="text-green-600 dark:text-green-400">-¥{{ selectedOrder.couponDiscount.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDetailDialog = false">关闭</button>
        <button v-if="selectedOrder?.status === 'pending'" class="btn-glass btn-glass--primary">
          确认收款
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

type OrderStatus = 'paid' | 'pending' | 'refunded' | 'cancelled' | 'refunding'

interface Order {
  id: string
  orderNo: string
  userName: string
  userEmail: string
  userPhone: string | null
  planName: string
  planDuration: string
  planDescription: string
  amount: number
  paymentMethod: string
  status: OrderStatus
  transactionId: string
  couponCode: string | null
  couponDiscount: number
  createdAt: string
  paidAt: string | null
}

const searchOrderNo = ref('')
const searchUser = ref('')
const statusFilter = ref('all')
const dateRange = ref('')
const currentPage = ref(1)
const showDetailDialog = ref(false)
const selectedOrder = ref<Order | null>(null)

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已支付', value: 'paid' },
  { label: '待支付', value: 'pending' },
  { label: '已退款', value: 'refunded' },
  { label: '退款中', value: 'refunding' },
  { label: '已取消', value: 'cancelled' },
]

const orders = ref<Order[]>([
  {
    id: '1',
    orderNo: 'ORD20260707001',
    userName: '张明',
    userEmail: 'zhangming@example.com',
    userPhone: '138****6789',
    planName: '专业版·年付',
    planDuration: '12个月',
    planDescription: '含全部Agent权限、优先响应、专属客服',
    amount: 999.00,
    paymentMethod: '微信支付',
    status: 'paid',
    transactionId: 'WX20260707001001',
    couponCode: 'SUMMER20',
    couponDiscount: 199.80,
    createdAt: '2026-07-07 14:30:25',
    paidAt: '2026-07-07 14:31:02',
  },
  {
    id: '2',
    orderNo: 'ORD20260707002',
    userName: '李婷',
    userEmail: 'liting@example.com',
    userPhone: '139****1234',
    planName: '黄金版·季付',
    planDuration: '3个月',
    planDescription: '含全部Agent权限、标准响应速度',
    amount: 299.00,
    paymentMethod: '支付宝',
    status: 'paid',
    transactionId: 'ALI20260707002001',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-07 12:15:40',
    paidAt: '2026-07-07 12:16:18',
  },
  {
    id: '3',
    orderNo: 'ORD20260707003',
    userName: '王强',
    userEmail: 'wangqiang@example.com',
    userPhone: '136****5678',
    planName: '钻石版·年付',
    planDuration: '12个月',
    planDescription: '含全部Agent权限、优先响应、专属客服、API调用',
    amount: 1999.00,
    paymentMethod: '微信支付',
    status: 'pending',
    transactionId: '—',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-07 11:20:00',
    paidAt: null,
  },
  {
    id: '4',
    orderNo: 'ORD20260706001',
    userName: '赵雪',
    userEmail: 'zhaoxue@example.com',
    userPhone: null,
    planName: '专业版·月付',
    planDuration: '1个月',
    planDescription: '含全部Agent权限、优先响应',
    amount: 99.00,
    paymentMethod: '支付宝',
    status: 'refunded',
    transactionId: 'ALI20260706001001',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-06 16:40:30',
    paidAt: '2026-07-06 16:41:10',
  },
  {
    id: '5',
    orderNo: 'ORD20260706002',
    userName: '孙磊',
    userEmail: 'sunlei@example.com',
    userPhone: '137****4321',
    planName: '黄金版·半年付',
    planDuration: '6个月',
    planDescription: '含全部Agent权限、标准响应速度',
    amount: 549.00,
    paymentMethod: '微信支付',
    status: 'paid',
    transactionId: 'WX20260706002001',
    couponCode: 'NEWUSER',
    couponDiscount: 50.00,
    createdAt: '2026-07-06 10:05:15',
    paidAt: '2026-07-06 10:05:50',
  },
  {
    id: '6',
    orderNo: 'ORD20260705001',
    userName: '周杰',
    userEmail: 'zhoujie@example.com',
    userPhone: '135****8765',
    planName: '专业版·季付',
    planDuration: '3个月',
    planDescription: '含全部Agent权限、优先响应',
    amount: 279.00,
    paymentMethod: '支付宝',
    status: 'cancelled',
    transactionId: '—',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-05 09:30:00',
    paidAt: null,
  },
  {
    id: '7',
    orderNo: 'ORD20260705002',
    userName: '吴芳',
    userEmail: 'wufang@example.com',
    userPhone: '133****6543',
    planName: '钻石版·季付',
    planDuration: '3个月',
    planDescription: '含全部Agent权限、优先响应、专属客服、API调用',
    amount: 599.00,
    paymentMethod: '微信支付',
    status: 'paid',
    transactionId: 'WX20260705002001',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-05 15:22:10',
    paidAt: '2026-07-05 15:22:45',
  },
  {
    id: '8',
    orderNo: 'ORD20260704001',
    userName: '郑涛',
    userEmail: 'zhengtao@example.com',
    userPhone: null,
    planName: '黄金版·月付',
    planDuration: '1个月',
    planDescription: '含全部Agent权限、标准响应速度',
    amount: 109.00,
    paymentMethod: '支付宝',
    status: 'refunding',
    transactionId: 'ALI20260704001001',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-04 11:10:00',
    paidAt: '2026-07-04 11:10:35',
  },
  {
    id: '9',
    orderNo: 'ORD20260703001',
    userName: '冯丽',
    userEmail: 'fengli@example.com',
    userPhone: '132****7890',
    planName: '专业版·年付',
    planDuration: '12个月',
    planDescription: '含全部Agent权限、优先响应、专属客服',
    amount: 999.00,
    paymentMethod: '微信支付',
    status: 'paid',
    transactionId: 'WX20260703001001',
    couponCode: 'VIP10',
    couponDiscount: 100.00,
    createdAt: '2026-07-03 08:45:00',
    paidAt: '2026-07-03 08:45:30',
  },
  {
    id: '10',
    orderNo: 'ORD20260702001',
    userName: '陈伟',
    userEmail: 'chenwei@example.com',
    userPhone: '131****3456',
    planName: '钻石版·半年付',
    planDuration: '6个月',
    planDescription: '含全部Agent权限、优先响应、专属客服、API调用',
    amount: 1099.00,
    paymentMethod: '支付宝',
    status: 'paid',
    transactionId: 'ALI20260702001001',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-02 13:55:20',
    paidAt: '2026-07-02 13:56:00',
  },
  {
    id: '11',
    orderNo: 'ORD20260701001',
    userName: '刘洋',
    userEmail: 'liuyang@example.com',
    userPhone: '130****2345',
    planName: '黄金版·年付',
    planDuration: '12个月',
    planDescription: '含全部Agent权限、标准响应速度',
    amount: 999.00,
    paymentMethod: '微信支付',
    status: 'refunded',
    transactionId: 'WX20260701001001',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-01 17:20:00',
    paidAt: '2026-07-01 17:20:40',
  },
  {
    id: '12',
    orderNo: 'ORD20260701002',
    userName: '黄梅',
    userEmail: 'huangmei@example.com',
    userPhone: null,
    planName: '专业版·月付',
    planDuration: '1个月',
    planDescription: '含全部Agent权限、优先响应',
    amount: 99.00,
    paymentMethod: '支付宝',
    status: 'pending',
    transactionId: '—',
    couponCode: null,
    couponDiscount: 0,
    createdAt: '2026-07-01 10:00:00',
    paidAt: null,
  },
])

const stats = computed(() => ({
  totalOrders: orders.value.length,
  todayOrders: orders.value.filter(o => o.createdAt.startsWith('2026-07-07')).length,
  monthlyRevenue: orders.value
    .filter(o => o.status === 'paid' && o.createdAt.startsWith('2026-07'))
    .reduce((sum, o) => sum + o.amount, 0),
  refunding: orders.value.filter(o => o.status === 'refunding').length,
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

function getStatusText(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: '已支付',
    pending: '待支付',
    refunded: '已退款',
    cancelled: '已取消',
    refunding: '退款中',
  }
  return map[status]
}

function getStatusClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    refunded: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    cancelled: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
    refunding: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400',
  }
  return map[status]
}

function getStatusDotClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: 'bg-green-500',
    pending: 'bg-yellow-500',
    refunded: 'bg-red-500',
    cancelled: 'bg-gray-400',
    refunding: 'bg-orange-500',
  }
  return map[status]
}

function getStatusTextClass(status: OrderStatus): string {
  const map: Record<OrderStatus, string> = {
    paid: 'text-green-600 dark:text-green-400 font-medium',
    pending: 'text-yellow-600 dark:text-yellow-400 font-medium',
    refunded: 'text-red-600 dark:text-red-400 font-medium',
    cancelled: 'text-gray-500 font-medium',
    refunding: 'text-orange-600 dark:text-orange-400 font-medium',
  }
  return map[status]
}

function resetFilters() {
  searchOrderNo.value = ''
  searchUser.value = ''
  statusFilter.value = 'all'
  dateRange.value = ''
  currentPage.value = 1
}

function openOrderDetail(order: Order) {
  selectedOrder.value = order
  showDetailDialog.value = true
}
</script>