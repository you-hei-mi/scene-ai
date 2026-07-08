<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">网站配置</p>
    </div>

    <AdminSystemTabs />

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="lucide:loader" class="w-8 h-8 animate-spin text-primary" />
      <span class="ml-3 text-slate-500">加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
      <div class="flex items-center gap-2">
        <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-600 dark:text-red-400" />
        <span class="text-sm text-red-700 dark:text-red-400">{{ error }}</span>
      </div>
      <button class="btn-glass mt-3 text-sm" @click="fetchConfig">重试</button>
    </div>

    <div v-else class="space-y-6">
      <!-- 基本信息 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">基本信息</h2>
          <p class="text-sm mt-1 text-slate-500">网站基础信息配置</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">网站名称</label>
            <UInput v-model="config.basic.siteName" placeholder="输入网站名称" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Logo URL</label>
              <UInput v-model="config.basic.logoUrl" placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Favicon URL</label>
              <UInput v-model="config.basic.faviconUrl" placeholder="https://example.com/favicon.ico" />
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">网站描述</label>
            <UTextarea v-model="config.basic.description" placeholder="输入网站描述" rows="3" />
          </div>
        </div>
      </div>

      <!-- SEO设置 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">SEO 设置</h2>
          <p class="text-sm mt-1 text-slate-500">搜索引擎优化相关配置</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">SEO 关键词</label>
            <UInput v-model="config.seo.keywords" placeholder="AI平台, AI助手, 智能体, AI对话" />
            <p class="text-xs mt-1 text-slate-500">多个关键词用逗号分隔</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">SEO 描述</label>
            <UTextarea v-model="config.seo.description" placeholder="输入 SEO 描述，建议 120-160 字" rows="3" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">ICP 备案号</label>
            <UInput v-model="config.seo.icpNumber" placeholder="京ICP备XXXXXXXX号" />
          </div>
        </div>
      </div>

      <!-- 联系信息 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">联系信息</h2>
          <p class="text-sm mt-1 text-slate-500">对外展示的联系方式</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">客服邮箱</label>
            <UInput v-model="config.contact.email" placeholder="support@example.com" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">联系电话</label>
            <UInput v-model="config.contact.phone" placeholder="400-XXX-XXXX" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公司地址</label>
            <UInput v-model="config.contact.address" placeholder="北京市朝阳区XX路XX号" />
          </div>
        </div>
      </div>

      <!-- 社交媒体 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">社交媒体</h2>
          <p class="text-sm mt-1 text-slate-500">社交媒体链接配置</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <UIcon name="lucide:message-circle" class="w-4 h-4 inline mr-1.5" />
              微信公众号 / 微信
            </label>
            <UInput v-model="config.social.wechat" placeholder="微信公众号名称或链接" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <UIcon name="lucide:at-sign" class="w-4 h-4 inline mr-1.5" />
              微博
            </label>
            <UInput v-model="config.social.weibo" placeholder="微博主页链接" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
              <UIcon name="lucide:github" class="w-4 h-4 inline mr-1.5" />
              GitHub
            </label>
            <UInput v-model="config.social.github" placeholder="https://github.com/your-org" />
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button class="btn-glass" @click="resetConfig">重置</button>
        <button class="btn-glass btn-glass--primary" @click="saveConfig" :disabled="saving">
          <UIcon v-if="saving" name="lucide:loader" class="w-4 h-4 animate-spin" />
          {{ saving ? '保存中...' : '保存设置' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { getWebsiteConfig, updateWebsiteConfig } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface BasicInfo {
  siteName: string
  logoUrl: string
  faviconUrl: string
  description: string
}

interface SeoConfig {
  keywords: string
  description: string
  icpNumber: string
}

interface ContactInfo {
  email: string
  phone: string
  address: string
}

interface SocialLinks {
  wechat: string
  weibo: string
  github: string
}

interface WebsiteConfig {
  basic: BasicInfo
  seo: SeoConfig
  contact: ContactInfo
  social: SocialLinks
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)

const defaultConfig: WebsiteConfig = {
  basic: {
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    description: '',
  },
  seo: {
    keywords: '',
    description: '',
    icpNumber: '',
  },
  contact: {
    email: '',
    phone: '',
    address: '',
  },
  social: {
    wechat: '',
    weibo: '',
    github: '',
  },
}

const config = reactive<WebsiteConfig>(JSON.parse(JSON.stringify(defaultConfig)))

async function fetchConfig() {
  loading.value = true
  error.value = null
  try {
    const data = await getWebsiteConfig()
    if (data) {
      config.basic = {
        siteName: data.basic?.siteName ?? '',
        logoUrl: data.basic?.logoUrl ?? '',
        faviconUrl: data.basic?.faviconUrl ?? '',
        description: data.basic?.description ?? '',
      }
      config.seo = {
        keywords: data.seo?.keywords ?? '',
        description: data.seo?.description ?? '',
        icpNumber: data.seo?.icpNo ?? '',
      }
      config.contact = {
        email: data.contact?.email ?? '',
        phone: data.contact?.phone ?? '',
        address: data.contact?.address ?? '',
      }
      config.social = {
        wechat: data.social?.wechat ?? '',
        weibo: data.social?.weibo ?? '',
        github: data.social?.github ?? '',
      }
    }
  } catch (e: any) {
    error.value = e.message || '加载网站配置失败'
  } finally {
    loading.value = false
  }
}

function resetConfig() {
  Object.assign(config, JSON.parse(JSON.stringify(defaultConfig)))
}

async function saveConfig() {
  if (saving.value) return
  saving.value = true
  error.value = null
  try {
    await updateWebsiteConfig({
      basic: config.basic,
      seo: {
        keywords: config.seo.keywords,
        description: config.seo.description,
        icpNo: config.seo.icpNumber,
      },
      contact: config.contact,
      social: config.social,
    } as any)
  } catch (e: any) {
    error.value = e.message || '保存网站配置失败'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>