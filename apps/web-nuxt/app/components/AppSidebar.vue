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
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.to">
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
interface Props {
  collapsed?: boolean
}

defineProps<Props>()

const route = useRoute()

const menuItems = ref([
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
    label: '仪表盘',
    to: '/admin',
    icon: 'lucide:layout-dashboard',
  },
  {
    label: '设置',
    to: '/settings',
    icon: 'lucide:settings',
  },
])

function isActive(path: string) {
  return route.path.startsWith(path)
}
</script>
