<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">MCP 服务管理</h1>
        <p class="text-muted-foreground text-sm mt-1">管理模型上下文协议服务和工具</p>
      </div>
      <UButton @click="showAddDialog = true">
        <template #icon>
          <UIcon name="lucide:plus" class="w-4 h-4" />
        </template>
        添加服务
      </UButton>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">总服务数</p>
            <p class="text-2xl font-bold mt-1">{{ stats.totalServices }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <UIcon name="lucide:server" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">运行中</p>
            <p class="text-2xl font-bold mt-1 text-green-600">{{ stats.running }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <UIcon name="lucide:check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">已停止</p>
            <p class="text-2xl font-bold mt-1 text-yellow-600">{{ stats.stopped }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <UIcon name="lucide:pause-circle" class="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
        </div>
      </UCard>
      <UCard>
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-muted-foreground">工具总数</p>
            <p class="text-2xl font-bold mt-1">{{ stats.totalTools }}</p>
          </div>
          <div class="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <UIcon name="lucide:wrench" class="w-6 h-6 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
      </UCard>
    </div>

    <!-- 筛选和搜索 -->
    <UCard class="mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <UInput v-model="searchKeyword" placeholder="搜索服务名称..." class="w-64">
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4 text-muted-foreground" />
          </template>
        </UInput>
        <USelect v-model="statusFilter" :options="statusOptions" class="w-40" />
        <USelect v-model="typeFilter" :options="typeOptions" class="w-40" />
        <div class="flex-1"></div>
        <UButton variant="outline" @click="resetFilters">
          重置筛选
        </UButton>
      </div>
    </UCard>

    <!-- 服务列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="service in filteredServices"
        :key="service.id"
        class="hover:shadow-md transition-shadow cursor-pointer"
        @click="viewServiceDetail(service)"
      >
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-lg flex items-center justify-center"
              :class="getServiceIconBg(service.type)"
            >
              <UIcon :name="getServiceIcon(service.type)" class="w-5 h-5" :class="getServiceIconColor(service.type)" />
            </div>
            <div>
              <h3 class="font-semibold">{{ service.name }}</h3>
              <p class="text-xs text-muted-foreground">{{ service.type }}</p>
            </div>
          </div>
          <span
            class="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
            :class="getStatusBadgeClass(service.status)"
          >
            <span
              class="w-1.5 h-1.5 rounded-full"
              :class="getStatusDotClass(service.status)"
            ></span>
            {{ getStatusText(service.status) }}
          </span>
        </div>

        <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ service.description }}</p>

        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center gap-1 text-muted-foreground">
            <UIcon name="lucide:wrench" class="w-4 h-4" />
            <span>{{ service.toolCount }} 个工具</span>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              v-if="service.status === 'running'"
              variant="ghost"
              size="sm"
              icon="lucide:pause"
              @click.stop="toggleService(service)"
            />
            <UButton
              v-else
              variant="ghost"
              size="sm"
              icon="lucide:play"
              @click.stop="toggleService(service)"
            />
            <UDropdownMenu>
              <UButton variant="ghost" size="sm" icon="lucide:more-horizontal" @click.stop />
              <template #items>
                <UDropdownMenuItem label="查看详情" icon="lucide:eye" @click="viewServiceDetail(service)" />
                <UDropdownMenuItem label="编辑配置" icon="lucide:settings" @click="editService(service)" />
                <UDropdownMenuItem label="查看日志" icon="lucide:file-text" @click="viewLogs(service)" />
                <UDropdownMenuItem label="删除服务" icon="lucide:trash-2" color="red" @click="deleteService(service)" />
              </template>
            </UDropdownMenu>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredServices.length === 0" class="text-center py-12">
      <UIcon name="lucide:server-off" class="w-12 h-12 mx-auto text-muted-foreground mb-3" />
      <p class="text-muted-foreground mb-4">未找到匹配的 MCP 服务</p>
      <UButton @click="showAddDialog = true">
        <template #icon>
          <UIcon name="lucide:plus" class="w-4 h-4" />
        </template>
        添加第一个服务
      </UButton>
    </div>

    <!-- 添加服务对话框 -->
    <UDialog v-model="showAddDialog" :title="editingService ? '编辑 MCP 服务' : '添加 MCP 服务'" size="lg">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5">服务名称</label>
          <UInput v-model="formData.name" placeholder="输入服务名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">服务类型</label>
          <USelect v-model="formData.type" :options="serviceTypeOptions" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5">服务描述</label>
          <UTextarea v-model="formData.description" placeholder="输入服务描述" rows="3" />
        </div>
        <div v-if="formData.type === 'stdio'">
          <label class="block text-sm font-medium mb-1.5">启动命令</label>
          <UInput v-model="formData.command" placeholder="例如: npx -y @modelcontextprotocol/server-filesystem /path/to/files" />
          <p class="text-xs text-muted-foreground mt-1">用于启动 MCP 服务器的命令</p>
        </div>
        <div v-else-if="formData.type === 'sse'">
          <label class="block text-sm font-medium mb-1.5">SSE 端点 URL</label>
          <UInput v-model="formData.url" placeholder="https://example.com/mcp/sse" />
          <p class="text-xs text-muted-foreground mt-1">MCP SSE 服务器的完整 URL</p>
        </div>
        <div v-else-if="formData.type === 'websocket'">
          <label class="block text-sm font-medium mb-1.5">WebSocket URL</label>
          <UInput v-model="formData.url" placeholder="ws://localhost:8080/mcp" />
          <p class="text-xs text-muted-foreground mt-1">MCP WebSocket 服务器地址</p>
        </div>
        <div>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="formData.autoStart" />
            <span class="text-sm">启动时自动运行</span>
          </label>
        </div>
      </div>
      <template #footer>
        <UButton variant="outline" @click="showAddDialog = false">取消</UButton>
        <UButton @click="saveService">{{ editingService ? '保存' : '添加' }}</UButton>
      </template>
    </UDialog>

    <!-- 服务详情抽屉 -->
    <UDrawer v-model="showDetailDrawer" :title="selectedService?.name || '服务详情'" side="right" size="lg">
      <div v-if="selectedService" class="space-y-6">
        <!-- 服务状态 -->
        <div>
          <h3 class="text-sm font-medium text-muted-foreground mb-2">服务状态</h3>
          <UCard>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div
                  class="w-12 h-12 rounded-lg flex items-center justify-center"
                  :class="getServiceIconBg(selectedService.type)"
                >
                  <UIcon :name="getServiceIcon(selectedService.type)" class="w-6 h-6" :class="getServiceIconColor(selectedService.type)" />
                </div>
                <div>
                  <h4 class="font-semibold">{{ selectedService.name }}</h4>
                  <p class="text-sm text-muted-foreground">{{ selectedService.type }}</p>
                </div>
              </div>
              <span
                class="inline-flex items-center gap-1.5 text-sm px-3 py-1 rounded-full"
                :class="getStatusBadgeClass(selectedService.status)"
              >
                <span
                  class="w-2 h-2 rounded-full"
                  :class="getStatusDotClass(selectedService.status)"
                ></span>
                {{ getStatusText(selectedService.status) }}
              </span>
            </div>
          </UCard>
        </div>

        <!-- 服务描述 -->
        <div>
          <h3 class="text-sm font-medium text-muted-foreground mb-2">服务描述</h3>
          <UCard>
            <p class="text-sm">{{ selectedService.description }}</p>
          </UCard>
        </div>

        <!-- 配置信息 -->
        <div>
          <h3 class="text-sm font-medium text-muted-foreground mb-2">配置信息</h3>
          <UCard>
            <div class="space-y-3">
              <div v-if="selectedService.command" class="flex items-start justify-between">
                <span class="text-sm text-muted-foreground">启动命令</span>
                <code class="text-xs bg-muted px-2 py-1 rounded">{{ selectedService.command }}</code>
              </div>
              <div v-if="selectedService.url" class="flex items-start justify-between">
                <span class="text-sm text-muted-foreground">服务地址</span>
                <code class="text-xs bg-muted px-2 py-1 rounded">{{ selectedService.url }}</code>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">工具数量</span>
                <span class="text-sm font-medium">{{ selectedService.toolCount }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">自动启动</span>
                <span class="text-sm font-medium">{{ selectedService.autoStart ? '是' : '否' }}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-sm text-muted-foreground">创建时间</span>
                <span class="text-sm">{{ selectedService.createdAt }}</span>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 工具列表 -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-muted-foreground">工具列表</h3>
            <UButton variant="outline" size="sm" @click="testTools = !testTools">
              <template #icon>
                <UIcon name="lucide:play-circle" class="w-4 h-4" />
              </template>
              测试工具
            </UButton>
          </div>
          <UCard class="p-0">
            <div class="divide-y divide-border">
              <div
                v-for="tool in selectedService.tools"
                :key="tool.name"
                class="p-4 hover:bg-accent/30 transition-colors"
              >
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h4 class="font-medium text-sm">{{ tool.name }}</h4>
                    <p class="text-xs text-muted-foreground mt-1">{{ tool.description }}</p>
                  </div>
                  <UButton variant="ghost" size="sm" icon="lucide:play" @click="testTool(tool)" />
                </div>
              </div>
            </div>
          </UCard>
        </div>

        <!-- 操作按钮 -->
        <div class="flex gap-3">
          <UButton
            v-if="selectedService.status === 'running'"
            variant="outline"
            class="flex-1"
            @click="toggleService(selectedService)"
          >
            <template #icon>
              <UIcon name="lucide:pause" class="w-4 h-4" />
            </template>
            停止服务
          </UButton>
          <UButton
            v-else
            class="flex-1"
            @click="toggleService(selectedService)"
          >
            <template #icon>
              <UIcon name="lucide:play" class="w-4 h-4" />
            </template>
            启动服务
          </UButton>
          <UButton variant="outline" @click="editService(selectedService)">
            <template #icon>
              <UIcon name="lucide:edit" class="w-4 h-4" />
            </template>
            编辑
          </UButton>
        </div>
      </div>
    </UDrawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * MCP 服务状态类型
 */
type ServiceStatus = 'running' | 'stopped' | 'error'

/**
 * MCP 服务类型
 */
type ServiceType = 'stdio' | 'sse' | 'websocket' | 'builtin'

/**
 * MCP 工具接口定义
 */
interface McpTool {
  name: string
  description: string
  inputSchema?: Record<string, unknown>
}

/**
 * MCP 服务接口定义
 */
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

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 状态筛选
 */
const statusFilter = ref('all')

/**
 * 类型筛选
 */
const typeFilter = ref('all')

/**
 * 是否显示添加对话框
 */
const showAddDialog = ref(false)

/**
 * 是否显示详情抽屉
 */
const showDetailDrawer = ref(false)

/**
 * 当前选中的服务
 */
const selectedService = ref<McpService | null>(null)

/**
 * 正在编辑的服务
 */
const editingService = ref<McpService | null>(null)

/**
 * 是否显示测试工具模式
 */
const testTools = ref(false)

/**
 * 状态筛选选项
 */
const statusOptions = [
  { label: '全部状态', value: 'all' },
  { label: '运行中', value: 'running' },
  { label: '已停止', value: 'stopped' },
  { label: '错误', value: 'error' },
]

/**
 * 类型筛选选项
 */
const typeOptions = [
  { label: '全部类型', value: 'all' },
  { label: '标准输入输出', value: 'stdio' },
  { label: 'SSE', value: 'sse' },
  { label: 'WebSocket', value: 'websocket' },
  { label: '内置服务', value: 'builtin' },
]

/**
 * 服务类型选项（用于表单）
 */
const serviceTypeOptions = [
  { label: '标准输入输出 (STDIO)', value: 'stdio' },
  { label: 'Server-Sent Events (SSE)', value: 'sse' },
  { label: 'WebSocket', value: 'websocket' },
  { label: '内置服务', value: 'builtin' },
]

/**
 * 表单数据
 */
const formData = ref({
  name: '',
  type: 'stdio' as ServiceType,
  description: '',
  command: '',
  url: '',
  autoStart: false,
})

/**
 * 模拟 MCP 服务数据
 */
const services = ref<McpService[]>([
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
])

/**
 * 统计数据
 */
const stats = computed(() => ({
  totalServices: services.value.length,
  running: services.value.filter(s => s.status === 'running').length,
  stopped: services.value.filter(s => s.status === 'stopped').length,
  error: services.value.filter(s => s.status === 'error').length,
  totalTools: services.value.reduce((sum, s) => sum + s.toolCount, 0),
}))

/**
 * 根据筛选条件过滤后的服务列表
 */
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

/**
 * 获取服务状态文本
 * @param status - 服务状态
 * @returns 状态显示文本
 */
function getStatusText(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    running: '运行中',
    stopped: '已停止',
    error: '错误',
  }
  return map[status]
}

/**
 * 获取状态徽章样式类
 * @param status - 服务状态
 * @returns CSS 类名
 */
function getStatusBadgeClass(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    running: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    stopped: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return map[status]
}

/**
 * 获取状态点样式类
 * @param status - 服务状态
 * @returns CSS 类名
 */
function getStatusDotClass(status: ServiceStatus): string {
  const map: Record<ServiceStatus, string> = {
    running: 'bg-green-500',
    stopped: 'bg-yellow-500',
    error: 'bg-red-500',
  }
  return map[status]
}

/**
 * 获取服务图标
 * @param type - 服务类型
 * @returns 图标名称
 */
function getServiceIcon(type: ServiceType): string {
  const map: Record<ServiceType, string> = {
    stdio: 'lucide:terminal',
    sse: 'lucide:radio',
    websocket: 'lucide:zap',
    builtin: 'lucide:box',
  }
  return map[type]
}

/**
 * 获取服务图标背景色
 * @param type - 服务类型
 * @returns CSS 类名
 */
function getServiceIconBg(type: ServiceType): string {
  const map: Record<ServiceType, string> = {
    stdio: 'bg-blue-100 dark:bg-blue-900/30',
    sse: 'bg-green-100 dark:bg-green-900/30',
    websocket: 'bg-yellow-100 dark:bg-yellow-900/30',
    builtin: 'bg-purple-100 dark:bg-purple-900/30',
  }
  return map[type]
}

/**
 * 获取服务图标颜色
 * @param type - 服务类型
 * @returns CSS 类名
 */
function getServiceIconColor(type: ServiceType): string {
  const map: Record<ServiceType, string> = {
    stdio: 'text-blue-600 dark:text-blue-400',
    sse: 'text-green-600 dark:text-green-400',
    websocket: 'text-yellow-600 dark:text-yellow-400',
    builtin: 'text-purple-600 dark:text-purple-400',
  }
  return map[type]
}

/**
 * 重置所有筛选条件
 */
function resetFilters() {
  searchKeyword.value = ''
  statusFilter.value = 'all'
  typeFilter.value = 'all'
}

/**
 * 切换服务运行状态
 * @param service - MCP 服务
 */
function toggleService(service: McpService) {
  if (service.status === 'running') {
    service.status = 'stopped'
  } else {
    service.status = 'running'
  }
}

/**
 * 查看服务详情
 * @param service - MCP 服务
 */
function viewServiceDetail(service: McpService) {
  selectedService.value = service
  showDetailDrawer.value = true
}

/**
 * 编辑服务
 * @param service - MCP 服务
 */
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

/**
 * 查看服务日志
 * @param service - MCP 服务
 */
function viewLogs(service: McpService) {
  console.log('查看日志:', service.name)
}

/**
 * 删除服务
 * @param service - MCP 服务
 */
function deleteService(service: McpService) {
  const index = services.value.findIndex(s => s.id === service.id)
  if (index > -1) {
    services.value.splice(index, 1)
  }
}

/**
 * 保存服务
 */
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

/**
 * 重置表单
 */
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

/**
 * 测试工具
 * @param tool - MCP 工具
 */
function testTool(tool: McpTool) {
  console.log('测试工具:', tool.name)
}
</script>
