<template>
  <div style="background: var(--bg-deep); min-height: 100vh; display: flex; align-items: center; justify-content: center;">
    <div style="text-align: center; padding: 2rem;">
      <h1 class="font-display text-gradient" style="font-size: 3.75rem; font-weight: 700; margin-bottom: 1rem;">
        {{ error.statusCode || 500 }}
      </h1>
      <p style="color: var(--text-secondary); font-size: 1.25rem; margin-bottom: 2rem;">
        {{ error.statusMessage || '发生错误' }}
      </p>
      <button class="btn-glass btn-glass--primary" @click="handleError">
        返回首页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    statusMessage: string
    message: string
  }
}>()

const handleError = () => clearError({ redirect: '/' })
</script>
