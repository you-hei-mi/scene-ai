<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">知识库</h1>
        <p class="text-muted-foreground text-sm mt-1">管理和维护您的知识库，为 AI 提供上下文信息</p>
      </div>
      <UButton @click="handleCreate">
        <template #icon>
          <UIcon name="lucide:plus" class="w-4 h-4" />
        </template>
        创建知识库
      </UButton>
    </div>

    <div class="flex items-center gap-4 mb-6">
      <UInput v-model="keyword" placeholder="搜索知识库..." class="w-64">
        <template #leading>
          <UIcon name="lucide:search" class="w-4 h-4 text-muted-foreground" />
        </template>
      </UInput>
      <div class="flex gap-2">
        <UButton
          :variant="filterType === 'all' ? 'solid' : 'outline'"
          size="sm"
          @click="filterType = 'all'"
        >
          全部
        </UButton>
        <UButton
          :variant="filterType === 'private' ? 'solid' : 'outline'"
          size="sm"
          @click="filterType = 'private'"
        >
          私有
        </UButton>
        <UButton
          :variant="filterType === 'public' ? 'solid' : 'outline'"
          size="sm"
          @click="filterType = 'public'"
        >
          公开
        </UButton>
      </div>
    </div>

    <div v-if="datasetStore.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard v-for="i in 6" :key="i" class="animate-pulse">
        <div class="space-y-3">
          <div class="h-10 w-10 rounded-lg bg-muted"></div>
          <div class="h-5 w-2/3 bg-muted rounded"></div>
          <div class="h-4 w-full bg-muted rounded"></div>
          <div class="flex gap-2 pt-2">
            <div class="h-4 w-16 bg-muted rounded"></div>
            <div class="h-4 w-16 bg-muted rounded"></div>
            <div class="h-4 w-16 bg-muted rounded"></div>
          </div>
        </div>
      </UCard>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="dataset in filteredDatasets"
        :key="dataset.id"
        class="cursor-pointer hover:border-primary transition-all hover:shadow-md group"
        @click="handleSelect(dataset)"
      >
        <div class="flex items-start gap-3 mb-4">
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            :class="getTypeBg(dataset.type)"
          >
            <UIcon name="lucide:database" class="w-5 h-5 text-white" />
          </div>
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold truncate group-hover:text-primary transition-colors flex items-center gap-2">
              {{ dataset.name }}
              <UBadge
                :variant="dataset.type === 'public' ? 'default' : 'secondary'"
                size="sm"
              >
                {{ dataset.type === 'public' ? '公开' : '私有' }}
              </UBadge>
            </h3>
            <p class="text-sm text-muted-foreground mt-1">
              <span
                class="inline-flex items-center gap-1"
                :class="{
                  'text-green-600': dataset.status === 'active',
                  'text-yellow-600': dataset.status === 'indexing',
                  'text-red-600': dataset.status === 'error',
                }"
              >
                <span class="w-2 h-2 rounded-full inline-block"
                  :class="{
                    'bg-green-600': dataset.status === 'active',
                    'bg-yellow-600': dataset.status === 'indexing',
                    'bg-red-600': dataset.status === 'error',
                  }"
                ></span>
                {{ statusText(dataset.status) }}
              </span>
            </p>
          </div>
        </div>

        <p class="text-sm text-muted-foreground line-clamp-2 mb-4 min-h-[40px]">
          {{ dataset.description }}
        </p>

        <div class="flex items-center justify-between text-xs text-muted-foreground pt-3 border-t border-border">
          <span class="flex items-center gap-1">
            <UIcon name="lucide:file-text" class="w-3 h-3" />
            {{ dataset.docCount }} 文档
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="lucide:layers" class="w-3 h-3" />
            {{ dataset.chunkCount }} 分段
          </span>
          <span class="flex items-center gap-1">
            <UIcon name="lucide:hard-drive" class="w-3 h-3" />
            {{ datasetStore.formatSize(dataset.size) }}
          </span>
        </div>
      </UCard>
    </div>

    <div v-if="filteredDatasets.length === 0 && !datasetStore.loading" class="text-center py-16">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
        <UIcon name="lucide:database" class="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 class="text-lg font-medium mb-2">暂无知识库</h3>
      <p class="text-muted-foreground mb-4">创建您的第一个知识库，上传文档开始使用</p>
      <UButton @click="handleCreate">
        <template #icon>
          <UIcon name="lucide:plus" class="w-4 h-4" />
        </template>
        创建知识库
      </UButton>
    </div>

    <UDialog v-model:open="showCreateDialog" title="创建知识库">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5">知识库名称</label>
          <UInput v-model="newDataset.name" placeholder="输入知识库名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">描述</label>
          <textarea
            v-model="newDataset.description"
            placeholder="简单描述知识库的用途和内容"
            class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[80px] resize-none"
          ></textarea>
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">类型</label>
          <USelect v-model="newDataset.type" :options="typeOptions" />
        </div>
      </div>
      <template #footer>
        <UButton variant="outline" @click="showCreateDialog = false">
          取消
        </UButton>
        <UButton @click="handleConfirmCreate">
          创建
        </UButton>
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
