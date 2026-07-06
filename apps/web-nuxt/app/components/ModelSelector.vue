<template>
  <UDropdownMenu>
    <UButton variant="outline" size="sm">
      <template #icon>
        <Icon name="lucide:sparkles" class="w-4 h-4" />
      </template>
      {{ currentModelLabel }}
      <template #trailing>
        <Icon name="lucide:chevron-down" class="w-4 h-4" />
      </template>
    </UButton>

    <template #items>
      <UDropdownMenuItem
        v-for="m in models"
        :key="m.id"
        :label="m.name"
        :icon="m.icon"
        :selected="model === m.id"
        @click="$emit('change', m.id)"
      />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  model: string
}>()

defineEmits<{
  (e: 'change', model: string): void
}>()

const models = [
  { id: 'deepseek-chat', name: 'DeepSeek V3', icon: 'lucide:zap' },
  { id: 'gpt-4o', name: 'GPT-4o', icon: 'lucide:sparkles' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', icon: 'lucide:cpu' },
  { id: 'claude-sonnet', name: 'Claude Sonnet', icon: 'lucide:brain' },
  { id: 'qwen-plus', name: '通义千问 Plus', icon: 'lucide:message-circle' },
]

const currentModelLabel = computed(() => {
  const found = models.find(m => m.id === props.model)
  return found?.name || props.model
})
</script>
