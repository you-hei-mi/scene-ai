<template>
  <div style="background: var(--bg-deep); min-height: 100vh">
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-display text-2xl font-bold text-gradient">通知中心</h1>
        <p class="text-sm mt-1" style="color: var(--text-secondary)">查看你的所有通知消息</p>
      </div>
      <button class="btn-glass" @click="markAllRead">
        <UIcon name="lucide:check-check" class="w-4 h-4" />
        全部标记已读
      </button>
    </div>

    <!-- 顶部标签页切换 -->
    <div class="flex items-center gap-2 mb-6" style="border-bottom: 1px solid var(--glass-border)">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="relative px-4 py-2.5 text-sm font-medium transition-colors -mb-px"
        :style="{ borderBottom: activeTab === tab.id ? '2px solid var(--accent-soft)' : '2px solid transparent', color: activeTab === tab.id ? 'var(--accent-soft-text)' : 'var(--text-secondary)' }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <UBadge
          v-if="tab.id === 'unread' && unreadCount > 0"
          color="red"
          size="sm"
          class="ml-1.5"
        >
          {{ unreadCount }}
        </UBadge>
      </button>
    </div>

    <!-- 通知类型筛选 -->
    <div class="flex flex-wrap items-center gap-2 mb-6">
      <button
        v-for="filter in typeFilters"
        :key="filter.id"
        class="btn-glass"
        :class="activeType === filter.id ? 'btn-glass--primary' : ''"
        @click="activeType = filter.id"
      >
        <UIcon :name="filter.icon" class="w-4 h-4" />
        {{ filter.label }}
      </button>
      <div class="flex-1"></div>
      <span class="text-sm" style="color: var(--text-secondary)">
        共 {{ filteredNotifications.length }} 条通知
      </span>
    </div>

    <!-- 通知列表 -->
    <div v-if="filteredNotifications.length > 0" class="glass-card" style="padding: 0">
      <div>
        <div
          v-for="(item, itemIndex) in filteredNotifications"
          :key="item.id"
          class="flex items-start gap-3 px-4 py-4 transition-colors"
          :style="{ borderBottom: itemIndex < filteredNotifications.length - 1 ? '1px solid var(--glass-border)' : 'none', background: !item.read ? 'var(--glass-bg-1)' : 'transparent' }"
        >
          <!-- 通知图标 -->
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            :style="{ background: item.type === 'system' ? 'rgba(59, 130, 246, 0.12)' : item.type === 'chat' ? 'rgba(34, 197, 94, 0.12)' : item.type === 'agent' ? 'rgba(168, 85, 247, 0.12)' : item.type === 'dataset' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(6, 182, 212, 0.12)' }"
          >
            <UIcon :name="getTypeIcon(item.type)" class="w-5 h-5" :style="{ color: item.type === 'system' ? '#3b82f6' : item.type === 'chat' ? '#22c55e' : item.type === 'agent' ? '#a855f7' : item.type === 'dataset' ? '#f97316' : '#06b6d4' }" />
          </div>

          <!-- 通知内容 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <p class="font-medium text-sm" :style="{ color: !item.read ? 'var(--text-primary)' : 'var(--text-secondary)' }">
                {{ item.title }}
              </p>
              <span
                v-if="!item.read"
                class="w-2 h-2 rounded-full flex-shrink-0"
                style="background: #3b82f6"
              ></span>
            </div>
            <p class="text-sm mt-1 line-clamp-2" style="color: var(--text-secondary)">{{ item.summary }}</p>
            <div class="flex items-center gap-3 mt-2">
              <span class="text-xs flex items-center gap-1" style="color: var(--text-secondary)">
                <UIcon name="lucide:clock" class="w-3 h-3" />
                {{ item.time }}
              </span>
              <UBadge :variant="getTypeBadgeVariant(item.type)" size="sm">
                {{ getTypeText(item.type) }}
              </UBadge>
            </div>
          </div>

          <!-- 操作按钮 -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <button
              v-if="!item.read"
              class="btn-glass"
              @click="markAsRead(item)"
            >
              <UIcon name="lucide:check" class="w-4 h-4" />
            </button>
            <button
              class="btn-glass"
              @click="deleteNotification(item)"
            >
              <UIcon name="lucide:trash-2" class="w-4 h-4" style="color: #ef4444" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="glass-card p-4">
      <div class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style="background: var(--glass-bg-1)">
          <UIcon name="lucide:bell-off" class="w-8 h-8" style="color: var(--text-secondary)" />
        </div>
        <h3 class="text-lg font-medium mb-2" style="color: var(--text-primary)">暂无通知</h3>
        <p style="color: var(--text-secondary)">当前筛选条件下没有通知消息</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 通知类型
 */
type NotificationType = 'system' | 'chat' | 'agent' | 'dataset' | 'team'

/**
 * 通知接口定义
 */
interface Notification {
  id: string
  type: NotificationType
  title: string
  summary: string
  time: string
  read: boolean
}

/**
 * 当前激活的标签页
 */
const activeTab = ref<'all' | 'unread' | 'read'>('all')

/**
 * 当前激活的类型筛选
 */
const activeType = ref<'all' | NotificationType>('all')

/**
 * 标签页定义
 */
const tabs = [
  { id: 'all' as const, label: '全部' },
  { id: 'unread' as const, label: '未读' },
  { id: 'read' as const, label: '已读' },
]

/**
 * 类型筛选选项
 */
const typeFilters = [
  { id: 'all' as const, label: '全部', icon: 'lucide:layers' },
  { id: 'system' as const, label: '系统通知', icon: 'lucide:settings' },
  { id: 'chat' as const, label: '对话', icon: 'lucide:message-square' },
  { id: 'agent' as const, label: 'Agent', icon: 'lucide:bot' },
  { id: 'dataset' as const, label: '知识库', icon: 'lucide:database' },
  { id: 'team' as const, label: '团队', icon: 'lucide:users' },
]

/**
 * 模拟通知数据
 */
const notifications = ref<Notification[]>([
  {
    id: '1',
    type: 'system',
    title: '系统升级通知',
    summary: '系统将于今晚 23:00 进行升级维护，预计耗时 30 分钟，期间部分功能可能不可用。',
    time: '5 分钟前',
    read: false,
  },
  {
    id: '2',
    type: 'agent',
    title: '智能体发布成功',
    summary: '你的智能体「代码助手」已成功发布到广场，目前已有 128 次使用。',
    time: '15 分钟前',
    read: false,
  },
  {
    id: '3',
    type: 'chat',
    title: '新消息提醒',
    summary: '张三在团队对话中提到了你：「@你 请看看这个方案是否可行」',
    time: '32 分钟前',
    read: false,
  },
  {
    id: '4',
    type: 'dataset',
    title: '知识库索引完成',
    summary: '知识库「产品文档」已完成索引，共处理 256 个文档，可以开始使用了。',
    time: '1 小时前',
    read: false,
  },
  {
    id: '5',
    type: 'team',
    title: '团队邀请',
    summary: '李四邀请你加入团队「设计组」，点击查看详情并接受邀请。',
    time: '2 小时前',
    read: false,
  },
  {
    id: '6',
    type: 'system',
    title: '账号安全提醒',
    summary: '检测到你的账号在新设备上登录，如非本人操作请及时修改密码。',
    time: '5 小时前',
    read: true,
  },
  {
    id: '7',
    type: 'agent',
    title: '智能体评论提醒',
    summary: '王五在你的智能体「翻译专家」下发表了评论：「非常好用，翻译准确！」',
    time: '昨天',
    read: true,
  },
  {
    id: '8',
    type: 'dataset',
    title: '文档处理失败',
    summary: '文档《年度报告.pdf》处理失败，可能是文件过大或格式不支持，请重试。',
    time: '昨天',
    read: true,
  },
])

/**
 * 未读通知数量
 */
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

/**
 * 根据标签页和类型筛选后的通知列表
 */
const filteredNotifications = computed(() => {
  let result = [...notifications.value]

  // 标签页筛选（已读/未读状态）
  if (activeTab.value === 'unread') {
    result = result.filter(n => !n.read)
  } else if (activeTab.value === 'read') {
    result = result.filter(n => n.read)
  }

  // 类型筛选
  if (activeType.value !== 'all') {
    result = result.filter(n => n.type === activeType.value)
  }

  return result
})

/**
 * 获取通知类型显示文本
 * @param type - 通知类型
 * @returns 类型显示文本
 */
function getTypeText(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    system: '系统通知',
    chat: '对话',
    agent: 'Agent',
    dataset: '知识库',
    team: '团队',
  }
  return map[type]
}

/**
 * 获取通知类型徽章样式变体
 * @param type - 通知类型
 * @returns UBadge variant
 */
function getTypeBadgeVariant(type: NotificationType): 'default' | 'secondary' | 'outline' | 'destructive' {
  const map: Record<NotificationType, 'default' | 'secondary' | 'outline' | 'destructive'> = {
    system: 'default',
    chat: 'secondary',
    agent: 'outline',
    dataset: 'secondary',
    team: 'outline',
  }
  return map[type]
}

/**
 * 获取通知类型对应的图标
 * @param type - 通知类型
 * @returns 图标名称
 */
function getTypeIcon(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    system: 'lucide:bell',
    chat: 'lucide:message-square',
    agent: 'lucide:bot',
    dataset: 'lucide:database',
    team: 'lucide:users',
  }
  return map[type]
}

/**
 * 获取通知类型对应的图标背景色
 * @param type - 通知类型
 * @returns Tailwind CSS 类名
 */
function getTypeIconBg(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    system: 'bg-blue-100 dark:bg-blue-900/30',
    chat: 'bg-green-100 dark:bg-green-900/30',
    agent: 'bg-purple-100 dark:bg-purple-900/30',
    dataset: 'bg-orange-100 dark:bg-orange-900/30',
    team: 'bg-cyan-100 dark:bg-cyan-900/30',
  }
  return map[type]
}

/**
 * 获取通知类型对应的图标颜色
 * @param type - 通知类型
 * @returns Tailwind CSS 类名
 */
function getTypeIconColor(type: NotificationType): string {
  const map: Record<NotificationType, string> = {
    system: 'text-blue-600 dark:text-blue-400',
    chat: 'text-green-600 dark:text-green-400',
    agent: 'text-purple-600 dark:text-purple-400',
    dataset: 'text-orange-600 dark:text-orange-400',
    team: 'text-cyan-600 dark:text-cyan-400',
  }
  return map[type]
}

/**
 * 标记单条通知为已读
 * @param item - 通知
 */
function markAsRead(item: Notification) {
  item.read = true
}

/**
 * 标记所有通知为已读
 */
function markAllRead() {
  notifications.value.forEach(n => {
    n.read = true
  })
}

/**
 * 删除通知
 * @param item - 通知
 */
function deleteNotification(item: Notification) {
  const index = notifications.value.findIndex(n => n.id === item.id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}
</script>
