<template>
  <div class="h-screen flex flex-col bg-background">
    <header class="h-14 border-b border-border flex items-center justify-between px-4">
      <div class="flex items-center gap-3">
        <UButton variant="ghost" size="sm" @click="navigateTo('/datasets')">
          <template #icon>
            <UIcon name="lucide:arrow-left" class="w-4 h-4" />
          </template>
          返回
        </UButton>
        <div class="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <UIcon name="lucide:database" class="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 class="font-semibold">{{ currentDataset?.name || '知识库详情' }}</h1>
          <p class="text-xs text-muted-foreground">
            {{ currentDataset?.docCount || 0 }} 文档 · {{ currentDataset?.chunkCount || 0 }} 分段
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <UButton variant="outline" @click="handleTest">
          <template #icon>
            <UIcon name="lucide:search" class="w-4 h-4" />
          </template>
          检索测试
        </UButton>
        <UButton @click="handleUpload">
          <template #icon>
            <UIcon name="lucide:upload" class="w-4 h-4" />
          </template>
          上传文档
        </UButton>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-56 border-r border-border bg-card/30">
        <nav class="p-2">
          <ul class="space-y-1">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              class="flex items-center gap-2 px-3 py-2 rounded-md text-sm cursor-pointer transition-colors"
              :class="activeTab === tab.id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50'"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-5xl mx-auto p-6">
          <!-- 文档列表 -->
          <div v-if="activeTab === 'documents'">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl font-semibold">文档管理</h2>
              <div class="flex items-center gap-2">
                <UInput v-model="docKeyword" placeholder="搜索文档..." size="sm" class="w-48">
                  <template #leading>
                    <UIcon name="lucide:search" class="w-4 h-4 text-muted-foreground" />
                  </template>
                </UInput>
              </div>
            </div>

            <UCard class="p-0">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-border">
                    <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground">文件名</th>
                    <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">类型</th>
                    <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">大小</th>
                    <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-20">分段</th>
                    <th class="text-left px-4 py-3 text-sm font-medium text-muted-foreground w-24">状态</th>
                    <th class="text-right px-4 py-3 text-sm font-medium text-muted-foreground w-24">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="doc in filteredDocuments"
                    :key="doc.id"
                    class="border-b border-border last:border-0 hover:bg-accent/30"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <UIcon name="lucide:file-text" class="w-4 h-4 text-muted-foreground" />
                        <span class="font-medium">{{ doc.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-sm">
                      <UBadge variant="outline" size="sm">
                        {{ typeText(doc.type) }}
                      </UBadge>
                    </td>
                    <td class="px-4 py-3 text-sm text-muted-foreground">
                      {{ doc.size > 0 ? formatSize(doc.size) : '-' }}
                    </td>
                    <td class="px-4 py-3 text-sm text-muted-foreground">
                      {{ doc.chunkCount > 0 ? doc.chunkCount : '-' }}
                    </td>
                    <td class="px-4 py-3">
                      <span
                        class="inline-flex items-center gap-1.5 text-sm"
                        :class="{
                          'text-green-600': doc.status === 'completed',
                          'text-yellow-600': doc.status === 'parsing',
                          'text-red-600': doc.status === 'error',
                        }"
                      >
                        <span
                          class="w-2 h-2 rounded-full"
                          :class="{
                            'bg-green-600': doc.status === 'completed',
                            'bg-yellow-600 animate-pulse': doc.status === 'parsing',
                            'bg-red-600': doc.status === 'error',
                          }"
                        ></span>
                        {{ statusText(doc.status) }}
                      </span>
                    </td>
                    <td class="px-4 py-3 text-right">
                      <UDropdownMenu>
                        <UButton variant="ghost" size="sm" icon="lucide:more-horizontal" />
                        <template #items>
                          <UDropdownMenuItem label="查看分段" icon="lucide:layers" />
                          <UDropdownMenuItem label="重新解析" icon="lucide:refresh-cw" />
                          <UDropdownMenuItem label="下载" icon="lucide:download" />
                          <UDropdownMenuItem label="删除" icon="lucide:trash-2" color="red" />
                        </template>
                      </UDropdownMenu>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div v-if="filteredDocuments.length === 0" class="text-center py-12">
                <UIcon name="lucide:folder-open" class="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p class="text-muted-foreground mb-4">暂无文档</p>
                <UButton size="sm" @click="handleUpload">
                  上传文档
                </UButton>
              </div>
            </UCard>
          </div>

          <!-- 分段管理 -->
          <div v-if="activeTab === 'chunks'">
            <h2 class="text-xl font-semibold mb-6">分段管理</h2>
            <UCard>
              <div class="space-y-4">
                <div
                  v-for="chunk in mockChunks"
                  :key="chunk.id"
                  class="p-4 border border-border rounded-lg hover:bg-accent/30"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium">{{ chunk.id }}</span>
                    <span class="text-xs text-muted-foreground">{{ chunk.tokens }} tokens</span>
                  </div>
                  <p class="text-sm text-muted-foreground line-clamp-2">{{ chunk.content }}</p>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 检索测试 -->
          <div v-if="activeTab === 'test'">
            <h2 class="text-xl font-semibold mb-6">检索测试</h2>
            <UCard>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5">查询内容</label>
                  <div class="flex gap-2">
                    <UInput v-model="testQuery" placeholder="输入要测试的查询内容..." />
                    <UButton @click="handleTestSearch" :loading="testing">
                      检索
                    </UButton>
                  </div>
                </div>

                <div v-if="testResults.length > 0">
                  <label class="block text-sm font-medium mb-2">检索结果</label>
                  <div class="space-y-3">
                    <div
                      v-for="(result, index) in testResults"
                      :key="index"
                      class="p-3 border border-border rounded-lg"
                    >
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-sm font-medium">{{ result.source }}</span>
                        <span class="text-xs text-primary">相似度: {{ result.score }}%</span>
                      </div>
                      <p class="text-sm text-muted-foreground">{{ result.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </UCard>
          </div>

          <!-- 设置 -->
          <div v-if="activeTab === 'settings'">
            <h2 class="text-xl font-semibold mb-6">知识库设置</h2>
            
            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4">基础设置</h3>
              <UCard>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5">知识库名称</label>
                    <UInput v-model="editForm.name" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5">描述</label>
                    <textarea
                      v-model="editForm.description"
                      class="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[80px] resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5">可见性</label>
                    <USelect v-model="editForm.type" :options="typeOptions" />
                  </div>
                </div>
              </UCard>
            </section>

            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4">索引设置</h3>
              <UCard>
                <div class="space-y-4">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">自动索引</div>
                      <div class="text-sm text-muted-foreground">上传文档后自动进行向量化索引</div>
                    </div>
                    <USwitch v-model="editForm.autoIndex" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium">分段大小</div>
                      <div class="text-sm text-muted-foreground">每个文本分段的最大字符数</div>
                    </div>
                    <UInput v-model.number="editForm.chunkSize" class="w-32" type="number" />
                  </div>
                </div>
              </UCard>
            </section>

            <section class="mb-8">
              <h3 class="text-lg font-medium mb-4">成员管理</h3>
              <UCard>
                <div class="space-y-3 mb-4">
                  <div
                    v-for="member in members"
                    :key="member.id"
                    class="flex items-center justify-between p-3 border border-border rounded-lg"
                  >
                    <div class="flex items-center gap-3">
                      <UAvatar :text="member.name.charAt(0)" size="sm" />
                      <div>
                        <div class="font-medium text-sm">{{ member.name }}</div>
                        <div class="text-xs text-muted-foreground">{{ member.email }}</div>
                      </div>
                    </div>
                    <UBadge :variant="member.role === 'owner' ? 'default' : 'outline'" size="sm">
                      {{ roleText(member.role) }}
                    </UBadge>
                  </div>
                </div>
                <UButton variant="outline" class="w-full">
                  <template #icon>
                    <UIcon name="lucide:user-plus" class="w-4 h-4" />
                  </template>
                  添加成员
                </UButton>
              </UCard>
            </section>

            <div class="flex justify-end gap-3">
              <UButton variant="outline" color="red">
                删除知识库
              </UButton>
              <UButton @click="handleSaveSettings" :loading="saving">
                保存设置
              </UButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UDialog v-model:open="showUploadDialog" title="上传文档">
      <div class="space-y-4">
        <div
          class="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
          @click="triggerFileInput"
        >
          <UIcon name="lucide:upload-cloud" class="w-12 h-12 mx-auto text-muted-foreground mb-3" />
          <p class="font-medium mb-1">点击或拖拽文件到此处上传</p>
          <p class="text-sm text-muted-foreground">支持 PDF、Word、Markdown、TXT 等格式</p>
          <input ref="fileInputRef" type="file" class="hidden" multiple @change="handleFileSelect" />
        </div>
        <div v-if="uploadList.length > 0" class="space-y-2">
          <div
            v-for="(item, index) in uploadList"
            :key="index"
            class="flex items-center justify-between p-2 border border-border rounded-md"
          >
            <div class="flex items-center gap-2">
              <UIcon name="lucide:file" class="w-4 h-4 text-muted-foreground" />
              <span class="text-sm">{{ item.name }}</span>
            </div>
            <span class="text-xs text-muted-foreground">{{ item.status }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <UButton variant="outline" @click="showUploadDialog = false">
          取消
        </UButton>
        <UButton @click="handleStartUpload">
          开始上传
        </UButton>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const datasetStore = useDatasetStore()
const toast = useToast()
const route = useRoute()

const datasetId = computed(() => route.params.id as string)
const currentDataset = computed(() => datasetStore.currentDataset)

const activeTab = ref('documents')
const saving = ref(false)
const testing = ref(false)
const showUploadDialog = ref(false)
const docKeyword = ref('')
const fileInputRef = ref<HTMLInputElement>()

const tabs = [
  { id: 'documents', label: '文档管理', icon: 'lucide:file-text' },
  { id: 'chunks', label: '分段管理', icon: 'lucide:layers' },
  { id: 'test', label: '检索测试', icon: 'lucide:search' },
  { id: 'settings', label: '设置', icon: 'lucide:settings' },
]

const typeOptions = [
  { label: '私有 - 仅成员可见', value: 'private' },
  { label: '公开 - 所有人可见', value: 'public' },
]

const editForm = ref({
  name: '',
  description: '',
  type: 'private',
  autoIndex: true,
  chunkSize: 500,
})

const testQuery = ref('')
const testResults = ref<any[]>([])

const uploadList = ref<any[]>([])

const mockChunks = ref([
  { id: 'chunk-001', tokens: 256, content: '这是第一段文本内容，包含了关于产品介绍的相关信息...' },
  { id: 'chunk-002', tokens: 312, content: '技术架构部分描述了系统的整体设计和各模块之间的关系...' },
  { id: 'chunk-003', tokens: 189, content: 'API 接口文档详细列出了所有可用的接口及其参数说明...' },
])

const members = ref([
  { id: '1', name: '张三', email: 'zhangsan@example.com', role: 'owner' },
  { id: '2', name: '李四', email: 'lisi@example.com', role: 'admin' },
  { id: '3', name: '王五', email: 'wangwu@example.com', role: 'member' },
])

const filteredDocuments = computed(() => {
  let result = [...datasetStore.documents]
  if (docKeyword.value.trim()) {
    const kw = docKeyword.value.toLowerCase()
    result = result.filter(d => d.name.toLowerCase().includes(kw))
  }
  return result
})

function typeText(type: string) {
  const map: Record<string, string> = {
    file: '文件',
    url: '网页',
    text: '文本',
  }
  return map[type] || type
}

function statusText(status: string) {
  const map: Record<string, string> = {
    completed: '已完成',
    parsing: '解析中',
    error: '失败',
  }
  return map[status] || status
}

function roleText(role: string) {
  const map: Record<string, string> = {
    owner: '所有者',
    admin: '管理员',
    member: '成员',
  }
  return map[role] || role
}

function formatSize(bytes: number): string {
  return datasetStore.formatSize(bytes)
}

function handleUpload() {
  uploadList.value = []
  showUploadDialog.value = true
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files) {
    uploadList.value = Array.from(target.files).map(f => ({
      name: f.name,
      size: f.size,
      status: '等待上传',
    }))
  }
}

function handleStartUpload() {
  toast.add({ title: '开始上传...', color: 'blue' })
  showUploadDialog.value = false
}

function handleTest() {
  activeTab.value = 'test'
}

async function handleTestSearch() {
  if (!testQuery.value.trim()) return
  
  testing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
    testResults.value = [
      {
        source: '产品需求文档 v2.0.pdf - 第 3 页',
        content: '关于产品功能的详细描述，包括核心模块和扩展功能的设计思路...',
        score: 92.5,
      },
      {
        source: 'API 接口文档.md',
        content: '接口调用方式和参数说明，支持多种数据格式的请求和响应...',
        score: 85.3,
      },
      {
        source: '用户操作手册.docx',
        content: '用户使用指南和常见问题解答，帮助用户快速上手使用系统...',
        score: 78.1,
      },
    ]
  } finally {
    testing.value = false
  }
}

async function handleSaveSettings() {
  saving.value = true
  try {
    await datasetStore.updateDataset(datasetId.value, editForm.value as any)
    toast.add({ title: '保存成功', color: 'green' })
  } finally {
    saving.value = false
  }
}

watch(currentDataset, (dataset) => {
  if (dataset) {
    editForm.value.name = dataset.name
    editForm.value.description = dataset.description
    editForm.value.type = dataset.type
  }
})

onMounted(() => {
  if (datasetId.value) {
    datasetStore.fetchDatasetDetail(datasetId.value)
  }
})
</script>
