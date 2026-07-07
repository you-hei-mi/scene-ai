<template>
  <div style="background: var(--bg-deep); min-height: 100vh; padding: 1.5rem;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
      <div>
        <h1 class="font-display text-gradient" style="font-size: 1.5rem; font-weight: 700;">知识库</h1>
        <p style="color: var(--text-secondary); font-size: 0.875rem; margin-top: 0.25rem;">管理和维护您的知识库，为 AI 提供上下文信息</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="handleCreate">
        <UIcon name="lucide:plus" style="width: 1rem; height: 1rem;" />
        创建知识库
      </button>
    </div>

    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem;">
      <div style="position: relative; width: 16rem;">
        <UIcon name="lucide:search" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--text-secondary);" />
        <input v-model="keyword" placeholder="搜索知识库..." style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem 0.5rem 2.25rem; color: var(--text-primary); outline: none; width: 100%;" />
      </div>
      <div style="display: flex; gap: 0.5rem;">
        <button
          :class="filterType === 'all' ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          style="font-size: 0.875rem; padding: 0.25rem 0.75rem;"
          @click="filterType = 'all'"
        >
          全部
        </button>
        <button
          :class="filterType === 'private' ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          style="font-size: 0.875rem; padding: 0.25rem 0.75rem;"
          @click="filterType = 'private'"
        >
          私有
        </button>
        <button
          :class="filterType === 'public' ? 'btn-glass btn-glass--primary' : 'btn-glass'"
          style="font-size: 0.875rem; padding: 0.25rem 0.75rem;"
          @click="filterType = 'public'"
        >
          公开
        </button>
      </div>
    </div>

    <div v-if="datasetStore.loading" style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem;">
      <div v-for="i in 6" :key="i" class="glass-card animate-pulse" style="padding: 1rem;">
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="height: 2.5rem; width: 2.5rem; border-radius: 0.5rem; background: var(--glass-bg-1);"></div>
          <div style="height: 1.25rem; width: 66.66%; background: var(--glass-bg-1); border-radius: 0.25rem;"></div>
          <div style="height: 1rem; width: 100%; background: var(--glass-bg-1); border-radius: 0.25rem;"></div>
          <div style="display: flex; gap: 0.5rem; padding-top: 0.5rem;">
            <div style="height: 1rem; width: 4rem; background: var(--glass-bg-1); border-radius: 0.25rem;"></div>
            <div style="height: 1rem; width: 4rem; background: var(--glass-bg-1); border-radius: 0.25rem;"></div>
            <div style="height: 1rem; width: 4rem; background: var(--glass-bg-1); border-radius: 0.25rem;"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else style="display: grid; grid-template-columns: repeat(1, 1fr); gap: 1rem;">
      <div
        v-for="dataset in filteredDatasets"
        :key="dataset.id"
        class="glass-card"
        style="padding: 1rem; cursor: pointer;"
        @click="handleSelect(dataset)"
      >
        <div style="display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 1rem;">
          <div
            style="width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
            :style="{ backgroundColor: dataset.type === 'public' ? '#22c55e' : '#3b82f6' }"
          >
            <UIcon name="lucide:database" style="width: 1.25rem; height: 1.25rem; color: white;" />
          </div>
          <div style="flex: 1; min-width: 0;">
            <h3 style="font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; align-items: center; gap: 0.5rem; color: var(--text-primary);">
              {{ dataset.name }}
              <UBadge
                :variant="dataset.type === 'public' ? 'default' : 'secondary'"
                size="sm"
              >
                {{ dataset.type === 'public' ? '公开' : '私有' }}
              </UBadge>
            </h3>
            <p style="font-size: 0.875rem; margin-top: 0.25rem;">
              <span
                style="display: inline-flex; align-items: center; gap: 0.25rem;"
                :style="{
                  color: dataset.status === 'active' ? '#22c55e' : dataset.status === 'indexing' ? '#eab308' : dataset.status === 'error' ? '#ef4444' : undefined,
                }"
              >
                <span style="width: 0.5rem; height: 0.5rem; border-radius: 50%; display: inline-block;"
                  :style="{
                    backgroundColor: dataset.status === 'active' ? '#22c55e' : dataset.status === 'indexing' ? '#eab308' : dataset.status === 'error' ? '#ef4444' : undefined,
                  }"
                ></span>
                {{ statusText(dataset.status) }}
              </span>
            </p>
          </div>
        </div>

        <p style="font-size: 0.875rem; color: var(--text-secondary); overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; margin-bottom: 1rem; min-height: 40px;">
          {{ dataset.description }}
        </p>

        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary); padding-top: 0.75rem; border-top: 1px solid var(--glass-border);">
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <UIcon name="lucide:file-text" style="width: 0.75rem; height: 0.75rem;" />
            {{ dataset.docCount }} 文档
          </span>
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <UIcon name="lucide:layers" style="width: 0.75rem; height: 0.75rem;" />
            {{ dataset.chunkCount }} 分段
          </span>
          <span style="display: flex; align-items: center; gap: 0.25rem;">
            <UIcon name="lucide:hard-drive" style="width: 0.75rem; height: 0.75rem;" />
            {{ datasetStore.formatSize(dataset.size) }}
          </span>
        </div>
      </div>
    </div>

    <div v-if="filteredDatasets.length === 0 && !datasetStore.loading" style="text-align: center; padding-top: 4rem; padding-bottom: 4rem;">
      <div style="display: inline-flex; align-items: center; justify-content: center; width: 4rem; height: 4rem; border-radius: 50%; background: var(--glass-bg-1); margin-bottom: 1rem;">
        <UIcon name="lucide:database" style="width: 2rem; height: 2rem; color: var(--text-secondary);" />
      </div>
      <h3 style="font-size: 1.125rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">暂无知识库</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1rem;">创建您的第一个知识库，上传文档开始使用</p>
      <button class="btn-glass btn-glass--primary" @click="handleCreate">
        <UIcon name="lucide:plus" style="width: 1rem; height: 1rem;" />
        创建知识库
      </button>
    </div>

    <UDialog v-model:open="showCreateDialog" title="创建知识库">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">知识库名称</label>
          <input v-model="newDataset.name" placeholder="输入知识库名称" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">描述</label>
          <textarea
            v-model="newDataset.description"
            placeholder="简单描述知识库的用途和内容"
            style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; outline: none; min-height: 80px; resize: none; background: var(--glass-bg-1); color: var(--text-primary);"
          ></textarea>
        </div>
        <div>
          <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">类型</label>
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

const datasetStore = useDatasetStore()
const toast = useToast()

definePageMeta({
  layout: 'console',
})

const keyword = ref('')
const filterType = ref<'all' | 'private' | 'public'>('all')
const showCreateDialog = ref(false)

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

onMounted(() => {
  datasetStore.fetchDatasets()
})
</script>
