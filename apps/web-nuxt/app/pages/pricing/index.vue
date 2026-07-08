<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="text-center mb-8">
      <div class="flex items-center justify-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">套餐与定价</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400">选择适合你的方案</p>
    </div>

    <div class="flex items-center justify-center gap-3 mb-10">
      <span
        class="text-sm font-medium"
        :class="billingCycle === 'monthly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'"
      >
        月付
      </span>
      <button
        class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
        :class="billingCycle === 'yearly' ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-700'"
        @click="toggleBillingCycle"
      >
        <span
          class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
          :class="billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'"
        />
      </button>
      <span
        class="text-sm font-medium"
        :class="billingCycle === 'yearly' ? 'text-slate-900 dark:text-white' : 'text-slate-500'"
      >
        年付
      </span>
      <UBadge v-if="billingCycle === 'yearly'" color="success" size="sm">省 20%</UBadge>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="relative flex flex-col bg-white dark:bg-slate-800 rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-xl"
        :class="plan.isCurrent ? 'border-primary ring-2 ring-primary/20' : 'border-slate-100 dark:border-slate-700'"
      >
        <div v-if="plan.isCurrent" class="absolute -top-3 left-1/2 -translate-x-1/2">
          <UBadge color="primary" size="sm">当前套餐</UBadge>
        </div>

        <div class="text-center p-6">
          <div
            class="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
            :class="plan.id === 'free' ? 'bg-slate-100 dark:bg-slate-700' : plan.id === 'pro' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-purple-100 dark:bg-purple-900/30'"
          >
            <UIcon :name="plan.icon" class="w-6 h-6" :class="plan.id === 'free' ? 'text-slate-500' : plan.id === 'pro' ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'" />
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">{{ plan.name }}</h2>
          <p class="text-xs mt-1 text-slate-500">{{ plan.description }}</p>
        </div>

        <div class="text-center px-6 pb-6">
          <div class="flex items-end justify-center gap-1">
            <span class="text-4xl font-bold text-slate-900 dark:text-white">¥{{ getPlanPrice(plan) }}</span>
            <span class="text-sm mb-1 text-slate-500">
              {{ plan.price === 0 ? '永久免费' : billingCycle === 'yearly' ? '/年' : '/月' }}
            </span>
          </div>
          <p v-if="plan.price > 0 && billingCycle === 'yearly'" class="text-xs mt-1 text-green-600 dark:text-green-400">
            相比月付节省 ¥{{ plan.price * 12 - getYearlyPrice(plan.price) }}
          </p>
        </div>

        <ul class="space-y-3 px-6 pb-6 flex-1">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2">
            <UIcon name="lucide:check" class="w-4 h-4 flex-shrink-0 mt-0.5 text-green-500" />
            <span class="text-sm text-slate-700 dark:text-slate-300">{{ feature }}</span>
          </li>
        </ul>

        <div class="px-6 pb-6">
          <button
            class="w-full py-2.5 px-4 rounded-xl font-medium transition-all"
            :class="plan.isCurrent ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-not-allowed' : 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25'"
            :disabled="plan.isCurrent"
            @click="handleSubscribe(plan)"
          >
            {{ getButtonText(plan) }}
          </button>
        </div>
      </div>
    </div>

    <div class="mb-12">
      <h2 class="font-display text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">功能对比</h2>
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th class="text-left px-4 py-3 text-sm font-medium text-slate-500">功能</th>
                <th class="text-center px-4 py-3 text-sm font-medium text-slate-500">免费版</th>
                <th class="text-center px-4 py-3 text-sm font-medium text-slate-500">专业版</th>
                <th class="text-center px-4 py-3 text-sm font-medium text-slate-500">团队版</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in comparisonRows"
                :key="row.feature"
                class="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td class="px-4 py-3 text-sm font-medium text-slate-900 dark:text-white">{{ row.feature }}</td>
                <td class="px-4 py-3 text-center">
                  <UIcon v-if="row.free === true" name="lucide:check" class="w-4 h-4 inline-block text-green-500" />
                  <UIcon v-else-if="row.free === false" name="lucide:x" class="w-4 h-4 inline-block text-slate-400" />
                  <span v-else class="text-sm text-slate-700 dark:text-slate-300">{{ row.free }}</span>
                </td>
                <td class="px-4 py-3 text-center bg-blue-50/50 dark:bg-blue-900/10">
                  <UIcon v-if="row.pro === true" name="lucide:check" class="w-4 h-4 inline-block text-green-500" />
                  <UIcon v-else-if="row.pro === false" name="lucide:x" class="w-4 h-4 inline-block text-slate-400" />
                  <span v-else class="text-sm text-slate-700 dark:text-slate-300">{{ row.pro }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <UIcon v-if="row.team === true" name="lucide:check" class="w-4 h-4 inline-block text-green-500" />
                  <UIcon v-else-if="row.team === false" name="lucide:x" class="w-4 h-4 inline-block text-slate-400" />
                  <span v-else class="text-sm text-slate-700 dark:text-slate-300">{{ row.team }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="mb-6">
      <h2 class="font-display text-xl font-bold mb-6 text-center text-slate-900 dark:text-white">常见问题</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <div v-for="faq in faqs" :key="faq.id" class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/10">
              <UIcon name="lucide:help-circle" class="w-4 h-4 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-sm mb-2 text-slate-900 dark:text-white">{{ faq.question }}</h3>
              <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{{ faq.answer }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center p-6 max-w-3xl mx-auto">
      <div class="py-6">
        <UIcon name="lucide:headphones" class="w-10 h-10 mx-auto mb-3 text-primary" />
        <h3 class="font-display text-lg font-bold mb-1 text-slate-900 dark:text-white">需要更多帮助？</h3>
        <p class="text-sm mb-4 text-slate-600 dark:text-slate-400">如果你有定制需求或团队规模超过 50 人，请联系我们的销售团队</p>
        <div class="flex items-center justify-center gap-3">
          <button class="btn-glass">
            <UIcon name="lucide:mail" class="w-4 h-4" />
            联系销售
          </button>
          <button class="btn-glass">
            <UIcon name="lucide:calendar" class="w-4 h-4" />
            预约演示
          </button>
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

type BillingCycle = 'monthly' | 'yearly'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  icon: string
  iconBg: string
  iconColor: string
  features: string[]
  isCurrent?: boolean
}

type ComparisonValue = boolean | string | number

interface ComparisonRow {
  feature: string
  free: ComparisonValue
  pro: ComparisonValue
  team: ComparisonValue
}

const billingCycle = ref<BillingCycle>('monthly')

function toggleBillingCycle() {
  billingCycle.value = billingCycle.value === 'monthly' ? 'yearly' : 'monthly'
}

function getYearlyPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * 0.8)
}

function getPlanPrice(plan: Plan): number {
  if (plan.price === 0) return 0
  return billingCycle.value === 'yearly' ? getYearlyPrice(plan.price) : plan.price
}

function getButtonText(plan: Plan): string {
  if (plan.isCurrent) return '当前套餐'
  if (plan.price === 0) return '降级到免费版'
  return '升级到' + plan.name
}

const plans = ref<Plan[]>([
  {
    id: 'free',
    name: '免费版',
    description: '适合个人体验',
    price: 0,
    icon: 'lucide:gift',
    iconBg: 'bg-gray-100 dark:bg-gray-800',
    iconColor: 'text-gray-600 dark:text-gray-400',
    features: [
      '每日 20 次对话',
      '基础模型支持',
      '单用户使用',
      '社区支持',
      '基础知识库（100MB）',
    ],
  },
  {
    id: 'pro',
    name: '专业版',
    description: '适合重度个人用户',
    price: 99,
    icon: 'lucide:zap',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    features: [
      '无限对话次数',
      '所有模型可用',
      '高级 Agent 编排',
      '优先技术支持',
      '知识库（10GB）',
      '历史记录 90 天',
      'API 调用权限',
    ],
    isCurrent: true,
  },
  {
    id: 'team',
    name: '团队版',
    description: '适合团队协作',
    price: 299,
    icon: 'lucide:users',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    features: [
      '专业版全部功能',
      '最多 20 位成员',
      '团队知识库共享（100GB）',
      '权限管理与审计',
      '专属客户经理',
      'SLA 99.9% 可用性',
      '私有化部署支持',
    ],
  },
])

const comparisonRows = ref<ComparisonRow[]>([
  { feature: '每日对话次数', free: '20 次', pro: '无限', team: '无限' },
  { feature: '可用模型数量', free: '3 个', pro: '全部', team: '全部' },
  { feature: 'Agent 编排', free: false, pro: true, team: true },
  { feature: '知识库容量', free: '100MB', pro: '10GB', team: '100GB' },
  { feature: '团队成员数', free: '1 人', pro: '1 人', team: '20 人' },
  { feature: 'API 调用', free: false, pro: true, team: true },
  { feature: '历史记录保留', free: '7 天', pro: '90 天', team: '永久' },
  { feature: '优先技术支持', free: false, pro: true, team: true },
  { feature: '专属客户经理', free: false, pro: false, team: true },
  { feature: 'SLA 服务保障', free: false, pro: false, team: '99.9%' },
  { feature: '私有化部署', free: false, pro: false, team: true },
  { feature: '审计日志', free: false, pro: false, team: true },
])

const faqs = ref([
  {
    id: '1',
    question: '如何升级套餐？',
    answer: '在套餐页面选择目标套餐并点击升级按钮，系统会自动计算差价并完成升级。升级后立即生效，新功能即可使用。',
  },
  {
    id: '2',
    question: '年付有什么优惠？',
    answer: '选择年付可享受 8 折优惠，相比月付节省 20%。例如专业版月付 ¥99，年付仅需 ¥950.4，节省 ¥237.6。',
  },
  {
    id: '3',
    question: '可以随时降级或取消吗？',
    answer: '可以。你可以在套餐管理页面随时降级或取消订阅。降级后将在当前计费周期结束生效，已支付费用不予退还。',
  },
  {
    id: '4',
    question: '团队成员如何计费？',
    answer: '团队版套餐包含 20 个成员席位。超出部分按每位成员 ¥50/月 计费，年付同样享受 8 折优惠。',
  },
])

function handleSubscribe(plan: Plan) {
  console.log('订阅套餐:', plan.name)
}
</script>