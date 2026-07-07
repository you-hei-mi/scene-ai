<template>
  <div class="min-h-screen">
    <div class="mb-6">
      <button class="btn-glass p-2" @click="handleBack">
        <UIcon name="lucide:arrow-left" class="w-4 h-4" />
      </button>
    </div>

    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">Agent 发布</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">管理智能体的发布状态与分享设置</p>
    </div>

    <div class="max-w-3xl space-y-6">
      <section>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div
                :class="[
                  'w-12 h-12 rounded-full flex items-center justify-center',
                  publishStatus === 'published'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-slate-100 dark:bg-slate-700'
                ]"
              >
                <UIcon
                  :name="publishStatus === 'published' ? 'lucide:check-circle' : 'lucide:file'"
                  :class="[
                    'w-6 h-6',
                    publishStatus === 'published'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-slate-500 dark:text-slate-400'
                  ]"
                />
              </div>
              <div>
                <div class="font-medium text-slate-900 dark:text-white">当前状态</div>
                <div class="text-sm text-slate-500 mt-1">
                  {{ publishStatus === 'published' ? '已发布 - 所有人可访问' : '草稿 - 仅自己可见' }}
                </div>
              </div>
            </div>
            <button
              :class="[
                'px-5 py-2.5 rounded-xl font-medium transition-all',
                publishStatus === 'published'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  : 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
              ]"
              @click="togglePublish"
            >
              {{ publishStatus === 'published' ? '取消发布' : '立即发布' }}
            </button>
          </div>
        </div>
      </section>

      <section v-if="publishStatus === 'published'">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">公开访问设置</h3>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="space-y-5">
            <div class="flex items-center justify-between">
              <div>
                <div class="font-medium text-slate-900 dark:text-white">公开访问</div>
                <div class="text-sm text-slate-500 mt-1">允许任何人通过链接访问此智能体</div>
              </div>
              <button
                :class="[
                  'relative w-11 h-6 rounded-full transition-colors duration-200',
                  publicAccess ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                ]"
                @click="publicAccess = !publicAccess"
              >
                <span
                  :class="[
                    'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                    publicAccess ? 'translate-x-5' : 'translate-x-0'
                  ]"
                ></span>
              </button>
            </div>
            <div v-if="publicAccess">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">访问链接</label>
              <div class="flex gap-3">
                <input
                  :value="shareUrl"
                  readonly
                  class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button class="btn-glass px-5" @click="copyShareUrl">
                  <UIcon name="lucide:copy" class="w-4 h-4" />
                  复制
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="publishStatus === 'published'">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">嵌入设置</h3>
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">iframe 嵌入代码</label>
              <div class="relative">
                <textarea
                  :value="iframeSnippet"
                  readonly
                  rows="4"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-500 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                ></textarea>
                <button class="absolute top-2 right-2 btn-glass p-2 text-xs" @click="copyIframeSnippet">
                  <UIcon name="lucide:copy" class="w-3 h-3" />
                </button>
              </div>
              <p class="text-xs text-slate-500 mt-2">将此代码粘贴到您的网站 HTML 中即可嵌入智能体对话窗口</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">发布历史</h3>
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">版本</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">时间</th>
                <th class="text-left px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-200">状态</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in publishHistory"
                :key="record.version"
                class="border-b border-slate-100 dark:border-slate-700/50 last:border-b-0"
              >
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">{{ record.version }}</td>
                <td class="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{{ record.time }}</td>
                <td class="px-6 py-4">
                  <span
                    :class="[
                      'px-2.5 py-1 rounded-full text-xs font-medium',
                      record.status === 'published'
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    ]"
                  >
                    {{ record.status === 'published' ? '已发布' : '已下线' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <div class="flex justify-end gap-3 pt-4">
        <button
          v-if="publishStatus === 'published'"
          class="btn-glass px-6"
          @click="togglePublish"
        >
          取消发布
        </button>
        <button
          v-if="publishStatus !== 'published'"
          class="btn-glass btn-glass--primary px-6"
          @click="togglePublish"
        >
          发布
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

const route = useRoute()
const toast = useToast()

const agentId = computed(() => route.params.id as string)

const publishStatus = ref<'draft' | 'published'>('draft')
const publicAccess = ref(false)

const shareUrl = computed(() => `https://buildingai.cc/a/${agentId.value}`)

const iframeSnippet = computed(() => {
  return `<iframe
  src="${shareUrl.value}/embed"
  width="100%"
  height="600"
  frameborder="0"
  style="border-radius: 12px;"
></iframe>`
})

const publishHistory = ref([
  { version: 'v1.2.0', time: '2024-06-25 14:30', status: 'published' },
  { version: 'v1.1.2', time: '2024-06-20 10:15', status: 'unpublished' },
  { version: 'v1.1.1', time: '2024-06-18 16:45', status: 'published' },
  { version: 'v1.1.0', time: '2024-06-15 09:00', status: 'published' },
  { version: 'v1.0.0', time: '2024-06-10 11:20', status: 'published' },
])

function togglePublish() {
  publishStatus.value = publishStatus.value === 'published' ? 'draft' : 'published'
  if (publishStatus.value === 'published') {
    publishHistory.value.unshift({
      version: `v1.${publishHistory.value.length + 1}.0`,
      time: new Date().toLocaleString('zh-CN', { hour12: false }),
      status: 'published',
    })
  }
  toast.add({
    title: publishStatus.value === 'published' ? '发布成功' : '已取消发布',
    color: 'green',
  })
}

function copyShareUrl() {
  navigator.clipboard.writeText(shareUrl.value)
  toast.add({ title: '链接已复制到剪贴板', color: 'green' })
}

function copyIframeSnippet() {
  navigator.clipboard.writeText(iframeSnippet.value)
  toast.add({ title: '嵌入代码已复制到剪贴板', color: 'green' })
}

function handleBack() {
  navigateTo(`/agents/${agentId.value}`)
}
</script>