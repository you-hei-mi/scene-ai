<template>
  <UCard class="cursor-pointer hover:shadow-md transition-shadow" @click="$emit('click')">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" :class="iconBgClass">
        <UIcon :name="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <h3 class="font-semibold truncate">{{ name }}</h3>
          <UBadge v-if="status" :variant="statusVariant" size="sm">{{ statusText }}</UBadge>
        </div>
        <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ description }}</p>
        <div class="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>{{ model }}</span>
          <span>{{ usageCount }} 次调用</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  id: string
  name: string
  description: string
  model: string
  icon: string
  status?: 'running' | 'stopped' | 'error'
  usageCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  status: 'running',
  usageCount: 0,
})

defineEmits(['click'])

const iconBgClass = computed(() => 'bg-blue-100 dark:bg-blue-900/30')
const iconColorClass = computed(() => 'text-blue-600 dark:text-blue-400')

const statusVariant = computed(() => {
  const map = { running: 'default', stopped: 'outline', error: 'destructive' }
  return map[props.status]
})

const statusText = computed(() => {
  const map = { running: '运行中', stopped: '已停止', error: '错误' }
  return map[props.status]
})
</script>
