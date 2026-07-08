<template>
  <div class="min-h-screen">
    <div class="flex items-center justify-between mb-8">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">应用中心</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">发现和管理扩展应用，丰富你的 AI 体验</p>
      </div>
      <div class="flex items-center gap-3">
        <USelect v-model="activeTab" :options="tabOptions" class="w-36" />
      </div>
    </div>

    <div v-if="error" class="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 flex items-center gap-3">
      <UIcon name="lucide:alert-triangle" class="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-amber-800 dark:text-amber-300">{{ error }}</p>
        <p class="text-xs text-amber-600 dark:text-amber-400 mt-1">当前显示的是本地缓存数据，部分功能可能受限</p>
      </div>
      <button class="text-xs text-amber-700 dark:text-amber-300 underline hover:no-underline flex-shrink-0" @click="fetchAppList">
        重试
      </button>
    </div>

    <div class="flex flex-wrap gap-3 mb-8">
      <button
        v-for="cat in categories"
        :key="cat.value"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2',
          selectedCategory === cat.value
            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-primary/50'
        ]"
        @click="selectedCategory = cat.value"
      >
        <UIcon v-if="cat.icon" :name="cat.icon" class="w-4 h-4" />
        {{ cat.label }}
      </button>
    </div>

    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 mb-8">
      <div class="flex flex-wrap items-center gap-4">
        <div class="relative flex-1 min-w-[280px]">
          <UIcon name="lucide:search" class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchKeyword"
            placeholder="搜索应用名称或描述..."
            class="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <USelect v-model="sortBy" :options="sortOptions" class="w-40" />
      </div>
    </div>

    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="i in 6" :key="i" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-14 h-14 rounded-xl bg-slate-100 dark:bg-slate-700"></div>
          <div class="flex-1 space-y-2">
            <div class="h-5 w-2/3 rounded-lg bg-slate-100 dark:bg-slate-700"></div>
            <div class="h-3 w-1/3 rounded bg-slate-100 dark:bg-slate-700"></div>
          </div>
        </div>
        <div class="space-y-2 mb-4">
          <div class="h-4 w-full rounded bg-slate-100 dark:bg-slate-700"></div>
          <div class="h-4 w-5/6 rounded bg-slate-100 dark:bg-slate-700"></div>
        </div>
        <div class="flex gap-2 mb-4">
          <div class="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-700"></div>
          <div class="h-6 w-16 rounded-full bg-slate-100 dark:bg-slate-700"></div>
        </div>
        <div class="flex justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
          <div class="h-4 w-12 rounded bg-slate-100 dark:bg-slate-700"></div>
          <div class="h-8 w-20 rounded-xl bg-slate-100 dark:bg-slate-700"></div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="app in filteredApps"
        :key="app.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 group transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/20"
      >
        <div class="flex items-start gap-4 mb-4">
          <div
            :class="[
              'w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
              getAppIconBg(app.category)
            ]"
          >
            <UIcon :name="app.icon" class="w-7 h-7" :class="getAppIconColor(app.category)" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h3 class="font-semibold text-slate-900 dark:text-white truncate">{{ app.name }}</h3>
              <span v-if="isInstalled(app.id)" class="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">已安装</span>
              <span v-else-if="app.isNew" class="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary dark:bg-primary/20">NEW</span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">{{ app.developer }}</p>
            <div class="flex items-center gap-2 mt-1.5">
              <div class="flex items-center gap-0.5">
                <UIcon name="lucide:star" class="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span class="text-xs font-medium text-slate-900 dark:text-white">{{ app.rating }}</span>
              </div>
              <span class="text-xs text-slate-400">·</span>
              <span class="text-xs text-slate-500">{{ app.installCount.toLocaleString() }} 安装</span>
            </div>
          </div>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{{ app.description }}</p>

        <div class="flex flex-wrap gap-1.5 mb-4">
          <span
            v-for="tag in app.tags.slice(0, 3)"
            :key="tag"
            class="text-xs px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
          >
            {{ tag }}
          </span>
        </div>

        <div class="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <div class="text-sm font-medium">
            <span v-if="app.price === 0" class="text-green-600 dark:text-green-400">免费</span>
            <span v-else class="text-slate-900 dark:text-white">¥{{ app.price }}</span>
          </div>
          <div class="flex items-center gap-2">
            <button class="btn-glass px-4 py-2 text-sm" @click="viewAppDetail(app)">
              详情
            </button>
            <button
              v-if="!isInstalled(app.id)"
              class="btn-glass btn-glass--primary px-4 py-2 text-sm"
              @click="installApp(app)"
            >
              <UIcon name="lucide:download" class="w-4 h-4" />
              安装
            </button>
            <button
              v-else
              class="btn-glass px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
              @click="uninstallApp(app)"
            >
              <UIcon name="lucide:trash-2" class="w-4 h-4" />
              卸载
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="filteredApps.length === 0 && !loading" class="text-center py-20">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
        <UIcon name="lucide:package-search" class="w-10 h-10 text-slate-400" />
      </div>
      <h3 class="text-xl font-semibold text-slate-900 dark:text-white mb-2">未找到匹配的应用</h3>
      <p class="text-slate-600 dark:text-slate-400">尝试使用其他关键词搜索</p>
    </div>

    <UDialog v-model="showDetailDialog" :title="selectedApp?.name || '应用详情'" size="xl">
      <div v-if="selectedApp" class="space-y-6">
        <div class="flex items-start gap-4">
          <div
            :class="[
              'w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0',
              getAppIconBg(selectedApp.category)
            ]"
          >
            <UIcon :name="selectedApp.icon" class="w-10 h-10" :class="getAppIconColor(selectedApp.category)" />
          </div>
          <div class="flex-1">
            <h2 class="font-display text-xl font-bold text-slate-900 dark:text-white">{{ selectedApp.name }}</h2>
            <p class="text-sm text-slate-500 mt-1">{{ selectedApp.developer }}</p>
            <div class="flex flex-wrap items-center gap-4 mt-2">
              <div class="flex items-center gap-1">
                <UIcon name="lucide:star" class="w-4 h-4 text-amber-500 fill-amber-500" />
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ selectedApp.rating }}</span>
                <span class="text-xs text-slate-500">({{ selectedApp.reviewCount }} 评价)</span>
              </div>
              <span class="text-sm text-slate-500">{{ selectedApp.installCount.toLocaleString() }} 安装</span>
              <span :class="selectedApp.price === 0 ? 'text-green-600 dark:text-green-400' : 'text-slate-900 dark:text-white'" class="text-sm font-medium">
                {{ selectedApp.price === 0 ? '免费' : '¥' + selectedApp.price }}
              </span>
            </div>
          </div>
          <button
            v-if="!isInstalled(selectedApp.id)"
            class="btn-glass btn-glass--primary"
            @click="installApp(selectedApp)"
          >
            <UIcon name="lucide:download" class="w-4 h-4" />
            安装
          </button>
          <button
            v-else
            class="btn-glass text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            @click="uninstallApp(selectedApp)"
          >
            <UIcon name="lucide:trash-2" class="w-4 h-4" />
            卸载
          </button>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-2">应用介绍</h3>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600/50">
            <p class="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">{{ selectedApp.fullDescription }}</p>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">主要功能</h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="feature in selectedApp.features" :key="feature" class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-3 flex items-center gap-3 border border-slate-200 dark:border-slate-600/50">
              <UIcon name="lucide:check-circle-2" class="w-5 h-5 text-green-500 flex-shrink-0" />
              <span class="text-sm text-slate-900 dark:text-white">{{ feature }}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white mb-3">应用信息</h3>
          <div class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4 border border-slate-200 dark:border-slate-600/50">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-slate-500">版本</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{{ selectedApp.version }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">大小</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{{ selectedApp.size }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">更新时间</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{{ selectedApp.updatedAt }}</p>
              </div>
              <div>
                <p class="text-xs text-slate-500">类别</p>
                <p class="text-sm font-medium text-slate-900 dark:text-white mt-1">{{ getCategoryLabel(selectedApp.category) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getExtensionList } from '~/composables/api/core'

definePageMeta({
  layout: 'app',
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
 * 加载状态
 */
const loading = ref(false)

/**
 * 错误信息
 */
const error = ref<string | null>(null)

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
 * 模拟应用数据（API 失败时的回退数据）
 */
const mockApps: AppItem[] = [
  {
    id: 'comic-factory',
    name: '漫剧工厂',
    description: 'AI 驱动的漫画创作工具，一键将文本转换为精彩漫画',
    fullDescription: '漫剧工厂是一款强大的 AI 漫画创作工具，让每个人都能轻松创作出精彩的漫画作品。\n\n主要功能：\n• 文本转漫画：输入故事脚本，自动生成漫画分镜\n• AI 角色生成：自定义角色形象和风格\n• 场景设计：丰富的背景场景和道具选择\n• 分镜编辑：拖拽式分镜编排\n• 多风格支持：支持日式、美式、卡通等多种画风\n• 导出分享：一键导出高清漫画图片',
    icon: 'lucide:film',
    category: 'design',
    developer: 'BuildingAI',
    version: '1.0.0',
    size: '32.5 MB',
    price: 0,
    rating: 4.9,
    reviewCount: 1892,
    installCount: 56800,
    updatedAt: '2024-06-28',
    tags: ['漫画', '创作', 'AI'],
    features: ['文本转漫画', 'AI 角色生成', '场景设计', '分镜编辑'],
    isNew: true,
  },
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
]

/**
 * 应用列表（初始使用 mock 数据，API 成功后替换）
 */
const apps = ref<AppItem[]>([...mockApps])

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

/**
 * 从 API 获取应用列表，失败时回退到 mock 数据
 */
async function fetchAppList() {
  error.value = null
  loading.value = true
  try {
    const apiItems = await getExtensionList()
    if (apiItems && apiItems.length > 0) {
      const mappedApps: AppItem[] = apiItems.map((item: any, index: number) => ({
        id: item.id || item.identifier || String(index + 1),
        name: item.name || item.identifier || '未知应用',
        description: item.description || '',
        fullDescription: item.fullDescription || item.description || '',
        icon: item.icon || 'lucide:package',
        category: mapApiCategory(item.category),
        developer: item.developer || item.author || '未知',
        version: item.version || '1.0.0',
        size: item.size || '未知',
        price: item.price ?? 0,
        rating: item.rating ?? 4.0,
        reviewCount: item.reviewCount ?? 0,
        installCount: item.installCount ?? item.downloadCount ?? 0,
        updatedAt: item.updatedAt || item.updateTime || '',
        tags: item.tags ?? [],
        features: item.features ?? [],
        isNew: item.isNew ?? false,
      }))
      apps.value = mappedApps
    }
  } catch (e: any) {
    error.value = `加载应用列表失败: ${e.message || '网络异常'}` + '，已切换到本地缓存数据'
    apps.value = [...mockApps]
  } finally {
    loading.value = false
  }
}

/**
 * 将 API 返回的分类字符串映射到本地 AppCategory 类型
 */
function mapApiCategory(category?: string): AppCategory {
  if (!category) return 'utilities'
  const lower = category.toLowerCase()
  const map: Record<string, AppCategory> = {
    productivity: 'productivity',
    development: 'development',
    dev: 'development',
    design: 'design',
    communication: 'communication',
    chat: 'communication',
    data: 'data',
    analytics: 'data',
    utilities: 'utilities',
    utility: 'utilities',
    tools: 'utilities',
  }
  return map[lower] || 'utilities'
}

onMounted(() => {
  fetchAppList()
})
</script>