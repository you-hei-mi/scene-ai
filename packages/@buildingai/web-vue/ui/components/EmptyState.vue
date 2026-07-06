<template>
  <div class="flex flex-col items-center justify-center py-12">
    <UIcon :name="icon" class="w-12 h-12 text-muted-foreground mb-3" />
    <p class="text-muted-foreground mb-4">{{ title }}</p>
    <UButton v-if="actionText" @click="$emit('action')">
      <template #icon>
        <UIcon :name="actionIcon" class="w-4 h-4" />
      </template>
      {{ actionText }}
    </UButton>
  </div>
</template>

<script setup lang="ts">
interface Props {
  icon: string
  title: string
  actionText?: string
  actionIcon?: string
}

withDefaults(defineProps<Props>(), {
  actionIcon: 'lucide:plus',
})

defineEmits(['action'])
</script>
