<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">运营公告管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理系统公告和通知</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openCreateDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        发布公告
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总公告数</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.total }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:megaphone" class="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">已发布</p>
            <p class="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{{ stats.published }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:check-circle" class="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">草稿</p>
            <p class="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mt-2">{{ stats.draft }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30">
            <UIcon name="lucide:file-edit" class="w-7 h-7 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 transition-all duration-300 hover:shadow-lg">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">今日浏览</p>
            <p class="text-3xl font-bold text-slate-900 dark:text-white mt-2">{{ stats.todayViews.toLocaleString() }}</p>
          </div>
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
            <UIcon name="lucide:eye" class="w-7 h-7 text-orange-600 dark:text-orange-400" />
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
            placeholder="搜索公告标题..." 
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
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">标题</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-28">类型</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">状态</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-36">发布时间</th>
              <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">浏览量</th>
              <th class="text-right px-6 py-4 text-sm font-medium text-slate-500 w-24">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredAnnouncements"
              :key="item.id"
              class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <UIcon
                    v-if="item.pinned"
                    name="lucide:pin"
                    class="w-4 h-4 flex-shrink-0 text-orange-500"
                  />
                  <span class="font-medium text-sm text-slate-900 dark:text-white">{{ item.title }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <UBadge :variant="getTypeBadgeVariant(item.type)" size="sm">
                  {{ getTypeText(item.type) }}
                </UBadge>
              </td>
              <td class="px-6 py-4">
                <UBadge :variant="getStatusBadgeVariant(item.status)" size="sm">
                  {{ getStatusText(item.status) }}
                </UBadge>
              </td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ item.publishTime || '—' }}</td>
              <td class="px-6 py-4 text-sm text-slate-500">{{ item.views.toLocaleString() }}</td>
              <td class="px-6 py-4 text-right">
                <UDropdownMenu>
                  <button class="btn-glass p-2">
                    <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                  </button>
                  <template #items>
                    <UDropdownMenuItem label="编辑公告" icon="lucide:edit" @click="openEditDialog(item)" />
                    <UDropdownMenuItem
                      v-if="item.status === 'draft'"
                      label="发布公告"
                      icon="lucide:send"
                      color="green"
                      @click="publishAnnouncement(item)"
                    />
                    <UDropdownMenuItem label="置顶/取消置顶" icon="lucide:pin" @click="togglePin(item)" />
                    <UDropdownMenuItem label="删除公告" icon="lucide:trash-2" color="red" @click="deleteAnnouncement(item)" />
                  </template>
                </UDropdownMenu>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredAnnouncements.length === 0" class="text-center py-12">
        <UIcon name="lucide:megaphone" class="w-12 h-12 mx-auto mb-3 text-slate-400" />
        <p class="text-slate-500">未找到匹配的公告</p>
      </div>

      <div class="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-700/30">
        <div class="text-sm text-slate-500">
          共 {{ filteredAnnouncements.length }} 条公告
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

    <UDialog v-model="showDialog" :title="editingItem ? '编辑公告' : '发布公告'" size="xl">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公告标题</label>
          <UInput v-model="formData.title" placeholder="输入公告标题" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公告类型</label>
            <USelect v-model="formData.type" :options="typeSelectOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">状态</label>
            <USelect v-model="formData.status" :options="statusSelectOptions" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公告内容</label>
          <UTextarea v-model="formData.content" placeholder="输入公告内容..." rows="5" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">定时发布时间</label>
          <UInput v-model="formData.scheduledAt" type="datetime-local" />
          <p class="text-xs mt-1 text-slate-500">留空表示立即发布（仅草稿状态生效）</p>
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.pinned" />
            <span class="text-sm text-slate-700 dark:text-slate-300">置顶公告</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.sendNotification" />
            <span class="text-sm text-slate-700 dark:text-slate-300">发送站内通知</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveAnnouncement">{{ editingItem ? '保存' : '发布' }}</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

type AnnouncementType = 'system' | 'update' | 'activity' | 'maintenance'
type AnnouncementStatus = 'published' | 'draft' | 'expired'

interface Announcement {
  id: string
  title: string
  type: AnnouncementType
  status: AnnouncementStatus
  content: string
  publishTime: string | null
  views: number
  pinned: boolean
  scheduledAt: string | null
}

const searchKeyword = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const currentPage = ref(1)
const showDialog = ref(false)
const editingItem = ref<Announcement | null>(null)

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已过期', value: 'expired' },
]

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '系统公告', value: 'system' },
  { label: '版本更新', value: 'update' },
  { label: '活动通知', value: 'activity' },
  { label: '维护通知', value: 'maintenance' },
]

const typeSelectOptions = [
  { label: '系统公告', value: 'system' },
  { label: '版本更新', value: 'update' },
  { label: '活动通知', value: 'activity' },
  { label: '维护通知', value: 'maintenance' },
]

const statusSelectOptions = [
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
]

const formData = ref({
  title: '',
  type: 'system' as AnnouncementType,
  status: 'draft' as AnnouncementStatus,
  content: '',
  scheduledAt: '',
  pinned: false,
  sendNotification: false,
})

const announcements = ref<Announcement[]>([
  {
    id: '1',
    title: '系统升级公告：v26.1.1 版本发布',
    type: 'update',
    status: 'published',
    content: '我们已于今日完成系统升级至 v26.1.1 版本，本次升级带来更流畅的对话体验和更强大的 Agent 编排能力。',
    publishTime: '2026-07-06 10:00',
    views: 3528,
    pinned: true,
    scheduledAt: null,
  },
  {
    id: '2',
    title: '暑期活动：智能体创作大赛开启',
    type: 'activity',
    status: 'published',
    content: '为期一个月的智能体创作大赛正式开启，参与即有机会赢取丰厚奖品，快来展示你的创意吧！',
    publishTime: '2026-07-01 09:00',
    views: 1842,
    pinned: false,
    scheduledAt: null,
  },
  {
    id: '3',
    title: '系统维护通知：本周日凌晨停服 2 小时',
    type: 'maintenance',
    status: 'published',
    content: '为提供更稳定的服务，我们将于本周日凌晨 2:00-4:00 进行系统维护，期间服务将暂时不可用。',
    publishTime: '2026-06-28 18:00',
    views: 2156,
    pinned: false,
    scheduledAt: null,
  },
  {
    id: '4',
    title: '关于优化知识库检索能力的说明',
    type: 'system',
    status: 'published',
    content: '我们已对知识库检索引擎进行优化，检索准确率提升 30%，响应速度提升 50%。',
    publishTime: '2026-06-20 14:00',
    views: 987,
    pinned: false,
    scheduledAt: null,
  },
  {
    id: '5',
    title: '新功能预告：MCP 工具市场即将上线',
    type: 'update',
    status: 'draft',
    content: 'MCP 工具市场即将上线，届时将支持一键安装各类外部工具，敬请期待。',
    publishTime: null,
    views: 0,
    pinned: false,
    scheduledAt: '2026-07-10 10:00',
  },
  {
    id: '6',
    title: '五一假期客服响应延迟通知',
    type: 'system',
    status: 'expired',
    content: '五一假期期间，客服响应时间可能延长至 24 小时，感谢您的理解与支持。',
    publishTime: '2026-04-28 16:00',
    views: 4321,
    pinned: false,
    scheduledAt: null,
  },
])

const stats = computed(() => ({
  total: announcements.value.length,
  published: announcements.value.filter(a => a.status === 'published').length,
  draft: announcements.value.filter(a => a.status === 'draft').length,
  todayViews: 4285,
}))

const totalPages = computed(() => Math.ceil(filteredAnnouncements.value.length / 10) || 1)

const filteredAnnouncements = computed(() => {
  let result = [...announcements.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      a => a.title.toLowerCase().includes(kw) || a.content.toLowerCase().includes(kw)
    )
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(a => a.status === statusFilter.value)
  }

  if (typeFilter.value !== 'all') {
    result = result.filter(a => a.type === typeFilter.value)
  }

  result.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return result
})

function getTypeText(type: AnnouncementType): string {
  const map: Record<AnnouncementType, string> = {
    system: '系统公告',
    update: '版本更新',
    activity: '活动通知',
    maintenance: '维护通知',
  }
  return map[type]
}

function getTypeBadgeVariant(type: AnnouncementType): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<AnnouncementType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    system: 'default',
    update: 'secondary',
    activity: 'outline',
    maintenance: 'destructive',
  }
  return map[type]
}

function getStatusText(status: AnnouncementStatus): string {
  const map: Record<AnnouncementStatus, string> = {
    published: '已发布',
    draft: '草稿',
    expired: '已过期',
  }
  return map[status]
}

function getStatusBadgeVariant(status: AnnouncementStatus): 'default' | 'secondary' | 'outline' {
  const map: Record<AnnouncementStatus, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    expired: 'outline',
  }
  return map[status]
}

function resetFilters() {
  searchKeyword.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
  currentPage.value = 1
}

function openCreateDialog() {
  editingItem.value = null
  formData.value = {
    title: '',
    type: 'system',
    status: 'draft',
    content: '',
    scheduledAt: '',
    pinned: false,
    sendNotification: false,
  }
  showDialog.value = true
}

function openEditDialog(item: Announcement) {
  editingItem.value = item
  formData.value = {
    title: item.title,
    type: item.type,
    status: item.status === 'expired' ? 'draft' : item.status,
    content: item.content,
    scheduledAt: item.scheduledAt || '',
    pinned: item.pinned,
    sendNotification: false,
  }
  showDialog.value = true
}

function saveAnnouncement() {
  if (editingItem.value) {
    const item = announcements.value.find(a => a.id === editingItem.value!.id)
    if (item) {
      item.title = formData.value.title
      item.type = formData.value.type
      item.status = formData.value.status
      item.content = formData.value.content
      item.pinned = formData.value.pinned
      item.scheduledAt = formData.value.scheduledAt || null
      if (formData.value.status === 'published' && !item.publishTime) {
        item.publishTime = formatNow()
      }
    }
  } else {
    const newItem: Announcement = {
      id: Date.now().toString(),
      title: formData.value.title,
      type: formData.value.type,
      status: formData.value.status,
      content: formData.value.content,
      publishTime: formData.value.status === 'published' ? formatNow() : null,
      views: 0,
      pinned: formData.value.pinned,
      scheduledAt: formData.value.scheduledAt || null,
    }
    announcements.value.unshift(newItem)
  }

  showDialog.value = false
}

function publishAnnouncement(item: Announcement) {
  item.status = 'published'
  item.publishTime = formatNow()
}

function togglePin(item: Announcement) {
  item.pinned = !item.pinned
}

function deleteAnnouncement(item: Announcement) {
  const index = announcements.value.findIndex(a => a.id === item.id)
  if (index > -1) {
    announcements.value.splice(index, 1)
  }
}

function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>