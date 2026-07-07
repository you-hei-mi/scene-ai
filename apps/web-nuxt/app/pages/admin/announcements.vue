<template>
  <div style="background: var(--bg-deep); min-height: 100vh">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-gradient text-2xl font-bold">运营公告管理</h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary)">管理系统公告和通知</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="openCreateDialog">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        发布公告
      </button>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">总公告数</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ stats.total }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(59, 130, 246, 0.12)">
            <UIcon name="lucide:megaphone" class="w-6 h-6" style="color: #3b82f6" />
          </div>
        </div>
      </div>

      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">已发布</p>
            <p class="text-2xl font-bold mt-1" style="color: #22c55e">{{ stats.published }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(34, 197, 94, 0.12)">
            <UIcon name="lucide:check-circle" class="w-6 h-6" style="color: #22c55e" />
          </div>
        </div>
      </div>

      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">草稿</p>
            <p class="text-2xl font-bold mt-1" style="color: #eab308">{{ stats.draft }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(234, 179, 8, 0.12)">
            <UIcon name="lucide:file-edit" class="w-6 h-6" style="color: #eab308" />
          </div>
        </div>
      </div>

      <div class="glass-card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm" style="color: var(--text-secondary)">今日浏览</p>
            <p class="text-2xl font-bold mt-1" style="color: var(--text-primary)">{{ stats.todayViews.toLocaleString() }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(249, 115, 22, 0.12)">
            <UIcon name="lucide:eye" class="w-6 h-6" style="color: #f97316" />
          </div>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="glass-card p-4 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <UInput v-model="searchKeyword" placeholder="搜索公告标题..." class="w-64">
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4" style="color: var(--text-secondary)" />
          </template>
        </UInput>
        <USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
        <USelect v-model="typeFilter" :options="typeOptions" class="w-44" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">
          重置筛选
        </button>
      </div>
    </div>

    <!-- 公告列表表格 -->
    <div class="glass-card" style="padding: 0">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border)">
              <th class="text-left px-4 py-3 text-sm font-medium" style="color: var(--text-secondary)">标题</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-28" style="color: var(--text-secondary)">类型</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-24" style="color: var(--text-secondary)">状态</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-36" style="color: var(--text-secondary)">发布时间</th>
              <th class="text-left px-4 py-3 text-sm font-medium w-24" style="color: var(--text-secondary)">浏览量</th>
              <th class="text-right px-4 py-3 text-sm font-medium w-24" style="color: var(--text-secondary)">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in filteredAnnouncements"
              :key="item.id"
              style="border-bottom: 1px solid var(--glass-border)"
              :style="item === filteredAnnouncements[filteredAnnouncements.length - 1] ? { borderBottom: 'none' } : {}"
            >
              <td class="px-4 py-3">
                <div class="flex items-center gap-2">
                  <UIcon
                    v-if="item.pinned"
                    name="lucide:pin"
                    class="w-4 h-4 flex-shrink-0"
                    style="color: #f97316"
                  />
                  <span class="font-medium text-sm" style="color: var(--text-primary)">{{ item.title }}</span>
                </div>
              </td>
              <td class="px-4 py-3">
                <UBadge :variant="getTypeBadgeVariant(item.type)" size="sm">
                  {{ getTypeText(item.type) }}
                </UBadge>
              </td>
              <td class="px-4 py-3">
                <UBadge :variant="getStatusBadgeVariant(item.status)" size="sm">
                  {{ getStatusText(item.status) }}
                </UBadge>
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-secondary)">
                {{ item.publishTime || '—' }}
              </td>
              <td class="px-4 py-3 text-sm" style="color: var(--text-secondary)">
                {{ item.views.toLocaleString() }}
              </td>
              <td class="px-4 py-3 text-right">
                <UDropdownMenu>
                  <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem">
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

      <!-- 空状态 -->
      <div v-if="filteredAnnouncements.length === 0" class="text-center py-12">
        <UIcon name="lucide:megaphone" class="w-12 h-12 mx-auto mb-3" style="color: var(--text-secondary)" />
        <p style="color: var(--text-secondary)">未找到匹配的公告</p>
      </div>

      <!-- 分页 -->
      <div class="flex items-center justify-between px-4 py-3" style="border-top: 1px solid var(--glass-border)">
        <div class="text-sm" style="color: var(--text-secondary)">
          共 {{ filteredAnnouncements.length }} 条公告
        </div>
        <div class="flex items-center gap-2">
          <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.5rem">
            <UIcon name="lucide:chevron-left" class="w-4 h-4" />
          </button>
          <span class="text-sm" style="color: var(--text-primary)">第 {{ currentPage }} / {{ totalPages }} 页</span>
          <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.5rem">
            <UIcon name="lucide:chevron-right" class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑公告对话框 -->
    <UDialog v-model="showDialog" :title="editingItem ? '编辑公告' : '发布公告'" size="xl">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">公告标题</label>
          <UInput v-model="formData.title" placeholder="输入公告标题" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">公告类型</label>
            <USelect v-model="formData.type" :options="typeSelectOptions" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">状态</label>
            <USelect v-model="formData.status" :options="statusSelectOptions" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">公告内容</label>
          <UTextarea v-model="formData.content" placeholder="输入公告内容..." rows="5" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5" style="color: var(--text-primary)">定时发布时间</label>
          <UInput v-model="formData.scheduledAt" type="datetime-local" />
          <p class="text-xs mt-1" style="color: var(--text-secondary)">留空表示立即发布（仅草稿状态生效）</p>
        </div>
        <div class="flex items-center gap-6">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.pinned" />
            <span class="text-sm" style="color: var(--text-primary)">置顶公告</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.sendNotification" />
            <span class="text-sm" style="color: var(--text-primary)">发送站内通知</span>
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

/**
 * 公告类型
 */
type AnnouncementType = 'system' | 'update' | 'activity' | 'maintenance'

/**
 * 公告状态
 */
type AnnouncementStatus = 'published' | 'draft' | 'expired'

/**
 * 公告接口定义
 */
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

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 状态筛选
 */
const statusFilter = ref('all')

/**
 * 类型筛选
 */
const typeFilter = ref('all')

/**
 * 当前页码
 */
const currentPage = ref(1)

/**
 * 是否显示对话框
 */
const showDialog = ref(false)

/**
 * 正在编辑的公告
 */
const editingItem = ref<Announcement | null>(null)

/**
 * 状态筛选选项
 */
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
  { label: '已过期', value: 'expired' },
]

/**
 * 类型筛选选项
 */
const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '系统公告', value: 'system' },
  { label: '版本更新', value: 'update' },
  { label: '活动通知', value: 'activity' },
  { label: '维护通知', value: 'maintenance' },
]

/**
 * 类型选择选项（表单用）
 */
const typeSelectOptions = [
  { label: '系统公告', value: 'system' },
  { label: '版本更新', value: 'update' },
  { label: '活动通知', value: 'activity' },
  { label: '维护通知', value: 'maintenance' },
]

/**
 * 状态选择选项（表单用）
 */
const statusSelectOptions = [
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' },
]

/**
 * 表单数据
 */
const formData = ref({
  title: '',
  type: 'system' as AnnouncementType,
  status: 'draft' as AnnouncementStatus,
  content: '',
  scheduledAt: '',
  pinned: false,
  sendNotification: false,
})

/**
 * 模拟公告数据
 */
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

/**
 * 统计数据
 */
const stats = computed(() => ({
  total: announcements.value.length,
  published: announcements.value.filter(a => a.status === 'published').length,
  draft: announcements.value.filter(a => a.status === 'draft').length,
  todayViews: 4285,
}))

/**
 * 总页数
 */
const totalPages = computed(() => Math.ceil(filteredAnnouncements.value.length / 10) || 1)

/**
 * 根据筛选条件过滤后的公告列表
 */
const filteredAnnouncements = computed(() => {
  let result = [...announcements.value]

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      a => a.title.toLowerCase().includes(kw) || a.content.toLowerCase().includes(kw)
    )
  }

  // 状态筛选
  if (statusFilter.value !== 'all') {
    result = result.filter(a => a.status === statusFilter.value)
  }

  // 类型筛选
  if (typeFilter.value !== 'all') {
    result = result.filter(a => a.type === typeFilter.value)
  }

  // 置顶公告优先排序
  result.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1
    if (!a.pinned && b.pinned) return 1
    return 0
  })

  return result
})

/**
 * 获取公告类型显示文本
 * @param type - 公告类型
 * @returns 类型显示文本
 */
function getTypeText(type: AnnouncementType): string {
  const map: Record<AnnouncementType, string> = {
    system: '系统公告',
    update: '版本更新',
    activity: '活动通知',
    maintenance: '维护通知',
  }
  return map[type]
}

/**
 * 获取公告类型徽章样式变体
 * @param type - 公告类型
 * @returns UBadge variant
 */
function getTypeBadgeVariant(type: AnnouncementType): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<AnnouncementType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    system: 'default',
    update: 'secondary',
    activity: 'outline',
    maintenance: 'destructive',
  }
  return map[type]
}

/**
 * 获取公告状态显示文本
 * @param status - 公告状态
 * @returns 状态显示文本
 */
function getStatusText(status: AnnouncementStatus): string {
  const map: Record<AnnouncementStatus, string> = {
    published: '已发布',
    draft: '草稿',
    expired: '已过期',
  }
  return map[status]
}

/**
 * 获取公告状态徽章样式变体
 * @param status - 公告状态
 * @returns UBadge variant
 */
function getStatusBadgeVariant(status: AnnouncementStatus): 'default' | 'secondary' | 'outline' {
  const map: Record<AnnouncementStatus, 'default' | 'secondary' | 'outline'> = {
    published: 'default',
    draft: 'secondary',
    expired: 'outline',
  }
  return map[status]
}

/**
 * 重置所有筛选条件
 */
function resetFilters() {
  searchKeyword.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
  currentPage.value = 1
}

/**
 * 打开创建公告对话框
 */
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

/**
 * 打开编辑公告对话框
 * @param item - 公告
 */
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

/**
 * 保存公告（新增或编辑）
 */
function saveAnnouncement() {
  if (editingItem.value) {
    // 编辑现有公告
    const item = announcements.value.find(a => a.id === editingItem.value!.id)
    if (item) {
      item.title = formData.value.title
      item.type = formData.value.type
      item.status = formData.value.status
      item.content = formData.value.content
      item.pinned = formData.value.pinned
      item.scheduledAt = formData.value.scheduledAt || null
      // 草稿转发布时设置发布时间
      if (formData.value.status === 'published' && !item.publishTime) {
        item.publishTime = formatNow()
      }
    }
  } else {
    // 新增公告
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

/**
 * 发布草稿公告
 * @param item - 公告
 */
function publishAnnouncement(item: Announcement) {
  item.status = 'published'
  item.publishTime = formatNow()
}

/**
 * 切换公告置顶状态
 * @param item - 公告
 */
function togglePin(item: Announcement) {
  item.pinned = !item.pinned
}

/**
 * 删除公告
 * @param item - 公告
 */
function deleteAnnouncement(item: Announcement) {
  const index = announcements.value.findIndex(a => a.id === item.id)
  if (index > -1) {
    announcements.value.splice(index, 1)
  }
}

/**
 * 格式化当前时间为可读字符串
 * @returns 格式化后的时间字符串
 */
function formatNow(): string {
  const d = new Date()
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}
</script>
