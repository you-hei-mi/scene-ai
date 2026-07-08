<template>
  <div class="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <header class="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-slate-200/80 dark:border-slate-700/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
      <div class="flex items-center gap-4">
        <button class="btn-glass p-2 hover:bg-slate-100 dark:hover:bg-slate-800" @click="navigateTo('/datasets')">
          <UIcon name="lucide:arrow-left" class="w-4 h-4" />
        </button>
        <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-primary to-accent">
          <UIcon name="lucide:database" class="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 class="font-display font-bold text-slate-900 dark:text-white">{{ currentDataset?.name || '知识库详情' }}</h1>
          <p class="text-xs text-slate-500">{{ currentDataset?.docCount || 0 }} 文档 · {{ currentDataset?.chunkCount || 0 }} 分段</p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn-glass" @click="handleTest">
          <UIcon name="lucide:search" class="w-4 h-4" />
          检索测试
        </button>
        <button class="btn-glass btn-glass--primary" @click="handleUpload">
          <UIcon name="lucide:upload" class="w-4 h-4" />
          上传文档
        </button>
      </div>
    </header>

    <div class="flex-1 flex overflow-hidden">
      <aside class="w-48 border-r border-slate-200/50 dark:border-slate-700/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <nav class="p-3">
          <ul class="space-y-1">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              :class="[
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary dark:from-primary/20 dark:to-accent/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              ]"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" class="w-4 h-4" />
              <span>{{ tab.label }}</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div class="flex-1 overflow-y-auto">
        <div class="max-w-6xl mx-auto p-6 sm:p-8">
          <div v-if="activeTab === 'documents'" class="space-y-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <div class="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                <h2 class="font-display text-xl font-bold text-slate-900 dark:text-white">文档管理</h2>
              </div>
              <div class="relative w-48">
                <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  v-model="docKeyword" 
                  placeholder="搜索文档..." 
                  class="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
              <table class="w-full">
                <thead>
                  <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                    <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">文件名</th>
                    <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-20">类型</th>
                    <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-20">大小</th>
                    <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-16">分段</th>
                    <th class="text-left px-6 py-4 text-sm font-medium text-slate-500 w-24">状态</th>
                    <th class="text-right px-6 py-4 text-sm font-medium text-slate-500 w-24">操作</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
                  <tr
                    v-for="doc in filteredDocuments"
                    :key="doc.id"
                    class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-3">
                        <UIcon name="lucide:file-text" class="w-4 h-4 text-slate-400" />
                        <span class="font-medium text-slate-900 dark:text-white">{{ doc.name }}</span>
                      </div>
                    </td>
                    <td class="px-6 py-4">
                      <span class="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {{ typeText(doc.type) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">
                      {{ doc.size > 0 ? formatSize(doc.size) : '-' }}
                    </td>
                    <td class="px-6 py-4 text-sm text-slate-500">
                      {{ doc.chunkCount > 0 ? doc.chunkCount : '-' }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center gap-2">
                        <span
                          :class="[
                            'w-2 h-2 rounded-full',
                            doc.status === 'completed' ? 'bg-green-500' : doc.status === 'parsing' ? 'bg-amber-500 animate-pulse' : 'bg-red-500'
                          ]"
                        ></span>
                        <span
                          :class="[
                            'text-sm font-medium',
                            doc.status === 'completed' ? 'text-green-600 dark:text-green-400' : doc.status === 'parsing' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                          ]"
                        >
                          {{ statusText(doc.status) }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-4 text-right">
                      <UDropdownMenu>
                        <button class="btn-glass p-2">
                          <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
                        </button>
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
                <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700 mb-4">
                  <UIcon name="lucide:folder-open" class="w-8 h-8 text-slate-400" />
                </div>
                <p class="text-slate-500 mb-4">暂无文档</p>
                <button class="btn-glass btn-glass--primary" @click="handleUpload">
                  上传文档
                </button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'chunks'" class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 class="font-display text-xl font-bold text-slate-900 dark:text-white">分段管理</h2>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <div class="space-y-4">
                <div
                  v-for="chunk in mockChunks"
                  :key="chunk.id"
                  class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600/50"
                >
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ chunk.id }}</span>
                    <span class="text-xs text-slate-500">{{ chunk.tokens }} tokens</span>
                  </div>
                  <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{{ chunk.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'test'" class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 class="font-display text-xl font-bold text-slate-900 dark:text-white">检索测试</h2>
            </div>
            <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
              <div class="space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-2">查询内容</label>
                  <div class="flex gap-3">
                    <input 
                      v-model="testQuery" 
                      placeholder="输入要测试的查询内容..." 
                      class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                    <button class="btn-glass btn-glass--primary px-6" @click="handleTestSearch" :disabled="testing">
                      <span v-if="testing" class="inline-flex items-center gap-2">
                        <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        检索中...
                      </span>
                      <span v-else>检索</span>
                    </button>
                  </div>
                </div>

                <div v-if="testResults.length > 0">
                  <label class="block text-sm font-semibold text-slate-900 dark:text-white mb-3">检索结果</label>
                  <div class="space-y-4">
                    <div
                      v-for="(result, index) in testResults"
                      :key="index"
                      class="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600/50"
                    >
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-sm font-medium text-slate-900 dark:text-white">{{ result.source }}</span>
                        <span class="text-xs font-medium text-primary">相似度: {{ result.score }}%</span>
                      </div>
                      <p class="text-sm text-slate-600 dark:text-slate-400">{{ result.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'settings'" class="space-y-8">
            <div class="flex items-center gap-4">
              <div class="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full"></div>
              <h2 class="font-display text-xl font-bold text-slate-900 dark:text-white">知识库设置</h2>
            </div>
            
            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">基础设置</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div class="space-y-5">
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">知识库名称</label>
                    <input 
                      v-model="editForm.name" 
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">描述</label>
                    <textarea
                      v-model="editForm.description"
                      class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">可见性</label>
                    <USelect v-model="editForm.type" :options="typeOptions" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">索引设置</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div class="space-y-5">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-slate-900 dark:text-white">自动索引</div>
                      <div class="text-sm text-slate-500 mt-1">上传文档后自动进行向量化索引</div>
                    </div>
                    <USwitch v-model="editForm.autoIndex" />
                  </div>
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-slate-900 dark:text-white">分段大小</div>
                      <div class="text-sm text-slate-500 mt-1">每个文本分段的最大字符数</div>
                    </div>
                    <input 
                      v-model.number="editForm.chunkSize" 
                      type="number" 
                      class="w-28 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-center"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">成员管理</h3>
              <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
                <div class="space-y-3 mb-4">
                  <div
                    v-for="member in members"
                    :key="member.id"
                    class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600/50"
                  >
                    <div class="flex items-center gap-3">
                      <UAvatar :text="member.name.charAt(0)" size="sm" class="w-10 h-10" />
                      <div>
                        <div class="font-medium text-slate-900 dark:text-white">{{ member.name }}</div>
                        <div class="text-xs text-slate-500">{{ member.email }}</div>
                      </div>
                    </div>
                    <span
                      :class="[
                        'px-3 py-1 rounded-full text-xs font-medium',
                        member.role === 'owner' ? 'bg-primary/10 text-primary dark:bg-primary/20' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      ]"
                    >
                      {{ roleText(member.role) }}
                    </span>
                  </div>
                </div>
                <button class="w-full py-3 px-4 bg-slate-50 dark:bg-slate-700/50 border border-dashed border-slate-300 dark:border-slate-600 rounded-xl text-slate-600 dark:text-slate-400 hover:border-primary/50 hover:text-primary transition-all flex items-center justify-center gap-2">
                  <UIcon name="lucide:user-plus" class="w-4 h-4" />
                  添加成员
                </button>
              </div>
            </section>

            <div class="flex justify-end gap-3 pt-4">
              <button class="btn-glass text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20" color="red">
                删除知识库
              </button>
              <button class="btn-glass btn-glass--primary px-6" @click="handleSaveSettings" :disabled="saving">
                <span v-if="saving" class="inline-flex items-center gap-2">
                  <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  保存中...
                </span>
                <span v-else>保存设置</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UDialog v-model:open="showUploadDialog" title="上传文档">
      <div class="space-y-4">
        <div
          class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          @click="triggerFileInput"
        >
          <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
            <UIcon name="lucide:upload-cloud" class="w-8 h-8 text-slate-400" />
          </div>
          <p class="font-medium text-slate-900 dark:text-white mb-1">点击或拖拽文件到此处上传</p>
          <p class="text-sm text-slate-500">支持 PDF、Word、Markdown、TXT 等格式</p>
          <input ref="fileInputRef" type="file" class="hidden" multiple @change="handleFileSelect" />
        </div>
        <div v-if="uploadList.length > 0" class="space-y-3">
          <div
            v-for="(item, index) in uploadList"
            :key="index"
            class="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600/50"
          >
            <div class="flex items-center gap-3">
              <UIcon name="lucide:file" class="w-4 h-4 text-slate-400" />
              <span class="text-sm text-slate-900 dark:text-white">{{ item.name }}</span>
            </div>
            <span class="text-xs text-slate-500">{{ item.status }}</span>
          </div>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showUploadDialog = false">
          取消
        </button>
        <button class="btn-glass btn-glass--primary" @click="handleStartUpload">
          开始上传
        </button>
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
