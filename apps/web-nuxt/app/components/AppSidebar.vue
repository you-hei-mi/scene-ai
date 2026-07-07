<template>
  <aside
    class="border-r border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl flex flex-col transition-all duration-300 ease-out"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex items-center h-14 px-4 border-b border-slate-200 dark:border-slate-700">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
        <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
      </div>
      <span v-if="!collapsed" class="ml-3 font-bold text-base bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BuildingAI</span>
    </div>
    <nav class="flex-1 p-3 overflow-y-auto">
      <ul class="space-y-1">
        <template v-for="item in menuItems" :key="item.to || item.label">
          <!-- 有子菜单的菜单项 -->
          <li v-if="item.children">
            <button
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 w-full text-left"
              :class="[
                isActive(item.to!)
                  ? 'text-primary'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white',
                collapsed ? 'justify-center' : ''
              ]"
              @click="toggleSubmenu(item.label)"
            >
              <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!collapsed" class="truncate flex-1">{{ item.label }}</span>
              <UIcon
                v-if="!collapsed"
                name="lucide:chevron-right"
                class="w-4 h-4 transition-transform duration-200"
                :class="expandedMenus.has(item.label) ? 'rotate-90' : ''"
              />
            </button>
            <ul v-if="!collapsed && expandedMenus.has(item.label)" class="ml-3 mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 pl-3">
              <li v-for="child in item.children" :key="child.to">
                <NuxtLink
                  :to="child.to"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200"
                  :class="
                    route.path === child.to || route.path.startsWith(child.to + '/')
                      ? 'bg-primary/10 text-primary font-semibold'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                  "
                >
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    :class="route.path === child.to || route.path.startsWith(child.to + '/') ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'"
                  ></span>
                  <span class="truncate">{{ child.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
          <!-- 无子菜单的菜单项 -->
          <li v-else>
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              :class="[
                isActive(item.to)
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white',
                collapsed ? 'justify-center' : ''
              ]"
            >
              <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!collapsed" class="truncate">{{ item.label }}</span>
            </NuxtLink>
          </li>
        </template>
      </ul>
    </nav>
    <div v-if="!collapsed" class="p-4 border-t border-slate-200 dark:border-slate-700">
      <div class="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-3 border border-primary/10">
        <p class="text-xs text-slate-500 dark:text-slate-400 mb-1">当前版本</p>
        <p class="text-sm font-semibold text-primary">v1.0.0</p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface MenuItem {
  label: string
  to?: string
  icon: string
  children?: MenuItem[]
}

interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const route = useRoute()

const expandedMenus = ref(new Set<string>(['管理后台']))

const menuItems: MenuItem[] = [
  {
    label: '对话',
    to: '/chat',
    icon: 'lucide:message-square',
  },
  {
    label: 'Agents',
    to: '/agents',
    icon: 'lucide:bot',
  },
  {
    label: 'Agent工作台',
    to: '/agents/workspace',
    icon: 'lucide:grid-3x3',
  },
  {
    label: '知识库',
    to: '/datasets',
    icon: 'lucide:database',
  },
  {
    label: '应用中心',
    to: '/apps',
    icon: 'lucide:puzzle',
  },
  {
    label: 'MCP 服务',
    to: '/mcp',
    icon: 'lucide:plug',
  },
  {
    label: '管理后台',
    icon: 'lucide:layout-dashboard',
    children: [
      { label: '仪表盘', to: '/admin', icon: 'lucide:gauge' },
      { label: '数据分析', to: '/admin/analytics', icon: 'lucide:bar-chart-3' },
      { label: '公告管理', to: '/admin/announcements', icon: 'lucide:megaphone' },
      { label: '用户管理', to: '/admin/users', icon: 'lucide:users' },
      { label: '模型管理', to: '/admin/models', icon: 'lucide:cpu' },
      { label: '系统设置', to: '/admin/settings', icon: 'lucide:sliders' },
      { label: '运营中心', to: '/admin/operation', icon: 'lucide:shopping-bag' },
      { label: '装修中心', to: '/admin/decorate/apps', icon: 'lucide:palette' },
      { label: '对话管理', to: '/admin/chat/record', icon: 'lucide:messages-square' },
      { label: '订单管理', to: '/admin/order/membership', icon: 'lucide:receipt' },
      { label: '通知管理', to: '/admin/notice/sms', icon: 'lucide:bell' },
      { label: '渠道管理', to: '/admin/channel/wechat-oa', icon: 'lucide:share-2' },
      { label: '财务管理', to: '/admin/financial/analysis', icon: 'lucide:dollar-sign' },
      { label: '权限管理', to: '/admin/access/menu', icon: 'lucide:shield' },
      { label: '全局配置', to: '/admin/system/agreement', icon: 'lucide:wrench' },
    ],
  },
  {
    label: '帮助中心',
    to: '/help',
    icon: 'lucide:help-circle',
  },
  {
    label: '设置',
    to: '/settings',
    icon: 'lucide:settings',
  },
]

function isActive(path: string) {
  return route.path.startsWith(path)
}

function toggleSubmenu(label: string) {
  const s = new Set(expandedMenus.value)
  if (s.has(label)) {
    s.delete(label)
  } else {
    s.add(label)
  }
  expandedMenus.value = s
}
</script>