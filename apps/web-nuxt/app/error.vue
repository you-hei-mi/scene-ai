<template>
  <div class="min-h-screen flex items-center justify-center bg-background">
    <div class="text-center p-8">
      <h1 class="text-6xl font-bold text-primary mb-4">
        {{ error.statusCode || 500 }}
      </h1>
      <p class="text-xl text-muted-foreground mb-8">
        {{ error.statusMessage || '发生错误' }}
      </p>
      <UButton @click="handleError">
        返回首页
      </UButton>
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
