<template>
  <div class="flex gap-3 group">
    <div
      class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
      :class="isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'"
    >
      <Icon v-if="isUser" name="lucide:user" class="w-4 h-4" />
      <Icon v-else name="lucide:bot" class="w-4 h-4" />
    </div>
    <div class="flex-1 min-w-0">
      <div class="font-medium text-sm mb-1">
        {{ isUser ? '我' : 'BuildingAI' }}
      </div>
      <div v-if="message.isTyping" class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div
        v-else
        class="prose prose-sm max-w-none dark:prose-invert"
        v-html="renderedContent"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { renderMarkdown } from '~/utils/markdown'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
  isTyping?: boolean
}

const props = defineProps<{
  message: ChatMessage
}>()

const isUser = computed(() => props.message.role === 'user')

const renderedContent = computed(() => {
  return renderMarkdown(props.message.content)
})
</script>

<style scoped>
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 8px 0;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background-color: currentColor;
  border-radius: 50%;
  opacity: 0.4;
  animation: typing 1.4s infinite ease-in-out both;
}

.typing-indicator span:nth-child(1) {
  animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes typing {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
