<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">运营中心</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">会员管理、套餐配置、CDK 发放与充值管理</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总会员数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.totalMembers.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +15.8% 较上月
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:users" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">活跃套餐</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.activePlans }}</p>
            <p class="text-xs text-slate-500 mt-2">共 {{ stats.totalPlans }} 个套餐</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:package" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">CDK 发放量</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.cdkIssued.toLocaleString() }}</p>
            <p class="text-xs text-amber-600 dark:text-amber-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:gift" class="w-3 h-3" />
              已使用 {{ stats.cdkUsed.toLocaleString() }}
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
            <UIcon name="lucide:ticket" class="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">本月充值金额</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ stats.monthlyRecharge.toLocaleString() }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
              <UIcon name="lucide:trending-up" class="w-3 h-3" />
              +23.5% 较上月
            </p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:wallet" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">快捷入口</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NuxtLink
          v-for="link in quickLinks"
          :key="link.path"
          :to="link.path"
          class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 hover:border-primary/40 hover:shadow-lg transition-all duration-300 group"
        >
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/20 dark:to-accent/20 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
              <UIcon :name="link.icon" class="w-6 h-6 text-primary" />
            </div>
            <div>
              <p class="font-medium text-slate-900 dark:text-white">{{ link.label }}</p>
              <p class="text-xs text-slate-500 mt-0.5">{{ link.description }}</p>
            </div>
          </div>
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="flex items-center justify-between mb-6">
            <h3 class="font-semibold text-slate-900 dark:text-white">最近运营活动</h3>
            <NuxtLink to="/admin/operation/cdk/records" class="text-xs text-primary hover:text-primary-dark transition-colors">查看全部</NuxtLink>
          </div>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50 hover:border-primary/30 transition-colors"
            >
              <div
                :class="[
                  'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
                  activity.iconBg
                ]"
              >
                <UIcon :name="activity.icon" class="w-5 h-5 text-white" />
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
          <h3 class="font-semibold text-slate-900 dark:text-white mb-6">会员分布</h3>
          <div class="space-y-4">
            <div
              v-for="level in membershipDistribution"
              :key="level.name"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-3">
                <span
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: level.color }"
                ></span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ level.name }}</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-32 h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    :style="{ width: level.percentage + '%', backgroundColor: level.color }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-slate-900 dark:text-white w-12 text-right">{{ level.count.toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <h4 class="font-semibold text-sm text-slate-900 dark:text-white mb-4">运营概览</h4>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-slate-500">今日新增会员</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">+{{ overview.todayNewMembers }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-slate-500">今日 CDK 兑换</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ overview.todayCdkRedeems }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-slate-500">今日充值订单</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ overview.todayRechargeOrders }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-slate-500">待处理工单</span>
                <span class="text-sm font-medium text-orange-600 dark:text-orange-400">{{ overview.pendingTickets }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'console',
})

interface QuickLink {
  label: string
  description: string
  icon: string
  path: string
}

interface Activity {
  id: string
  title: string
  description: string
  icon: string
  iconBg: string
  time: string
}

interface MembershipLevel {
  name: string
  color: string
  percentage: number
  count: number
}

const stats = ref({
  totalMembers: 12850,
  activePlans: 3,
  totalPlans: 4,
  cdkIssued: 15680,
  cdkUsed: 9842,
  monthlyRecharge: 256800,
})

const quickLinks: QuickLink[] = [
  {
    label: '会员等级',
    description: '管理会员等级与权益',
    icon: 'lucide:medal',
    path: '/admin/operation/membership/level',
  },
  {
    label: '套餐管理',
    description: '配置会员套餐方案',
    icon: 'lucide:package-check',
    path: '/admin/operation/membership/plan',
  },
  {
    label: 'CDK 管理',
    description: '生成与管理 CDK',
    icon: 'lucide:ticket-percent',
    path: '/admin/operation/cdk/management',
  },
  {
    label: '充值配置',
    description: '配置充值档位与规则',
    icon: 'lucide:wallet-cards',
    path: '/admin/operation/recharge',
  },
]

const recentActivities = ref<Activity[]>([
  {
    id: '1',
    title: 'CDK 批量生成',
    description: '管理员生成了 500 个「专业版月卡」CDK',
    icon: 'lucide:ticket',
    iconBg: 'bg-amber-500',
    time: '10 分钟前',
  },
  {
    id: '2',
    title: '会员升级',
    description: '用户「王小明」升级为钻石会员',
    icon: 'lucide:arrow-up-circle',
    iconBg: 'bg-purple-500',
    time: '25 分钟前',
  },
  {
    id: '3',
    title: 'CDK 兑换',
    description: '用户「李四」兑换了「专业版季卡」CDK',
    icon: 'lucide:gift',
    iconBg: 'bg-green-500',
    time: '1 小时前',
  },
  {
    id: '4',
    title: '套餐更新',
    description: '「专业版」套餐价格已更新为 ¥99/月',
    icon: 'lucide:package',
    iconBg: 'bg-blue-500',
    time: '3 小时前',
  },
  {
    id: '5',
    title: '充值订单',
    description: '用户「赵六」完成 ¥299 充值订单',
    icon: 'lucide:wallet',
    iconBg: 'bg-emerald-500',
    time: '5 小时前',
  },
])

const membershipDistribution = ref<MembershipLevel[]>([
  { name: '钻石会员', color: '#8b5cf6', percentage: 8, count: 1028 },
  { name: '黄金会员', color: '#f59e0b', percentage: 22, count: 2827 },
  { name: '白银会员', color: '#94a3b8', percentage: 35, count: 4498 },
  { name: '普通会员', color: '#6b7280', percentage: 35, count: 4497 },
])

const overview = ref({
  todayNewMembers: 128,
  todayCdkRedeems: 256,
  todayRechargeOrders: 89,
  pendingTickets: 3,
})
</script>