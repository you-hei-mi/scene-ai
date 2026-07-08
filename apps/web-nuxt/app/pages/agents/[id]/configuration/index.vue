<template>
  <div class="min-h-screen">
    <div class="mb-6">
      <button class="btn-glass p-2" @click="handleBack">
        <UIcon name="lucide:arrow-left" class="w-4 h-4" />
      </button>
    </div>

    <div class="mb-8">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">Agent 配置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">配置智能体的基础参数、模型设置、工具与知识库</p>
    </div>

    <div class="flex gap-2 mb-6 border-b border-slate-200 dark:border-slate-700 pb-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="[
          'px-5 py-2.5 text-sm font-medium rounded-t-xl transition-all duration-200',
          activeTab === tab.id
            ? 'bg-white dark:bg-slate-800 text-primary border-b-2 border-primary'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
        ]"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
      </button>
    </div>

    <div class="max-w-3xl">
      <div v-if="activeTab === 'basic'" class="space-y-6">
        <section>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">智能体名称</label>
                <input
                  v-model="form.name"
                  placeholder="输入智能体名称"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">描述</label>
                <textarea
                  v-model="form.description"
                  placeholder="描述这个智能体的功能和用途"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[100px] resize-none"
                ></textarea>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">图标</label>
                  <div class="flex items-center gap-3">
                    <div
                      class="w-12 h-12 rounded-xl flex items-center justify-center"
                      :style="{ background: getIconGradient(form.icon) }"
                    >
                      <UIcon :name="form.icon" class="w-6 h-6 text-white" />
                    </div>
                    <select
                      v-model="form.icon"
                      class="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    >
                      <option v-for="icon in iconOptions" :key="icon.value" :value="icon.value">{{ icon.label }}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">分类</label>
                  <select
                    v-model="form.category"
                    class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  >
                    <option v-for="cat in categoryOptions" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'model'" class="space-y-6">
        <section>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div class="space-y-5">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">选择模型</label>
                <select
                  v-model="form.model"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                >
                  <option v-for="m in modelOptions" :key="m.value" :value="m.value">{{ m.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
                  温度: <span class="text-primary font-bold">{{ form.temperature }}</span>
                </label>
                <input
                  type="range"
                  v-model.number="form.temperature"
                  min="0"
                  max="2"
                  step="0.1"
                  class="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div class="flex justify-between text-xs text-slate-500 mt-2">
                  <span>精确</span>
                  <span>创意</span>
                </div>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">最大 Token 数</label>
                <input
                  v-model.number="form.maxTokens"
                  type="number"
                  placeholder="4096"
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">系统提示词</label>
                <textarea
                  v-model="form.systemPrompt"
                  placeholder="定义智能体的角色、行为准则、回答风格等..."
                  class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[160px] resize-vertical font-mono text-sm"
                ></textarea>
                <p class="text-xs text-slate-500 mt-2">提示词会影响智能体的所有回复，建议仔细编写</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'tools'" class="space-y-6">
        <section>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div class="space-y-3">
              <div
                v-for="tool in toolOptions"
                :key="tool.id"
                class="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600/50"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <UIcon :name="tool.icon" class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div class="font-medium text-slate-900 dark:text-white">{{ tool.label }}</div>
                    <div class="text-xs text-slate-500">{{ tool.description }}</div>
                  </div>
                </div>
                <button
                  :class="[
                    'relative w-11 h-6 rounded-full transition-colors duration-200',
                    form.tools.includes(tool.id) ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'
                  ]"
                  @click="toggleTool(tool.id)"
                >
                  <span
                    :class="[
                      'absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                      form.tools.includes(tool.id) ? 'translate-x-5' : 'translate-x-0'
                    ]"
                  ></span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'knowledge'" class="space-y-6">
        <section>
          <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
            <div class="space-y-3">
              <div
                v-for="kb in knowledgeBases"
                :key="kb.id"
                :class="[
                  'flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border',
                  form.knowledgeBases.includes(kb.id)
                    ? 'bg-primary/10 dark:bg-primary/20 border-primary/30'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600/50 hover:border-primary/30'
                ]"
                @click="toggleKnowledgeBase(kb.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                    <UIcon name="lucide:database" class="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div class="font-medium text-slate-900 dark:text-white">{{ kb.name }}</div>
                    <div class="text-xs text-slate-500">{{ kb.docs }} 篇文档</div>
                  </div>
                </div>
                <div
                  :class="[
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                    form.knowledgeBases.includes(kb.id)
                      ? 'bg-primary border-primary'
                      : 'border-slate-300 dark:border-slate-600'
                  ]"
                >
                  <UIcon v-if="form.knowledgeBases.includes(kb.id)" name="lucide:check" class="w-3 h-3 text-white" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div class="flex justify-end gap-3 pt-6">
        <button class="btn-glass px-6" @click="handleReset">
          重置
        </button>
        <button class="btn-glass btn-glass--primary px-6" @click="handleSave" :disabled="saving">
          <span v-if="saving" class="inline-flex items-center gap-2">
            <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            保存中...
          </span>
          <span v-else>保存配置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'console',
})

const route = useRoute()
const toast = useToast()

const agentId = computed(() => route.params.id as string)

const activeTab = ref('basic')
const saving = ref(false)

const tabs = [
  { id: 'basic', label: '基础配置' },
  { id: 'model', label: '模型设置' },
  { id: 'tools', label: '工具配置' },
  { id: 'knowledge', label: '知识库' },
]

const form = reactive({
  name: '通用 AI 助手',
  description: '一个功能全面的通用 AI 助手，可以回答各种问题、提供建议和帮助解决问题。',
  icon: 'lucide:bot',
  category: 'general',
  model: 'deepseek-chat',
  temperature: 0.7,
  maxTokens: 4096,
  systemPrompt: '你是一个专业的 AI 助手，请用中文回答用户的问题。回答应该准确、详细、有帮助。',
  tools: ['search', 'file-read'] as string[],
  knowledgeBases: ['kb1'] as string[],
})

const iconOptions = [
  { label: '机器人', value: 'lucide:bot' },
  { label: '代码', value: 'lucide:code' },
  { label: '笔', value: 'lucide:pen' },
  { label: '语言', value: 'lucide:languages' },
  { label: '图表', value: 'lucide:bar-chart' },
  { label: '灯泡', value: 'lucide:lightbulb' },
]

const categoryOptions = [
  { label: '通用', value: 'general' },
  { label: '编程', value: 'coding' },
  { label: '写作', value: 'writing' },
  { label: '翻译', value: 'translation' },
  { label: '数据', value: 'data' },
  { label: '产品', value: 'product' },
]

const modelOptions = [
  { label: 'DeepSeek V3', value: 'deepseek-chat' },
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { label: 'Claude Sonnet', value: 'claude-sonnet' },
  { label: '通义千问 Plus', value: 'qwen-plus' },
]

const toolOptions = [
  { id: 'search', label: '联网搜索', description: '允许智能体搜索互联网获取实时信息', icon: 'lucide:search' },
  { id: 'file-read', label: '文件读取', description: '允许智能体读取用户上传的文件内容', icon: 'lucide:file-text' },
  { id: 'code-exec', label: '代码执行', description: '允许智能体在沙箱环境中执行代码', icon: 'lucide:terminal' },
  { id: 'image-gen', label: '图像生成', description: '允许智能体生成图片', icon: 'lucide:image' },
  { id: 'calc', label: '计算器', description: '允许智能体进行精确的数学计算', icon: 'lucide:calculator' },
  { id: 'web-fetch', label: '网页抓取', description: '允许智能体读取指定 URL 的内容', icon: 'lucide:globe' },
]

const knowledgeBases = [
  { id: 'kb1', name: '产品文档库', docs: 156 },
  { id: 'kb2', name: '技术知识库', docs: 342 },
  { id: 'kb3', name: 'FAQ 常见问题', docs: 89 },
  { id: 'kb4', name: '客户服务手册', docs: 67 },
  { id: 'kb5', name: '培训资料', docs: 234 },
]

const iconGradients: Record<string, string> = {
  'lucide:bot': 'linear-gradient(135deg, #6366f1, #8b5cf6)',
  'lucide:code': 'linear-gradient(135deg, #16a34a, #22c55e)',
  'lucide:pen': 'linear-gradient(135deg, #a855f7, #d946ef)',
  'lucide:languages': 'linear-gradient(135deg, #f97316, #f59e0b)',
  'lucide:bar-chart': 'linear-gradient(135deg, #06b6d4, #22d3ee)',
  'lucide:lightbulb': 'linear-gradient(135deg, #ec4899, #f43f5e)',
}

function getIconGradient(icon: string): string {
  return iconGradients[icon] || 'linear-gradient(135deg, #6366f1, #8b5cf6)'
}

function toggleTool(toolId: string) {
  const index = form.tools.indexOf(toolId)
  if (index > -1) {
    form.tools.splice(index, 1)
  } else {
    form.tools.push(toolId)
  }
}

function toggleKnowledgeBase(kbId: string) {
  const index = form.knowledgeBases.indexOf(kbId)
  if (index > -1) {
    form.knowledgeBases.splice(index, 1)
  } else {
    form.knowledgeBases.push(kbId)
  }
}

function handleBack() {
  navigateTo(`/agents/${agentId.value}`)
}

function handleReset() {
  form.name = '通用 AI 助手'
  form.description = '一个功能全面的通用 AI 助手，可以回答各种问题、提供建议和帮助解决问题。'
  form.icon = 'lucide:bot'
  form.category = 'general'
  form.model = 'deepseek-chat'
  form.temperature = 0.7
  form.maxTokens = 4096
  form.systemPrompt = '你是一个专业的 AI 助手，请用中文回答用户的问题。回答应该准确、详细、有帮助。'
  form.tools = ['search', 'file-read']
  form.knowledgeBases = ['kb1']
}

async function handleSave() {
  if (!form.name.trim()) {
    toast.add({ title: '请输入智能体名称', color: 'yellow' })
    return
  }

  saving.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 600))
    toast.add({ title: '配置保存成功', color: 'green' })
  } finally {
    saving.value = false
  }
}
</script>