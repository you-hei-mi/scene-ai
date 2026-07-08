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
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">充值配置</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">配置充值档位、优惠赠送和显示顺序</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openAddDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        新增档位
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总档位</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.total }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:credit-card" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">已启用</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.enabled }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:check-circle" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总赠送</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">¥{{ stats.totalBonus }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
            <UIcon name="lucide:gift" class="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-12">排序</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">充值金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">赠送金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">实得金额</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">折扣率</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">推荐</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(tier, index) in sortedTiers"
              :key="tier.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ tier.sortOrder }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-lg font-bold text-slate-900 dark:text-white">¥{{ tier.amount }}</span>
              </td>
              <td class="px-6 py-4">
                <span v-if="tier.bonusAmount > 0" class="text-sm font-medium text-green-600 dark:text-green-400">+¥{{ tier.bonusAmount }}</span>
                <span v-else class="text-sm text-slate-500">无赠送</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">¥{{ tier.amount + tier.bonusAmount }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  v-if="tier.bonusAmount > 0"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                >
                  {{ getDiscountRate(tier) }} 折
                </span>
                <span v-else class="text-sm text-slate-500">无折扣</span>
              </td>
              <td class="px-6 py-4">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="tier.status === 'enabled'" @change="toggleStatus(tier)">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary peer-checked:to-accent"></div>
                </label>
              </td>
              <td class="px-6 py-4">
                <label class="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" class="sr-only peer" :checked="tier.recommended" @change="toggleRecommended(tier)">
                  <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-400/30 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-amber-400 peer-checked:to-orange-500"></div>
                </label>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑档位" icon="lucide:edit" @click="openEditDialog(tier)" />
                    <UDropdownMenuItem
                      v-if="index > 0"
                      label="上移"
                      icon="lucide:arrow-up"
                      @click="moveUp(index)"
                    />
                    <UDropdownMenuItem
                      v-if="index < sortedTiers.length - 1"
                      label="下移"
                      icon="lucide:arrow-down"
                      @click="moveDown(index)"
                    />
                    <UDropdownMenuItem label="删除档位" icon="lucide:trash-2" color="red" @click="removeTier(tier)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="tiers.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:wallet" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">暂未配置充值档位</p>
      </div>
    </div>

    <UDialog v-model="showDialog" :title="editingItem ? '编辑充值档位' : '新增充值档位'" size="lg">
      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">充值金额 (¥) <span class="text-red-500">*</span></label>
            <UInput v-model.number="formData.amount" type="number" placeholder="30" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">赠送金额 (¥)</label>
            <UInput v-model.number="formData.bonusAmount" type="number" placeholder="5" />
            <p class="text-xs mt-1 text-slate-500">额外赠送，用户账户实际到账 = 充值金额 + 赠送金额</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">排序序号</label>
            <UInput v-model.number="formData.sortOrder" type="number" placeholder="1" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">是否启用</label>
            <div class="pt-2">
              <UCheckbox v-model="formData.status" :checked="formData.status === 'enabled'" @change="formData.status = formData.status === 'enabled' ? 'disabled' : 'enabled'" />
              <span class="text-sm text-slate-700 dark:text-slate-300 ml-2">启用该充值档位</span>
            </div>
          </div>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.recommended" />
            <span class="text-sm text-slate-700 dark:text-slate-300">设为推荐档位（在充值页面高亮显示）</span>
          </label>
        </div>
        <div v-if="formData.bonusAmount > 0" class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
          <p class="text-sm text-green-700 dark:text-green-300">
            用户购买 <strong>¥{{ formData.amount }}</strong>，实际到账 <strong>¥{{ formData.amount + formData.bonusAmount }}</strong>，
            相当于 <span class="font-bold">{{ getDiscountRateFormatted() }}</span> 折优惠
          </p>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveTier">
          {{ editingItem ? '保存修改' : '创建档位' }}
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getRechargeTiers,
  createRechargeTier,
  updateRechargeTier,
  deleteRechargeTier,
  type RechargeTier,
} from '~/composables/api/operation'

definePageMeta({
  layout: 'console',
})

type TierStatus = 'enabled' | 'disabled'

interface RechargeTierUI {
  id: string
  amount: number
  bonusAmount: number
  sortOrder: number
  status: TierStatus
  recommended: boolean
}

const loading = ref(true)
const error = ref<string | null>(null)
const showDialog = ref(false)
const editingItem = ref<RechargeTierUI | null>(null)
const saving = ref(false)

const formData = ref({
  amount: 0,
  bonusAmount: 0,
  sortOrder: 1,
  status: 'enabled' as TierStatus,
  recommended: false,
})

const tiers = ref<RechargeTierUI[]>([])

function mapApiToUI(api: RechargeTier, index: number): RechargeTierUI {
  return {
    id: api.id,
    amount: api.amount ?? 0,
    bonusAmount: api.giftAmount ?? 0,
    sortOrder: index + 1,
    status: api.isEnabled ? 'enabled' : 'disabled',
    recommended: api.isRecommended || false,
  }
}

function mapFormToApiPayload() {
  return {
    amount: formData.value.amount,
    giftAmount: formData.value.bonusAmount,
    isEnabled: formData.value.status === 'enabled',
    isRecommended: formData.value.recommended,
  }
}

const sortedTiers = computed(() => {
  return [...tiers.value].sort((a, b) => a.sortOrder - b.sortOrder)
})

const stats = computed(() => ({
  total: tiers.value.length,
  enabled: tiers.value.filter(t => t.status === 'enabled').length,
  totalBonus: tiers.value.filter(t => t.status === 'enabled').reduce((sum, t) => sum + t.bonusAmount, 0),
}))

async function fetchTiers() {
  loading.value = true
  error.value = null
  try {
    const res = await getRechargeTiers()
    tiers.value = (res.data || []).map((t, i) => mapApiToUI(t, i))
  } catch (e: any) {
    error.value = e?.message || '加载充值档位失败'
  } finally {
    loading.value = false
  }
}

function getDiscountRate(tier: RechargeTierUI): number {
  if (tier.bonusAmount <= 0) return 100
  const total = tier.amount + tier.bonusAmount
  return Math.round((tier.amount / total) * 100)
}

function getDiscountRateFormatted(): string {
  if (formData.value.amount <= 0) return '100'
  const total = formData.value.amount + formData.value.bonusAmount
  return ((formData.value.amount / total) * 100).toFixed(1)
}

function openAddDialog() {
  editingItem.value = null
  formData.value = {
    amount: 0,
    bonusAmount: 0,
    sortOrder: tiers.value.length + 1,
    status: 'enabled',
    recommended: false,
  }
  showDialog.value = true
}

function openEditDialog(tier: RechargeTierUI) {
  editingItem.value = tier
  formData.value = {
    amount: tier.amount,
    bonusAmount: tier.bonusAmount,
    sortOrder: tier.sortOrder,
    status: tier.status,
    recommended: tier.recommended,
  }
  showDialog.value = true
}

async function saveTier() {
  if (!formData.value.amount || formData.value.amount <= 0) return
  saving.value = true
  try {
    if (editingItem.value) {
      await updateRechargeTier(editingItem.value.id, mapFormToApiPayload())
    } else {
      await createRechargeTier(mapFormToApiPayload())
    }
    showDialog.value = false
    await fetchTiers()
  } catch (e: any) {
    error.value = e?.message || '保存充值档位失败'
  } finally {
    saving.value = false
  }
}

async function toggleStatus(tier: RechargeTierUI) {
  try {
    const newStatus = tier.status === 'enabled' ? 'disabled' : 'enabled'
    await updateRechargeTier(tier.id, { isEnabled: newStatus === 'enabled' })
    tier.status = newStatus
  } catch (e: any) {
    error.value = e?.message || '切换状态失败'
  }
}

async function toggleRecommended(tier: RechargeTierUI) {
  try {
    const newVal = !tier.recommended
    await updateRechargeTier(tier.id, { isRecommended: newVal })
    tier.recommended = newVal
  } catch (e: any) {
    error.value = e?.message || '操作失败'
  }
}

function moveUp(index: number) {
  const sorted = sortedTiers.value
  const current = sorted[index]
  const prev = sorted[index - 1]
  if (prev) {
    const temp = current.sortOrder
    current.sortOrder = prev.sortOrder
    prev.sortOrder = temp
  }
}

function moveDown(index: number) {
  const sorted = sortedTiers.value
  const current = sorted[index]
  const next = sorted[index + 1]
  if (next) {
    const temp = current.sortOrder
    current.sortOrder = next.sortOrder
    next.sortOrder = temp
  }
}

async function removeTier(tier: RechargeTierUI) {
  try {
    await deleteRechargeTier(tier.id)
    await fetchTiers()
  } catch (e: any) {
    error.value = e?.message || '删除充值档位失败'
  }
}

onMounted(() => {
  fetchTiers()
})
</script>