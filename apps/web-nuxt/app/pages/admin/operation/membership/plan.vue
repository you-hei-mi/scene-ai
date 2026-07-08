<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-24">
      <UIcon name="lucide:loader-2" class="w-10 h-10 text-primary animate-spin" />
    </div>

    <!-- Error -->
    <div v-if="error" class="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
      <div class="flex items-center gap-3">
        <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-500" />
        <p class="text-sm text-red-700 dark:text-red-400">{{ error }}</p>
      </div>
    </div>

    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">套餐管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理会员套餐方案、定价和功能配置</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openCreateDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        新增套餐
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="relative bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-lg group"
        :class="{ 'ring-2 ring-primary': plan.recommended }"
      >
        <div
          v-if="plan.recommended"
          class="absolute top-0 right-0 bg-gradient-to-l from-primary to-accent text-white text-xs font-semibold px-4 py-1.5 rounded-bl-xl"
        >
          推荐
        </div>

        <div class="p-6">
          <div class="flex items-center gap-3 mb-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center" :class="plan.iconBg">
              <UIcon :name="plan.icon" class="w-6 h-6" :class="plan.iconColor" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ plan.name }}</h3>
              <p class="text-xs text-slate-500">{{ plan.memberCount.toLocaleString() }} 位会员</p>
            </div>
          </div>

          <p class="text-sm text-slate-500 mb-4 line-clamp-2">{{ plan.description }}</p>

          <div class="mb-5">
            <div class="flex items-baseline gap-1">
              <span class="text-3xl font-bold text-slate-900 dark:text-white">¥{{ plan.price }}</span>
              <span class="text-sm text-slate-500">/ {{ plan.periodLabel }}</span>
            </div>
            <p v-if="plan.originalPrice" class="text-xs text-slate-400 line-through mt-1">¥{{ plan.originalPrice }}/{{ plan.periodLabel }}</p>
          </div>

          <div class="space-y-2.5 mb-6">
            <div
              v-for="(feature, idx) in plan.features"
              :key="idx"
              class="flex items-start gap-2"
            >
              <UIcon
                :name="feature.included ? 'lucide:check-circle' : 'lucide:x-circle'"
                class="w-4 h-4 flex-shrink-0 mt-0.5"
                :class="feature.included ? 'text-green-500' : 'text-slate-300 dark:text-slate-600'"
              />
              <span
                class="text-sm"
                :class="feature.included ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-500 line-through'"
              >
                {{ feature.label }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
            <button class="btn-glass flex-1 text-sm" @click="openEditDialog(plan)">
              <UIcon name="lucide:edit" class="w-4 h-4" />
              编辑
            </button>
            <button
              class="btn-glass flex-1 text-sm"
              :class="plan.status === 'active' ? 'text-amber-600' : 'text-green-600'"
              @click="toggleStatus(plan)"
            >
              <UIcon :name="plan.status === 'active' ? 'lucide:eye-off' : 'lucide:eye'" class="w-4 h-4" />
              {{ plan.status === 'active' ? '下架' : '上架' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">套餐名称</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">价格</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">周期</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">会员数</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">推荐</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="plan in plans"
              :key="plan.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="plan.iconBg">
                    <UIcon :name="plan.icon" class="w-4 h-4" :class="plan.iconColor" />
                  </div>
                  <div>
                    <span class="font-medium text-sm text-slate-900 dark:text-white">{{ plan.name }}</span>
                    <p class="text-xs text-slate-500">{{ plan.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div>
                  <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ plan.price }}</span>
                  <span v-if="plan.originalPrice" class="text-xs text-slate-400 line-through ml-1">¥{{ plan.originalPrice }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ plan.periodLabel }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ plan.memberCount.toLocaleString() }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="plan.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-slate-500 dark:text-slate-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="plan.status === 'active' ? 'bg-green-500' : 'bg-slate-400'"
                  ></span>
                  {{ plan.status === 'active' ? '上架' : '下架' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <UIcon
                  v-if="plan.recommended"
                  name="lucide:star"
                  class="w-4 h-4 text-amber-500"
                />
                <span v-else class="text-sm text-slate-400">—</span>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑套餐" icon="lucide:edit" @click="openEditDialog(plan)" />
                    <UDropdownMenuItem
                      v-if="plan.status === 'active'"
                      label="下架套餐"
                      icon="lucide:eye-off"
                      color="amber"
                      @click="toggleStatus(plan)"
                    />
                    <UDropdownMenuItem
                      v-else
                      label="上架套餐"
                      icon="lucide:eye"
                      color="green"
                      @click="toggleStatus(plan)"
                    />
                    <UDropdownMenuItem
                      :label="plan.recommended ? '取消推荐' : '设为推荐'"
                      icon="lucide:star"
                      @click="toggleRecommended(plan)"
                    />
                    <UDropdownMenuItem label="删除套餐" icon="lucide:trash-2" color="red" @click="removePlan(plan)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="plans.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:package" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">暂未创建套餐</p>
      </div>
    </div>

    <UDialog v-model="showDialog" :title="editingItem ? '编辑套餐' : '新增套餐'" size="xl">
      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">套餐名称 <span class="text-red-500">*</span></label>
            <UInput v-model="formData.name" placeholder="例如：专业版" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">套餐图标</label>
            <USelect v-model="formData.icon" :options="iconSelectOptions" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">套餐描述</label>
          <UTextarea v-model="formData.description" placeholder="简短的套餐描述" rows="2" />
        </div>
        <div class="grid grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">价格 (¥)</label>
            <UInput v-model.number="formData.price" type="number" placeholder="99" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">原价 (¥)</label>
            <UInput v-model.number="formData.originalPrice" type="number" placeholder="199" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">计费周期</label>
            <USelect v-model="formData.period" :options="periodOptions" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">套餐功能</label>
          <div class="space-y-2 mb-3">
            <div
              v-for="(feature, idx) in formData.features"
              :key="idx"
              class="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
            >
              <UCheckbox v-model="feature.included" />
              <UInput v-model="feature.label" placeholder="功能描述" class="flex-1" />
              <button class="btn-glass p-1.5 text-red-500 hover:text-red-600" @click="removeFeature(idx)">
                <UIcon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <button class="btn-glass text-sm" @click="addFeature">
            <UIcon name="lucide:plus" class="w-4 h-4" />
            添加功能
          </button>
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.recommended" />
            <span class="text-sm text-slate-700 dark:text-slate-300">设为推荐套餐</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.status" :checked="formData.status === 'active'" @change="formData.status = formData.status === 'active' ? 'disabled' : 'active'" />
            <span class="text-sm text-slate-700 dark:text-slate-300">上架套餐</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="savePlan">
          {{ editingItem ? '保存修改' : '创建套餐' }}
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getMembershipPlans,
  createMembershipPlan,
  updateMembershipPlan,
  deleteMembershipPlan,
  type MembershipPlan,
} from '~/composables/api/operation'

definePageMeta({
  layout: 'console',
})

interface PlanFeature {
  label: string
  included: boolean
}

interface Plan {
  id: string
  name: string
  icon: string
  iconBg: string
  iconColor: string
  description: string
  price: number
  originalPrice: number | null
  period: string
  periodLabel: string
  features: PlanFeature[]
  memberCount: number
  status: 'active' | 'disabled'
  recommended: boolean
}

const loading = ref(true)
const error = ref<string | null>(null)
const showDialog = ref(false)
const editingItem = ref<Plan | null>(null)
const saving = ref(false)

const formData = ref({
  name: '',
  icon: 'lucide:zap',
  description: '',
  price: 0,
  originalPrice: 0 as number | null,
  period: 'monthly',
  features: [] as PlanFeature[],
  status: 'active' as 'active' | 'disabled',
  recommended: false,
})

const iconSelectOptions = [
  { label: '闪电', value: 'lucide:zap' },
  { label: '火箭', value: 'lucide:rocket' },
  { label: '星星', value: 'lucide:star' },
  { label: '钻石', value: 'lucide:gem' },
  { label: '皇冠', value: 'lucide:crown' },
  { label: '奖杯', value: 'lucide:trophy' },
  { label: '火花', value: 'lucide:sparkles' },
  { label: '太阳', value: 'lucide:sun' },
]

const periodOptions = [
  { label: '按月', value: 'monthly' },
  { label: '按季度', value: 'quarterly' },
  { label: '按年', value: 'yearly' },
  { label: '永久', value: 'lifetime' },
]

const periodLabelMap: Record<string, string> = {
  monthly: '月',
  quarterly: '季',
  yearly: '年',
  lifetime: '永久',
}

const cycleMap: Record<string, string> = {
  monthly: 'month',
  quarterly: 'quarter',
  yearly: 'year',
  lifetime: 'lifetime',
  month: 'monthly',
  quarter: 'quarterly',
  year: 'yearly',
}

const iconBgMap: Record<string, string> = {
  'lucide:zap': 'bg-amber-100 dark:bg-amber-900/30',
  'lucide:rocket': 'bg-purple-100 dark:bg-purple-900/30',
  'lucide:star': 'bg-blue-100 dark:bg-blue-900/30',
  'lucide:gem': 'bg-violet-100 dark:bg-violet-900/30',
  'lucide:crown': 'bg-orange-100 dark:bg-orange-900/30',
  'lucide:trophy': 'bg-yellow-100 dark:bg-yellow-900/30',
  'lucide:sparkles': 'bg-pink-100 dark:bg-pink-900/30',
  'lucide:sun': 'bg-red-100 dark:bg-red-900/30',
}

const iconColorMap: Record<string, string> = {
  'lucide:zap': 'text-amber-600 dark:text-amber-400',
  'lucide:rocket': 'text-purple-600 dark:text-purple-400',
  'lucide:star': 'text-blue-600 dark:text-blue-400',
  'lucide:gem': 'text-violet-600 dark:text-violet-400',
  'lucide:crown': 'text-orange-600 dark:text-orange-400',
  'lucide:trophy': 'text-yellow-600 dark:text-yellow-400',
  'lucide:sparkles': 'text-pink-600 dark:text-pink-400',
  'lucide:sun': 'text-red-600 dark:text-red-400',
}

const plans = ref<Plan[]>([])

function mapApiToUI(api: MembershipPlan): Plan {
  return {
    id: api.id,
    name: api.name,
    icon: 'lucide:zap',
    iconBg: iconBgMap['lucide:zap'],
    iconColor: iconColorMap['lucide:zap'],
    description: api.description || '',
    price: api.price ?? 0,
    originalPrice: api.discountPrice || null,
    period: cycleMap[api.cycle] || 'monthly',
    periodLabel: periodLabelMap[cycleMap[api.cycle] || 'monthly'] || '月',
    features: (api.features || []).map(f => ({ label: f, included: true })),
    memberCount: 0,
    status: api.isEnabled ? 'active' : 'disabled',
    recommended: false,
  }
}

function mapFormToApiPayload() {
  return {
    name: formData.value.name,
    description: formData.value.description,
    price: formData.value.price,
    discountPrice: formData.value.originalPrice || undefined,
    cycle: cycleMap[formData.value.period] || 'month',
    features: formData.value.features.filter(f => f.label.trim()).map(f => f.label),
    isEnabled: formData.value.status === 'active',
  }
}

async function fetchPlans() {
  loading.value = true
  error.value = null
  try {
    const res = await getMembershipPlans()
    plans.value = (res.data || []).map(mapApiToUI)
  } catch (e: any) {
    error.value = e?.message || '加载套餐失败'
  } finally {
    loading.value = false
  }
}

function openCreateDialog() {
  editingItem.value = null
  formData.value = {
    name: '',
    icon: 'lucide:zap',
    description: '',
    price: 0,
    originalPrice: null,
    period: 'monthly',
    features: [
      { label: '', included: true },
      { label: '', included: true },
      { label: '', included: false },
    ],
    status: 'active',
    recommended: false,
  }
  showDialog.value = true
}

function openEditDialog(plan: Plan) {
  editingItem.value = plan
  formData.value = {
    name: plan.name,
    icon: plan.icon,
    description: plan.description,
    price: plan.price,
    originalPrice: plan.originalPrice,
    period: plan.period,
    features: plan.features.map(f => ({ ...f })),
    status: plan.status,
    recommended: plan.recommended,
  }
  showDialog.value = true
}

function addFeature() {
  formData.value.features.push({ label: '', included: true })
}

function removeFeature(index: number) {
  formData.value.features.splice(index, 1)
}

async function savePlan() {
  if (!formData.value.name.trim()) return
  saving.value = true
  try {
    if (editingItem.value) {
      await updateMembershipPlan(editingItem.value.id, mapFormToApiPayload())
    } else {
      await createMembershipPlan(mapFormToApiPayload())
    }
    showDialog.value = false
    await fetchPlans()
  } catch (e: any) {
    error.value = e?.message || '保存套餐失败'
  } finally {
    saving.value = false
  }
}

async function toggleStatus(plan: Plan) {
  try {
    const newStatus = plan.status === 'active' ? 'disabled' : 'active'
    await updateMembershipPlan(plan.id, { isEnabled: newStatus === 'active' })
    plan.status = newStatus
  } catch (e: any) {
    error.value = e?.message || '切换状态失败'
  }
}

function toggleRecommended(plan: Plan) {
  plan.recommended = !plan.recommended
}

async function removePlan(plan: Plan) {
  try {
    await deleteMembershipPlan(plan.id)
    await fetchPlans()
  } catch (e: any) {
    error.value = e?.message || '删除套餐失败'
  }
}

onMounted(() => {
  fetchPlans()
})
</script>