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
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">CDK 管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">生成、管理和监控 CDK 兑换码</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/admin/operation/cdk/settings" class="btn-glass">
          <UIcon name="lucide:settings" class="w-4 h-4" />
          设置
        </NuxtLink>
        <button class="btn-glass btn-glass--primary" @click="openBatchGenerateDialog">
          <UIcon name="lucide:plus" class="w-4 h-4" />
          批量生成
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总生成量</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.total }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:ticket" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">已使用</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.used }}</p>
            <p class="text-xs text-green-600 dark:text-green-400 mt-2">{{ stats.usedRate }}%</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:check-circle" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">待兑换</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.unused }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-amber-100 dark:bg-amber-900/30">
            <UIcon name="lucide:gift" class="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">本月新增</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">+{{ stats.monthNew }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30">
            <UIcon name="lucide:plus-circle" class="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchKeyword"
            placeholder="搜索 CDK 码..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
        <USelect v-model="typeFilter" :options="typeOptions" class="w-44" />
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
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">CDK 码</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">类型</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">兑换内容</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">过期时间</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">使用人</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">生成时间</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cdk in filteredCdkList"
              :key="cdk.code"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <code class="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-900 dark:text-white font-mono">{{ cdk.code }}</code>
              </td>
              <td class="px-6 py-4">
                <UBadge :variant="getTypeBadgeVariant(cdk.type)" size="sm">
                  {{ getTypeText(cdk.type) }}
                </UBadge>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ cdk.content }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="getStatusColor(cdk.status)"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="getStatusDot(cdk.status)"
                  ></span>
                  {{ getStatusText(cdk.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ cdk.expireAt || '永不过期' }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ cdk.usedBy || '—' }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ cdk.createdAt }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem
                      v-if="cdk.status === 'unused'"
                      label="复制 CDK"
                      icon="lucide:copy"
                      @click="copyCdk(cdk.code)"
                    />
                    <UDropdownMenuItem
                      v-if="cdk.status === 'unused'"
                      label="作废"
                      icon="lucide:x-circle"
                      color="red"
                      @click="revokeCdk(cdk)"
                    />
                    <UDropdownMenuItem label="删除" icon="lucide:trash-2" color="red" @click="removeCdk(cdk)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredCdkList.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:ticket" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的 CDK</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredCdkList.length }} 条记录
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

    <UDialog v-model="showBatchDialog" title="批量生成 CDK" size="lg">
      <div class="space-y-5">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">生成数量 <span class="text-red-500">*</span></label>
            <UInput v-model.number="batchForm.quantity" type="number" placeholder="100" />
            <p class="text-xs mt-1 text-slate-500">单次最多生成 1000 个</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">CDK 类型</label>
            <USelect v-model="batchForm.type" :options="typeOptions" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">兑换内容</label>
          <UInput v-model="batchForm.content" placeholder="专业版月卡" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">面值 (可选)</label>
          <UInput v-model.number="batchForm.value" type="number" placeholder="99" />
          <p class="text-xs mt-1 text-slate-500">充值金额面值，留空表示兑换套餐</p>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">过期时间</label>
          <UInput v-model="batchForm.expireAt" type="date" />
          <p class="text-xs mt-1 text-slate-500">留空表示永不过期</p>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showBatchDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="batchGenerate">开始生成</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getCDKList,
  generateCDK,
  deleteCDK,
  type CDKItem,
} from '~/composables/api/operation'

definePageMeta({
  layout: 'console',
})

type CdkType = 'recharge' | 'subscription' | 'gift'
type CdkStatus = 'unused' | 'used' | 'expired' | 'revoked'

interface CdkItemUI {
  id: string
  code: string
  type: CdkType
  content: string
  value: number | null
  status: CdkStatus
  expireAt: string | null
  usedBy: string | null
  usedAt: string | null
  createdAt: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const currentPage = ref(1)
const showBatchDialog = ref(false)

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '未使用', value: 'unused' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' },
  { label: '已作废', value: 'revoked' },
]

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '充值金额', value: 'recharge' },
  { label: '订阅套餐', value: 'subscription' },
  { label: '礼品码', value: 'gift' },
]

const batchForm = ref({
  quantity: 100,
  type: 'subscription' as CdkType,
  content: '',
  value: null as number | null,
  expireAt: '',
})

function mapApiToUI(api: CDKItem): CdkItemUI {
  const uiType: CdkType = api.type === 'recharge' ? 'recharge' : 'subscription'
  const content = api.type === 'recharge'
    ? `¥${api.value || 0} 充值`
    : api.membershipPlanId
      ? `套餐兑换 (${api.membershipPlanId})`
      : '套餐兑换'
  return {
    id: api.id,
    code: api.code,
    type: uiType,
    content,
    value: api.value || null,
    status: api.status === 'unused' ? 'unused' : 'used',
    expireAt: api.expireAt || null,
    usedBy: api.userId || null,
    usedAt: api.usedAt || null,
    createdAt: api.createdAt,
  }
}

const cdkList = ref<CdkItemUI[]>([])
const totalCount = ref(0)

const stats = computed(() => ({
  total: totalCount.value,
  used: cdkList.value.filter(c => c.status === 'used').length,
  unused: cdkList.value.filter(c => c.status === 'unused').length,
  usedRate: totalCount.value ? Math.round((cdkList.value.filter(c => c.status === 'used').length / totalCount.value) * 100) : 0,
  monthNew: cdkList.value.filter(c => c.createdAt.startsWith('2026-07')).length,
}))

const totalPages = computed(() => Math.ceil(filteredCdkList.value.length / 10) || 1)

const filteredCdkList = computed(() => {
  let result = [...cdkList.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toUpperCase()
    result = result.filter(c => c.code.toUpperCase().includes(kw) || c.content.includes(kw))
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(c => c.status === statusFilter.value)
  }

  if (typeFilter.value !== 'all') {
    result = result.filter(c => c.type === typeFilter.value)
  }

  return result
})

async function fetchCdks() {
  loading.value = true
  error.value = null
  try {
    const res = await getCDKList({ page: 1, pageSize: 1000 })
    cdkList.value = (res.data?.items || []).map(mapApiToUI)
    totalCount.value = res.data?.total || 0
  } catch (e: any) {
    error.value = e?.message || '加载 CDK 列表失败'
  } finally {
    loading.value = false
  }
}

function getTypeText(type: CdkType): string {
  const map: Record<CdkType, string> = {
    recharge: '充值',
    subscription: '订阅',
    gift: '礼品',
  }
  return map[type]
}

function getTypeBadgeVariant(type: CdkType): 'default' | 'secondary' | 'outline' {
  const map: Record<CdkType, 'default' | 'secondary' | 'outline'> = {
    recharge: 'default',
    subscription: 'secondary',
    gift: 'outline',
  }
  return map[type]
}

function getStatusText(status: CdkStatus): string {
  const map: Record<CdkStatus, string> = {
    unused: '未使用',
    used: '已使用',
    expired: '已过期',
    revoked: '已作废',
  }
  return map[status]
}

function getStatusColor(status: CdkStatus): string {
  const map: Record<CdkStatus, string> = {
    unused: 'text-amber-600 dark:text-amber-400',
    used: 'text-green-600 dark:text-green-400',
    expired: 'text-slate-500 dark:text-slate-400',
    revoked: 'text-red-600 dark:text-red-400',
  }
  return map[status]
}

function getStatusDot(status: CdkStatus): string {
  const map: Record<CdkStatus, string> = {
    unused: 'bg-amber-500',
    used: 'bg-green-500',
    expired: 'bg-slate-400',
    revoked: 'bg-red-500',
  }
  return map[status]
}

function resetFilters() {
  searchKeyword.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
  currentPage.value = 1
}

function openBatchGenerateDialog() {
  batchForm.value = {
    quantity: 100,
    type: 'subscription',
    content: '',
    value: null,
    expireAt: '',
  }
  showBatchDialog.value = true
}

async function batchGenerate() {
  if (!batchForm.value.quantity || batchForm.value.quantity <= 0) return
  saving.value = true
  try {
    const apiType = batchForm.value.type === 'recharge' ? 'recharge' : 'membership'
    await generateCDK({
      quantity: batchForm.value.quantity,
      type: apiType as 'recharge' | 'membership',
      value: batchForm.value.value ?? undefined,
      expireDays: batchForm.value.expireAt ? undefined : undefined,
    })
    showBatchDialog.value = false
    await fetchCdks()
  } catch (e: any) {
    error.value = e?.message || '生成 CDK 失败'
  } finally {
    saving.value = false
  }
}

function copyCdk(code: string) {
  navigator.clipboard.writeText(code.replace(/-/g, ''))
}

async function revokeCdk(cdk: CdkItemUI) {
  try {
    await deleteCDK(cdk.id)
    await fetchCdks()
  } catch (e: any) {
    error.value = e?.message || '作废 CDK 失败'
  }
}

async function removeCdk(cdk: CdkItemUI) {
  try {
    await deleteCDK(cdk.id)
    await fetchCdks()
  } catch (e: any) {
    error.value = e?.message || '删除 CDK 失败'
  }
}

onMounted(() => {
  fetchCdks()
})
</script>