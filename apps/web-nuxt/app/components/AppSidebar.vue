<template>
  <aside
    class="border-r border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col transition-all duration-300 ease-out"
    :class="collapsed ? 'w-16' : 'w-60'"
  >
    <!-- Logo -->
    <div class="flex items-center justify-between h-14 px-4">
      <div v-if="!collapsed" class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
          <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
        </div>
        <span class="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BuildingAI</span>
      </div>
      <div v-else class="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto">
        <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
      </div>
      <UButton
        variant="ghost"
        size="xs"
        :icon="collapsed ? 'lucide:panel-right' : 'lucide:panel-left-close'"
        class="text-slate-400 hover:text-slate-600"
        @click="appStore.toggleSidebar()"
      />
    </div>

    <!-- 主菜单 -->
    <nav class="flex-1 px-3 py-2 overflow-y-auto">
      <ul class="space-y-0.5">
        <!-- 新对话 -->
        <li>
          <NuxtLink
            to="/chat"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/chat')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:pen-square" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">新对话</span>
          </NuxtLink>
        </li>

        <!-- 智能体 -->
        <li>
          <NuxtLink
            to="/agents"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/agents')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:bot" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">智能体</span>
          </NuxtLink>
        </li>

        <!-- 知识库 -->
        <li>
          <NuxtLink
            to="/datasets"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/datasets')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:library" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">知识库</span>
          </NuxtLink>
        </li>

        <!-- 工作流 -->
        <li>
          <NuxtLink
            to="/workflow"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="[
              isActive('/workflow')
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
          >
            <UIcon name="lucide:git-branch" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate">工作流</span>
          </NuxtLink>
        </li>

        <!-- 历史记录 -->
        <li>
          <button
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 w-full text-left"
            :class="[
              hasActiveHistory()
                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50',
              collapsed ? 'justify-center' : ''
            ]"
            @click="toggleHistory"
          >
            <UIcon name="lucide:clock" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed" class="truncate flex-1">历史记录</span>
            <UIcon
              v-if="!collapsed"
              name="lucide:chevron-right"
              class="w-4 h-4 transition-transform duration-200"
              :class="historyExpanded ? 'rotate-90' : ''"
            />
          </button>
          <ul
            v-if="!collapsed && historyExpanded"
            class="mt-1 space-y-0.5 border-l border-slate-200 dark:border-slate-700 ml-5 pl-3"
          >
            <li v-for="conv in recentConversations" :key="conv.id">
              <NuxtLink
                :to="`/chat/${conv.id}`"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all duration-200"
                :class="
                  route.path === `/chat/${conv.id}`
                    ? 'text-primary font-medium'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                "
              >
                <span class="truncate">{{ conv.title }}</span>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/chat"
                class="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all"
              >
                <span>查看全部</span>
              </NuxtLink>
            </li>
          </ul>
        </li>
      </ul>

      <!-- 热门应用 -->
      <div v-if="!collapsed" class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
        <p class="px-3 text-xs text-slate-400 mb-1.5">热门应用</p>
        <ul class="space-y-0.5">
          <li>
            <NuxtLink
              to="/apps/comic-factory"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                isActive('/apps/comic-factory')
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              ]"
            >
              <UIcon name="lucide:film" class="w-5 h-5 flex-shrink-0" />
              <span class="truncate">漫剧工厂</span>
            </NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/apps"
              class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
              :class="[
                isActive('/apps') && !isActive('/apps/comic-factory')
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              ]"
            >
              <UIcon name="lucide:layout-grid" class="w-5 h-5 flex-shrink-0" />
              <span class="truncate">全部应用</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </nav>

    <!-- 底部用户信息 -->
    <div class="p-3 border-t border-slate-200 dark:border-slate-700">
      <NuxtLink
        to="/admin"
        class="flex items-center gap-3 rounded-lg px-2 py-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all"
        :class="collapsed ? 'justify-center' : ''"
      >
        <UAvatar
          :text="userStore.userInfo?.nickname?.charAt(0) || 'U'"
          size="sm"
          class="bg-orange-200 text-orange-700"
        />
        <div v-if="!collapsed" class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
            {{ userStore.userInfo?.nickname || userStore.userInfo?.username || '超级管理员' }}
          </p>
          <p class="text-xs text-slate-400">99993</p>
        </div>
        <UIcon
          v-if="!collapsed"
          name="lucide:settings"
          class="w-4 h-4 text-slate-400"
        />
      </NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
interface Conversation {
  id: string
  title: string
}

interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()

const historyExpanded = ref(true)

// 历史记录示例数据，实际应从 API 获取
const recentConversations = ref<Conversation[]>([
  { id: '1', title: '新对话' },
  { id: '2', title: '新对话' },
  { id: '3', title: '新对话' },
  { id: '4', title: '新对话' },
  { id: '5', title: '新对话' },
])

function isActive(path: string) {
  return route.path === path || route.path.startsWith(path + '/')
}

function hasActiveHistory() {
  return route.path.startsWith('/chat/')
}

function toggleHistory() {
  historyExpanded.value = !historyExpanded.value
}
</script>
