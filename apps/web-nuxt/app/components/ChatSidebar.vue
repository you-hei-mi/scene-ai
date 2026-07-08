<template>
  <div class="w-72 border-r border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl flex flex-col h-full">
    <div class="p-4 border-b border-slate-200 dark:border-slate-700">
      <UButton class="w-full bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300" @click="$emit('new')">
        <template #icon>
          <UIcon name="lucide:plus" class="w-4 h-4" />
        </template>
        新建对话
      </UButton>
    </div>

    <div class="flex-1 overflow-y-auto p-3">
      <div v-if="conversations.length === 0" class="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
        暂无对话
      </div>
      <div
        v-for="conv in conversations"
        :key="conv.id"
        class="group flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer mb-2 transition-all duration-200"
        :class="[
          activeId === conv.id
            ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary border border-primary/20 shadow-sm'
            : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300',
        ]"
        @click="$emit('select', conv.id)"
      >
        <div class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" :class="activeId === conv.id ? 'bg-primary/20' : 'bg-slate-100 dark:bg-slate-700'">
          <UIcon name="lucide:message-square" class="w-5 h-5" :class="activeId === conv.id ? 'text-primary' : 'text-slate-500 dark:text-slate-400'" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="truncate text-sm font-semibold">{{ conv.title }}</div>
          <div v-if="conv.lastMessage" class="truncate text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ conv.lastMessage }}
          </div>
        </div>
        <UButton
          variant="ghost"
          size="sm"
          icon="lucide:trash-2"
          class="opacity-0 group-hover:opacity-100 transition-opacity hover:text-danger"
          @click.stop="$emit('delete', conv.id)"
        />
      </div>
    </div>

    <div class="p-4 border-t border-slate-200 dark:border-slate-700">
      <UButton variant="ghost" class="w-full justify-start text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl" @click="$emit('toggle-sidebar')">
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
