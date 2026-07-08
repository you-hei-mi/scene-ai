<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">装修中心</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">布局装修</p>
      </div>
      <button class="btn-glass btn-glass--primary" :disabled="saving" @click="saveLayout">
        <UIcon name="lucide:save" class="w-4 h-4" />
        {{ saving ? '保存中...' : '保存布局' }}
      </button>
    </div>

    <div class="flex items-center gap-2 mb-8 p-1.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 w-fit">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
        :class="activeTab === tab.key
          ? 'bg-gradient-to-r from-primary to-accent text-white shadow-md'
          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'"
        @click="activeTab = tab.key"
      >
        <UIcon :name="tab.icon" class="w-4 h-4 inline-block mr-1.5" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <UIcon name="lucide:loader-2" class="w-8 h-8 animate-spin text-primary" />
      <span class="ml-3 text-slate-500">加载中...</span>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 mb-6 flex items-start gap-3">
      <UIcon name="lucide:alert-circle" class="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">加载失败</p>
        <p class="text-xs text-red-600 dark:text-red-300 mt-1">{{ error }}</p>
      </div>
      <button class="btn-glass text-sm" @click="fetchLayout">重试</button>
    </div>

    <template v-else>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">顶部导航</h2>
            <p class="text-sm mt-1 text-slate-500">配置页面顶部导航栏的样式</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">导航栏样式</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  v-for="style in headerStyles"
                  :key="style.value"
                  class="relative p-4 rounded-xl border-2 transition-all duration-200 text-left"
                  :class="layoutConfig.headerStyle === style.value
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.headerStyle = style.value"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon :name="style.icon" class="w-4 h-4" :class="layoutConfig.headerStyle === style.value ? 'text-primary' : 'text-slate-400'" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ style.label }}</span>
                  </div>
                  <p class="text-xs text-slate-500">{{ style.description }}</p>
                  <UIcon
                    v-if="layoutConfig.headerStyle === style.value"
                    name="lucide:check-circle"
                    class="w-5 h-5 text-primary absolute top-2 right-2"
                  />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">导航栏高度</label>
              <USelect v-model="layoutConfig.headerHeight" :options="headerHeightOptions" />
            </div>

            <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">显示搜索框</h3>
                <p class="text-xs mt-0.5 text-slate-500">在导航栏中显示全局搜索</p>
              </div>
              <UCheckbox :modelValue="layoutConfig.showSearch" @change="layoutConfig.showSearch = !layoutConfig.showSearch" />
            </div>

            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">固定导航栏</h3>
                <p class="text-xs mt-0.5 text-slate-500">页面滚动时导航栏保持可见</p>
              </div>
              <UCheckbox :modelValue="layoutConfig.stickyHeader" @change="layoutConfig.stickyHeader = !layoutConfig.stickyHeader" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">侧边栏</h2>
            <p class="text-sm mt-1 text-slate-500">配置侧边导航栏的位置和样式</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">侧边栏位置</label>
              <div class="flex gap-3">
                <button
                  class="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200"
                  :class="layoutConfig.sidebarPosition === 'left'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.sidebarPosition = 'left'"
                >
                  <UIcon name="lucide:panel-left" class="w-5 h-5" :class="layoutConfig.sidebarPosition === 'left' ? 'text-primary' : 'text-slate-400'" />
                  <span class="text-sm font-medium text-slate-900 dark:text-white">左侧</span>
                </button>
                <button
                  class="flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all duration-200"
                  :class="layoutConfig.sidebarPosition === 'right'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.sidebarPosition = 'right'"
                >
                  <UIcon name="lucide:panel-right" class="w-5 h-5" :class="layoutConfig.sidebarPosition === 'right' ? 'text-primary' : 'text-slate-400'" />
                  <span class="text-sm font-medium text-slate-900 dark:text-white">右侧</span>
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">侧边栏宽度</label>
              <USelect v-model="layoutConfig.sidebarWidth" :options="sidebarWidthOptions" />
            </div>

            <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">默认折叠</h3>
                <p class="text-xs mt-0.5 text-slate-500">侧边栏默认折叠状态</p>
              </div>
              <UCheckbox :modelValue="layoutConfig.sidebarCollapsed" @change="layoutConfig.sidebarCollapsed = !layoutConfig.sidebarCollapsed" />
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">底部信息</h2>
            <p class="text-sm mt-1 text-slate-500">配置页面底部区域</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">底部样式</label>
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  v-for="style in footerStyles"
                  :key="style.value"
                  class="relative p-4 rounded-xl border-2 transition-all duration-200 text-left"
                  :class="layoutConfig.footerStyle === style.value
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.footerStyle = style.value"
                >
                  <div class="flex items-center gap-2 mb-2">
                    <UIcon :name="style.icon" class="w-4 h-4" :class="layoutConfig.footerStyle === style.value ? 'text-primary' : 'text-slate-400'" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ style.label }}</span>
                  </div>
                  <p class="text-xs text-slate-500">{{ style.description }}</p>
                  <UIcon
                    v-if="layoutConfig.footerStyle === style.value"
                    name="lucide:check-circle"
                    class="w-5 h-5 text-primary absolute top-2 right-2"
                  />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">版权信息</label>
              <UInput v-model="layoutConfig.copyright" placeholder="© 2026 BuildingAI. All rights reserved." />
            </div>

            <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">显示备案号</h3>
                <p class="text-xs mt-0.5 text-slate-500">在底部显示 ICP 备案号</p>
              </div>
              <UCheckbox :modelValue="layoutConfig.showIcp" @change="layoutConfig.showIcp = !layoutConfig.showIcp" />
            </div>

            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">显示社交链接</h3>
                <p class="text-xs mt-0.5 text-slate-500">在底部显示社交媒体图标</p>
              </div>
              <UCheckbox :modelValue="layoutConfig.showSocial" @change="layoutConfig.showSocial = !layoutConfig.showSocial" />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">色彩方案</h2>
            <p class="text-sm mt-1 text-slate-500">选择系统主题色彩</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">主题色</label>
              <div class="grid grid-cols-5 gap-2">
                <button
                  v-for="color in colorSchemes"
                  :key="color.value"
                  class="h-10 rounded-xl transition-all duration-200 relative"
                  :class="layoutConfig.colorScheme === color.value ? 'ring-2 ring-offset-2 ring-primary ring-offset-white dark:ring-offset-slate-800 scale-110' : 'hover:scale-105'"
                  :style="{ background: color.bg }"
                  @click="layoutConfig.colorScheme = color.value"
                  :title="color.label"
                >
                  <UIcon
                    v-if="layoutConfig.colorScheme === color.value"
                    name="lucide:check"
                    class="w-4 h-4 text-white absolute inset-0 m-auto"
                  />
                </button>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">模式</label>
              <div class="flex gap-3">
                <button
                  class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200"
                  :class="layoutConfig.themeMode === 'light'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.themeMode = 'light'"
                >
                  <UIcon name="lucide:sun" class="w-4 h-4" :class="layoutConfig.themeMode === 'light' ? 'text-primary' : 'text-slate-400'" />
                  <span class="text-sm font-medium text-slate-900 dark:text-white">浅色</span>
                </button>
                <button
                  class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200"
                  :class="layoutConfig.themeMode === 'dark'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.themeMode = 'dark'"
                >
                  <UIcon name="lucide:moon" class="w-4 h-4" :class="layoutConfig.themeMode === 'dark' ? 'text-primary' : 'text-slate-400'" />
                  <span class="text-sm font-medium text-slate-900 dark:text-white">深色</span>
                </button>
                <button
                  class="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-200"
                  :class="layoutConfig.themeMode === 'auto'
                    ? 'border-primary bg-primary/5 dark:bg-primary/10'
                    : 'border-slate-200 dark:border-slate-700 hover:border-primary/30'"
                  @click="layoutConfig.themeMode = 'auto'"
                >
                  <UIcon name="lucide:monitor" class="w-4 h-4" :class="layoutConfig.themeMode === 'auto' ? 'text-primary' : 'text-slate-400'" />
                  <span class="text-sm font-medium text-slate-900 dark:text-white">跟随系统</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">布局预览</h2>
            <p class="text-sm mt-1 text-slate-500">实时预览布局效果</p>
          </div>
          <div class="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-700/50">
            <div class="h-10 bg-slate-200 dark:bg-slate-600 flex items-center px-3 gap-2">
              <div class="w-2 h-2 rounded-full bg-red-400"></div>
              <div class="w-2 h-2 rounded-full bg-yellow-400"></div>
              <div class="w-2 h-2 rounded-full bg-green-400"></div>
              <span class="text-xs text-slate-400 ml-2">预览</span>
            </div>
            <div class="flex" :class="layoutConfig.sidebarPosition === 'right' ? 'flex-row-reverse' : ''">
              <div
                class="flex-shrink-0 bg-slate-100 dark:bg-slate-600 p-2 transition-all duration-300"
                :class="[
                  layoutConfig.sidebarWidth === 'compact' ? 'w-12' : layoutConfig.sidebarWidth === 'wide' ? 'w-24' : 'w-16',
                  layoutConfig.sidebarCollapsed ? 'hidden' : ''
                ]"
              >
                <div class="space-y-1.5">
                  <div v-for="i in 5" :key="i" class="h-2 rounded" :class="layoutConfig.sidebarCollapsed ? 'bg-slate-300 dark:bg-slate-500' : 'bg-slate-300 dark:bg-slate-500'"></div>
                </div>
              </div>
              <div class="flex-1 p-2">
                <div class="h-4 w-1/2 bg-slate-200 dark:bg-slate-500 rounded mb-2"></div>
                <div class="space-y-1.5">
                  <div v-for="i in 3" :key="i" class="h-3 bg-slate-200 dark:bg-slate-500 rounded" :style="{ width: (80 - i * 10) + '%' }"></div>
                </div>
              </div>
            </div>
            <div
              v-if="layoutConfig.footerStyle !== 'hidden'"
              class="h-8 bg-slate-200 dark:bg-slate-600 flex items-center justify-center px-3"
              :class="layoutConfig.footerStyle === 'minimal' ? 'h-6' : ''"
            >
              <div class="h-1.5 w-1/3 bg-slate-300 dark:bg-slate-500 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getDecorateLayout, updateDecorateLayout } from '~/composables/api/system'
import type { DecorateLayout as ApiDecorateLayout } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface LayoutConfig {
  headerStyle: string
  headerHeight: string
  showSearch: boolean
  stickyHeader: boolean
  sidebarPosition: string
  sidebarWidth: string
  sidebarCollapsed: boolean
  footerStyle: string
  copyright: string
  showIcp: boolean
  showSocial: boolean
  colorScheme: string
  themeMode: string
}

interface HeaderStyle {
  value: string
  label: string
  description: string
  icon: string
}

interface ColorScheme {
  value: string
  label: string
  bg: string
}

const loading = ref(true)
const error = ref('')
const saving = ref(false)
const activeTab = ref('layout')

const tabs = [
  { key: 'apps', label: '应用装修', icon: 'lucide:layout-grid' },
  { key: 'layout', label: '布局装修', icon: 'lucide:panel-top' },
  { key: 'agents', label: 'Agent装修', icon: 'lucide:bot' },
]

const headerStyles: HeaderStyle[] = [
  { value: 'default', label: '默认样式', description: '白色背景带阴影', icon: 'lucide:layout-template' },
  { value: 'transparent', label: '透明导航', description: '透明背景，沉浸式体验', icon: 'lucide:layers' },
  { value: 'colored', label: '彩色导航', description: '品牌色渐变背景', icon: 'lucide:palette' },
]

const headerHeightOptions = [
  { label: '紧凑 (48px)', value: 'compact' },
  { label: '默认 (64px)', value: 'default' },
  { label: '宽松 (80px)', value: 'tall' },
]

const sidebarWidthOptions = [
  { label: '紧凑 (200px)', value: 'compact' },
  { label: '默认 (240px)', value: 'default' },
  { label: '宽阔 (300px)', value: 'wide' },
]

const footerStyles = [
  { value: 'default', label: '标准底部', description: '包含导航链接和版权信息', icon: 'lucide:panel-bottom' },
  { value: 'minimal', label: '极简底部', description: '仅显示版权信息', icon: 'lucide:minus' },
  { value: 'hidden', label: '隐藏底部', description: '不显示底部区域', icon: 'lucide:eye-off' },
]

const colorSchemes: ColorScheme[] = [
  { value: 'indigo', label: '靛蓝', bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
  { value: 'blue', label: '蓝色', bg: 'linear-gradient(135deg, #3b82f6, #06b6d4)' },
  { value: 'emerald', label: '翠绿', bg: 'linear-gradient(135deg, #10b981, #14b8a6)' },
  { value: 'orange', label: '橙色', bg: 'linear-gradient(135deg, #f97316, #ef4444)' },
  { value: 'rose', label: '玫红', bg: 'linear-gradient(135deg, #f43f5e, #ec4899)' },
]

const layoutConfig = reactive<LayoutConfig>({
  headerStyle: 'default',
  headerHeight: 'default',
  showSearch: true,
  stickyHeader: true,
  sidebarPosition: 'left',
  sidebarWidth: 'default',
  sidebarCollapsed: false,
  footerStyle: 'default',
  copyright: '© 2026 BuildingAI. All rights reserved.',
  showIcp: true,
  showSocial: true,
  colorScheme: 'indigo',
  themeMode: 'auto',
})

function applyApiLayout(api: ApiDecorateLayout) {
  layoutConfig.headerStyle = api.headerStyle || layoutConfig.headerStyle
  layoutConfig.headerHeight = api.headerHeight || layoutConfig.headerHeight
  layoutConfig.showSearch = api.showSearch ?? layoutConfig.showSearch
  layoutConfig.stickyHeader = api.fixedHeader ?? layoutConfig.stickyHeader
  layoutConfig.sidebarPosition = api.sidebarPosition || layoutConfig.sidebarPosition
  layoutConfig.sidebarWidth = api.sidebarWidth || layoutConfig.sidebarWidth
  layoutConfig.sidebarCollapsed = api.defaultCollapsed ?? layoutConfig.sidebarCollapsed
  layoutConfig.footerStyle = api.footerStyle || layoutConfig.footerStyle
  layoutConfig.copyright = api.copyright || layoutConfig.copyright
  layoutConfig.showIcp = api.showIcp ?? layoutConfig.showIcp
  layoutConfig.colorScheme = api.colorScheme || layoutConfig.colorScheme
  layoutConfig.themeMode = api.themeMode === 'system' ? 'auto' : api.themeMode || layoutConfig.themeMode
}

async function fetchLayout() {
  loading.value = true
  error.value = ''
  try {
    const data = await getDecorateLayout()
    if (data) {
      applyApiLayout(data)
    }
  } catch (e: any) {
    error.value = e.message || '加载布局配置失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchLayout()
})

async function saveLayout() {
  saving.value = true
  try {
    await updateDecorateLayout({
      headerStyle: layoutConfig.headerStyle,
      headerHeight: layoutConfig.headerHeight,
      showSearch: layoutConfig.showSearch,
      fixedHeader: layoutConfig.stickyHeader,
      sidebarPosition: layoutConfig.sidebarPosition as 'left' | 'right',
      sidebarWidth: layoutConfig.sidebarWidth,
      defaultCollapsed: layoutConfig.sidebarCollapsed,
      footerStyle: layoutConfig.footerStyle,
      copyright: layoutConfig.copyright,
      showIcp: layoutConfig.showIcp,
      colorScheme: layoutConfig.colorScheme,
      themeMode: layoutConfig.themeMode === 'auto' ? 'system' : (layoutConfig.themeMode as 'light' | 'dark'),
    })
  } catch (e: any) {
    error.value = e.message || '保存布局配置失败'
  } finally {
    saving.value = false
  }
}
</script>