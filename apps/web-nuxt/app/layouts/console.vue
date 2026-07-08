<template>
  <div class="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
    <AdminSidebar :collapsed="appStore.sidebarCollapsed" />
    <div class="flex flex-col flex-1 overflow-hidden">
      <AppHeader />
      <main class="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore()
</script>
