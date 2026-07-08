<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">MCP 服务管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">管理模型上下文协议服务和工具</p>
      </div>
      <button class="btn-glass btn-glass--primary" @click="showAddDialog = true">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        添加服务
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">总服务数</p>
            <p class="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{{ stats.totalServices }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
            <UIcon name="lucide:server" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">运行中</p>
            <p class="text-2xl font-bold mt-1 text-green-600 dark:text-green-400">{{ stats.running }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/30">
            <UIcon name="lucide:check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">已停止</p>
            <p class="text-2xl font-bold mt-1 text-yellow-600 dark:text-yellow-400">{{ stats.stopped }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30">
            <UIcon name="lucide:pause-circle" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </div>
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-slate-500">工具总数</p>
            <p class="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{{ stats.totalTools }}</p>
          </div>
          <div class="w-12 h-12 rounded-full flex items-center justify-center bg-purple-100 dark:bg-purple-900/30">
            <UIcon name="lucide:wrench" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <UInput v-model="searchKeyword" placeholder="搜索服务名称..." class="w-64">
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4 text-slate-400" />
          </template>
        </UInput>
        <USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
        <USelect v-model="typeFilter" :options="typeOptions" class="w-40" />
        <div class="flex-1"></div>
        <button class="btn-glass" @click="resetFilters">重置筛选</button>
      </div>
    </div>

    <!-- Error banner -->
    <div v-if="error" class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-500 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">{{ error }}</p>
        <p class="text-xs text-red-500 dark:text-red-400 mt-0.5">已回退到本地模拟数据</p>
      </div>
      <button class="btn-glass text-red-600 hover:bg-red-100 dark:hover:bg-red-900/40" @click="fetchServices">
        <UIcon name="lucide:refresh-cw" class="w-4 h-4" />
        重试
      </button>
    </div>

    <!-- Loading spinner -->
    <div v-if="loading" class="flex items-center justify-center py-16">
      <div class="flex flex-col items-center gap-3">
        <div class="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p class="text-sm text-slate-500">正在加载服务列表...</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="service in filteredServices"
        :key="service.id"
        class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5 cursor-pointer transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
        @click="viewServiceDetail(service)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="service.type === 'stdio' ? 'bg-blue-100 dark:bg-blue-900/30' : service.type === 'sse' ? 'bg-green-100 dark:bg-green-900/30' : service.type === 'websocket' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-purple-100 dark:bg-purple-900/30'"
            >
              <UIcon :name="getServiceIcon(service.type)" class="w-5 h-5" :class="service.type === 'stdio' ? 'text-blue-600 dark:text-blue-400' : service.type === 'sse' ? 'text-green-600 dark:text-green-400' : service.type === 'websocket' ? 'text-yellow-600 dark:text-yellow-400' : 'text-purple-600 dark:text-purple-400'" />
            </div>
            <div>
              <h3 class="font-semibold text-slate-900 dark:text-white">{{ service.name }}</h3>
              <p class="text-xs text-slate-500">{{ service.type }}</p>
            </div>
          </div>
          <span
            class="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
            :class="service.status === 'running' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : service.status === 'stopped' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="service.status === 'running' ? 'bg-green-500' : service.status === 'stopped' ? 'bg-yellow-500' : 'bg-red-500'"
            ></span>
            {{ getStatusText(service.status) }}
          </span>
        </div>

        <p class="text-sm mb-4 line-clamp-2 text-slate-600 dark:text-slate-400">{{ service.description }}</p>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-1 text-slate-500">
            <UIcon name="lucide:wrench" class="w-4 h-4" />
            <span>{{ service.toolCount }} 个工具</span>
          </div>
          <div class="flex items-center gap-2">
            <button
              v-if="service.status === 'running'"
              class="btn-glass"
              @click.stop="toggleService(service)"
            >
              <UIcon name="lucide:pause" class="w-4 h-4" />
            </button>
            <button
              v-else
              class="btn-glass"
              @click.stop="toggleService(service)"
            >
              <UIcon name="lucide:play" class="w-4 h-4" />
            </button>
            <UDropdownMenu>
              <button class="btn-glass" @click.stop>
                <UIcon name="lucide:more-horizontal" class="w-4 h-4" />
              </button>
              <template #items>
                <UDropdownMenuItem label="查看详情" icon="lucide:eye" @click="viewServiceDetail(service)" />
                <UDropdownMenuItem label="编辑配置" icon="lucide:settings" @click="editService(service)" />
                <UDropdownMenuItem label="查看日志" icon="lucide:file-text" @click="viewLogs(service)" />
                <UDropdownMenuItem label="删除服务" icon="lucide:trash-2" color="red" @click="deleteService(service)" />
              </template>
            </UDropdownMenu>
          </div>
        </div>
      </div>
    </div>

    <div v-if="!loading && filteredServices.length === 0" class="text-center py-12">
      <UIcon name="lucide:server-off" class="w-12 h-12 mx-auto mb-3 text-slate-400" />
      <p class="mb-4 text-slate-500">未找到匹配的 MCP 服务</p>
      <button class="btn-glass btn-glass--primary" @click="showAddDialog = true">
        <UIcon name="lucide:plus" class="w-4 h-4" />
        添加第一个服务
      </button>
    </div>

    <UDialog v-model="showAddDialog" :title="editingService ? '编辑 MCP 服务' : '添加 MCP 服务'" size="lg">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">服务名称</label>
          <UInput v-model="formData.name" placeholder="输入服务名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">服务类型</label>
          <USelect v-model="formData.type" :options="serviceTypeOptions" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">服务描述</label>
          <UTextarea v-model="formData.description" placeholder="输入服务描述" rows="3" />
        </div>
        <div v-if="formData.type === 'stdio'">
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">启动命令</label>
          <UInput v-model="formData.command" placeholder="例如: npx -y @modelcontextprotocol/server-filesystem /path/to/files" />
          <p class="text-xs mt-1 text-slate-500">用于启动 MCP 服务器的命令</p>
        </div>
        <div v-else-if="formData.type === 'sse'">
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">SSE 端点 URL</label>
          <UInput v-model="formData.url" placeholder="https://example.com/mcp/sse" />
          <p class="text-xs mt-1 text-slate-500">MCP SSE 服务器的完整 URL</p>
        </div>
        <div v-else-if="formData.type === 'websocket'">
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">WebSocket URL</label>
          <UInput v-model="formData.url" placeholder="ws://localhost:8080/mcp" />
          <p class="text-xs mt-1 text-slate-500">MCP WebSocket 服务器地址</p>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.autoStart" />
            <span class="text-sm text-slate-700 dark:text-slate-300">启动时自动运行</span>
          </label>
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showAddDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveService">{{ editingService ? '保存' : '添加' }}</button>
      </template>
    </UDialog>

    <UDrawer v-model="showDetailDrawer" :title="selectedService?.name || '服务详情'" side="right" size="lg">
      <div v-if="selectedService" class="space-y-6">
        <div>
          <h3 class="text-sm font-medium mb-2 text-slate-500">服务状态</h3>
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :class="selectedService.type === 'stdio' ? 'bg-blue-100 dark:bg-blue-900/30' : selectedService.type === 'sse' ? 'bg-green-100 dark:bg-green-900/30' : selectedService.type === 'websocket' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-purple-100 dark:bg-purple-900/30'"
                >
                  <UIcon :name="getServiceIcon(selectedService.type)" class="w-6 h-6" :class="selectedService.type === 'stdio' ? 'text-blue-600 dark:text-blue-400' : selectedService.type === 'sse' ? 'text-green-600 dark:text-green-400' : selectedService.type === 'websocket' ? 'text-yellow-600 dark:text-yellow-400' : 'text-purple-600 dark:text-purple-400'" />
                </div>
                <div>
                  <h4 class="font-semibold text-slate-900 dark:text-white">{{ selectedService.name }}</h4>
                  <p class="text-sm text-slate-500">{{ selectedService.type }}</p>
                </div>
              </div>
              <span
                class="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
                :class="selectedService.status === 'running' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : selectedService.status === 'stopped' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="selectedService.status === 'running' ? 'bg-green-500' : selectedService.status === 'stopped' ? 'bg-yellow-500' : 'bg-red-500'"
                ></span>
                {{ getStatusText(selectedService.status) }}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2 text-slate-500">服务描述</h3>
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <p class="text-sm text-slate-700 dark:text-slate-300">{{ selectedService.description }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-medium mb-2 text-slate-500">配置信息</h3>
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-5">
            <div class="space-y-3">
              <div v-if="selectedService.command" class="flex items-start justify-between">
                <span class="text-sm text-slate-500">启动命令</span>
                <code class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{{ selectedService.command }}</code>
              </div>
              <div v-if="selectedService.url" class="flex items-start justify-between">
                <span class="text-sm text-slate-500">服务地址</span>
                <code class="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">{{ selectedService.url }}</code>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-500">工具数量</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ selectedService.toolCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-500">自动启动</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ selectedService.autoStart ? '是' : '否' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-slate-500">创建时间</span>
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ selectedService.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-slate-500">工具列表</h3>
            <button class="btn-glass" @click="testTools = !testTools">
              <UIcon name="lucide:play-circle" class="w-4 h-4" />
              测试工具
            </button>
          </div>
          <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <div>
              <div
                v-for="(tool, toolIndex) in selectedService.tools"
                :key="tool.name"
                class="p-4 border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-sm text-slate-900 dark:text-white">{{ tool.name }}</h4>
                    <p class="text-xs mt-1 text-slate-500">{{ tool.description }}</p>
                  </div>
                  <button class="btn-glass" @click="testTool(tool)">
                    <UIcon name="lucide:play" class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flex gap-3">
          <button
            v-if="selectedService.status === 'running'"
            class="btn-glass flex-1"
            @click="toggleService(selectedService)"
          >
            <UIcon name="lucide:pause" class="w-4 h-4" />
            停止服务
          </button>
          <button
            v-else
            class="btn-glass btn-glass--primary flex-1"
            @click="toggleService(selectedService)"
          >
            <UIcon name="lucide:play" class="w-4 h-4" />
            启动服务
          </button>
          <button class="btn-glass" @click="editService(selectedService)">
            <UIcon name="lucide:edit" class="w-4 h-4" />
            编辑
          </button>
        </div>
      </div>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getMcpServerList } from '~/composables/api/core'

definePageMeta({
  layout: 'console',
})

type ServiceStatus = 'running' | 'stopped' | 'error'
type ServiceType = 'stdio' | 'sse' | 'websocket' | 'builtin'

interface McpTool {
  name: string
  description: string
  inputSchema?: Record<string, unknown>
}

interface McpService {
  id: string
  name: string
  type: ServiceType
  description: string
  status: ServiceStatus
  toolCount: number
  command?: string
  url?: string
  autoStart: boolean
  createdAt: string
  tools: McpTool[]
}

const searchKeyword = ref('')
const statusFilter = ref('all')
const typeFilter = ref('all')
const showAddDialog = ref(false)
const showDetailDrawer = ref(false)
const selectedService = ref<McpService | null>(null)
const editingService = ref<McpService | null>(null)
const testTools = ref(false)
const loading = ref(true)
const error = ref<string | null>(null)

const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '运行中', value: 'running' },
  { label: '已停止', value: 'stopped' },
  { label: '错误', value: 'error' },
]

const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '标准输入输出', value: 'stdio' },
  { label: 'SSE', value: 'sse' },
  { label: 'WebSocket', value: 'websocket' },
  { label: '内置服务', value: 'builtin' },
]

const serviceTypeOptions = [
  { label: '标准输入输出 (STDIO)', value: 'stdio' },
  { label: 'Server-Sent Events (SSE)', value: 'sse' },
  { label: 'WebSocket', value: 'websocket' },
  { label: '内置服务', value: 'builtin' },
]

const formData = ref({
  name: '',
  type: 'stdio' as ServiceType,
  description: '',
  command: '',
  url: '',
  autoStart: false,
})

const defaultServices: McpService[] = [
  {
    id: '1',
    name: '文件系统',
    type: 'stdio',
    description: '提供文件系统操作能力，支持文件读写、目录浏览等功能',
    status: 'running',
    toolCount: 8,
    command: 'npx -y @modelcontextprotocol/server-filesystem /data',
    autoStart: true,
    createdAt: '2024-01-15',
    tools: [
      { name: 'read_file', description: '读取指定路径的文件内容' },
      { name: 'write_file', description: '将内容写入指定路径的文件' },
      { name: 'list_directory', description: '列出目录中的文件和子目录' },
      { name: 'create_directory', description: '创建新目录' },
      { name: 'delete_file', description: '删除指定的文件或目录' },
      { name: 'move_file', description: '移动或重命名文件' },
      { name: 'copy_file', description: '复制文件到目标位置' },
      { name: 'search_files', description: '按名称搜索文件' },
    ],
  },
  {
    id: '2',
    name: 'GitHub',
    type: 'stdio',
    description: 'GitHub API 集成，支持仓库管理、Issue 处理、PR 审查等',
    status: 'running',
    toolCount: 12,
    command: 'npx -y @modelcontextprotocol/server-github',
    autoStart: true,
    createdAt: '2024-01-20',
    tools: [
      { name: 'list_repos', description: '列出用户的 GitHub 仓库' },
      { name: 'get_repo', description: '获取仓库详细信息' },
      { name: 'create_issue', description: '创建新的 Issue' },
      { name: 'list_issues', description: '列出仓库的 Issues' },
      { name: 'create_pr', description: '创建 Pull Request' },
      { name: 'review_pr', description: '审查 Pull Request' },
      { name: 'search_code', description: '在 GitHub 上搜索代码' },
      { name: 'get_file_contents', description: '获取仓库中文件的内容' },
    ],
  },
  {
    id: '3',
    name: '浏览器控制',
    type: 'websocket',
    description: '通过 WebSocket 控制浏览器进行网页操作和数据采集',
    status: 'stopped',
    toolCount: 10,
    url: 'ws://localhost:9222/mcp',
    autoStart: false,
    createdAt: '2024-02-01',
    tools: [
      { name: 'navigate', description: '导航到指定 URL' },
      { name: 'click', description: '点击页面元素' },
      { name: 'type', description: '在输入框中输入文本' },
      { name: 'screenshot', description: '截取当前页面截图' },
      { name: 'evaluate', description: '在页面中执行 JavaScript' },
      { name: 'get_text', description: '获取页面文本内容' },
    ],
  },
  {
    id: '4',
    name: '数据库查询',
    type: 'sse',
    description: '通过 SSE 协议连接数据库，支持 SQL 查询和数据操作',
    status: 'error',
    toolCount: 6,
    url: 'https://db.example.com/mcp/sse',
    autoStart: true,
    createdAt: '2024-02-10',
    tools: [
      { name: 'execute_query', description: '执行 SQL 查询语句' },
      { name: 'list_tables', description: '列出数据库中的所有表' },
      { name: 'get_table_schema', description: '获取表结构信息' },
      { name: 'insert_data', description: '向表中插入数据' },
      { name: 'update_data', description: '更新表中的数据' },
      { name: 'delete_data', description: '删除表中的数据' },
    ],
  },
  {
    id: '5',
    name: '邮件服务',
    type: 'builtin',
    description: '内置邮件发送服务，支持文本和 HTML 邮件',
    status: 'running',
    toolCount: 4,
    autoStart: true,
    createdAt: '2024-01-10',
    tools: [
      { name: 'send_email', description: '发送电子邮件' },
      { name: 'send_html_email', description: '发送 HTML 格式邮件' },
      { name: 'list_templates', description: '列出可用的邮件模板' },
      { name: 'get_status', description: '获取邮件发送状态' },
    ],
  },
  {
    id: '6',
    name: 'Slack 通知',
    type: 'stdio',
    description: 'Slack 集成服务，支持消息发送和频道管理',
    status: 'stopped',
    toolCount: 5,
    command: 'npx -y @modelcontextprotocol/server-slack',
    autoStart: false,
    createdAt: '2024-02-15',
    tools: [
      { name: 'send_message', description: '发送消息到 Slack 频道' },
      { name: 'list_channels', description: '列出所有频道' },
      { name: 'create_channel', description: '创建新频道' },
      { name: 'upload_file', description: '上传文件到 Slack' },
      { name: 'get_history', description: '获取频道历史消息' },
    ],
  },
]

const services = ref<McpService[]>([...defaultServices])

function mapApiItemToService(item: any): McpService {
  return {
    id: item.id || '',
    name: item.name || '',
    type: (item.type as ServiceType) || 'stdio',
    description: item.description || '',
    status: mapApiStatus(item.status),
    toolCount: item.toolCount ?? item.tools?.length ?? 0,
    command: item.command || item.commandLine || undefined,
    url: item.url || item.serverUrl || undefined,
    autoStart: item.autoStart ?? item.autoRun ?? false,
    createdAt: item.createdAt || item.created_at || '',
    tools: (item.tools || []).map((t: any) => ({
      name: t.name || '',
      description: t.description || '',
      inputSchema: t.inputSchema || t.input_schema,
    })),
  }
}

function mapApiStatus(status: string | undefined): ServiceStatus {
  if (!status) return 'stopped'
  const s = status.toLowerCase()
  if (s === 'active' || s === 'running' || s === 'connected') return 'running'
  if (s === 'error' || s === 'failed') return 'error'
  return 'stopped'
}

async function fetchServices() {
  loading.value = true
  error.value = null
  try {
    const response = await getMcpServerList()
    if (response && response.items && response.items.length > 0) {
      services.value = response.items.map(mapApiItemToService)
    }
    // If response has no items, keep existing mock data
  } catch (e: any) {
    error.value = e?.message || '无法加载 MCP 服务列表'
    services.value = [...defaultServices]
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchServices()
})

const stats = computed(() => ({
  totalServices: services.value.length,
  running: services.value.filter(s => s.status === 'running').length,
  stopped: services.value.filter(s => s.status === 'stopped').length,
  error: services.value.filter(s => s.status === 'error').length,
  totalTools: services.value.reduce((sum, s) => sum + s.toolCount, 0),
}))

const filteredServices = computed(() => {
  let result = [...services.value]

  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      s =>
        s.name.toLowerCase().includes(kw) ||
        s.description.toLowerCase().includes(kw)
    )
  }

  if (statusFilter.value !== 'all') {
    result = result.filter(s => s.status === statusFilter.value)
  }

  if (typeFilter.value !== 'all') {
    result = result.filter(s => s.type === typeFilter.value)
  }

  return result
})

function getStatusText(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    running: '运行中',
    stopped: '已停止',
    error: '错误',
  }
  return map[status]
}

function getServiceIcon(type: ServiceType): string {
  const map: Record<ServiceType, string> = {
    stdio: 'lucide:terminal',
    sse: 'lucide:radio',
    websocket: 'lucide:zap',
    builtin: 'lucide:box',
  }
  return map[type]
}

function resetFilters() {
  searchKeyword.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
}

function toggleService(service: McpService) {
  if (service.status === 'running') {
    service.status = 'stopped'
  } else {
    service.status = 'running'
  }
}

function viewServiceDetail(service: McpService) {
  selectedService.value = service
  showDetailDrawer.value = true
}

function editService(service: McpService) {
  editingService.value = service
  formData.value = {
    name: service.name,
    type: service.type,
    description: service.description,
    command: service.command || '',
    url: service.url || '',
    autoStart: service.autoStart,
  }
  showDetailDrawer.value = false
  showAddDialog.value = true
}

function viewLogs(service: McpService) {
  console.log('查看日志:', service.name)
}

function deleteService(service: McpService) {
  const index = services.value.findIndex(s => s.id === service.id)
  if (index > -1) {
    services.value.splice(index, 1)
  }
}

function saveService() {
  if (editingService.value) {
    const service = services.value.find(s => s.id === editingService.value!.id)
    if (service) {
      service.name = formData.value.name
      service.type = formData.value.type
      service.description = formData.value.description
      service.command = formData.value.command
      service.url = formData.value.url
      service.autoStart = formData.value.autoStart
    }
  } else {
    const newService: McpService = {
      id: Date.now().toString(),
      name: formData.value.name,
      type: formData.value.type,
      description: formData.value.description,
      status: 'stopped',
      toolCount: 0,
      command: formData.value.command,
      url: formData.value.url,
      autoStart: formData.value.autoStart,
      createdAt: new Date().toISOString().split('T')[0],
      tools: [],
    }
    services.value.unshift(newService)
  }

  showAddDialog.value = false
  resetForm()
}

function resetForm() {
  formData.value = {
    name: '',
    type: 'stdio',
    description: '',
    command: '',
    url: '',
    autoStart: false,
  }
  editingService.value = null
}

function testTool(tool: McpTool) {
  console.log('测试工具:', tool.name)
}
</script>