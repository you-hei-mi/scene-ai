<template>
  <div class="flex items-end gap-2">
    <div class="flex-1">
      <div class="relative">
        <textarea
          v-model="inputValue"
          :disabled="disabled"
          @keydown.enter.exact.prevent="handleSend"
          placeholder="输入消息，按 Enter 发送，Shift+Enter 换行"
          rows="1"
          class="w-full px-4 py-3 pr-12 resize-none border border-input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[48px] max-h-[200px]"
        ></textarea>
        <UButton
          v-if="modelValue"
          variant="ghost"
          size="sm"
          icon="lucide:x"
          class="absolute right-12 top-1/2 -translate-y-1/2"
          @click="clearInput"
        />
        <UButton
          v-if="disabled && isSending"
          variant="ghost"
          size="sm"
          icon="lucide:square"
          class="absolute right-2 top-1/2 -translate-y-1/2"
          @click="$emit('stop')"
        />
        <UButton
          v-else
          variant="primary"
          size="sm"
          icon="lucide:send"
          :disabled="disabled || !modelValue.trim()"
          class="absolute right-2 top-1/2 -translate-y-1/2"
          @click="handleSend"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  modelValue: string
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'send'): void
  (e: 'stop'): void
}>()

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isSending = computed(() => props.disabled)

function handleSend() {
  if (!props.disabled && props.modelValue.trim()) {
    emit('send')
  }
}

function clearInput() {
  emit('update:modelValue', '')
}
</script>
