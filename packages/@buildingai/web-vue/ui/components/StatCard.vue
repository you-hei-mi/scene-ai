<template>
  <UCard>
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-muted-foreground">{{ title }}</p>
        <p class="text-2xl font-bold mt-1">{{ value }}</p>
        <p v-if="change" class="text-xs mt-1 flex items-center gap-1" :class="changeClass">
          <UIcon :name="changeIcon" class="w-3 h-3" />
          {{ change }}
        </p>
      </div>
      <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="iconBgClass">
        <UIcon :name="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  title: string
  value: string | number
  icon: string
  change?: string
  isPositive?: boolean
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red'
}

const props = withDefaults(defineProps<Props>(), {
  isPositive: true,
  color: 'blue',
})

const colorClasses = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  green: { bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-900/30', color: 'text-orange-600 dark:text-orange-400' },
  red: { bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
}

const iconBgClass = computed(() => colorClasses[props.color].bg)
const iconColorClass = computed(() => colorClasses[props.color].color)

const changeClass = computed(() => props.isPositive ? 'text-green-600' : 'text-red-600')
const changeIcon = computed(() => props.isPositive ? 'lucide:trending-up' : 'lucide:trending-down')
</script>
