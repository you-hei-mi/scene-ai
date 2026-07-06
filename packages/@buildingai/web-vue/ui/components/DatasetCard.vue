<template>
  <UCard class="cursor-pointer hover:shadow-md transition-shadow" @click="$emit('click')">
    <div class="flex items-start gap-4">
      <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center" :class="iconBgClass">
        <UIcon :name="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between">
          <h3 class="font-semibold truncate">{{ name }}</h3>
          <UBadge :variant="statusVariant" size="sm">{{ statusText }}</UBadge>
        </div>
        <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ description }}</p>
        <div class="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
          <span>{{ docCount }} 个文档</span>
          <span>{{ chunkCount }} 个分段</span>
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
  icon?: string
  status?: 'indexing' | 'ready' | 'error'
  docCount?: number
  chunkCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'lucide:database',
  status: 'ready',
  docCount: 0,
  chunkCount: 0,
})

defineEmits(['click'])

const iconBgClass = computed(() => 'bg-green-100 dark:bg-green-900/30')
const iconColorClass = computed(() => 'text-green-600 dark:text-green-400')

const statusVariant = computed(() => {
  const map = { indexing: 'secondary', ready: 'default', error: 'destructive' }
  return map[props.status]
})

const statusText = computed(() => {
  const map = { indexing: '索引中', ready: '就绪', error: '错误' }
  return map[props.status]
})
</script>
