<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">协议管理</p>
    </div>

    <AdminSystemTabs />

    <div class="space-y-6">
      <div
        v-for="agreement in agreements"
        :key="agreement.id"
        class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
              <UIcon name="lucide:file-text" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white">{{ agreement.name }}</h3>
              <div class="flex items-center gap-3 mt-1">
                <span
                  class="inline-flex items-center gap-1.5 text-sm"
                  :class="agreement.enabled ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                >
                  <span
                    class="w-2 h-2 rounded-full"
                    :class="agreement.enabled ? 'bg-green-500' : 'bg-red-500'"
                  ></span>
                  {{ agreement.enabled ? '已启用' : '已禁用' }}
                </span>
                <span class="text-sm text-slate-500">最后更新: {{ agreement.updatedAt }}</span>
              </div>
            </div>
          </div>
          <button class="btn-glass" @click="openEditDialog(agreement)">
            <UIcon name="lucide:edit" class="w-4 h-4" />
            编辑
          </button>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <p class="text-sm text-slate-500 line-clamp-3">{{ agreement.content }}</p>
        </div>
      </div>
    </div>

    <UDialog v-model="showEditDialog" :title="'编辑协议 - ' + editingAgreement?.name" size="xl">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">协议名称</label>
          <UInput v-model="editForm.name" placeholder="输入协议名称" />
        </div>
        <div class="flex items-center gap-4">
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="editForm.enabled" />
            <span class="text-sm text-slate-700 dark:text-slate-300">启用协议</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <UCheckbox v-model="showPreview" />
            <span class="text-sm text-slate-700 dark:text-slate-300">预览模式</span>
          </label>
        </div>
        <div v-if="showPreview" class="bg-slate-50 dark:bg-slate-700/50 rounded-xl p-6 min-h-48">
          <div class="prose prose-sm dark:prose-invert max-w-none" v-html="previewContent"></div>
        </div>
        <div v-else>
          <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">协议内容</label>
          <UTextarea v-model="editForm.content" placeholder="输入协议内容，支持 Markdown 格式..." :rows="16" />
        </div>
      </div>
      <template #footer>
        <button class="btn-glass" @click="showEditDialog = false">取消</button>
        <button class="btn-glass btn-glass--primary" @click="publishAgreement">发布</button>
      </template>
    </UDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'console',
})

interface Agreement {
  id: string
  name: string
  enabled: boolean
  content: string
  updatedAt: string
}

const showEditDialog = ref(false)
const showPreview = ref(false)
const editingAgreement = ref<Agreement | null>(null)

const agreements = ref<Agreement[]>([
  {
    id: '1',
    name: '用户协议',
    enabled: true,
    content: '# 用户协议\n\n欢迎使用 BuildingAI 平台。\n\n## 一、总则\n\n1. 本协议是您与 BuildingAI 之间关于使用本平台服务所订立的协议。\n2. 您在使用本平台服务时，即表示您已充分阅读、理解并同意接受本协议的全部内容。\n\n## 二、账号管理\n\n1. 您应保证注册信息的真实性和完整性。\n2. 您应妥善保管账号和密码，不得将账号提供给第三方使用。\n\n## 三、使用规范\n\n1. 您不得利用本平台从事任何违法违规活动。\n2. 您不得利用 AI 生成违法和不良信息。\n3. 您不得对平台进行反向工程、篡改或攻击。\n\n## 四、免责声明\n\n本平台提供的 AI 服务基于机器学习技术，生成内容可能存在偏差，仅供参考。',
    updatedAt: '2026-07-01 14:30',
  },
  {
    id: '2',
    name: '隐私政策',
    enabled: true,
    content: '# 隐私政策\n\n## 一、信息收集\n\n1. 我们在您注册时收集邮箱地址和用户名。\n2. 我们收集您的使用数据以改进服务质量。\n3. 我们不会收集您的敏感个人信息。\n\n## 二、信息使用\n\n1. 收集的信息仅用于提供和改进服务。\n2. 我们不会将您的信息出售给第三方。\n3. 我们使用加密技术保护您的数据。\n\n## 三、Cookie 使用\n\n我们使用必要的 Cookie 来维持会话和记住您的偏好设置。\n\n## 四、数据安全\n\n我们采用行业标准的安全措施保护您的个人信息。',
    updatedAt: '2026-06-28 09:15',
  },
  {
    id: '3',
    name: '服务条款',
    enabled: false,
    content: '# 服务条款\n\n## 一、服务说明\n\nBuildingAI 是一个 AI 对话服务和智能体平台，提供以下服务：\n\n- 多模型 AI 对话\n- 智能体创建与编排\n- 知识库管理\n- MCP 工具集成\n\n## 二、服务费用\n\n1. 基础服务免费提供。\n2. 高级功能按订阅计划收费。\n3. 价格变动将提前 30 天通知。\n\n## 三、服务限制\n\n1. 免费用户每日 API 调用次数有限。\n2. 我们保留在必要时暂停服务的权利。\n\n## 四、知识产权\n\n用户对其生成的内容保留所有权，平台保留对平台本身的知识产权。',
    updatedAt: '2026-06-15 16:45',
  },
])

const editForm = ref({
  name: '',
  enabled: true,
  content: '',
})

const previewContent = computed(() => {
  return editForm.value.content
    .replace(/\n/g, '<br>')
    .replace(/#{3} (.*)/g, '<h3 class="text-base font-semibold mt-4 mb-2">$1</h3>')
    .replace(/#{2} (.*)/g, '<h2 class="text-lg font-semibold mt-4 mb-2">$1</h2>')
    .replace(/#{1} (.*)/g, '<h1 class="text-xl font-bold mt-4 mb-2">$1</h1>')
    .replace(/^\d+\. (.*)/gm, '<p class="ml-4 mb-1">$1</p>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
})

function openEditDialog(agreement: Agreement) {
  editingAgreement.value = agreement
  editForm.value = {
    name: agreement.name,
    enabled: agreement.enabled,
    content: agreement.content,
  }
  showPreview.value = false
  showEditDialog.value = true
}

function publishAgreement() {
  if (editingAgreement.value) {
    const item = agreements.value.find(a => a.id === editingAgreement.value!.id)
    if (item) {
      item.name = editForm.value.name
      item.enabled = editForm.value.enabled
      item.content = editForm.value.content
      item.updatedAt = new Date().toLocaleString('zh-CN', { hour12: false })
    }
  }
  showEditDialog.value = false
}
</script>