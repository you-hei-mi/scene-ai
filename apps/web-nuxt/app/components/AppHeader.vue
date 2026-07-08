<template>
  <header class="h-14 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-800/60 z-20 transition-all duration-300">
    <div class="flex items-center justify-between h-full px-4 md:px-6">
      <div class="flex items-center gap-4">
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:panel-left"
          class="hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          @click="appStore.toggleSidebar()"
        />
        <NuxtLink to="/" class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
          </div>
          <span class="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BuildingAI</span>
        </NuxtLink>
      </div>
      <div class="flex items-center gap-2 md:gap-3">
        <UButton
          variant="ghost"
          size="sm"
          :icon="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
          class="hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-lg transition-all duration-200"
          @click="toggleTheme"
        />
        <UDropdownMenu :items="userMenuItems">
          <UAvatar
            v-if="userStore.userInfo?.avatar"
            :src="userStore.userInfo.avatar"
            size="sm"
            class="cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all duration-200"
          />
          <UAvatar
            v-else
            :text="userStore.userInfo?.nickname || 'U'"
            size="sm"
            class="cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all duration-200"
          />
        </UDropdownMenu>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const appStore = useAppStore()
const userStore = useUserStore()
const colorMode = useColorMode()

const userMenuItems = ref([
  {
    label: '个人设置',
    icon: 'lucide:settings',
    onClick: () => navigateTo('/settings'),
  },
  {
    label: '退出登录',
    icon: 'lucide:log-out',
    onClick: () => handleLogout(),
  },
])

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

function handleLogout() {
  userStore.logout()
  navigateTo('/login')
}
</script>
