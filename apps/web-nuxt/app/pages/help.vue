<template>
  <div>
    <!-- 页面标题 -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold">帮助中心</h1>
      <p class="text-muted-foreground text-sm mt-2">在这里找到使用指南和常见问题解答</p>
    </div>

    <!-- 搜索框 -->
    <div class="max-w-2xl mx-auto mb-10">
      <UInput v-model="searchKeyword" placeholder="搜索文档、教程或问题..." size="xl" class="w-full">
        <template #leading>
          <UIcon name="lucide:search" class="w-5 h-5 text-muted-foreground" />
        </template>
        <template #trailing>
          <UButton
            v-if="searchKeyword"
            variant="ghost"
            size="sm"
            icon="lucide:x"
            @click="searchKeyword = ''"
          />
        </template>
      </UInput>
      <div class="flex items-center justify-center gap-2 mt-3">
        <span class="text-xs text-muted-foreground">热门搜索：</span>
        <button
          v-for="tag in hotTags"
          :key="tag"
          class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          @click="searchKeyword = tag"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- 文档分类卡片 -->
    <div class="mb-12">
      <h2 class="text-lg font-bold mb-4">文档分类</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard
          v-for="category in categories"
          :key="category.id"
          class="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group"
          @click="goToCategory(category)"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
              :class="category.iconBg"
            >
              <UIcon :name="category.icon" class="w-6 h-6" :class="category.iconColor" />
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <h3 class="font-semibold">{{ category.title }}</h3>
                <UIcon name="lucide:arrow-right" class="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p class="text-sm text-muted-foreground mt-1 line-clamp-2">{{ category.description }}</p>
              <p class="text-xs text-muted-foreground mt-2">{{ category.articleCount }} 篇文章</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- 左侧：热门文章 -->
      <div class="lg:col-span-2">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">热门文章</h2>
          <UButton variant="ghost" size="sm">
            查看全部
            <template #trailing>
              <UIcon name="lucide:arrow-right" class="w-4 h-4" />
            </template>
          </UButton>
        </div>

        <UCard class="p-0">
          <ul>
            <li
              v-for="(article, index) in filteredArticles"
              :key="article.id"
              class="flex items-center gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-accent/30 cursor-pointer transition-colors"
              @click="openArticle(article)"
            >
              <!-- 排名 -->
              <div
                class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                :class="index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
              >
                {{ index + 1 }}
              </div>

              <!-- 文章信息 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-sm font-medium truncate">{{ article.title }}</h3>
                  <UBadge v-if="article.isHot" color="error" size="sm">热</UBadge>
                  <UBadge v-if="article.isNew" color="success" size="sm">新</UBadge>
                </div>
                <div class="flex items-center gap-3 mt-1">
                  <UBadge variant="outline" size="sm">{{ getCategoryLabel(article.category) }}</UBadge>
                  <span class="text-xs text-muted-foreground flex items-center gap-1">
                    <UIcon name="lucide:eye" class="w-3 h-3" />
                    {{ article.viewCount.toLocaleString() }} 阅读
                  </span>
                  <span class="text-xs text-muted-foreground flex items-center gap-1">
                    <UIcon name="lucide:clock" class="w-3 h-3" />
                    {{ article.updatedAt }}
                  </span>
                </div>
              </div>

              <UIcon name="lucide:chevron-right" class="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </li>
          </ul>

          <!-- 空状态 -->
          <div v-if="filteredArticles.length === 0" class="text-center py-12">
            <UIcon name="lucide:file-search" class="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <p class="text-muted-foreground">未找到匹配的文章</p>
          </div>
        </UCard>
      </div>

      <!-- 右侧：FAQ 手风琴 -->
      <div>
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">常见问题</h2>
          <UButton variant="ghost" size="sm" to="/pricing">
            套餐
            <template #trailing>
              <UIcon name="lucide:external-link" class="w-3.5 h-3.5" />
            </template>
          </UButton>
        </div>

        <UCard class="p-0">
          <div class="divide-y divide-border">
            <div v-for="faq in faqs" :key="faq.id">
              <button
                class="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-accent/30 transition-colors"
                @click="toggleFaq(faq.id)"
              >
                <span class="text-sm font-medium flex-1">{{ faq.question }}</span>
                <UIcon
                  :name="expandedFaq === faq.id ? 'lucide:chevron-down' : 'lucide:chevron-right'"
                  class="w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform"
                />
              </button>
              <div v-show="expandedFaq === faq.id" class="px-4 pb-3">
                <p class="text-sm text-muted-foreground leading-relaxed">{{ faq.answer }}</p>
                <div class="flex items-center gap-2 mt-3">
                  <span class="text-xs text-muted-foreground">是否解决了你的问题？</span>
                  <UButton variant="ghost" size="xs" icon="lucide:thumbs-up" />
                  <UButton variant="ghost" size="xs" icon="lucide:thumbs-down" />
                </div>
              </div>
            </div>
          </div>
        </UCard>

        <!-- 联系支持卡片 -->
        <UCard class="mt-4">
          <div class="text-center">
            <div class="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <UIcon name="lucide:headphones" class="w-6 h-6 text-primary" />
            </div>
            <h3 class="font-semibold text-sm mb-1">没有找到答案？</h3>
            <p class="text-xs text-muted-foreground mb-3">联系我们的技术支持团队获取帮助</p>
            <UButton size="sm" class="w-full">
              <template #icon>
                <UIcon name="lucide:message-circle" class="w-4 h-4" />
              </template>
              联系客服
            </UButton>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 文档分类接口定义
 */
interface DocCategory {
  id: string
  title: string
  description: string
  icon: string
  iconBg: string
  iconColor: string
  articleCount: number
}

/**
 * 文章接口定义
 */
interface Article {
  id: string
  title: string
  category: string
  viewCount: number
  updatedAt: string
  isHot?: boolean
  isNew?: boolean
}

/**
 * 常见问题接口定义
 */
interface FaqItem {
  id: string
  question: string
  answer: string
}

/**
 * 搜索关键词
 */
const searchKeyword = ref('')

/**
 * 当前展开的 FAQ ID
 */
const expandedFaq = ref<string | null>('1')

/**
 * 热门搜索标签
 */
const hotTags = ['快速开始', 'API 调用', '知识库', 'Agent 编排', '模型配置']

/**
 * 文档分类数据
 */
const categories = ref<DocCategory[]>([
  {
    id: 'quickstart',
    title: '快速开始',
    description: '了解如何注册账号、创建首个对话并体验核心功能',
    icon: 'lucide:rocket',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
    articleCount: 12,
  },
  {
    id: 'chat',
    title: '对话功能',
    description: '学习如何使用多模型对话、设置提示词以及管理对话历史',
    icon: 'lucide:message-square',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
    articleCount: 18,
  },
  {
    id: 'agent',
    title: 'Agent 管理',
    description: '了解如何创建、配置和编排 Agent 实现自动化工作流',
    icon: 'lucide:bot',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
    articleCount: 15,
  },
  {
    id: 'knowledge',
    title: '知识库',
    description: '掌握知识库的创建、文档上传、向量化检索等高级用法',
    icon: 'lucide:book-open',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
    articleCount: 22,
  },
  {
    id: 'api',
    title: 'API 文档',
    description: '查看 REST API 和 WebSocket 接口说明及调用示例',
    icon: 'lucide:code',
    iconBg: 'bg-cyan-100 dark:bg-cyan-900/30',
    iconColor: 'text-cyan-600 dark:text-cyan-400',
    articleCount: 30,
  },
  {
    id: 'faq',
    title: '常见问题',
    description: '汇总账户、计费、功能使用等高频问题解答',
    icon: 'lucide:help-circle',
    iconBg: 'bg-pink-100 dark:bg-pink-900/30',
    iconColor: 'text-pink-600 dark:text-pink-400',
    articleCount: 25,
  },
])

/**
 * 热门文章数据
 */
const articles = ref<Article[]>([
  {
    id: '1',
    title: '5 分钟快速上手 BuildingAI',
    category: 'quickstart',
    viewCount: 15820,
    updatedAt: '2024-06-25',
    isHot: true,
  },
  {
    id: '2',
    title: '如何选择适合的 AI 模型？模型对比与选型指南',
    category: 'chat',
    viewCount: 12340,
    updatedAt: '2024-06-22',
    isHot: true,
  },
  {
    id: '3',
    title: 'Agent 编排入门：构建你的第一个自动化工作流',
    category: 'agent',
    viewCount: 9870,
    updatedAt: '2024-06-20',
    isNew: true,
  },
  {
    id: '4',
    title: '知识库向量化检索原理与最佳实践',
    category: 'knowledge',
    viewCount: 8560,
    updatedAt: '2024-06-18',
  },
  {
    id: '5',
    title: 'REST API 鉴权与调用示例（含代码）',
    category: 'api',
    viewCount: 7230,
    updatedAt: '2024-06-15',
    isNew: true,
  },
])

/**
 * 常见问题数据
 */
const faqs = ref<FaqItem[]>([
  {
    id: '1',
    question: '如何重置我的密码？',
    answer: '在登录页面点击"忘记密码"，输入注册邮箱后我们会发送重置链接到你的邮箱。链接有效期为 30 分钟，点击后即可设置新密码。',
  },
  {
    id: '2',
    question: '免费版有哪些使用限制？',
    answer: '免费版每日可发起 20 次对话，仅支持 3 个基础模型，知识库容量 100MB，历史记录保留 7 天。如需更高额度请升级到专业版或团队版。',
  },
  {
    id: '3',
    question: '如何获取 API Key？',
    answer: '专业版及以上用户可在"设置 - API 管理"页面创建 API Key。每个账号最多可创建 10 个 Key，支持设置调用权限和速率限制。',
  },
  {
    id: '4',
    question: '支持哪些 AI 模型？',
    answer: '我们支持 OpenAI、Anthropic、Google、DeepSeek、智谱 AI、通义千问、Moonshot 等多家厂商的对话、补全、Embedding、图像和音频模型。',
  },
  {
    id: '5',
    question: '数据是否会被用于模型训练？',
    answer: '不会。你的对话内容和知识库数据完全属于你个人，我们承诺不会将其用于任何模型训练或共享给第三方。所有数据均经过加密存储。',
  },
])

/**
 * 根据搜索关键词过滤后的文章列表
 */
const filteredArticles = computed(() => {
  if (!searchKeyword.value.trim()) return articles.value
  const kw = searchKeyword.value.toLowerCase()
  return articles.value.filter(a => a.title.toLowerCase().includes(kw))
})

/**
 * 获取分类标签文本
 * @param categoryId - 分类 ID
 * @returns 分类名称
 */
function getCategoryLabel(categoryId: string): string {
  const cat = categories.value.find(c => c.id === categoryId)
  return cat?.title || categoryId
}

/**
 * 切换 FAQ 展开/收起
 * @param id - FAQ ID
 */
function toggleFaq(id: string) {
  expandedFaq.value = expandedFaq.value === id ? null : id
}

/**
 * 跳转到分类页面
 * @param category - 分类信息
 */
function goToCategory(category: DocCategory) {
  console.log('跳转到分类:', category.id)
}

/**
 * 打开文章
 * @param article - 文章
 */
function openArticle(article: Article) {
  console.log('打开文章:', article.id)
}
</script>
