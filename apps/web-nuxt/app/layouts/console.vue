<template>
  <div class="flex h-screen overflow-hidden bg-background">
    <AppSidebar :collapsed="appStore.sidebarCollapsed" />
    <div class="flex flex-col flex-1 overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
</script>
