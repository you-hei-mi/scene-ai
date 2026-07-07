<template>
  <div class="flex items-end gap-3">
    <div class="flex-1">
      <div class="relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm">
        <textarea
          v-model="inputValue"
          :disabled="disabled"
          @keydown.enter.exact.prevent="handleSend"
          placeholder="输入消息，按 Enter 发送，Shift+Enter 换行"
          rows="1"
          class="w-full px-5 py-4 pr-16 resize-none bg-transparent focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 min-h-[52px] max-h-[200px]"
        ></textarea>
        <UButton
          v-if="modelValue"
          variant="ghost"
          size="sm"
          icon="lucide:x"
          class="absolute right-16 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          @click="clearInput"
        />
        <UButton
          v-if="disabled && isSending"
          variant="ghost"
          size="sm"
          icon="lucide:square"
          class="absolute right-3 top-1/2 -translate-y-1/2 text-danger hover:text-danger/80"
          @click="$emit('stop')"
        />
        <UButton
          v-else
          variant="primary"
          size="sm"
          icon="lucide:send"
          :disabled="disabled || !modelValue.trim()"
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-200"
          @click="handleSend"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

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
