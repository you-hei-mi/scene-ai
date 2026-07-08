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
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">CDK 使用记录</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">查看所有 CDK 的兑换历史和使用记录</p>
      </div>
      <div class="flex gap-3">
        <NuxtLink to="/admin/operation/cdk/management" class="btn-glass">
          <UIcon name="lucide:ticket" class="w-4 h-4" />
          返回管理
        </NuxtLink>
        <button class="btn-glass">
          <UIcon name="lucide:download" class="w-4 h-4" />
          导出
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-64">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchKeyword"
            placeholder="搜索 CDK 码/使用人..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="typeFilter" :options="typeOptions" class="w-40" />
        <div class="relative w-40">
          <UInput v-model="dateRange.start" type="date" placeholder="开始日期" />
        </div>
        <div class="relative w-40">
          <UInput v-model="dateRange.end" type="date" placeholder="结束日期" />
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
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">CDK 码</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">类型</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">兑换内容</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">使用人</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">用户邮箱</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">使用时间</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">生成时间</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500 w-16">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in filteredRecords"
              :key="record.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <code class="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-900 dark:text-white font-mono">{{ record.code }}</code>
              </td>
              <td class="px-6 py-4">
                <UBadge :variant="getTypeBadgeVariant(record.type)" size="sm">
                  {{ getTypeText(record.type) }}
                </UBadge>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ record.content }}</span>
                <span v-if="record.value" class="text-sm text-green-600 dark:text-green-400 ml-1">(¥{{ record.value }})</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ record.username }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ record.email }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ record.usedAt }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-500">{{ record.createdAt }}</span>
              </td>
              <td class="px-6 py-4 text-right">
                <button class="btn-glass p-2" @click="viewDetail(record)">
                  <UIcon name="lucide:eye" class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredRecords.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:history" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的记录</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredRecords.length }} 条记录，累计兑换 {{ totalValue }} 元
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

    <UDialog v-model="showDetailDialog" title="兑换详情" size="md">
      <div v-if="currentRecord" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 mb-1">CDK 码</p>
            <code class="text-sm bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-slate-900 dark:text-white font-mono">{{ currentRecord.code }}</code>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">类型</p>
            <UBadge :variant="getTypeBadgeVariant(currentRecord.type)" size="sm">
              {{ getTypeText(currentRecord.type) }}
            </UBadge>
          </div>
        </div>
        <div>
          <p class="text-xs text-slate-500 mb-1">兑换内容</p>
          <p class="text-sm text-slate-700 dark:text-slate-300">{{ currentRecord.content }}</p>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 mb-1">使用人</p>
            <p class="text-sm text-slate-700 dark:text-slate-300">{{ currentRecord.username }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">邮箱</p>
            <p class="text-sm text-slate-700 dark:text-slate-300">{{ currentRecord.email }}</p>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-xs text-slate-500 mb-1">生成时间</p>
            <p class="text-sm text-slate-700 dark:text-slate-300">{{ currentRecord.createdAt }}</p>
          </div>
          <div>
            <p class="text-xs text-slate-500 mb-1">使用时间</p>
            <p class="text-sm text-slate-700 dark:text-slate-300">{{ currentRecord.usedAt }}</p>
          </div>
        </div>
        <div v-if="currentRecord.value" class="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
          <p class="text-xs text-green-600 dark:text-green-400 mb-1">兑换金额</p>
          <p class="text-2xl font-bold text-green-700 dark:text-green-300">¥{{ currentRecord.value }}</p>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDetailDialog = false">关闭</button>
        <button class="btn-glass" @click="copyCode">
          <UIcon name="lucide:copy" class="w-4 h-4" />
          复制 CDK
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getCDKUsageRecords, type CDKUsageRecord } from '~/composables/api/operation'

definePageMeta({
  layout: 'console',
})

type CdkType = 'recharge' | 'subscription' | 'gift'

interface CdkRecordUI {
  id: string
  code: string
  type: CdkType
  content: string
  value: number | null
  username: string
  email: string
  createdAt: string
  usedAt: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const searchKeyword = ref('')
const typeFilter = ref('all')
const currentPage = ref(1)
const showDetailDialog = ref(false)
const currentRecord = ref<CdkRecordUI | null>(null)

const dateRange = ref({
  start: '',
  end: '',
})

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '充值金额', value: 'recharge' },
  { label: '订阅套餐', value: 'subscription' },
  { label: '礼品码', value: 'gift' },
]

const records = ref<CdkRecordUI[]>([])

function mapApiToUI(api: CDKUsageRecord): CdkRecordUI {
  const uiType: CdkType = api.type === 'recharge' ? 'recharge' : 'subscription'
  return {
    id: api.id,
    code: api.code,
    type: uiType,
    content: api.type === 'recharge' ? `¥${api.amount || 0} 充值` : '套餐兑换',
    value: api.amount || null,
    username: api.username || '',
    email: '',
    createdAt: '',
    usedAt: api.usedAt || '',
  }
}

const totalValue = computed(() => {
  return records.value.reduce((sum, r) => sum + (r.value || 0), 0)
})

const totalPages = computed(() => Math.ceil(filteredRecords.value.length / 10) || 1)

const filteredRecords = computed(() => {
  let result = [...records.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      r => r.code.toLowerCase().includes(kw) ||
           r.username.toLowerCase().includes(kw) ||
           r.email.toLowerCase().includes(kw)
    )
  }

  if (typeFilter.value !== 'all') {
    result = result.filter(r => r.type === typeFilter.value)
  }

  if (dateRange.value.start) {
    result = result.filter(r => r.usedAt >= dateRange.value.start)
  }

  if (dateRange.value.end) {
    result = result.filter(r => r.usedAt <= dateRange.value.end + ' 23:59:59')
  }

  result.sort((a, b) => b.usedAt.localeCompare(a.usedAt))
  return result
})

async function fetchRecords() {
  loading.value = true
  error.value = null
  try {
    const res = await getCDKUsageRecords({ page: 1, pageSize: 1000 })
    records.value = (res.data?.items || []).map(mapApiToUI)
  } catch (e: any) {
    error.value = e?.message || '加载 CDK 使用记录失败'
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

function resetFilters() {
  searchKeyword.value = ''
  typeFilter.value = 'all'
  dateRange.value = { start: '', end: '' }
  currentPage.value = 1
}

function viewDetail(record: CdkRecordUI) {
  currentRecord.value = record
  showDetailDialog.value = true
}

function copyCode() {
  if (currentRecord.value) {
    navigator.clipboard.writeText(currentRecord.value.code.replace(/-/g, ''))
  }
}

onMounted(() => {
  fetchRecords()
})
</script>