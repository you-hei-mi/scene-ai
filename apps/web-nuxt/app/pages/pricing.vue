<template>
  <div>
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">套餐与定价</h1>
      <p class="text-muted-foreground text-sm mt-2">选择适合你的方案</p>
    </div>

    <!-- 月付/年付切换 -->
    <div class="flex items-center justify-center gap-3 mb-10">
      <span
        class="text-sm font-medium transition-colors"
        :class="billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground'"
      >
        月付
      </span>
      <button
        class="relative inline-flex h-7 w-12 items-center rounded-full transition-colors"
        :class="billingCycle === 'yearly' ? 'bg-primary' : 'bg-muted'"
        @click="toggleBillingCycle"
      >
        <span
          class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
          :class="billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'"
        />
      </button>
      <span
        class="text-sm font-medium transition-colors"
        :class="billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground'"
      >
        年付
      </span>
      <UBadge v-if="billingCycle === 'yearly'" color="success" size="sm">省 20%</UBadge>
    </div>

    <!-- 套餐卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      <UCard
        v-for="plan in plans"
        :key="plan.id"
        class="relative flex flex-col transition-all"
        :class="plan.isCurrent ? 'border-primary border-2 ring-2 ring-primary/20' : ''"
      >
        <!-- 当前套餐标识 -->
        <div v-if="plan.isCurrent" class="absolute -top-3 left-1/2 -translate-x-1/2">
          <UBadge color="primary" size="sm">当前套餐</UBadge>
        </div>

        <!-- 套餐名称 -->
        <div class="text-center mb-6">
          <div
            class="w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3"
            :class="plan.iconBg"
          >
            <UIcon :name="plan.icon" class="w-6 h-6" :class="plan.iconColor" />
          </div>
          <h2 class="text-xl font-bold">{{ plan.name }}</h2>
          <p class="text-xs text-muted-foreground mt-1">{{ plan.description }}</p>
        </div>

        <!-- 价格 -->
        <div class="text-center mb-6">
          <div class="flex items-end justify-center gap-1">
            <span class="text-4xl font-bold">¥{{ getPlanPrice(plan) }}</span>
            <span class="text-sm text-muted-foreground mb-1">
              {{ plan.price === 0 ? '永久免费' : billingCycle === 'yearly' ? '/年' : '/月' }}
            </span>
          </div>
          <p v-if="plan.price > 0 && billingCycle === 'yearly'" class="text-xs text-green-600 mt-1">
            相比月付节省 ¥{{ plan.price * 12 - getYearlyPrice(plan.price) }}
          </p>
        </div>

        <!-- 功能列表 -->
        <ul class="space-y-3 mb-6 flex-1">
          <li v-for="feature in plan.features" :key="feature" class="flex items-start gap-2">
            <UIcon name="lucide:check" class="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <span class="text-sm">{{ feature }}</span>
          </li>
        </ul>

        <!-- 订阅/升级按钮 -->
        <UButton
          class="w-full"
          :variant="plan.isCurrent ? 'outline' : 'solid'"
          :disabled="plan.isCurrent"
          @click="handleSubscribe(plan)"
        >
          {{ getButtonText(plan) }}
        </UButton>
      </UCard>
    </div>

    <!-- 功能对比表格 -->
    <div class="mb-12">
      <h2 class="text-xl font-bold mb-6 text-center">功能对比</h2>
      <UCard class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-border">
                <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground">功能</th>
                <th class="text-center px-4 py-3 text-sm font-medium text-muted-foreground">免费版</th>
                <th class="text-center px-4 py-3 text-sm font-medium text-muted-foreground">专业版</th>
                <th class="text-center px-4 py-3 text-sm font-medium text-muted-foreground">团队版</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="row in comparisonRows"
                :key="row.feature"
                class="border-b border-border last:border-0 hover:bg-accent/30"
              >
                <td class="px-4 py-3 text-sm font-medium">{{ row.feature }}</td>
                <td class="px-4 py-3 text-center">
                  <UIcon v-if="row.free === true" name="lucide:check" class="w-4 h-4 text-green-500 inline-block" />
                  <UIcon v-else-if="row.free === false" name="lucide:x" class="w-4 h-4 text-muted-foreground inline-block" />
                  <span v-else class="text-sm">{{ row.free }}</span>
                </td>
                <td class="px-4 py-3 text-center bg-primary/5">
                  <UIcon v-if="row.pro === true" name="lucide:check" class="w-4 h-4 text-green-500 inline-block" />
                  <UIcon v-else-if="row.pro === false" name="lucide:x" class="w-4 h-4 text-muted-foreground inline-block" />
                  <span v-else class="text-sm">{{ row.pro }}</span>
                </td>
                <td class="px-4 py-3 text-center">
                  <UIcon v-if="row.team === true" name="lucide:check" class="w-4 h-4 text-green-500 inline-block" />
                  <UIcon v-else-if="row.team === false" name="lucide:x" class="w-4 h-4 text-muted-foreground inline-block" />
                  <span v-else class="text-sm">{{ row.team }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>
    </div>

    <!-- 常见问题 -->
    <div class="mb-6">
      <h2 class="text-xl font-bold mb-6 text-center">常见问题</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
        <UCard v-for="faq in faqs" :key="faq.id">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
              <UIcon name="lucide:help-circle" class="w-4 h-4 text-primary" />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold text-sm mb-2">{{ faq.question }}</h3>
              <p class="text-sm text-muted-foreground leading-relaxed">{{ faq.answer }}</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- 底部联系区域 -->
    <UCard class="text-center">
      <div class="py-6">
        <UIcon name="lucide:headphones" class="w-10 h-10 mx-auto text-primary mb-3" />
        <h3 class="text-lg font-bold mb-1">需要更多帮助？</h3>
        <p class="text-sm text-muted-foreground mb-4">如果你有定制需求或团队规模超过 50 人，请联系我们的销售团队</p>
        <div class="flex items-center justify-center gap-3">
          <UButton variant="outline">
            <template #icon>
              <UIcon name="lucide:mail" class="w-4 h-4" />
            </template>
            联系销售
          </UButton>
          <UButton variant="outline">
            <template #icon>
              <UIcon name="lucide:calendar" class="w-4 h-4" />
            </template>
            预约演示
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 计费周期类型
 */
type BillingCycle = 'monthly' | 'yearly'

/**
 * 套餐接口定义
 */
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

/**
 * 对比表格单元格值类型
 */
type ComparisonValue = boolean | string | number

/**
 * 对比表格行接口定义
 */
interface ComparisonRow {
  feature: string
  free: ComparisonValue
  pro: ComparisonValue
  team: ComparisonValue
}

/**
 * 当前计费周期
 */
const billingCycle = ref<BillingCycle>('monthly')

/**
 * 切换计费周期
 */
function toggleBillingCycle() {
  billingCycle.value = billingCycle.value === 'monthly' ? 'yearly' : 'monthly'
}

/**
 * 计算年付价格（月付价格 × 12 × 0.8，省 20%）
 * @param monthlyPrice - 月付价格
 * @returns 年付价格
 */
function getYearlyPrice(monthlyPrice: number): number {
  return Math.round(monthlyPrice * 12 * 0.8)
}

/**
 * 获取套餐展示价格
 * @param plan - 套餐信息
 * @returns 当前计费周期下的价格
 */
function getPlanPrice(plan: Plan): number {
  if (plan.price === 0) return 0
  return billingCycle.value === 'yearly' ? getYearlyPrice(plan.price) : plan.price
}

/**
 * 获取按钮文本
 * @param plan - 套餐信息
 * @returns 按钮显示文本
 */
function getButtonText(plan: Plan): string {
  if (plan.isCurrent) return '当前套餐'
  if (plan.price === 0) return '降级到免费版'
  return '升级到' + plan.name
}

/**
 * 模拟套餐数据
 */
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

/**
 * 功能对比表格数据
 */
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

/**
 * 常见问题数据
 */
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

/**
 * 处理订阅/升级操作
 * @param plan - 选中的套餐
 */
function handleSubscribe(plan: Plan) {
  console.log('订阅套餐:', plan.name)
}
</script>
