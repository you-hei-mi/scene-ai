<template>
  <div>
    <!-- 页面标题和操作 -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold">应用中心</h1>
        <p class="text-muted-foreground text-sm mt-1">发现和管理扩展应用，丰富你的 AI 体验</p>
      </div>
      <div class="flex items-center gap-3">
        <USelect v-model="activeTab" :options="tabOptions" class="w-36" />
      </div>
    </div>

    <!-- 分类标签 -->
    <div class="flex flex-wrap gap-2 mb-6">
      <UButton
        v-for="cat in categories"
        :key="cat.value"
        :variant="selectedCategory === cat.value ? 'default' : 'outline'"
        size="sm"
        @click="selectedCategory = cat.value"
      >
        <template #icon v-if="cat.icon">
          <UIcon :name="cat.icon" class="w-4 h-4" />
        </template>
        {{ cat.label }}
      </UButton>
    </div>

    <!-- 搜索栏 -->
    <UCard class="mb-6">
      <div class="flex flex-wrap items-center gap-4">
        <UInput v-model="searchKeyword" placeholder="搜索应用名称或描述..." class="flex-1 min-w-64">
          <template #leading>
            <UIcon name="lucide:search" class="w-4 h-4 text-muted-foreground" />
          </template>
        </UInput>
        <USelect v-model="sortBy" :options="sortOptions" class="w-40" />
      </div>
    </UCard>

    <!-- 应用列表 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <UCard
        v-for="app in filteredApps"
        :key="app.id"
        class="hover:shadow-md transition-shadow group"
      >
        <div class="flex items-start gap-4 mb-4">
          <div
            class="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            :class="getAppIconBg(app.category)"
          >
            <UIcon :name="app.icon" class="w-7 h-7" :class="getAppIconColor(app.category)" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h3 class="font-semibold truncate">{{ app.name }}</h3>
              <UBadge v-if="isInstalled(app.id)" variant="outline" size="sm">已安装</UBadge>
              <UBadge v-else-if="app.isNew" color="green" size="sm">NEW</UBadge>
            </div>
            <p class="text-xs text-muted-foreground mt-0.5">{{ app.developer }}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="flex items-center gap-0.5">
                <UIcon name="lucide:star" class="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span class="text-xs font-medium">{{ app.rating }}</span>
              </div>
              <span class="text-xs text-muted-foreground">·</span>
              <span class="text-xs text-muted-foreground">{{ app.installCount }} 安装</span>
            </div>
          </div>
        </div>

        <p class="text-sm text-muted-foreground mb-4 line-clamp-2">{{ app.description }}</p>

        <div class="flex flex-wrap gap-1.5 mb-4">
          <span
            v-for="tag in app.tags.slice(0, 3)"
            :key="tag"
            class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            {{ tag }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-3 border-t border-border">
          <div class="text-sm">
            <span v-if="app.price === 0" class="text-green-600 font-medium">免费</span>
            <span v-else class="font-medium">¥{{ app.price }}</span>
          </div>
          <div class="flex items-center gap-2">
            <UButton variant="outline" size="sm" @click="viewAppDetail(app)">
              详情
            </UButton>
            <UButton
              v-if="!isInstalled(app.id)"
              size="sm"
              @click="installApp(app)"
            >
              <template #icon>
                <UIcon name="lucide:download" class="w-4 h-4" />
              </template>
              安装
            </UButton>
            <UButton
              v-else
              variant="outline"
              size="sm"
              color="red"
              @click="uninstallApp(app)"
            >
              <template #icon>
                <UIcon name="lucide:trash-2" class="w-4 h-4" />
              </template>
              卸载
            </UButton>
          </div>
        </div>
      </UCard>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredApps.length === 0" class="text-center py-12">
      <UIcon name="lucide:package-search" class="w-12 h-12 mx-auto text-muted-foreground mb-3" />
      <p class="text-muted-foreground">未找到匹配的应用</p>
    </div>

    <!-- 应用详情对话框 -->
    <UDialog v-model="showDetailDialog" :title="selectedApp?.name || '应用详情'" size="xl">
      <div v-if="selectedApp" class="space-y-6">
        <!-- 应用头部信息 -->
        <div class="flex items-start gap-4">
          <div
            class="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0"
            :class="getAppIconBg(selectedApp.category)"
          >
            <UIcon :name="selectedApp.icon" class="w-10 h-10" :class="getAppIconColor(selectedApp.category)" />
          </div>
          <div class="flex-1">
            <h2 class="text-xl font-bold">{{ selectedApp.name }}</h2>
            <p class="text-sm text-muted-foreground mt-1">{{ selectedApp.developer }}</p>
            <div class="flex items-center gap-4 mt-2">
              <div class="flex items-center gap-1">
                <UIcon name="lucide:star" class="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span class="text-sm font-medium">{{ selectedApp.rating }}</span>
                <span class="text-xs text-muted-foreground">({{ selectedApp.reviewCount }} 评价)</span>
              </div>
              <span class="text-sm text-muted-foreground">{{ selectedApp.installCount }} 安装</span>
              <span class="text-sm" :class="selectedApp.price === 0 ? 'text-green-600' : ''">
                {{ selectedApp.price === 0 ? '免费' : '¥' + selectedApp.price }}
              </span>
            </div>
          </div>
          <UButton
            v-if="!isInstalled(selectedApp.id)"
            @click="installApp(selectedApp)"
          >
            <template #icon>
              <UIcon name="lucide:download" class="w-4 h-4" />
            </template>
            安装
          </UButton>
          <UButton
            v-else
            variant="outline"
            color="red"
            @click="uninstallApp(selectedApp)"
          >
            <template #icon>
              <UIcon name="lucide:trash-2" class="w-4 h-4" />
            </template>
            卸载
          </UButton>
        </div>

        <!-- 应用描述 -->
        <div>
          <h3 class="text-sm font-medium mb-2">应用介绍</h3>
          <UCard>
            <p class="text-sm text-muted-foreground whitespace-pre-line">{{ selectedApp.fullDescription }}</p>
          </UCard>
        </div>

        <!-- 功能特性 -->
        <div>
          <h3 class="text-sm font-medium mb-2">主要功能</h3>
          <div class="grid grid-cols-2 gap-3">
            <UCard v-for="feature in selectedApp.features" :key="feature" class="flex items-center gap-3">
              <UIcon name="lucide:check-circle-2" class="w-5 h-5 text-green-500 flex-shrink-0" />
              <span class="text-sm">{{ feature }}</span>
            </UCard>
          </div>
        </div>

        <!-- 应用信息 -->
        <div>
          <h3 class="text-sm font-medium mb-2">应用信息</h3>
          <UCard>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-muted-foreground">版本</p>
                <p class="text-sm font-medium mt-1">{{ selectedApp.version }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">大小</p>
                <p class="text-sm font-medium mt-1">{{ selectedApp.size }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">更新时间</p>
                <p class="text-sm font-medium mt-1">{{ selectedApp.updatedAt }}</p>
              </div>
              <div>
                <p class="text-xs text-muted-foreground">类别</p>
                <p class="text-sm font-medium mt-1">{{ getCategoryLabel(selectedApp.category) }}</p>
              </div>
            </div>
          </UCard>
        </div>
      </div>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 应用类别类型
 */
type AppCategory = 'productivity' | 'development' | 'design' | 'communication' | 'data' | 'utilities'

/**
 * 应用接口定义
 */
interface AppItem {
  id: string
  name: string
  description: string
  fullDescription: string
  icon: string
  category: AppCategory
  developer: string
  version: string
  size: string
  price: number
  rating: number
  reviewCount: number
  installCount: number
  updatedAt: string
  tags: string[]
  features: string[]
  isNew?: boolean
}

/**
 * 当前激活的标签页（全部/已安装）
 */
const activeTab = ref('all')

/**
 * 选中的分类
 */
const selectedCategory = ref('all')

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 排序方式
 */
const sortBy = ref('popular')

/**
 * 是否显示详情对话框
 */
const showDetailDialog = ref(false)

/**
 * 当前选中的应用
 */
const selectedApp = ref<AppItem | null>(null)

/**
 * 已安装的应用 ID 列表
 */
const installedAppIds = ref<string[]>(['1', '3'])

/**
 * 标签页选项
 */
const tabOptions = [
  { label: '全部应用', value: 'all' },
  { label: '已安装', value: 'installed' },
]

/**
 * 分类选项
 */
const categories = [
  { label: '全部', value: 'all', icon: '' },
  { label: '效率工具', value: 'productivity', icon: 'lucide:zap' },
  { label: '开发工具', value: 'development', icon: 'lucide:code' },
  { label: '设计创意', value: 'design', icon: 'lucide:palette' },
  { label: '通讯协作', value: 'communication', icon: 'lucide:message-square' },
  { label: '数据分析', value: 'data', icon: 'lucide:bar-chart-3' },
  { label: '实用工具', value: 'utilities', icon: 'lucide:wrench' },
]

/**
 * 排序选项
 */
const sortOptions = [
  { label: '最受欢迎', value: 'popular' },
  { label: '最新上架', value: 'newest' },
  { label: '评分最高', value: 'rating' },
  { label: '安装最多', value: 'installs' },
]

/**
 * 模拟应用数据
 */
const apps = ref<AppItem[]>([
  {
    id: '1',
    name: 'Notion 助手',
    description: '快速创建和管理 Notion 页面，支持知识库同步和智能搜索',
    fullDescription: 'Notion 助手是一款强大的 Notion 集成工具，让你可以通过对话的方式快速创建、编辑和管理 Notion 页面。\n\n支持的功能：\n• 智能页面创建：自动生成结构化的 Notion 页面\n• 知识库同步：将 AI 对话内容一键保存到 Notion\n• 智能搜索：在 Notion 中进行语义搜索\n• 数据库管理：创建和查询 Notion 数据库\n• 模板管理：使用和管理页面模板\n\n完美融入你的工作流，让知识管理更加高效。',
    icon: 'lucide:notebook-pen',
    category: 'productivity',
    developer: 'BuildingAI',
    version: '2.1.0',
    size: '15.2 MB',
    price: 0,
    rating: 4.8,
    reviewCount: 256,
    installCount: 12580,
    updatedAt: '2024-06-20',
    tags: ['Notion', '知识库', '效率'],
    features: ['智能页面创建', '知识库同步', '语义搜索', '数据库管理'],
    isNew: true,
  },
  {
    id: '2',
    name: 'GitHub Copilot Pro',
    description: '深度集成 GitHub，支持代码审查、Issue 管理和 PR 自动生成',
    fullDescription: 'GitHub Copilot Pro 提供专业级的 GitHub 集成体验，让你的开发工作更加高效。\n\n主要功能：\n• 智能代码审查：自动分析 PR 并提供改进建议\n• Issue 自动生成：从对话中创建结构化的 Issue\n• 代码搜索：在 GitHub 上进行智能代码搜索\n• 仓库管理：快速创建和配置仓库\n• 团队协作：支持多人协作工作流',
    icon: 'lucide:github',
    category: 'development',
    developer: 'GitHub',
    version: '3.0.1',
    size: '28.5 MB',
    price: 0,
    rating: 4.9,
    reviewCount: 512,
    installCount: 28960,
    updatedAt: '2024-06-15',
    tags: ['GitHub', '开发', '代码'],
    features: ['智能代码审查', 'Issue 自动生成', '代码搜索', '仓库管理'],
  },
  {
    id: '3',
    name: 'Figma 设计助手',
    description: 'AI 驱动的设计辅助工具，自动生成设计规范和组件代码',
    fullDescription: 'Figma 设计助手利用 AI 技术，帮助设计师更快地完成设计工作，并自动将设计转换为代码。\n\n功能亮点：\n• 设计规范生成：从设计稿中自动提取设计系统\n• 组件代码生成：一键生成 Vue/React 组件代码\n• 设计审查：自动检测设计中的一致性问题\n• 原型生成：快速生成可交互原型\n• 资源管理：智能管理设计资源和素材',
    icon: 'lucide:figma',
    category: 'design',
    developer: 'DesignLab',
    version: '1.5.2',
    size: '42.1 MB',
    price: 0,
    rating: 4.7,
    reviewCount: 189,
    installCount: 8750,
    updatedAt: '2024-06-10',
    tags: ['Figma', '设计', 'UI'],
    features: ['设计规范生成', '组件代码生成', '设计审查', '原型生成'],
    isNew: true,
  },
  {
    id: '4',
    name: 'Slack 集成',
    description: '与 Slack 深度集成，支持频道消息同步和智能回复',
    fullDescription: 'Slack 集成应用让 AI 助手无缝融入你的团队沟通。\n\n主要功能：\n• 消息同步：将重要对话同步到 Slack 频道\n• 智能回复：AI 辅助生成回复内容\n• 提醒管理：创建和管理 Slack 提醒\n• 文件共享：快速分享 AI 生成的内容\n• 工作流自动化：连接 Slack 与其他工具',
    icon: 'lucide:message-circle',
    category: 'communication',
    developer: 'Slack',
    version: '2.3.0',
    size: '12.8 MB',
    price: 0,
    rating: 4.6,
    reviewCount: 324,
    installCount: 15680,
    updatedAt: '2024-06-05',
    tags: ['Slack', '协作', '通讯'],
    features: ['消息同步', '智能回复', '提醒管理', '文件共享'],
  },
  {
    id: '5',
    name: '数据分析助手',
    description: '智能数据分析工具，支持 SQL 生成、图表创建和数据洞察',
    fullDescription: '数据分析助手让你可以用自然语言进行数据分析，无需编写复杂的查询语句。\n\n核心功能：\n• 自然语言查询：用中文提问，自动生成 SQL\n• 智能图表：自动选择最合适的图表类型\n• 数据洞察：自动发现数据中的规律和异常\n• 报表生成：一键生成专业的数据报告\n• 多数据源：支持 MySQL、PostgreSQL、CSV 等',
    icon: 'lucide:bar-chart-2',
    category: 'data',
    developer: 'DataDriven',
    version: '4.2.1',
    size: '35.6 MB',
    price: 0,
    rating: 4.8,
    reviewCount: 421,
    installCount: 20150,
    updatedAt: '2024-06-18',
    tags: ['数据分析', 'SQL', '图表'],
    features: ['自然语言查询', '智能图表', '数据洞察', '报表生成'],
  },
  {
    id: '6',
    name: '翻译助手 Pro',
    description: '专业级翻译工具，支持 100+ 语言，保留格式和术语一致性',
    fullDescription: '翻译助手 Pro 提供专业级别的翻译体验，适合各种翻译场景。\n\n功能特点：\n• 多语言支持：支持 100+ 种语言互译\n• 术语库管理：自定义专业术语，确保翻译一致性\n• 格式保留：保留 Markdown、HTML 等格式\n• 批量翻译：支持文档批量翻译\n• 翻译记忆：自动学习你的翻译偏好',
    icon: 'lucide:languages',
    category: 'utilities',
    developer: 'TranslateX',
    version: '3.1.0',
    size: '18.9 MB',
    price: 0,
    rating: 4.9,
    reviewCount: 678,
    installCount: 35420,
    updatedAt: '2024-06-22',
    tags: ['翻译', '多语言', '工具'],
    features: ['100+ 语言', '术语库管理', '格式保留', '批量翻译'],
  },
  {
    id: '7',
    name: '飞书文档助手',
    description: '飞书多维表格和文档集成，支持智能文档生成和数据管理',
    fullDescription: '飞书文档助手帮助你更高效地使用飞书文档和多维表格。\n\n支持的功能：\n• 智能文档生成：自动创建结构化文档\n• 多维表格管理：查询、创建和管理数据表\n• 模板中心：丰富的文档和表格模板\n• 协作增强：AI 辅助团队协作\n• 自动化工作流：触发自动化流程',
    icon: 'lucide:file-text',
    category: 'productivity',
    developer: 'Feishu',
    version: '1.8.3',
    size: '22.4 MB',
    price: 0,
    rating: 4.7,
    reviewCount: 156,
    installCount: 9870,
    updatedAt: '2024-06-12',
    tags: ['飞书', '文档', '效率'],
    features: ['智能文档生成', '多维表格管理', '模板中心', '自动化工作流'],
  },
  {
    id: '8',
    name: '代码审查专家',
    description: '自动化代码审查工具，检测 Bug、性能问题和最佳实践',
    fullDescription: '代码审查专家是一款专业的代码质量分析工具，帮助团队提升代码质量。\n\n主要功能：\n• Bug 检测：自动发现潜在的代码错误\n• 性能分析：识别性能瓶颈和优化点\n• 安全审计：检测安全漏洞和风险\n• 代码规范：检查代码风格和最佳实践\n• 重构建议：提供代码重构建议',
    icon: 'lucide:code-2',
    category: 'development',
    developer: 'CodeQuality',
    version: '2.5.0',
    size: '56.3 MB',
    price: 0,
    rating: 4.8,
    reviewCount: 389,
    installCount: 18760,
    updatedAt: '2024-06-25',
    tags: ['代码审查', '质量', '开发'],
    features: ['Bug 检测', '性能分析', '安全审计', '代码规范'],
    isNew: true,
  },
  {
    id: '9',
    name: '思维导图',
    description: 'AI 驱动的思维导图工具，自动整理思路和生成导图',
    fullDescription: '思维导图应用让你可以通过对话快速生成专业的思维导图。\n\n功能亮点：\n• 智能生成：从对话内容自动生成思维导图\n• 多种模板：提供丰富的导图模板\n• 实时协作：支持多人实时协作编辑\n• 导出格式：支持 PNG、PDF、Markdown 导出\n• 主题美化：多种主题和样式可选',
    icon: 'lucide:network',
    category: 'design',
    developer: 'MindFlow',
    version: '1.3.5',
    size: '25.8 MB',
    price: 0,
    rating: 4.6,
    reviewCount: 145,
    installCount: 7650,
    updatedAt: '2024-06-08',
    tags: ['思维导图', '创意', '工具'],
    features: ['智能生成', '多种模板', '实时协作', '多格式导出'],
  },
])

/**
 * 筛选后的应用列表
 */
const filteredApps = computed(() => {
  let result = [...apps.value]

  // 按标签页筛选
  if (activeTab.value === 'installed') {
    result = result.filter(app => installedAppIds.value.includes(app.id))
  }

  // 按分类筛选
  if (selectedCategory.value !== 'all') {
    result = result.filter(app => app.category === selectedCategory.value)
  }

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const kw = searchKeyword.value.toLowerCase()
    result = result.filter(
      app =>
        app.name.toLowerCase().includes(kw) ||
        app.description.toLowerCase().includes(kw) ||
        app.developer.toLowerCase().includes(kw) ||
        app.tags.some(tag => tag.toLowerCase().includes(kw))
    )
  }

  // 排序
  switch (sortBy.value) {
    case 'popular':
      result.sort((a, b) => b.installCount - a.installCount)
      break
    case 'newest':
      result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      break
    case 'rating':
      result.sort((a, b) => b.rating - a.rating)
      break
    case 'installs':
      result.sort((a, b) => b.installCount - a.installCount)
      break
  }

  return result
})

/**
 * 检查应用是否已安装
 * @param appId - 应用 ID
 * @returns 是否已安装
 */
function isInstalled(appId: string): boolean {
  return installedAppIds.value.includes(appId)
}

/**
 * 获取分类标签文本
 * @param category - 分类值
 * @returns 分类标签
 */
function getCategoryLabel(category: AppCategory): string {
  const cat = categories.find(c => c.value === category)
  return cat?.label || category
}

/**
 * 获取应用图标背景色
 * @param category - 应用分类
 * @returns CSS 类名
 */
function getAppIconBg(category: AppCategory): string {
  const map: Record<AppCategory, string> = {
    productivity: 'bg-blue-100 dark:bg-blue-900/30',
    development: 'bg-purple-100 dark:bg-purple-900/30',
    design: 'bg-pink-100 dark:bg-pink-900/30',
    communication: 'bg-green-100 dark:bg-green-900/30',
    data: 'bg-orange-100 dark:bg-orange-900/30',
    utilities: 'bg-gray-100 dark:bg-gray-800',
  }
  return map[category]
}

/**
 * 获取应用图标颜色
 * @param category - 应用分类
 * @returns CSS 类名
 */
function getAppIconColor(category: AppCategory): string {
  const map: Record<AppCategory, string> = {
    productivity: 'text-blue-600 dark:text-blue-400',
    development: 'text-purple-600 dark:text-purple-400',
    design: 'text-pink-600 dark:text-pink-400',
    communication: 'text-green-600 dark:text-green-400',
    data: 'text-orange-600 dark:text-orange-400',
    utilities: 'text-gray-600 dark:text-gray-400',
  }
  return map[category]
}

/**
 * 安装应用
 * @param app - 应用
 */
function installApp(app: AppItem) {
  if (!installedAppIds.value.includes(app.id)) {
    installedAppIds.value.push(app.id)
  }
}

/**
 * 卸载应用
 * @param app - 应用
 */
function uninstallApp(app: AppItem) {
  const index = installedAppIds.value.indexOf(app.id)
  if (index > -1) {
    installedAppIds.value.splice(index, 1)
  }
}

/**
 * 查看应用详情
 * @param app - 应用
 */
function viewAppDetail(app: AppItem) {
  selectedApp.value = app
  showDetailDialog.value = true
}
</script>
