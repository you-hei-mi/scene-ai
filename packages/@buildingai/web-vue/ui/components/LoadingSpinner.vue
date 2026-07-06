<template>
  <div class="flex items-center justify-center">
    <div class="flex flex-col items-center">
      <div class="relative">
        <div class="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <UIcon v-if="icon" :name="icon" class="w-5 h-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <span v-if="text" class="text-sm text-muted-foreground mt-2">{{ text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon?: string
  text?: string
}

withDefaults(defineProps<Props>(), {
  icon: '',
  text: '',
})
</script>
