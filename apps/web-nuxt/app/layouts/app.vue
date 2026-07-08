<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
    <AppSidebar :collapsed="appStore.sidebarCollapsed" />
    <div class="flex flex-col flex-1 overflow-hidden">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
</script>