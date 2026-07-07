<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">通知管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">短信通知</p>
      </div>
    </div>

    <div class="mb-6">
      <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
        <NuxtLink
          to="/admin/notice/sms"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
        >
          短信通知
        </NuxtLink>
        <NuxtLink
          to="/admin/notice/notification-settings"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          通知设置
        </NuxtLink>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日发送</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.todaySent.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:send" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">本月发送</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.monthlySent.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:bar-chart-3" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">剩余额度</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.remainingQuota.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:credit-card" class="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">短信模板</h2>
        <button class="btn-glass btn-glass--primary">
          <UIcon name="lucide:plus" class="w-4 h-4" />
          新建模板
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in smsTemplates"
          :key="template.id"
          class="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg"
        >
          <div class="flex items-center justify-between mb-3">
            <h3 class="font-medium text-slate-900 dark:text-white">{{ template.name }}</h3>
            <span
              class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="getTemplateStatusClass(template.status)"
            >
              <span
                class="w-1.5 h-1.5 rounded-full"
                :class="getTemplateStatusDotClass(template.status)"
              ></span>
              {{ getTemplateStatusText(template.status) }}
            </span>
          </div>
          <div class="space-y-2 mb-4">
            <div class="flex justify-between text-xs">
              <span class="text-slate-500">模板 ID</span>
              <span class="font-mono text-slate-700 dark:text-slate-300">{{ template.templateId }}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-slate-500">类型</span>
              <span class="text-slate-700 dark:text-slate-300">{{ template.type }}</span>
            </div>
          </div>
          <p class="text-xs text-slate-500 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-3 mb-4 line-clamp-2">
            {{ template.content }}
          </p>
          <div class="flex items-center gap-2">
            <button class="btn-glass text-xs px-3 py-1.5 flex-1" @click="openTestDialog(template)">
              <UIcon name="lucide:play" class="w-3 h-3" />
              测试发送
            </button>
            <UDropdownMenu>
              <button class="btn-glass p-2">
                <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
              </button>
              <template #items>
                <UDropdownMenuItem label="编辑模板" icon="lucide:edit" />
                <UDropdownMenuItem label="复制模板" icon="lucide:copy" />
                <UDropdownMenuItem
                  v-if="template.status === 'active'"
                  label="停用模板"
                  icon="lucide:pause-circle"
                />
                <UDropdownMenuItem
                  v-else
                  label="启用模板"
                  icon="lucide:play-circle"
                  color="green"
                />
                <UDropdownMenuItem label="删除模板" icon="lucide:trash-2" color="red" />
              </template>
            </UDropdownMenu>
          </div>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <div class="flex items-center justify-between">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white">发送历史</h2>
        <button class="btn-glass text-sm">
          <UIcon name="lucide:download" class="w-4 h-4" />
          导出记录
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative w-48">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchPhone"
            placeholder="搜索手机号..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="templateFilter" :options="templateFilterOptions" class="w-44" />
        <USelect v-model="resultFilter" :options="resultOptions" class="w-36" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetHistoryFilters">
          重置筛选
        </button>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">接收手机号</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">模板名称</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">模板 ID</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">发送结果</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">发送时间</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">响应码</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="record in filteredHistory"
              :key="record.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <span class="text-sm font-mono text-slate-900 dark:text-white">{{ record.phone }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-slate-900 dark:text-white">{{ record.templateName }}</span>
              </td>
              <td class="px-6 py-4">
                <span class="text-xs font-mono text-slate-500">{{ record.templateId }}</span>
              </td>
              <td class="px-6 py-4">
                <span
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="record.result === 'success' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'"
                >
                  <span
                    class="w-1.5 h-1.5 rounded-full"
                    :class="record.result === 'success' ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ record.result === 'success' ? '成功' : '失败' }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ record.sendTime }}</td>
              <td class="px-6 py-4">
                <span class="text-xs font-mono text-slate-500">{{ record.responseCode }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredHistory.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
          <UIcon name="lucide:message-square" class="w-8 h-8 text-slate-400" />
        </div>
        <p class="text-slate-500">未找到匹配的发送记录</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredHistory.length }} 条发送记录
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm font-medium text-slate-900 dark:text-white">第 {{ historyPage }} / {{ historyTotalPages }} 页</span>
          <button class="btn-glass px-3 py-1.5 text-sm">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <UDialog v-model="showTestDialog" title="测试短信发送" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">短信模板</label>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3">
            <p class="text-sm font-medium text-slate-900 dark:text-white">{{ testTemplate?.name }}</p>
            <p class="text-xs text-slate-500 mt-1">{{ testTemplate?.content }}</p>
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">测试手机号</label>
          <UInput v-model="testPhone" placeholder="输入测试手机号" />
          <p class="text-xs text-slate-500 mt-1">请输入真实的手机号码以接收测试短信</p>
        </div>
        <div v-if="testResult !== null" class="rounded-xl p-4" :class="testResult === 'success' ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'">
          <div class="flex items-center gap-2">
            <UIcon
              :name="testResult === 'success' ? 'lucide:check-circle' : 'lucide:x-circle'"
              class="w-5 h-5"
              :class="testResult === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
            />
            <span class="text-sm font-medium" :class="testResult === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'">
              {{ testResult === 'success' ? '短信发送成功' : '短信发送失败' }}
            </span>
          </div>
          <p v-if="testResult === 'failed'" class="text-xs mt-2 text-red-600 dark:text-red-400">错误码：SMS_ERR_001 - 模板参数不完整</p>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showTestDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="sendTestSms" :disabled="isSending">
          <UIcon name="lucide:send" class="w-4 h-4" />
          {{ isSending ? '发送中...' : '发送测试' }}
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

type TemplateStatus = 'active' | 'inactive' | 'pending'
type SendResult = 'success' | 'failed'

interface SmsTemplate {
  id: string
  name: string
  templateId: string
  type: string
  content: string
  status: TemplateStatus
}

interface SmsHistory {
  id: string
  phone: string
  templateName: string
  templateId: string
  result: SendResult
  sendTime: string
  responseCode: string
}

const searchPhone = ref('')
const templateFilter = ref('all')
const resultFilter = ref('all')
const historyPage = ref(1)
const showTestDialog = ref(false)
const testTemplate = ref<SmsTemplate | null>(null)
const testPhone = ref('')
const testResult = ref<'success' | 'failed' | null>(null)
const isSending = ref(false)

const templateFilterOptions = [
  { label: '全部模板', value: 'all' },
  { label: '验证码短信', value: 'SMS_VERIFY' },
  { label: '通知短信', value: 'SMS_NOTIFY' },
  { label: '营销短信', value: 'SMS_MARKET' },
]

const resultOptions = [
  { label: '全部结果', value: 'all' },
  { label: '发送成功', value: 'success' },
  { label: '发送失败', value: 'failed' },
]

const smsTemplates = ref<SmsTemplate[]>([
  {
    id: '1',
    name: '登录验证码',
    templateId: 'SMS_VERIFY_001',
    type: '验证码短信',
    content: '您的验证码是：${code}，请在${minutes}分钟内完成验证。请勿将验证码泄露给他人。',
    status: 'active',
  },
  {
    id: '2',
    name: '注册欢迎通知',
    templateId: 'SMS_NOTIFY_001',
    type: '通知短信',
    content: '欢迎注册${appName}！您的账号已创建成功，立即开始探索 AI 的无限可能吧。',
    status: 'active',
  },
  {
    id: '3',
    name: '订单支付成功',
    templateId: 'SMS_NOTIFY_002',
    type: '通知短信',
    content: '您的订单 ${orderNo} 已支付成功，金额 ¥${amount}。感谢您的支持！',
    status: 'active',
  },
  {
    id: '4',
    name: '会员到期提醒',
    templateId: 'SMS_NOTIFY_003',
    type: '通知短信',
    content: '您的 ${planName} 会员将于 ${expireDate} 到期，请及时续费以继续享受会员权益。',
    status: 'active',
  },
  {
    id: '5',
    name: '活动推广',
    templateId: 'SMS_MARKET_001',
    type: '营销短信',
    content: '${appName} 暑期特惠活动开启！新用户注册即享 7 天免费会员，快来体验吧！退订回 T',
    status: 'inactive',
  },
  {
    id: '6',
    name: '密码重置验证',
    templateId: 'SMS_VERIFY_002',
    type: '验证码短信',
    content: '您正在重置密码，验证码为：${code}，有效期为 ${minutes} 分钟。如非本人操作，请忽略此短信。',
    status: 'pending',
  },
])

const smsHistory = ref<SmsHistory[]>([
  {
    id: '1',
    phone: '138****6789',
    templateName: '登录验证码',
    templateId: 'SMS_VERIFY_001',
    result: 'success',
    sendTime: '2026-07-07 14:30:25',
    responseCode: 'OK',
  },
  {
    id: '2',
    phone: '139****1234',
    templateName: '订单支付成功',
    templateId: 'SMS_NOTIFY_002',
    result: 'success',
    sendTime: '2026-07-07 14:28:10',
    responseCode: 'OK',
  },
  {
    id: '3',
    phone: '136****5678',
    templateName: '登录验证码',
    templateId: 'SMS_VERIFY_001',
    result: 'success',
    sendTime: '2026-07-07 13:15:40',
    responseCode: 'OK',
  },
  {
    id: '4',
    phone: '137****4321',
    templateName: '注册欢迎通知',
    templateId: 'SMS_NOTIFY_001',
    result: 'success',
    sendTime: '2026-07-07 12:00:00',
    responseCode: 'OK',
  },
  {
    id: '5',
    phone: '135****8765',
    templateName: '会员到期提醒',
    templateId: 'SMS_NOTIFY_003',
    result: 'failed',
    sendTime: '2026-07-07 11:45:30',
    responseCode: 'ERR_102',
  },
  {
    id: '6',
    phone: '133****6543',
    templateName: '密码重置验证',
    templateId: 'SMS_VERIFY_002',
    result: 'success',
    sendTime: '2026-07-07 10:20:15',
    responseCode: 'OK',
  },
  {
    id: '7',
    phone: '132****7890',
    templateName: '登录验证码',
    templateId: 'SMS_VERIFY_001',
    result: 'success',
    sendTime: '2026-07-07 09:10:00',
    responseCode: 'OK',
  },
  {
    id: '8',
    phone: '131****3456',
    templateName: '订单支付成功',
    templateId: 'SMS_NOTIFY_002',
    result: 'success',
    sendTime: '2026-07-07 08:55:30',
    responseCode: 'OK',
  },
  {
    id: '9',
    phone: '130****2345',
    templateName: '活动推广',
    templateId: 'SMS_MARKET_001',
    result: 'failed',
    sendTime: '2026-07-06 18:00:00',
    responseCode: 'ERR_301',
  },
  {
    id: '10',
    phone: '138****0123',
    templateName: '注册欢迎通知',
    templateId: 'SMS_NOTIFY_001',
    result: 'success',
    sendTime: '2026-07-06 16:30:00',
    responseCode: 'OK',
  },
])

const stats = computed(() => ({
  todaySent: smsHistory.value.filter(r => r.sendTime.startsWith('2026-07-07') && r.result === 'success').length,
  monthlySent: smsHistory.value.filter(r => r.sendTime.startsWith('2026-07') && r.result === 'success').length,
  remainingQuota: 8500,
}))

const historyTotalPages = computed(() => Math.ceil(filteredHistory.value.length / 10) || 1)

const filteredHistory = computed(() => {
  let result = [...smsHistory.value]

  if (searchPhone.value.trim()) {
    const kw = searchPhone.value.toLowerCase()
    result = result.filter(r => r.phone.toLowerCase().includes(kw))
  }

  if (templateFilter.value !== 'all') {
    result = result.filter(r => r.templateId.startsWith(templateFilter.value))
  }

  if (resultFilter.value !== 'all') {
    result = result.filter(r => r.result === resultFilter.value)
  }

  result.sort((a, b) => b.sendTime.localeCompare(a.sendTime))
  return result
})

function getTemplateStatusText(status: TemplateStatus): string {
  const map: Record<TemplateStatus, string> = {
    active: '已启用',
    inactive: '已停用',
    pending: '审核中',
  }
  return map[status]
}

function getTemplateStatusClass(status: TemplateStatus): string {
  const map: Record<TemplateStatus, string> = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
    inactive: 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  }
  return map[status]
}

function getTemplateStatusDotClass(status: TemplateStatus): string {
  const map: Record<TemplateStatus, string> = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    pending: 'bg-yellow-500',
  }
  return map[status]
}

function resetHistoryFilters() {
  searchPhone.value = ''
  templateFilter.value = 'all'
  resultFilter.value = 'all'
  historyPage.value = 1
}

function openTestDialog(template: SmsTemplate) {
  testTemplate.value = template
  testPhone.value = ''
  testResult.value = null
  showTestDialog.value = true
}

async function sendTestSms() {
  if (!testPhone.value.trim() || isSending.value) return

  isSending.value = true
  testResult.value = null

  await new Promise(resolve => setTimeout(resolve, 1500))

  testResult.value = Math.random() > 0.3 ? 'success' : 'failed'
  isSending.value = false
}
</script>