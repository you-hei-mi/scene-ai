<template>
  <div class="min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">知识库</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理和维护您的知识库，为 AI 提供上下文信息</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="handleCreate">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        创建知识库
      </button>
    </div>

    <div v-if="error" class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
      <UIcon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-amber-800 dark:text-amber-300">{{ error }}</p>
        <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">当前显示的是本地缓存数据，部分功能可能受限</p>
      </div>
      <button class="text-xs text-amber-700 dark:text-amber-300 underline hover:no-underline flex-shrink-0" @click="fetchDatasetList">
        重试
      </button>
    </div>

    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
      <div class="relative w-full sm:w-64">
        <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          v-model="keyword" 
          placeholder="搜索知识库..." 
          class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
        />
      </div>
      <div class="flex gap-2">
        <button
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filterType === 'all' ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
          ]"
          @click="filterType = 'all'"
        >
          全部
        </button>
        <button
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filterType === 'private' ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
          ]"
          @click="filterType = 'private'"
        >
          私有
        </button>
        <button
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            filterType === 'public' ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
          ]"
          @click="filterType = 'public'"
        >
          公开
        </button>
      </div>
    </div>

    <div v-if="datasetStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
        <div class="space-y-4">
          <div class="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-700"></div>
          <div class="h-5 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
          <div class="h-4 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
          <div class="flex gap-3 pt-2">
            <div class="h-4 w-16 rounded bg-slate-100 dark:bg-slate-700"></div>
            <div class="h-4 w-16 rounded bg-slate-100 dark:bg-slate-700"></div>
            <div class="h-4 w-16 rounded bg-slate-100 dark:bg-slate-700"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="dataset in filteredDatasets"
        :key="dataset.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 cursor-pointer transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20 group"
        @click="handleSelect(dataset)"
      >
        <div class="flex items-start gap-4 mb-4">
          <div
            :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
              dataset.type === 'public' ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-blue-500 to-cyan-500'
            ]"
          >
            <UIcon name="lucide:database" class="w-6 h-6 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-slate-900 dark:text-white truncate flex items-center gap-2">
              {{ dataset.name }}
              <span
                :class="[
                  'px-2 py-0.5 rounded-full text-xs font-medium',
                  dataset.type === 'public' 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                ]"
              >
                {{ dataset.type === 'public' ? '公开' : '私有' }}
              </span>
            </h3>
            <div class="flex items-center gap-2 mt-1">
              <span
                :class="[
                  'w-2 h-2 rounded-full',
                  dataset.status === 'active' ? 'bg-green-500' : dataset.status === 'indexing' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                ]"
              ></span>
              <span
                :class="[
                  'text-xs font-medium',
                  dataset.status === 'active' ? 'text-green-600 dark:text-green-400' : dataset.status === 'indexing' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                ]"
              >
                {{ statusText(dataset.status) }}
              </span>
            </div>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 min-h-[40px]">
          {{ dataset.description }}
        </p>

        <div class="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span class="flex items-center gap-1.5">
            <UIcon name="lucide:file-text" class="w-3.5 h-3.5" />
            {{ dataset.docCount }} 文档
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="lucide:layers" class="w-3.5 h-3.5" />
            {{ dataset.chunkCount }} 分段
          </span>
          <span class="flex items-center gap-1.5">
            <UIcon name="lucide:hard-drive" class="w-3.5 h-3.5" />
            {{ datasetStore.formatSize(dataset.size) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="filteredDatasets.length === 0 && !datasetStore.loading" class="text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
        <UIcon name="lucide:database" class="w-10 h-10 text-slate-400" />
      </div>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">暂无知识库</h3>
      <p class="text-slate-600 dark:text-slate-400 mb-6">创建您的第一个知识库，上传文档开始使用</p>
      <button class="btn-glass btn-glass--primary" @click="handleCreate">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        创建知识库
      </button>
    </div>

    <UDialog v-model:open="showCreateDialog" title="创建知识库">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">知识库名称</label>
          <input 
            v-model="newDataset.name" 
            placeholder="输入知识库名称" 
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">描述</label>
          <textarea
            v-model="newDataset.description"
            placeholder="简单描述知识库的用途和内容"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] resize-none"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">类型</label>
          <USelect v-model="newDataset.type" :options="typeOptions" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showCreateDialog = false">
          取消
        </button>
        <button class="btn-glass btn-glass--primary" @click="handleConfirmCreate">
          创建
        </button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMyDatasets } from '~/composables/api/core'

const datasetStore = useDatasetStore()
const toast = useToast()

definePageMeta({
  layout: 'console',
})

const keyword = ref('')
const filterType = ref<'all' | 'private' | 'public'>('all')
const showCreateDialog = ref(false)
const error = ref<string | null>(null)

const newDataset = ref({
  name: '',
  description: '',
  type: 'private',
})

const typeOptions = [
  { label: '私有 - 仅自己和成员可见', value: 'private' },
  { label: '公开 - 所有人可见', value: 'public' },
]

const filteredDatasets = computed(() => {
  let result = [...datasetStore.datasets]
  
  if (keyword.value.trim()) {
    const kw = keyword.value.toLowerCase()
    result = result.filter(
      d => d.name.toLowerCase().includes(kw) ||
           d.description.toLowerCase().includes(kw)
    )
  }
  
  if (filterType.value !== 'all') {
    result = result.filter(d => d.type === filterType.value)
  }
  
  return result
})

function getTypeBg(type: string) {
  return type === 'public' ? 'bg-green-600' : 'bg-blue-600'
}

function statusText(status: string) {
  const map: Record<string, string> = {
    active: '已就绪',
    indexing: '索引中',
    error: '异常',
  }
  return map[status] || status
}

function handleCreate() {
  newDataset.value = { name: '', description: '', type: 'private' }
  showCreateDialog.value = true
}

async function handleConfirmCreate() {
  if (!newDataset.value.name.trim()) {
    toast.add({ title: '请输入知识库名称', color: 'yellow' })
    return
  }
  
  const dataset = await datasetStore.createDataset(newDataset.value)
  showCreateDialog.value = false
  toast.add({ title: '创建成功', color: 'green' })
  
  if (dataset) {
    navigateTo(`/datasets/${dataset.id}`)
  }
}

function handleSelect(dataset: any) {
  navigateTo(`/datasets/${dataset.id}`)
}

async function fetchDatasetList() {
  error.value = null
  datasetStore.loading = true
  try {
    const result = await getMyDatasets()
    const apiItems = result?.items ?? []
    const mappedDatasets = apiItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description || '',
      icon: item.icon,
      type: (item.type === 'public' ? 'public' : 'private') as 'public' | 'private',
      docCount: item.docCount ?? 0,
      chunkCount: item.chunkCount ?? 0,
      size: item.size ?? 0,
      status: (item.status || 'active') as 'active' | 'indexing' | 'error',
      createdAt: new Date(item.createdAt || Date.now()),
      updatedAt: new Date(item.updatedAt || Date.now()),
      owner: item.owner,
      members: item.members,
    }))
    datasetStore.datasets = mappedDatasets
    datasetStore.total = mappedDatasets.length
  } catch (e: any) {
    error.value = `加载知识库列表失败: ${e.message || '网络异常'}` + '，已切换到本地缓存数据'
    datasetStore.initMockData()
  } finally {
    datasetStore.loading = false
  }
}

onMounted(() => {
  fetchDatasetList()
})
</script>