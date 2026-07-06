<template>
  <header class="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-20">
    <div class="flex items-center justify-between h-full px-4">
      <div class="flex items-center gap-4">
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:panel-left"
          @click="appStore.toggleSidebar()"
        />
        <div class="flex items-center gap-2">
          <span class="font-semibold text-lg">BuildingAI</span>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          variant="ghost"
          size="sm"
          :icon="colorMode.value === 'dark' ? 'lucide:sun' : 'lucide:moon'"
          @click="toggleTheme"
        />
        <UDropdownMenu :items="userMenuItems">
          <UAvatar
            v-if="userStore.userInfo?.avatar"
            :src="userStore.userInfo.avatar"
            size="sm"
            class="cursor-pointer"
          />
          <UAvatar
            v-else
            :text="userStore.userInfo?.nickname || 'U'"
            size="sm"
            class="cursor-pointer"
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
