<template>
  <div class="w-72 border-r border-border bg-card flex flex-col h-full">
    <div class="p-3 border-b border-border">
      <UButton class="w-full" @click="$emit('new')">
          <template #icon>
            <UIcon name="lucide:plus" class="w-4 h-4" />
          </template>
        新建对话
      </UButton>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <div v-if="conversations.length === 0" class="text-center py-8 text-muted-foreground text-sm">
        暂无对话
      </div>
      <div
        v-for="conv in conversations"
        :key="conv.id"
        class="group flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer mb-1 transition-colors"
        :class="{
          'bg-accent text-accent-foreground': activeId === conv.id,
          'hover:bg-accent/50': activeId !== conv.id,
        }"
        @click="$emit('select', conv.id)"
      >
        <UIcon name="lucide:message-square" class="w-4 h-4 flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <div class="truncate text-sm font-medium">{{ conv.title }}</div>
          <div v-if="conv.lastMessage" class="truncate text-xs text-muted-foreground">
            {{ conv.lastMessage }}
          </div>
        </div>
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:trash-2"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="$emit('delete', conv.id)"
        />
      </div>
    </div>

    <div class="p-3 border-t border-border">
      <UButton variant="ghost" class="w-full justify-start" @click="$emit('toggle-sidebar')">
        <template #icon>
          <UIcon name="lucide:panel-left-close" class="w-4 h-4" />
        </template>
        收起侧边栏
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Conversation {
  id: string
  title: string
  lastMessage?: string
  updatedAt: Date
}

defineProps<{
  conversations: Conversation[]
  activeId: string | null
}>()

defineEmits<{
  (e: 'select', id: string): void
  (e: 'new'): void
  (e: 'delete', id: string): void
  (e: 'toggle-sidebar'): void
}>()
</script>
