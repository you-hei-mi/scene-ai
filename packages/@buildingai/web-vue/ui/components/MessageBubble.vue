<template>
  <div
    :class="[
      'flex gap-3',
      isUser ? 'flex-row-reverse' : 'flex-row'
    ]"
  >
    <div
      class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-medium"
      :class="isUser ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
    >
      <UIcon v-if="isUser" name="lucide:user" class="w-5 h-5" />
      <UIcon v-else name="lucide:bot" class="w-5 h-5" />
    </div>
    <div
      :class="[
        'max-w-[70%]',
        isUser ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-md' : 'bg-muted rounded-2xl rounded-tl-md'
      ]"
    >
      <div class="p-4">
        <div class="text-sm font-medium mb-1">{{ isUser ? '用户' : agentName || 'AI' }}</div>
        <div class="text-sm whitespace-pre-wrap">{{ content }}</div>
      </div>
      <div class="px-4 pb-2">
        <span class="text-xs text-muted-foreground">{{ timestamp }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content: string
  isUser: boolean
  agentName?: string
  timestamp?: string
}

const props = withDefaults(defineProps<Props>(), {
  agentName: '',
  timestamp: '',
})

const formattedTimestamp = computed(() => {
  if (!props.timestamp) {
    return new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return props.timestamp
})
</script>
