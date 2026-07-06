<template>
  <aside
    class="border-r border-border bg-card flex flex-col transition-all duration-300"
    :class="collapsed ? 'w-16' : 'w-64'"
  >
    <div class="flex items-center h-14 px-4 border-b border-border">
      <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
        <UIcon name="lucide:bot" class="w-5 h-5 text-primary" />
      </div>
      <span v-if="!collapsed" class="ml-2 font-semibold">BuildingAI</span>
    </div>
    <nav class="flex-1 p-2 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in menuItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
            :class="{
              'bg-accent text-accent-foreground': isActive(item.to),
              'justify-center': collapsed,
            }"
          >
            <UIcon :name="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span v-if="!collapsed">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
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
