<template>
  <aside
    class="border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col transition-all duration-300 ease-out h-full"
    :class="collapsed ? 'w-16' : 'w-60'"
  >
    <!-- 顶部标题 -->
    <div class="flex items-center justify-between h-14 px-4 border-b border-slate-200 dark:border-slate-700">
      <div v-if="!collapsed" class="flex items-center gap-2 min-w-0">
        <NuxtLink
          to="/chat"
          class="font-medium inline-flex items-center text-xs gap-1.5 text-primary hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200 p-1.5 flex-shrink-0"
        >
          <UIcon name="lucide:panel-left" class="w-4 h-4" />
        </NuxtLink>
        <div class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <UIcon name="lucide:bot" class="w-4 h-4 text-white" />
        </div>
        <div class="leading-tight min-w-0">
          <p class="text-sm font-bold text-slate-900 dark:text-white truncate">BuildingAI</p>
          <p class="text-xs text-slate-400 truncate">工作台 · v26.2.1</p>
        </div>
      </div>
      <div v-else class="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
        <UIcon name="lucide:bot" class="w-4 h-4 text-white" />
      </div>
      <!-- 展开状态显示收起按钮 -->
      <UButton
        v-if="!collapsed"
        variant="ghost"
        size="xs"
        icon="lucide:panel-left-close"
        class="text-slate-400 hover:text-slate-600 flex-shrink-0"
        @click="appStore.toggleSidebar()"
      />
    </div>

    <!-- 菜单 -->
    <nav class="flex-1 px-3 py-2 overflow-y-auto">
      <ul class="space-y-0.5">
        <!-- 数据看板 -->
        <li>
          <NuxtLink
            to="/admin"
            exact
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              route.path === '/admin'
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:line-chart" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">数据看板</span>
          </NuxtLink>
        </li>

        <!-- 工作空间 分组标题 -->
        <li v-if="!collapsed" class="pt-3 pb-1">
          <p class="px-3 text-xs text-slate-400">工作空间</p>
        </li>

        <!-- 智能体 -->
        <li>
          <button
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left"
            :class="[
              hasActiveChild(workspaceMenu[0])
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
            @click="toggleSubmenu('智能体')"
          >
            <UIcon name="lucide:bot" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate flex-1">智能体</span>
            <UIcon
              v-if="!collapsed"
              name="lucide:chevron-down"
              class="w-4 h-4 transition-transform duration-200"
              :class="expandedMenus.has('智能体') ? 'rotate-180' : ''"
            />
          </button>
          <ul
            v-if="!collapsed && expandedMenus.has('智能体')"
            class="mt-0.5 space-y-0.5 ml-6 border-l border-slate-200 dark:border-slate-700 pl-3"
          >
            <li>
              <NuxtLink
                to="/admin/agents"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="route.path === '/admin/agents' ? 'text-primary font-medium bg-primary/5 dark:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0"></span>
                <span class="truncate">智能体列表</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/agents/configuration"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="route.path === '/admin/agents/configuration' ? 'text-primary font-medium bg-primary/5 dark:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0"></span>
                <span class="truncate">智能体配置</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- 知识库 -->
        <li>
          <button
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left"
            :class="[
              hasActiveChild(workspaceMenu[1])
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
            @click="toggleSubmenu('知识库')"
          >
            <UIcon name="lucide:library" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate flex-1">知识库</span>
            <UIcon
              v-if="!collapsed"
              name="lucide:chevron-down"
              class="w-4 h-4 transition-transform duration-200"
              :class="expandedMenus.has('知识库') ? 'rotate-180' : ''"
            />
          </button>
          <ul
            v-if="!collapsed && expandedMenus.has('知识库')"
            class="mt-0.5 space-y-0.5 ml-6 border-l border-slate-200 dark:border-slate-700 pl-3"
          >
            <li>
              <NuxtLink
                to="/admin/datasets"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="route.path === '/admin/datasets' ? 'text-primary font-medium bg-primary/5 dark:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0"></span>
                <span class="truncate">知识库列表</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/admin/datasets/configuration"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                :class="route.path === '/admin/datasets/configuration' ? 'text-primary font-medium bg-primary/5 dark:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
              >
                <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0"></span>
                <span class="truncate">知识库配置</span>
              </NuxtLink>
            </li>
          </ul>
        </li>

        <!-- MCP -->
        <li>
          <NuxtLink
            to="/admin/mcp"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/admin/mcp')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:puzzle" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">MCP</span>
          </NuxtLink>
        </li>

        <!-- 模型厂商 -->
        <li>
          <NuxtLink
            to="/admin/models"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/admin/models')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:cpu" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">模型厂商</span>
          </NuxtLink>
        </li>

        <!-- 密钥管理 -->
        <li>
          <NuxtLink
            to="/admin/key-management"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/admin/key-management')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:key-round" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">密钥管理</span>
          </NuxtLink>
        </li>

        <!-- 应用管理 -->
        <li>
          <NuxtLink
            to="/admin/apps"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/admin/apps')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:layout-grid" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">应用管理</span>
          </NuxtLink>
        </li>

        <!-- 系统管理 分组标题 -->
        <li v-if="!collapsed" class="pt-4 pb-1">
          <p class="px-3 text-xs text-slate-400">系统管理</p>
        </li>

        <!-- 动态渲染系统管理菜单 -->
        <template v-for="item in systemMenu" :key="item.label">
          <!-- 有子菜单 -->
          <li v-if="item.children">
            <button
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left"
              :class="[
                hasActiveChild(item)
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
                collapsed ? 'justify-center' : ''
              ]"
              @click="toggleSubmenu(item.label)"
            >
              <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
              <span v-if="!collapsed" class="truncate flex-1">{{ item.label }}</span>
              <UIcon
                v-if="!collapsed"
                name="lucide:chevron-down"
                class="w-4 h-4 transition-transform duration-200"
                :class="expandedMenus.has(item.label) ? 'rotate-180' : ''"
              />
            </button>
            <ul
              v-if="!collapsed && expandedMenus.has(item.label)"
              class="mt-0.5 space-y-0.5 ml-6 border-l border-slate-200 dark:border-slate-700 pl-3"
            >
              <li v-for="child in item.children" :key="child.to">
                <NuxtLink
                  :to="child.to"
                  class="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all duration-200"
                  :class="route.path === child.to ? 'text-primary font-medium bg-primary/5 dark:bg-primary/10' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-current opacity-50 flex-shrink-0"></span>
                  <span class="truncate">{{ child.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </li>
          <!-- 无子菜单 -->
          <li v-else>
            <NuxtLink
              :to="item.to"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                isActive(item.to)
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
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

    <!-- 底部 -->
    <div class="border-t border-slate-200 dark:border-slate-700 p-3">
      <!-- 收起状态：展开按钮和用户信息同级 -->
      <div v-if="collapsed" class="flex flex-col items-center gap-2">
        <UButton
          variant="ghost"
          size="xs"
          icon="lucide:panel-right"
          class="text-slate-400 hover:text-slate-600"
          @click="appStore.toggleSidebar()"
        />
        <NuxtLink
          to="/chat"
          class="flex items-center justify-center w-full py-2 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
        >
          <UAvatar
            :text="userStore.userInfo?.nickname?.charAt(0) || 'U'"
            size="sm"
            class="bg-violet-200 text-violet-700"
          />
        </NuxtLink>
      </div>
      <!-- 展开状态：只显示用户信息 -->
      <NuxtLink
        v-else
        to="/chat"
        class="flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
      >
        <UAvatar
          :text="userStore.userInfo?.nickname?.charAt(0) || 'U'"
          size="sm"
          class="bg-violet-200 text-violet-700"
        />
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
            {{ userStore.userInfo?.nickname || userStore.userInfo?.username || '超级管理员' }}
          </p>
          <p class="text-xs text-slate-400">返回用户端</p>
        </div>
        <UIcon
          name="lucide:panel-left"
          class="w-4 h-4 text-slate-400"
        />
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface MenuChild {
  label: string
  to: string
}

interface MenuItem {
  label: string
  to?: string
  icon: string
  children?: MenuChild[]
}

interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const expandedMenus = ref(new Set<string>(['智能体', '知识库', '装修中心', '系统设置']))

// 工作空间菜单
const workspaceMenu: MenuItem[] = [
  {
    label: '智能体',
    icon: 'lucide:bot',
    children: [
      { label: '智能体列表', to: '/admin/agents' },
      { label: '智能体配置', to: '/admin/agents/configuration' },
    ],
  },
  {
    label: '知识库',
    icon: 'lucide:library',
    children: [
      { label: '知识库列表', to: '/admin/datasets' },
      { label: '知识库配置', to: '/admin/datasets/configuration' },
    ],
  },
]

// 系统管理菜单
const systemMenu: MenuItem[] = [
  {
    label: '营销中心',
    to: '/admin/marketing',
    icon: 'lucide:store',
  },
  {
    label: '装修中心',
    icon: 'lucide:paintbrush',
    children: [
      { label: '布局配置', to: '/admin/decorate/layout' },
      { label: '应用中心', to: '/admin/decorate/apps' },
      { label: '智能体广场', to: '/admin/decorate/agents' },
    ],
  },
  {
    label: '对话管理',
    icon: 'lucide:message-circle',
    children: [
      { label: '对话记录', to: '/admin/chat/record' },
      { label: '对话配置', to: '/admin/chat/config' },
    ],
  },
  {
    label: '用户管理',
    icon: 'lucide:users',
    children: [
      { label: '用户列表', to: '/admin/users' },
    ],
  },
  {
    label: '订单管理',
    icon: 'lucide:file-text',
    children: [
      { label: '充值订单', to: '/admin/order/recharge' },
      { label: '会员订单', to: '/admin/order/membership' },
    ],
  },
  {
    label: '消息通知',
    icon: 'lucide:bell',
    children: [
      { label: '短信配置', to: '/admin/notice/sms' },
      { label: '通知设置', to: '/admin/notice/notification-settings' },
      { label: '站内信息', to: '/admin/notice/in-site' },
    ],
  },
  {
    label: '渠道管理',
    icon: 'lucide:share-2',
    children: [
      { label: '微信公众号', to: '/admin/channel/wechat-oa' },
      { label: '谷歌配置', to: '/admin/channel/google' },
    ],
  },
  {
    label: '财务管理',
    icon: 'lucide:dollar-sign',
    children: [
      { label: '财务中心', to: '/admin/financial/analysis' },
      { label: '余额明细', to: '/admin/financial/balance-details' },
    ],
  },
  {
    label: '权限管理',
    icon: 'lucide:shield',
    children: [
      { label: '权限列表', to: '/admin/access/permission' },
      { label: '菜单列表', to: '/admin/access/menu' },
    ],
  },
  {
    label: '部门管理',
    icon: 'lucide:sitemap',
    children: [
      { label: '部门与成员', to: '/admin/department/members' },
      { label: '部门角色', to: '/admin/department/role' },
    ],
  },
  {
    label: '系统设置',
    icon: 'lucide:settings',
    children: [
      { label: '支付配置', to: '/admin/system/pay-config' },
      { label: '站点信息', to: '/admin/system/website-config' },
      { label: '政策协议', to: '/admin/system/agreement' },
      { label: '登录配置', to: '/admin/system/login-config' },
      { label: '存储配置', to: '/admin/system/storage-config' },
      { label: '日志切割', to: '/admin/system/pm2-log-rotate' },
    ],
  },
]

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function hasActiveChild(item: MenuItem) {
  if (!item.children) return false
  return item.children.some(child => route.path === child.to)
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
