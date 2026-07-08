<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
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
      <button class="btn-glass text-sm" @click="fetchData">重试</button>
    </div>

    <template v-else>
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">渠道管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">微信公众号</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-glass" :disabled="isTesting" @click="testConnection">
          <UIcon name="lucide:plug" class="w-4 h-4" />
          {{ isTesting ? '测试中...' : '测试连接' }}
        </button>
        <button class="btn-glass btn-glass--primary" :disabled="saving" @click="saveConfig">
          <UIcon name="lucide:save" class="w-4 h-4" />
          {{ saving ? '保存中...' : '保存配置' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">公众号配置</h2>
            <p class="text-sm mt-1 text-slate-500">填写微信公众号的基本信息和开发参数</p>
          </div>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公众号名称</label>
              <UInput v-model="config.name" placeholder="例如：BuildingAI 智能助手" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">AppID</label>
              <UInput v-model="config.appId" placeholder="请输入公众号 AppID" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">AppSecret</label>
              <UInput v-model="config.appSecret" type="password" placeholder="请输入公众号 AppSecret" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Token</label>
                <UInput v-model="config.token" placeholder="自定义 Token" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">EncodingAESKey</label>
                <UInput v-model="config.encodingAesKey" type="password" placeholder="消息加密密钥" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">服务器地址 (URL)</label>
              <div class="flex items-center gap-2">
                <UInput :model-value="serverUrl" readonly class="flex-1" />
                <button class="btn-glass" @click="copyUrl">
                  <UIcon name="lucide:copy" class="w-4 h-4" />
                </button>
              </div>
              <p class="text-xs mt-1 text-slate-500">将此地址配置到公众号开发平台的服务器配置中</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">自定义菜单</h2>
              <p class="text-sm mt-1 text-slate-500">管理微信公众号底部菜单栏</p>
            </div>
            <button class="btn-glass btn-glass--primary text-sm" @click="openAddMenuDialog(null)">
              <UIcon name="lucide:plus" class="w-4 h-4" />
              添加菜单
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="menu in menuItems"
              :key="menu.id"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50"
            >
              <div class="flex items-center justify-between mb-3">
                <div class="flex items-center gap-3">
                  <UIcon :name="menu.icon" class="w-5 h-5 text-primary" />
                  <div>
                    <span class="font-medium text-sm text-slate-900 dark:text-white">{{ menu.name }}</span>
                    <span class="text-xs text-slate-500 ml-2">{{ menu.typeLabel }}</span>
                  </div>
                </div>
                <div class="flex items-center gap-1">
                  <button class="btn-glass p-1.5" @click="openAddMenuDialog(menu)">
                    <UIcon name="lucide:plus" class="w-3.5 h-3.5" />
                  </button>
                  <button class="btn-glass p-1.5" @click="openEditMenuDialog(menu)">
                    <UIcon name="lucide:edit" class="w-3.5 h-3.5" />
                  </button>
                  <button class="btn-glass p-1.5 text-red-500" @click="deleteMenu(menu)">
                    <UIcon name="lucide:trash-2" class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div v-if="menu.children && menu.children.length > 0" class="ml-6 space-y-2">
                <div
                  v-for="child in menu.children"
                  :key="child.id"
                  class="flex items-center justify-between px-3 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-600"
                >
                  <div class="flex items-center gap-2">
                    <span class="text-sm text-slate-700 dark:text-slate-300">{{ child.name }}</span>
                    <span class="text-xs text-slate-400">{{ child.typeLabel }}</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button class="btn-glass p-1" @click="openEditSubMenuDialog(menu, child)">
                      <UIcon name="lucide:edit" class="w-3 h-3" />
                    </button>
                    <button class="btn-glass p-1 text-red-500" @click="deleteSubMenu(menu, child)">
                      <UIcon name="lucide:trash-2" class="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="menuItems.length === 0" class="text-center py-8">
              <div class="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 mb-3">
                <UIcon name="lucide:menu" class="w-6 h-6 text-slate-400" />
              </div>
              <p class="text-sm text-slate-500">暂无菜单项，点击上方按钮添加</p>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">自动回复设置</h2>
            <p class="text-sm mt-1 text-slate-500">配置用户关注回复、关键词回复和默认回复</p>
          </div>
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">关注回复</label>
              <UTextarea v-model="autoReply.subscribe" placeholder="用户关注公众号后自动回复的内容" rows="3" />
              <p class="text-xs mt-1 text-slate-500">支持文字、图片、图文链接</p>
            </div>
            <div>
              <div class="flex items-center justify-between mb-2">
                <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">关键词回复</label>
                <button class="btn-glass text-sm" @click="addKeywordReply">
                  <UIcon name="lucide:plus" class="w-3.5 h-3.5" />
                  添加规则
                </button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(rule, idx) in autoReply.keywords"
                  :key="idx"
                  class="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50"
                >
                  <div class="flex-1 space-y-2">
                    <UInput v-model="rule.keyword" placeholder="关键词，多个用逗号分隔" />
                    <UTextarea v-model="rule.reply" placeholder="回复内容" rows="2" />
                  </div>
                  <button class="btn-glass p-1.5 text-red-500 flex-shrink-0 mt-1" @click="removeKeywordReply(idx)">
                    <UIcon name="lucide:trash-2" class="w-4 h-4" />
                  </button>
                </div>
                <div v-if="autoReply.keywords.length === 0" class="text-center py-4">
                  <p class="text-sm text-slate-400">暂无关键词回复规则</p>
                </div>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">默认回复</label>
              <UTextarea v-model="autoReply.default" placeholder="当无法匹配关键词时的默认回复" rows="3" />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">连接状态</h2>
          <div class="flex items-center gap-4 mb-4">
            <div class="w-16 h-16 rounded-full flex items-center justify-center"
              :class="connectionStatus === 'connected' ? 'bg-green-100 dark:bg-green-900/30' : connectionStatus === 'error' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'">
              <UIcon :name="connectionStatusIcon" class="w-8 h-8"
                :class="connectionStatus === 'connected' ? 'text-green-600 dark:text-green-400' : connectionStatus === 'error' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'" />
            </div>
            <div>
              <p class="text-lg font-semibold text-slate-900 dark:text-white">{{ connectionStatusText }}</p>
              <p class="text-xs text-slate-500">{{ connectionStatusDesc }}</p>
            </div>
          </div>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span class="text-slate-500">关注人数</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ stats.subscribers.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span class="text-slate-500">今日新增</span>
              <span class="font-medium text-green-600 dark:text-green-400">+{{ stats.todayNew }}</span>
            </div>
            <div class="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
              <span class="text-slate-500">今日消息</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ stats.todayMessages.toLocaleString() }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-slate-500">最后同步</span>
              <span class="font-medium text-slate-900 dark:text-white">{{ stats.lastSync }}</span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">快速操作</h2>
          <div class="space-y-2">
            <button class="btn-glass w-full justify-start" :disabled="savingMenus" @click="syncMenus">
              <UIcon name="lucide:refresh-cw" class="w-4 h-4" />
              {{ savingMenus ? '同步中...' : '同步菜单到微信' }}
            </button>
            <button class="btn-glass w-full justify-start" @click="syncMaterials">
              <UIcon name="lucide:image" class="w-4 h-4" />
              同步素材库
            </button>
            <button class="btn-glass w-full justify-start" @click="fetchFollowers">
              <UIcon name="lucide:users" class="w-4 h-4" />
              同步粉丝列表
            </button>
          </div>
        </div>
      </div>
    </div>

    <UDialog v-model="showMenuDialog" :title="editingSubMenu ? '编辑子菜单' : editingMenu ? '编辑菜单' : addingChildMenu ? `添加子菜单 - ${addingChildMenu.name}` : '添加菜单'" size="md">
      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">菜单名称 <span class="text-red-500">*</span></label>
          <UInput v-model="menuForm.name" placeholder="菜单显示名称" />
        </div>
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">菜单类型</label>
          <USelect v-model="menuForm.type" :options="menuTypeOptions" />
        </div>
        <div v-if="menuForm.type === 'view' || menuForm.type === 'miniprogram'">
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">
            {{ menuForm.type === 'miniprogram' ? '小程序页面路径' : '跳转 URL' }}
          </label>
          <UInput v-model="menuForm.url" :placeholder="menuForm.type === 'miniprogram' ? 'pages/index/index' : 'https://example.com'" />
        </div>
        <div v-if="menuForm.type === 'click'">
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">响应关键词</label>
          <UInput v-model="menuForm.key" placeholder="事件 KEY 值" />
        </div>
        <div v-if="menuForm.type === 'miniprogram'">
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">小程序 AppID</label>
          <UInput v-model="menuForm.appId" placeholder="关联小程序的 AppID" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showMenuDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="saveMenu">确认</button>
      </template>
    </UDialog>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import {
  getWeChatOAConfig,
  updateWeChatOAConfig,
  testWeChatOAConnection,
  getWeChatMenus,
  updateWeChatMenus,
  getAutoReplyConfig,
  updateAutoReplyConfig,
} from '~/composables/api/system'
import type { WeChatMenu, AutoReplyConfig as ApiAutoReplyConfig } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface MenuItem {
  id: string
  name: string
  type: 'click' | 'view' | 'miniprogram' | 'parent'
  typeLabel: string
  icon: string
  url?: string
  key?: string
  appId?: string
  children?: MenuItem[]
}

interface KeywordRule {
  keyword: string
  reply: string
}

interface WechatConfig {
  name: string
  appId: string
  appSecret: string
  token: string
  encodingAesKey: string
}

interface AutoReplyConfig {
  subscribe: string
  keywords: KeywordRule[]
  default: string
}

type ConnectionStatus = 'connected' | 'disconnected' | 'error'

const loading = ref(true)
const error = ref('')
const saving = ref(false)
const isTesting = ref(false)
const savingMenus = ref(false)

const config = reactive<WechatConfig>({
  name: '',
  appId: '',
  appSecret: '',
  token: '',
  encodingAesKey: '',
})

const connectionStatus = ref<ConnectionStatus>('disconnected')
const showMenuDialog = ref(false)
const editingMenu = ref<MenuItem | null>(null)
const editingSubMenu = ref<MenuItem | null>(null)
const addingChildMenu = ref<MenuItem | null>(null)

const connectionStatusIcon = computed(() => {
  const map: Record<ConnectionStatus, string> = {
    connected: 'lucide:check-circle',
    disconnected: 'lucide:alert-circle',
    error: 'lucide:x-circle',
  }
  return map[connectionStatus.value]
})

const connectionStatusText = computed(() => {
  const map: Record<ConnectionStatus, string> = {
    connected: '已连接',
    disconnected: '未连接',
    error: '连接异常',
  }
  return map[connectionStatus.value]
})

const connectionStatusDesc = computed(() => {
  const map: Record<ConnectionStatus, string> = {
    connected: '公众号配置正常，服务运行中',
    disconnected: '请填写公众号配置信息并保存',
    error: 'AppID 或 AppSecret 可能不正确',
  }
  return map[connectionStatus.value]
})

const serverUrl = computed(() => `https://api.buildingai.cc/wechat/callback/${config.appId || 'YOUR_APPID'}`)

const menuTypeOptions = [
  { label: '点击推事件', value: 'click' },
  { label: '跳转网页', value: 'view' },
  { label: '跳转小程序', value: 'miniprogram' },
]

const menuForm = reactive({
  name: '',
  type: 'click' as MenuItem['type'],
  url: '',
  key: '',
  appId: '',
})

const autoReply = reactive<AutoReplyConfig>({
  subscribe: '',
  keywords: [],
  default: '',
})

const stats = reactive({
  subscribers: 0,
  todayNew: 0,
  todayMessages: 0,
  lastSync: '--',
})

const menuItems = ref<MenuItem[]>([])

function mapApiMenuToLocal(menu: WeChatMenu): MenuItem {
  const typeLabelMap: Record<string, string> = {
    click: '点击事件',
    view: '跳转网页',
    miniprogram: '跳转小程序',
    parent: '父菜单',
  }
  const iconMap: Record<string, string> = {
    click: 'lucide:mouse-pointer-click',
    view: 'lucide:link',
    miniprogram: 'lucide:smartphone',
    parent: 'lucide:folder',
  }
  const effectiveType = menu.children && menu.children.length > 0 ? 'parent' : menu.type
  return {
    id: menu.id,
    name: menu.name,
    type: effectiveType,
    typeLabel: typeLabelMap[effectiveType] || effectiveType,
    icon: iconMap[effectiveType] || 'lucide:link',
    url: menu.url || undefined,
    key: menu.key || undefined,
    appId: undefined,
    children: menu.children?.map(mapApiMenuToLocal),
  }
}

function mapLocalMenuToApi(menu: MenuItem): WeChatMenu {
  return {
    id: menu.id,
    name: menu.name,
    type: menu.type === 'parent' ? 'view' : menu.type,
    key: menu.key || '',
    url: menu.url || '',
    parentId: null,
    children: menu.children?.map(mapLocalMenuToApi),
  }
}

async function fetchData() {
  loading.value = true
  error.value = ''
  try {
    const [oaConfig, menus, autoReplyConfig] = await Promise.all([
      getWeChatOAConfig(),
      getWeChatMenus(),
      getAutoReplyConfig(),
    ])

    if (oaConfig) {
      config.name = oaConfig.name || ''
      config.appId = oaConfig.appId || ''
      config.appSecret = oaConfig.appSecret || ''
      config.token = oaConfig.token || ''
      config.encodingAesKey = oaConfig.encodingAESKey || ''
      connectionStatus.value = oaConfig.isConnected ? 'connected' : 'disconnected'
      if (oaConfig.stats) {
        stats.subscribers = oaConfig.stats.followers || 0
        stats.todayMessages = oaConfig.stats.todayMessages || 0
      }
    }

    if (menus) {
      menuItems.value = menus.map(mapApiMenuToLocal)
    }

    if (autoReplyConfig) {
      autoReply.subscribe = autoReplyConfig.followReply?.content || ''
      autoReply.keywords = (autoReplyConfig.keywordReplies || []).map(kr => ({
        keyword: kr.keyword || '',
        reply: kr.content || '',
      }))
      autoReply.default = autoReplyConfig.defaultReply?.content || ''
    }
  } catch (e: any) {
    error.value = e.message || '加载数据失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

async function saveConfig() {
  saving.value = true
  try {
    const result = await updateWeChatOAConfig({
      name: config.name,
      appId: config.appId,
      appSecret: config.appSecret,
      token: config.token,
      encodingAESKey: config.encodingAesKey,
    })
    if (result) {
      connectionStatus.value = result.isConnected ? 'connected' : 'disconnected'
    }
  } catch (e: any) {
    error.value = e.message || '保存配置失败'
  } finally {
    saving.value = false
  }
}

async function testConnection() {
  isTesting.value = true
  try {
    const result = await testWeChatOAConnection()
    connectionStatus.value = result?.success ? 'connected' : 'error'
  } catch (e: any) {
    connectionStatus.value = 'error'
    error.value = e.message || '连接测试失败'
  } finally {
    isTesting.value = false
  }
}

function copyUrl() {
  navigator.clipboard.writeText(serverUrl.value)
}

function openAddMenuDialog(parent: MenuItem | null) {
  editingMenu.value = null
  editingSubMenu.value = null
  addingChildMenu.value = parent
  menuForm.name = ''
  menuForm.type = 'click'
  menuForm.url = ''
  menuForm.key = ''
  menuForm.appId = ''
  showMenuDialog.value = true
}

function openEditMenuDialog(menu: MenuItem) {
  editingMenu.value = menu
  editingSubMenu.value = null
  addingChildMenu.value = null
  menuForm.name = menu.name
  menuForm.type = menu.type === 'parent' ? 'click' : menu.type
  menuForm.url = menu.url || ''
  menuForm.key = menu.key || ''
  menuForm.appId = menu.appId || ''
  showMenuDialog.value = true
}

function openEditSubMenuDialog(parent: MenuItem, child: MenuItem) {
  editingMenu.value = parent
  editingSubMenu.value = child
  addingChildMenu.value = null
  menuForm.name = child.name
  menuForm.type = child.type
  menuForm.url = child.url || ''
  menuForm.key = child.key || ''
  menuForm.appId = child.appId || ''
  showMenuDialog.value = true
}

function saveMenu() {
  if (!menuForm.name.trim()) return

  const typeLabelMap: Record<string, string> = {
    click: '点击事件',
    view: '跳转网页',
    miniprogram: '跳转小程序',
    parent: '父菜单',
  }

  const newItem: MenuItem = {
    id: Date.now().toString(),
    name: menuForm.name,
    type: menuForm.type,
    typeLabel: typeLabelMap[menuForm.type] || menuForm.type,
    icon: 'lucide:link',
    url: menuForm.url || undefined,
    key: menuForm.key || undefined,
    appId: menuForm.appId || undefined,
    children: [],
  }

  if (editingSubMenu.value && editingMenu.value) {
    const parent = editingMenu.value
    const children = parent.children || []
    const idx = children.findIndex(c => c.id === editingSubMenu.value!.id)
    if (idx > -1) {
      children[idx] = { ...children[idx], ...newItem }
    }
  } else if (editingMenu.value) {
    const idx = menuItems.value.findIndex(m => m.id === editingMenu.value!.id)
    if (idx > -1) {
      menuItems.value[idx] = { ...menuItems.value[idx], ...newItem, children: editingMenu.value.children }
    }
  } else if (addingChildMenu.value) {
    const parent = menuItems.value.find(m => m.id === addingChildMenu.value!.id)
    if (parent) {
      if (!parent.children) parent.children = []
      if (parent.children.length < 5) {
        parent.children.push(newItem)
      }
    }
  } else {
    if (menuItems.value.length < 3) {
      menuItems.value.push(newItem)
    }
  }

  showMenuDialog.value = false
}

function deleteMenu(menu: MenuItem) {
  const idx = menuItems.value.findIndex(m => m.id === menu.id)
  if (idx > -1) {
    menuItems.value.splice(idx, 1)
  }
}

function deleteSubMenu(parent: MenuItem, child: MenuItem) {
  if (parent.children) {
    const idx = parent.children.findIndex(c => c.id === child.id)
    if (idx > -1) {
      parent.children.splice(idx, 1)
    }
  }
}

function addKeywordReply() {
  autoReply.keywords.push({ keyword: '', reply: '' })
}

function removeKeywordReply(idx: number) {
  autoReply.keywords.splice(idx, 1)
}

async function syncMenus() {
  savingMenus.value = true
  try {
    const apiMenus = menuItems.value.map(mapLocalMenuToApi)
    const result = await updateWeChatMenus(apiMenus)
    if (result) {
      menuItems.value = result.map(mapApiMenuToLocal)
    }
  } catch (e: any) {
    error.value = e.message || '同步菜单失败'
  } finally {
    savingMenus.value = false
  }
}

function syncMaterials() {
  console.log('同步素材库...')
}

function fetchFollowers() {
  console.log('同步粉丝列表...')
}
</script>