<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">协议管理</p>
    </div>

    <AdminSystemTabs />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="lucide:loader" class="w-8 h-8 animate-spin text-primary" />
      <span class="ml-3 text-slate-500">加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
      <div class="flex items-center gap-2">
        <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ error }}</span>
      </div>
      <button class="btn-glass mt-3 text-sm" @click="fetchAgreements">重试</button>
    </div>

    <div v-else class="space-y-6">
      <div
        v-for="agreement in agreements"
        :key="agreement.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
              <UIcon name="lucide:file-text" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ agreement.name }}</h3>
              <div class="flex items-center gap-3 mt-1">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="agreement.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="agreement.enabled ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ agreement.enabled ? '已启用' : '已禁用' }}
                </span>
                <span class="text-sm text-slate-500">最后更新: {{ agreement.updatedAt }}</span>
              </div>
            </div>
          </div>
          <button class="btn-glass" @click="openEditDialog(agreement)">
            <UIcon name="lucide:edit" class="w-4 h-4" />
            编辑
          </button>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p class="text-sm text-slate-500 line-clamp-3">{{ agreement.content }}</p>
        </div>
      </div>
    </div>

    <UDialog v-model="showEditDialog" :title="'编辑协议 - ' + editingAgreement?.name" size="xl">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">协议名称</label>
          <UInput v-model="editForm.name" placeholder="输入协议名称" />
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="editForm.enabled" />
            <span class="text-sm text-slate-700 dark:text-slate-300">启用协议</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="showPreview" />
            <span class="text-sm text-slate-700 dark:text-slate-300">预览模式</span>
          </label>
        </div>
        <div v-if="showPreview" class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 min-h-48">
          <div class="prose prose-sm dark:prose-invert max-w-none" v-html="previewContent"></div>
        </div>
        <div v-else>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">协议内容</label>
          <UTextarea v-model="editForm.content" placeholder="输入协议内容，支持 Markdown 格式..." :rows="16" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showEditDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="publishAgreement" :disabled="saving">
          <UIcon v-if="saving" name="lucide:loader" class="w-4 h-4 animate-spin" />
          {{ saving ? '保存中...' : '发布' }}
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getAgreements, updateAgreement } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface Agreement {
  id: string
  name: string
  enabled: boolean
  content: string
  updatedAt: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const showEditDialog = ref(false)
const showPreview = ref(false)
const editingAgreement = ref<Agreement | null>(null)

const agreements = ref<Agreement[]>([])

const editForm = ref({
  name: '',
  enabled: true,
  content: '',
})

const previewContent = computed(() => {
  return editForm.value.content
    .replace(/\n/g, '<br>')
    .replace(/#{3} (.*)/g, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/#{2} (.*)/g, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
    .replace(/#{1} (.*)/g, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/^\d+\. (.*)/gm, '<p class="ml-4 mb-1">$1</p>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
})

async function fetchAgreements() {
  loading.value = true
  error.value = null
  try {
    const data = await getAgreements()
    agreements.value = data.map((a: any) => ({
      id: a.id,
      name: a.name,
      enabled: a.isEnabled ?? a.enabled ?? false,
      content: a.content,
      updatedAt: a.updatedAt || '',
    }))
  } catch (e: any) {
    error.value = e.message || '加载协议数据失败'
  } finally {
    loading.value = false
  }
}

function openEditDialog(agreement: Agreement) {
  editingAgreement.value = agreement
  editForm.value = {
    name: agreement.name,
    enabled: agreement.enabled,
    content: agreement.content,
  }
  showPreview.value = false
  showEditDialog.value = true
}

async function publishAgreement() {
  if (!editingAgreement.value || saving.value) return
  saving.value = true
  try {
    await updateAgreement(editingAgreement.value.id, {
      name: editForm.value.name,
      isEnabled: editForm.value.enabled,
      content: editForm.value.content,
    } as any)
    const item = agreements.value.find(a => a.id === editingAgreement.value!.id)
    if (item) {
      item.name = editForm.value.name
      item.enabled = editForm.value.enabled
      item.content = editForm.value.content
      item.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
    }
    showEditDialog.value = false
  } catch (e: any) {
    error.value = e.message || '保存协议失败'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchAgreements()
})
</script>