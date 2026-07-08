<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">通知管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">通知设置</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="saveSettings" :disabled="saving">
        <UIcon v-if="saving" name="lucide:loader" class="w-4 h-4 animate-spin" />
        <template v-else>
          <UIcon name="lucide:save" class="w-4 h-4" />
        </template>
        {{ saving ? '保存中...' : '保存设置' }}
      </button>
    </div>

    <div class="mb-6">
      <div class="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
        <NuxtLink
          to="/admin/notice/sms"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white"
        >
          短信通知
        </NuxtLink>
        <NuxtLink
          to="/admin/notice/notification-settings"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
        >
          通知设置
        </NuxtLink>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="lucide:loader" class="w-8 h-8 animate-spin text-primary" />
      <span class="ml-3 text-slate-500">加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
      <div class="flex items-center gap-2">
        <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ error }}</span>
      </div>
      <button class="btn-glass mt-3 text-sm" @click="fetchSettings">重试</button>
    </div>

    <template v-else>
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">通知渠道配置</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="channel in notificationChannels"
            :key="channel.id"
            class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg"
          >
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-xl flex items-center justify-center"
                  :class="channel.iconBg"
                >
                  <UIcon :name="channel.icon" class="w-6 h-6" :class="channel.iconColor" />
                </div>
                <div>
                  <p class="font-medium text-slate-900 dark:text-white">{{ channel.name }}</p>
                  <p class="text-xs text-slate-500">{{ channel.description }}</p>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-500">启用状态</span>
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="channel.enabled"
                  class="sr-only peer"
                  @change="toggleChannel(channel.id)"
                />
                <div class="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-primary"></div>
              </label>
            </div>
            <div v-if="channel.id === 'email'" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">SMTP 配置</span>
                <span class="text-green-600 dark:text-green-400 font-medium">已配置</span>
              </div>
            </div>
            <div v-if="channel.id === 'sms'" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">服务商</span>
                <span class="text-slate-700 dark:text-slate-300">阿里云短信</span>
              </div>
            </div>
            <div v-if="channel.id === 'wechat'" class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <div class="flex justify-between text-xs">
                <span class="text-slate-500">公众号</span>
                <span class="text-slate-700 dark:text-slate-300">已绑定</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">事件通知设置</h2>
        <div class="space-y-4">
          <div
            v-for="event in notificationEvents"
            :key="event.id"
            class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
          >
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex items-start gap-4">
                  <div
                    class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    :class="event.iconBg"
                  >
                    <UIcon :name="event.icon" class="w-5 h-5" :class="event.iconColor" />
                  </div>
                  <div>
                    <h3 class="font-medium text-slate-900 dark:text-white">{{ event.name }}</h3>
                    <p class="text-sm text-slate-500 mt-1">{{ event.description }}</p>
                  </div>
                </div>
                <label class="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    :checked="event.enabled"
                    class="sr-only peer"
                    @change="toggleEvent(event.id)"
                  />
                  <div class="w-10 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:after:border-slate-600 peer-checked:bg-primary"></div>
                </label>
              </div>

              <div v-if="event.enabled" class="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">通知渠道</p>
                <div class="flex flex-wrap gap-4">
                  <label
                    v-for="channel in event.channels"
                    :key="channel.id"
                    class="flex items-center gap-2 cursor-pointer"
                  >
                    <UCheckbox :modelValue="channel.selected" @change="toggleEventChannel(event.id, channel.id)" />
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ channel.name }}</span>
                  </label>
                </div>
              </div>

              <div v-if="event.enabled && event.subEvents.length > 0" class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                <p class="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">具体事件</p>
                <div class="space-y-2">
                  <div
                    v-for="sub in event.subEvents"
                    :key="sub.id"
                    class="flex items-center justify-between py-1.5"
                  >
                    <span class="text-sm text-slate-600 dark:text-slate-400">{{ sub.name }}</span>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        :checked="sub.enabled"
                        class="sr-only peer"
                        @change="toggleSubEvent(event.id, sub.id)"
                      />
                      <div class="w-9 h-4.5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all dark:after:border-slate-600 peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 flex items-center justify-end gap-3">
        <button class="btn-glass" @click="resetSettings">
          <UIcon name="lucide:rotate-ccw" class="w-4 h-4" />
          恢复默认
        </button>
        <button class="btn-glass btn-glass--primary" @click="saveSettings" :disabled="saving">
          <UIcon v-if="saving" name="lucide:loader" class="w-4 h-4 animate-spin" />
          <template v-else>
            <UIcon name="lucide:save" class="w-4 h-4" />
          </template>
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </template>

    <div
      v-if="saveMessage"
      class="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg transition-all duration-300"
      :class="saveMessage.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'"
    >
      <UIcon :name="saveMessage.type === 'success' ? 'lucide:check-circle' : 'lucide:alert-circle'" class="w-5 h-5" />
      <span class="text-sm font-medium">{{ saveMessage.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getNotificationSettings, updateNotificationSettings } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface NotificationChannel {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  enabled: boolean
}

interface EventChannel {
  id: string
  name: string
  selected: boolean
}

interface SubEvent {
  id: string
  name: string
  enabled: boolean
}

interface NotificationEvent {
  id: string
  name: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  enabled: boolean
  channels: EventChannel[]
  subEvents: SubEvent[]
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const saveMessage = ref<{ type: 'success' | 'error'; text: string } | null>(null)

const notificationChannels = ref<NotificationChannel[]>([
  {
    id: 'inapp',
    name: '站内信',
    description: '系统内消息通知',
    icon: 'lucide:bell',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    enabled: true,
  },
  {
    id: 'email',
    name: '邮件通知',
    description: '通过邮件发送通知',
    icon: 'lucide:mail',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    enabled: true,
  },
  {
    id: 'sms',
    name: '短信通知',
    description: '通过短信发送通知',
    icon: 'lucide:smartphone',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    enabled: true,
  },
  {
    id: 'wechat',
    name: '微信通知',
    description: '微信模板消息推送',
    icon: 'lucide:message-circle',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    enabled: false,
  },
])

const notificationEvents = ref<NotificationEvent[]>([
  {
    id: 'system',
    name: '系统通知',
    description: '系统维护、版本更新、公告发布等系统级通知',
    icon: 'lucide:settings',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    enabled: true,
    channels: [
      { id: 'inapp', name: '站内信', selected: true },
      { id: 'email', name: '邮件', selected: true },
      { id: 'sms', name: '短信', selected: false },
      { id: 'wechat', name: '微信', selected: false },
    ],
    subEvents: [
      { id: 'system-maintenance', name: '系统维护通知', enabled: true },
      { id: 'system-update', name: '版本更新通知', enabled: true },
      { id: 'system-announcement', name: '公告发布通知', enabled: true },
      { id: 'system-policy', name: '政策变更通知', enabled: false },
    ],
  },
  {
    id: 'order',
    name: '订单通知',
    description: '订单支付、退款、发货等订单相关通知',
    icon: 'lucide:receipt',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    enabled: true,
    channels: [
      { id: 'inapp', name: '站内信', selected: true },
      { id: 'email', name: '邮件', selected: true },
      { id: 'sms', name: '短信', selected: true },
      { id: 'wechat', name: '微信', selected: false },
    ],
    subEvents: [
      { id: 'order-created', name: '订单创建通知', enabled: true },
      { id: 'order-paid', name: '支付成功通知', enabled: true },
      { id: 'order-refund', name: '退款处理通知', enabled: true },
      { id: 'order-expired', name: '订单过期通知', enabled: false },
    ],
  },
  {
    id: 'agent',
    name: 'Agent 通知',
    description: 'Agent 创建、配置变更、异常告警等通知',
    icon: 'lucide:bot',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    enabled: true,
    channels: [
      { id: 'inapp', name: '站内信', selected: true },
      { id: 'email', name: '邮件', selected: false },
      { id: 'sms', name: '短信', selected: false },
      { id: 'wechat', name: '微信', selected: false },
    ],
    subEvents: [
      { id: 'agent-created', name: 'Agent 创建通知', enabled: true },
      { id: 'agent-error', name: 'Agent 异常告警', enabled: true },
      { id: 'agent-quota', name: '调用额度预警', enabled: true },
      { id: 'agent-update', name: 'Agent 更新通知', enabled: false },
    ],
  },
  {
    id: 'security',
    name: '安全通知',
    description: '登录异常、密码修改、账号安全等安全相关通知',
    icon: 'lucide:shield',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
    enabled: true,
    channels: [
      { id: 'inapp', name: '站内信', selected: true },
      { id: 'email', name: '邮件', selected: true },
      { id: 'sms', name: '短信', selected: true },
      { id: 'wechat', name: '微信', selected: false },
    ],
    subEvents: [
      { id: 'security-login', name: '异常登录通知', enabled: true },
      { id: 'security-password', name: '密码修改通知', enabled: true },
      { id: 'security-device', name: '新设备登录通知', enabled: true },
      { id: 'security-account', name: '账号绑定变更通知', enabled: true },
    ],
  },
])

function toggleChannel(channelId: string) {
  const channel = notificationChannels.value.find(c => c.id === channelId)
  if (channel) {
    channel.enabled = !channel.enabled
  }
}

function toggleEvent(eventId: string) {
  const event = notificationEvents.value.find(e => e.id === eventId)
  if (event) {
    event.enabled = !event.enabled
  }
}

function toggleEventChannel(eventId: string, channelId: string) {
  const event = notificationEvents.value.find(e => e.id === eventId)
  if (event) {
    const channel = event.channels.find(c => c.id === channelId)
    if (channel) {
      channel.selected = !channel.selected
    }
  }
}

function toggleSubEvent(eventId: string, subEventId: string) {
  const event = notificationEvents.value.find(e => e.id === eventId)
  if (event) {
    const sub = event.subEvents.find(s => s.id === subEventId)
    if (sub) {
      sub.enabled = !sub.enabled
    }
  }
}

function resetSettings() {
  notificationChannels.value.forEach(c => {
    c.enabled = c.id !== 'wechat'
  })
  notificationEvents.value.forEach(e => {
    e.enabled = true
    e.channels.forEach(c => {
      c.selected = c.id === 'inapp' || c.id === 'email'
    })
    e.subEvents.forEach(s => {
      s.enabled = true
    })
  })
  showSaveMessage('success', '已恢复默认设置')
}

async function saveSettings() {
  if (saving.value) return
  saving.value = true
  error.value = null
  try {
    const channels: any = {}
    notificationChannels.value.forEach(c => {
      const key = c.id === 'inapp' ? 'inApp' : c.id
      channels[key] = { enabled: c.enabled }
    })

    const events: any = {}
    notificationEvents.value.forEach(e => {
      const subEvents: Record<string, boolean> = {}
      e.subEvents.forEach(s => { subEvents[s.id] = s.enabled })
      events[e.id] = {
        enabled: e.enabled,
        channels: e.channels.filter(c => c.selected).map(c => c.id),
        subEvents,
      }
    })

    await updateNotificationSettings({
      channels,
      events,
    } as any)
    showSaveMessage('success', '通知设置已保存')
  } catch (e: any) {
    const msg = e.message || '保存通知设置失败'
    error.value = msg
    showSaveMessage('error', msg)
  } finally {
    saving.value = false
  }
}

function showSaveMessage(type: 'success' | 'error', text: string) {
  saveMessage.value = { type, text }
  setTimeout(() => {
    saveMessage.value = null
  }, 3000)
}

async function fetchSettings() {
  loading.value = true
  error.value = null
  try {
    const data = await getNotificationSettings()
    if (data) {
      if (data.channels) {
        const ch = data.channels as any
        notificationChannels.value.forEach(c => {
          const key = c.id === 'inapp' ? 'inApp' : c.id
          if (ch[key] !== undefined) {
            c.enabled = ch[key].enabled ?? c.enabled
          }
        })
      }
      if (data.events) {
        const ev = data.events as any
        notificationEvents.value.forEach(e => {
          const eventData = ev[e.id]
          if (eventData) {
            e.enabled = eventData.enabled ?? e.enabled
            if (eventData.channels) {
              e.channels.forEach(c => {
                c.selected = eventData.channels.includes(c.id)
              })
            }
            if (eventData.subEvents) {
              e.subEvents.forEach(s => {
                s.enabled = eventData.subEvents[s.id] ?? s.enabled
              })
            }
          }
        })
      }
    }
  } catch (e: any) {
    error.value = e.message || '加载通知设置失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSettings()
})
</script>