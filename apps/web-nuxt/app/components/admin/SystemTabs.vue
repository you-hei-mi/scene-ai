<template>
  <div class="bg-white dark:bg-slate-800 rounded-2xl p-1.5 mb-6 shadow-sm border border-slate-100 dark:border-slate-700">
    <nav class="flex flex-wrap gap-1">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.path"
        :to="tab.path"
        class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        :class="isActive(tab.path)
          ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary dark:from-primary/20 dark:to-accent/20 shadow-sm'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
      >
        <UIcon :name="tab.icon" class="w-4 h-4" />
        <span>{{ tab.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

interface TabItem {
  label: string
  path: string
  icon: string
}

const route = useRoute()

const tabs: TabItem[] = [
  { label: '协议管理', path: '/admin/system/agreement', icon: 'lucide:file-text' },
  { label: '登录配置', path: '/admin/system/login-config', icon: 'lucide:log-in' },
  { label: '支付配置', path: '/admin/system/pay-config', icon: 'lucide:credit-card' },
  { label: '网站配置', path: '/admin/system/website-config', icon: 'lucide:globe' },
  { label: '存储配置', path: '/admin/system/storage-config', icon: 'lucide:hard-drive' },
  { label: '日志轮转', path: '/admin/system/pm2-log-rotate', icon: 'lucide:rotate-cw' },
]

function isActive(path: string): boolean {
  return route.path === path
}
</script>