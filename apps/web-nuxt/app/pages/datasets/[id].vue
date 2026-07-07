<template>
  <div style="background: var(--bg-deep); min-height: 100vh; display: flex; flex-direction: column;">
    <header style="height: 3.5rem; border-bottom: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: space-between; padding: 0 1rem;">
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" @click="navigateTo('/datasets')">
          <UIcon name="lucide:arrow-left" style="width: 1rem; height: 1rem;" />
          返回
        </button>
        <div style="width: 2rem; height: 2rem; border-radius: 0.5rem; background: var(--accent-soft-bg); display: flex; align-items: center; justify-content: center;">
          <UIcon name="lucide:database" style="width: 1.25rem; height: 1.25rem; color: var(--accent-soft-text);" />
        </div>
        <div>
          <h1 class="font-display" style="font-weight: 600; color: var(--text-primary);">{{ currentDataset?.name || '知识库详情' }}</h1>
          <p style="font-size: 0.75rem; color: var(--text-secondary);">
            {{ currentDataset?.docCount || 0 }} 文档 · {{ currentDataset?.chunkCount || 0 }} 分段
          </p>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 0.5rem;">
        <button class="btn-glass" @click="handleTest">
          <UIcon name="lucide:search" style="width: 1rem; height: 1rem;" />
          检索测试
        </button>
        <button class="btn-glass btn-glass--primary" @click="handleUpload">
          <UIcon name="lucide:upload" style="width: 1rem; height: 1rem;" />
          上传文档
        </button>
      </div>
    </header>

    <div style="flex: 1; display: flex; overflow: hidden;">
      <aside style="width: 14rem; border-right: 1px solid var(--glass-border); background: var(--glass-bg-1);">
        <nav style="padding: 0.5rem;">
          <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.25rem;">
            <li
              v-for="tab in tabs"
              :key="tab.id"
              style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem; cursor: pointer;"
              :style="activeTab === tab.id ? { background: 'var(--accent-soft-bg)', color: 'var(--accent-soft-text)' } : { color: 'var(--text-secondary)' }"
              @click="activeTab = tab.id"
            >
              <UIcon :name="tab.icon" style="width: 1rem; height: 1rem;" />
              <span>{{ tab.label }}</span>
            </li>
          </ul>
        </nav>
      </aside>

      <div style="flex: 1; overflow-y: auto;">
        <div style="max-width: 64rem; margin: 0 auto; padding: 1.5rem;">
          <!-- 文档列表 -->
          <div v-if="activeTab === 'documents'">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
              <h2 class="font-display" style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary);">文档管理</h2>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <div style="position: relative; width: 12rem;">
                  <UIcon name="lucide:search" style="position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); width: 1rem; height: 1rem; color: var(--text-secondary);" />
                  <input v-model="docKeyword" placeholder="搜索文档..." style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.375rem 0.75rem 0.375rem 2rem; color: var(--text-primary); outline: none; width: 100%; font-size: 0.875rem;" />
                </div>
              </div>
            </div>

            <div class="glass-panel" style="padding: 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid var(--glass-border);">
                    <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary);">文件名</th>
                    <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); width: 6rem;">类型</th>
                    <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); width: 6rem;">大小</th>
                    <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); width: 5rem;">分段</th>
                    <th style="text-align: left; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); width: 6rem;">状态</th>
                    <th style="text-align: right; padding: 0.75rem 1rem; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); width: 6rem;">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="doc in filteredDocuments"
                    :key="doc.id"
                    style="border-bottom: 1px solid var(--glass-border);"
                  >
                    <td style="padding: 0.75rem 1rem;">
                      <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <UIcon name="lucide:file-text" style="width: 1rem; height: 1rem; color: var(--text-secondary);" />
                        <span style="font-weight: 500; color: var(--text-primary);">{{ doc.name }}</span>
                      </div>
                    </td>
                    <td style="padding: 0.75rem 1rem; font-size: 0.875rem;">
                      <UBadge variant="outline" size="sm">
                        {{ typeText(doc.type) }}
                      </UBadge>
                    </td>
                    <td style="padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--text-secondary);">
                      {{ doc.size > 0 ? formatSize(doc.size) : '-' }}
                    </td>
                    <td style="padding: 0.75rem 1rem; font-size: 0.875rem; color: var(--text-secondary);">
                      {{ doc.chunkCount > 0 ? doc.chunkCount : '-' }}
                    </td>
                    <td style="padding: 0.75rem 1rem;">
                      <span
                        style="display: inline-flex; align-items: center; gap: 0.375rem; font-size: 0.875rem;"
                        :style="{
                          color: doc.status === 'completed' ? '#22c55e' : doc.status === 'parsing' ? '#eab308' : doc.status === 'error' ? '#ef4444' : undefined,
                        }"
                      >
                        <span
                          style="width: 0.5rem; height: 0.5rem; border-radius: 50%;"
                          :style="{
                            backgroundColor: doc.status === 'completed' ? '#22c55e' : doc.status === 'parsing' ? '#eab308' : doc.status === 'error' ? '#ef4444' : undefined,
                          }"
                        ></span>
                        {{ statusText(doc.status) }}
                      </span>
                    </td>
                    <td style="padding: 0.75rem 1rem; text-align: right;">
                      <UDropdownMenu>
                        <button class="btn-glass" style="font-size: 0.875rem; padding: 0.25rem 0.5rem;" icon="lucide:more-horizontal">
                          <UIcon name="lucide:more-horizontal" style="width: 1rem; height: 1rem;" />
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
              <div v-if="filteredDocuments.length === 0" style="text-align: center; padding-top: 3rem; padding-bottom: 3rem;">
                <UIcon name="lucide:folder-open" style="width: 3rem; height: 3rem; margin: 0 auto; color: var(--text-secondary); margin-bottom: 0.75rem;" />
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">暂无文档</p>
                <button class="btn-glass btn-glass--primary" style="font-size: 0.875rem;" @click="handleUpload">
                  上传文档
                </button>
              </div>
            </div>
          </div>

          <!-- 分段管理 -->
          <div v-if="activeTab === 'chunks'">
            <h2 class="font-display" style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem;">分段管理</h2>
            <div class="glass-panel" style="padding: 1rem;">
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div
                  v-for="chunk in mockChunks"
                  :key="chunk.id"
                  style="padding: 1rem; border: 1px solid var(--glass-border); border-radius: 0.5rem;"
                >
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary);">{{ chunk.id }}</span>
                    <span style="font-size: 0.75rem; color: var(--text-secondary);">{{ chunk.tokens }} tokens</span>
                  </div>
                  <p style="font-size: 0.875rem; color: var(--text-secondary); overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;">{{ chunk.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 检索测试 -->
          <div v-if="activeTab === 'test'">
            <h2 class="font-display" style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem;">检索测试</h2>
            <div class="glass-panel" style="padding: 1rem;">
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">查询内容</label>
                  <div style="display: flex; gap: 0.5rem;">
                    <input v-model="testQuery" placeholder="输入要测试的查询内容..." style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
                    <button class="btn-glass btn-glass--primary" @click="handleTestSearch" :loading="testing">
                      检索
                    </button>
                  </div>
                </div>

                <div v-if="testResults.length > 0">
                  <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: var(--text-primary);">检索结果</label>
                  <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                    <div
                      v-for="(result, index) in testResults"
                      :key="index"
                      style="padding: 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem;"
                    >
                      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                        <span style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary);">{{ result.source }}</span>
                        <span style="font-size: 0.75rem; color: var(--accent-soft-text);">相似度: {{ result.score }}%</span>
                      </div>
                      <p style="font-size: 0.875rem; color: var(--text-secondary);">{{ result.content }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 设置 -->
          <div v-if="activeTab === 'settings'">
            <h2 class="font-display" style="font-size: 1.25rem; font-weight: 600; color: var(--text-primary); margin-bottom: 1.5rem;">知识库设置</h2>
            
            <section style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.125rem; font-weight: 500; color: var(--text-primary); margin-bottom: 1rem;">基础设置</h3>
              <div class="glass-panel" style="padding: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">知识库名称</label>
                    <input v-model="editForm.name" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">描述</label>
                    <textarea
                      v-model="editForm.description"
                      style="width: 100%; padding: 0.5rem 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem; outline: none; min-height: 80px; resize: none; background: var(--glass-bg-1); color: var(--text-primary);"
                    ></textarea>
                  </div>
                  <div>
                    <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">可见性</label>
                    <USelect v-model="editForm.type" :options="typeOptions" />
                  </div>
                </div>
              </div>
            </section>

            <section style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.125rem; font-weight: 500; color: var(--text-primary); margin-bottom: 1rem;">索引设置</h3>
              <div class="glass-panel" style="padding: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 1rem;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                      <div style="font-weight: 500; color: var(--text-primary);">自动索引</div>
                      <div style="font-size: 0.875rem; color: var(--text-secondary);">上传文档后自动进行向量化索引</div>
                    </div>
                    <USwitch v-model="editForm.autoIndex" />
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div>
                      <div style="font-weight: 500; color: var(--text-primary);">分段大小</div>
                      <div style="font-size: 0.875rem; color: var(--text-secondary);">每个文本分段的最大字符数</div>
                    </div>
                    <input v-model.number="editForm.chunkSize" type="number" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 8rem;" />
                  </div>
                </div>
              </div>
            </section>

            <section style="margin-bottom: 2rem;">
              <h3 style="font-size: 1.125rem; font-weight: 500; color: var(--text-primary); margin-bottom: 1rem;">成员管理</h3>
              <div class="glass-panel" style="padding: 1rem;">
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
                  <div
                    v-for="member in members"
                    :key="member.id"
                    style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border: 1px solid var(--glass-border); border-radius: 0.5rem;"
                  >
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <UAvatar :text="member.name.charAt(0)" size="sm" />
                      <div>
                        <div style="font-weight: 500; font-size: 0.875rem; color: var(--text-primary);">{{ member.name }}</div>
                        <div style="font-size: 0.75rem; color: var(--text-secondary);">{{ member.email }}</div>
                      </div>
                    </div>
                    <UBadge :variant="member.role === 'owner' ? 'default' : 'outline'" size="sm">
                      {{ roleText(member.role) }}
                    </UBadge>
                  </div>
                </div>
                <button class="btn-glass" style="width: 100%;">
                  <UIcon name="lucide:user-plus" style="width: 1rem; height: 1rem;" />
                  添加成员
                </button>
              </div>
            </section>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
              <button class="btn-glass" style="color: #ef4444;" color="red">
                删除知识库
              </button>
              <button class="btn-glass btn-glass--primary" @click="handleSaveSettings" :loading="saving">
                保存设置
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <UDialog v-model:open="showUploadDialog" title="上传文档">
      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div
          style="border: 2px dashed var(--glass-border); border-radius: 0.5rem; padding: 2rem; text-align: center; cursor: pointer;"
          @click="triggerFileInput"
        >
          <UIcon name="lucide:upload-cloud" style="width: 3rem; height: 3rem; margin: 0 auto; color: var(--text-secondary); margin-bottom: 0.75rem;" />
          <p style="font-weight: 500; color: var(--text-primary); margin-bottom: 0.25rem;">点击或拖拽文件到此处上传</p>
          <p style="font-size: 0.875rem; color: var(--text-secondary);">支持 PDF、Word、Markdown、TXT 等格式</p>
          <input ref="fileInputRef" type="file" style="display: none;" multiple @change="handleFileSelect" />
        </div>
        <div v-if="uploadList.length > 0" style="display: flex; flex-direction: column; gap: 0.5rem;">
          <div
            v-for="(item, index) in uploadList"
            :key="index"
            style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem; border: 1px solid var(--glass-border); border-radius: 0.375rem;"
          >
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <UIcon name="lucide:file" style="width: 1rem; height: 1rem; color: var(--text-secondary);" />
              <span style="font-size: 0.875rem; color: var(--text-primary);">{{ item.name }}</span>
            </div>
            <span style="font-size: 0.75rem; color: var(--text-secondary);">{{ item.status }}</span>
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
