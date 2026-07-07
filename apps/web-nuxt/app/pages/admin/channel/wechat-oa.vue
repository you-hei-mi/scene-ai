<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">渠道管理</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">微信公众号</p>
      </div>
      <div class="flex items-center gap-2">
        <button class="btn-glass" @click="testConnection">
          <UIcon name="lucide:plug" class="w-4 h-4" />
          测试连接
        </button>
        <button class="btn-glass btn-glass--primary" @click="saveConfig">
          <UIcon name="lucide:save" class="w-4 h-4" />
          保存配置
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
            <button class="btn-glass w-full justify-start" @click="syncMenus">
              <UIcon name="lucide:refresh-cw" class="w-4 h-4" />
              同步菜单到微信
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'

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

const config = reactive<WechatConfig>({
  name: 'BuildingAI 智能助手',
  appId: 'wx1234567890abcdef',
  appSecret: '',
  token: 'buildingai_token_2024',
  encodingAesKey: '',
})

const connectionStatus = ref<ConnectionStatus>('connected')
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
  subscribe: '欢迎关注 BuildingAI！我是您的智能助手，可以为您提供 AI 对话、知识查询、智能分析等服务。回复"帮助"了解更多功能。',
  keywords: [
    { keyword: '帮助,help', reply: '您好！我可以帮您：\n1. 查询 AI 模型信息\n2. 查看知识库内容\n3. 获取最新活动资讯\n4. 联系客服\n\n直接回复您的问题即可。' },
    { keyword: '客服,人工', reply: '已为您转接人工客服，请稍候。工作时间：周一至周五 9:00-18:00，我们会尽快回复您。' },
    { keyword: '活动,优惠', reply: '当前热门活动：\n🎉 新用户注册即送 100 次对话额度\n🎁 邀请好友各得 50 次对话额度\n🔥 专业版限时 8 折优惠\n\n详情请访问：https://buildingai.cc/pricing' },
  ],
  default: '已收到您的消息，我们会尽快处理。如需帮助，请回复"帮助"查看可用功能。',
})

const stats = reactive({
  subscribers: 12850,
  todayNew: 36,
  todayMessages: 2840,
  lastSync: '2026-07-07 10:30:25',
})

const menuItems = ref<MenuItem[]>([
  {
    id: '1',
    name: 'AI 对话',
    type: 'view',
    typeLabel: '跳转网页',
    icon: 'lucide:message-circle',
    url: 'https://buildingai.cc/chat',
    children: [
      { id: '1-1', name: '开始对话', type: 'view', typeLabel: '跳转网页', icon: 'lucide:play', url: 'https://buildingai.cc/chat/new' },
      { id: '1-2', name: '对话历史', type: 'view', typeLabel: '跳转网页', icon: 'lucide:history', url: 'https://buildingai.cc/chat/history' },
      { id: '1-3', name: '模型选择', type: 'click', typeLabel: '点击事件', icon: 'lucide:cpu', key: 'model_select' },
    ],
  },
  {
    id: '2',
    name: '智能服务',
    type: 'parent',
    typeLabel: '父菜单',
    icon: 'lucide:bot',
    children: [
      { id: '2-1', name: '知识库', type: 'view', typeLabel: '跳转网页', icon: 'lucide:book-open', url: 'https://buildingai.cc/datasets' },
      { id: '2-2', name: '数据分析', type: 'click', typeLabel: '点击事件', icon: 'lucide:bar-chart-3', key: 'data_analysis' },
      { id: '2-3', name: '翻译助手', type: 'click', typeLabel: '点击事件', icon: 'lucide:languages', key: 'translator' },
    ],
  },
  {
    id: '3',
    name: '个人中心',
    type: 'view',
    typeLabel: '跳转网页',
    icon: 'lucide:user',
    url: 'https://buildingai.cc/settings',
    children: [
      { id: '3-1', name: '我的账户', type: 'view', typeLabel: '跳转网页', icon: 'lucide:credit-card', url: 'https://buildingai.cc/settings/account' },
      { id: '3-2', name: '联系客服', type: 'click', typeLabel: '点击事件', icon: 'lucide:headphones', key: 'contact_service' },
    ],
  },
])

function saveConfig() {
  connectionStatus.value = 'connected'
  console.log('保存配置:', config)
}

function testConnection() {
  connectionStatus.value = 'connected'
  console.log('测试连接...')
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

function syncMenus() {
  console.log('同步菜单到微信...')
}

function syncMaterials() {
  console.log('同步素材库...')
}

function fetchFollowers() {
  console.log('同步粉丝列表...')
}
</script>