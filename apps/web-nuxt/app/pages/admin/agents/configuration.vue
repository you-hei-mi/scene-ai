<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center gap-4 mb-6">
      <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
      <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">智能体配置</h1>
    </div>
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-sm border border-slate-100 dark:border-slate-700 text-center">
      <UIcon name="lucide:construction" class="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h2 class="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">页面开发中</h2>
      <p class="text-slate-500">该功能正在开发中，敬请期待</p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'console',
})
</script>
