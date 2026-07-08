<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="text-center mb-6">
        <div class="w-16 h-16 mx-auto rounded-2xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-sm">
          <UIcon name="lucide:sparkles" class="w-8 h-8 text-primary" />
        </div>
        <h1 class="font-display text-2xl font-bold text-white">BuildingAI 安装向导</h1>
        <p class="text-sm mt-2 text-slate-300">跟随引导完成系统初始化配置</p>
      </div>

      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl">
        <div class="mb-6">
          <div class="flex items-center justify-between">
            <template v-for="(step, index) in steps" :key="step.id">
              <div class="flex flex-col items-center flex-1">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300"
                  :class="index < currentStep ? 'bg-primary border-primary text-white' : index === currentStep ? 'bg-white/10 border-primary text-primary' : 'bg-transparent border-slate-600 text-slate-500'"
                >
                  <UIcon v-if="index < currentStep" name="lucide:check" class="w-5 h-5" />
                  <UIcon v-else :name="step.icon" class="w-5 h-5" />
                </div>
                <p
                  class="text-xs font-medium mt-2"
                  :class="index <= currentStep ? 'text-white' : 'text-slate-500'"
                >
                  {{ step.title }}
                </p>
              </div>
              <div
                v-if="index < steps.length - 1"
                class="h-0.5 flex-1 mx-1 mb-6 rounded-full transition-all duration-300"
                :class="index < currentStep ? 'bg-primary' : 'bg-slate-600'"
              />
            </template>
          </div>
        </div>

        <div v-show="currentStep === 0">
          <div class="mb-4">
            <h2 class="text-lg font-semibold text-white">环境检查</h2>
            <p class="text-sm mt-1 text-slate-400">检测服务器运行环境是否满足要求</p>
          </div>
          <div class="space-y-3">
            <div
              v-for="check in environmentChecks"
              :key="check.id"
              class="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="check.iconBg"
                >
                  <UIcon :name="check.icon" class="w-5 h-5" :class="check.iconColor" />
                </div>
                <div>
                  <p class="text-sm font-medium text-white">{{ check.name }}</p>
                  <p class="text-xs text-slate-400">
                    需要 {{ check.required }}，当前 {{ check.current || '检测中...' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <span
                  v-if="check.status === 'checking'"
                  class="text-xs text-yellow-400 flex items-center gap-1"
                >
                  <UIcon name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                  检测中
                </span>
                <span
                  v-else-if="check.status === 'passed'"
                  class="text-xs text-green-400 flex items-center gap-1"
                >
                  <UIcon name="lucide:check-circle-2" class="w-3.5 h-3.5" />
                  通过
                </span>
                <span
                  v-else
                  class="text-xs text-red-400 flex items-center gap-1"
                >
                  <UIcon name="lucide:x-circle" class="w-3.5 h-3.5" />
                  未通过
                </span>
              </div>
            </div>
          </div>
          <UAlert
            v-if="hasFailedCheck"
            class="mt-4"
            color="error"
            variant="subtle"
            title="环境检测未通过"
            description="请修复上述未通过的检测项后重试，或联系系统管理员。"
            icon="lucide:alert-triangle"
          />
        </div>

        <div v-show="currentStep === 1">
          <div class="mb-4">
            <h2 class="text-lg font-semibold text-white">数据库配置</h2>
            <p class="text-sm mt-1 text-slate-400">配置系统使用的数据库连接信息</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">数据库类型</label>
              <USelect v-model="dbConfig.type" :options="dbTypeOptions" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-300">主机地址</label>
                <input
                  v-model="dbConfig.host"
                  placeholder="127.0.0.1"
                  class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-300">端口</label>
                <input
                  v-model.number="dbConfig.port"
                  type="number"
                  placeholder="5432"
                  class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">数据库名</label>
              <input
                v-model="dbConfig.database"
                placeholder="buildingai"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">用户名</label>
              <input
                v-model="dbConfig.username"
                placeholder="postgres"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">密码</label>
              <input
                v-model="dbConfig.password"
                type="password"
                placeholder="输入数据库密码"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div class="flex items-center justify-between pt-2">
              <p class="text-xs text-slate-400">配置完成后请先测试连接</p>
              <button class="btn-glass" :loading="testingConnection" @click="testConnection">
                <UIcon name="lucide:plug" class="w-4 h-4" />
                测试连接
              </button>
            </div>
          </div>
        </div>

        <div v-show="currentStep === 2">
          <div class="mb-4">
            <h2 class="text-lg font-semibold text-white">管理员账户</h2>
            <p class="text-sm mt-1 text-slate-400">创建系统的超级管理员账户</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">用户名</label>
              <input
                v-model="adminConfig.username"
                placeholder="admin"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <p class="text-xs text-slate-400 mt-1">3-20 个字符，仅支持字母、数字和下划线</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">邮箱</label>
              <input
                v-model="adminConfig.email"
                type="email"
                placeholder="admin@example.com"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">密码</label>
              <input
                v-model="adminConfig.password"
                type="password"
                placeholder="至少 8 位字符"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <p class="text-xs text-slate-400 mt-1">建议包含大小写字母、数字和特殊字符</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-300">确认密码</label>
              <input
                v-model="adminConfig.confirmPassword"
                type="password"
                placeholder="再次输入密码"
                class="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <label class="flex items-start gap-2 cursor-pointer pt-2">
              <UCheckbox v-model="adminConfig.agreeTerms" />
              <span class="text-xs text-slate-400 leading-relaxed">
                我已阅读并同意 <NuxtLink to="/license" class="text-primary underline">服务协议</NuxtLink> 和 <NuxtLink to="/privacy" class="text-primary underline">隐私政策</NuxtLink>
              </span>
            </label>
          </div>
        </div>

        <div v-show="currentStep === 3">
          <div class="mb-4">
            <h2 class="text-lg font-semibold text-white">完成安装</h2>
            <p class="text-sm mt-1 text-slate-400">系统正在初始化，请稍候</p>
          </div>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-white">安装进度</span>
                <span class="text-sm text-slate-400">{{ installProgress }}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  :style="{ width: installProgress + '%' }"
                />
              </div>
            </div>

            <div class="space-y-2">
              <div
                v-for="task in installTasks"
                :key="task.id"
                class="flex items-center gap-3 text-sm"
              >
                <UIcon
                  v-if="task.status === 'done'"
                  name="lucide:check-circle-2"
                  class="w-4 h-4 text-green-400 flex-shrink-0"
                />
                <UIcon
                  v-else-if="task.status === 'running'"
                  name="lucide:loader-2"
                  class="w-4 h-4 text-primary flex-shrink-0 animate-spin"
                />
                <UIcon
                  v-else
                  name="lucide:circle"
                  class="w-4 h-4 text-slate-600 flex-shrink-0"
                />
                <span :class="task.status === 'done' ? 'text-white' : 'text-slate-400'">
                  {{ task.name }}
                </span>
              </div>
            </div>

            <UAlert
              v-if="installProgress === 100"
              color="success"
              variant="subtle"
              title="安装完成！"
              description="系统已成功初始化，即将跳转到登录页面。"
              icon="lucide:party-popper"
            />

            <div v-if="installProgress === 100" class="grid grid-cols-2 gap-3 pt-2">
              <div class="p-3 rounded-xl bg-white/5">
                <p class="text-xs text-slate-400">数据库</p>
                <p class="text-sm font-medium text-white mt-1">{{ dbConfig.type }} · {{ dbConfig.host }}</p>
              </div>
              <div class="p-3 rounded-xl bg-white/5">
                <p class="text-xs text-slate-400">管理员</p>
                <p class="text-sm font-medium text-white mt-1">{{ adminConfig.username || 'admin' }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between pt-6 mt-6 border-t border-white/10">
          <button
            class="btn-glass"
            :disabled="currentStep === 0"
            @click="prevStep"
          >
            <UIcon name="lucide:arrow-left" class="w-4 h-4" />
            上一步
          </button>

          <span class="text-xs text-slate-400">步骤 {{ currentStep + 1 }} / {{ steps.length }}</span>

          <button
            v-if="currentStep < steps.length - 1"
            class="btn-glass btn-glass--primary"
            :disabled="!canNext"
            @click="nextStep"
          >
            下一步
            <UIcon name="lucide:arrow-right" class="w-4 h-4" />
          </button>
          <button
            v-else
            class="btn-glass btn-glass--primary"
            :disabled="installProgress < 100"
            @click="finishInstall"
          >
            <UIcon name="lucide:check" class="w-4 h-4" />
            完成安装
          </button>
        </div>
      </div>

      <p class="text-center text-xs text-slate-500 mt-6">
        BuildingAI © 2024 · 遇到问题请查阅
        <NuxtLink to="/help" class="text-primary underline">帮助文档</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: false,
})

type CheckStatus = 'checking' | 'passed' | 'failed'
type TaskStatus = 'pending' | 'running' | 'done'

interface Step {
  id: string
  title: string
  icon: string
}

interface EnvironmentCheck {
  id: string
  name: string
  required: string
  current?: string
  status: CheckStatus
  icon: string
  iconBg: string
  iconColor: string
}

interface InstallTask {
  id: string
  name: string
  status: TaskStatus
}

const steps: Step[] = [
  { id: 'environment', title: '环境检查', icon: 'lucide:server' },
  { id: 'database', title: '数据库配置', icon: 'lucide:database' },
  { id: 'admin', title: '管理员账户', icon: 'lucide:user-cog' },
  { id: 'complete', title: '完成安装', icon: 'lucide:check-circle' },
]

const currentStep = ref(0)

const dbTypeOptions = [
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'SQLite', value: 'sqlite' },
]

const dbConfig = ref({
  type: 'postgresql',
  host: '127.0.0.1',
  port: 5432,
  database: 'buildingai',
  username: 'postgres',
  password: '',
})

const adminConfig = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

const testingConnection = ref(false)
const installProgress = ref(0)

const environmentChecks = ref<EnvironmentCheck[]>([
  {
    id: 'node',
    name: 'Node.js 版本',
    required: 'v18.0.0+',
    current: undefined,
    status: 'checking',
    icon: 'lucide:hexagon',
    iconBg: 'bg-green-100/20 dark:bg-green-900/30',
    iconColor: 'text-green-400',
  },
  {
    id: 'database',
    name: '数据库版本',
    required: 'PostgreSQL 14+',
    current: undefined,
    status: 'checking',
    icon: 'lucide:database',
    iconBg: 'bg-blue-100/20 dark:bg-blue-900/30',
    iconColor: 'text-blue-400',
  },
  {
    id: 'redis',
    name: 'Redis 版本',
    required: 'v6.0+',
    current: undefined,
    status: 'checking',
    icon: 'lucide:layers',
    iconBg: 'bg-red-100/20 dark:bg-red-900/30',
    iconColor: 'text-red-400',
  },
  {
    id: 'disk',
    name: '磁盘空间',
    required: '至少 5GB 可用',
    current: undefined,
    status: 'checking',
    icon: 'lucide:hard-drive',
    iconBg: 'bg-orange-100/20 dark:bg-orange-900/30',
    iconColor: 'text-orange-400',
  },
  {
    id: 'memory',
    name: '内存容量',
    required: '至少 2GB',
    current: undefined,
    status: 'checking',
    icon: 'lucide:cpu',
    iconBg: 'bg-purple-100/20 dark:bg-purple-900/30',
    iconColor: 'text-purple-400',
  },
])

const installTasks = ref<InstallTask[]>([
  { id: 'init-db', name: '初始化数据库表结构', status: 'pending' },
  { id: 'init-data', name: '写入默认配置和初始数据', status: 'pending' },
  { id: 'init-admin', name: '创建管理员账户', status: 'pending' },
  { id: 'init-cache', name: '初始化 Redis 缓存', status: 'pending' },
  { id: 'init-storage', name: '创建存储目录', status: 'pending' },
])

const hasFailedCheck = computed(() =>
  environmentChecks.value.some(c => c.status === 'failed'),
)

const canNext = computed(() => {
  switch (currentStep.value) {
    case 0:
      return !hasFailedCheck.value && environmentChecks.value.every(c => c.status === 'passed')
    case 1:
      return !!dbConfig.value.host && !!dbConfig.value.database && !!dbConfig.value.username
    case 2:
      return (
        !!adminConfig.value.username
        && !!adminConfig.value.email
        && !!adminConfig.value.password
        && adminConfig.value.password === adminConfig.value.confirmPassword
        && adminConfig.value.agreeTerms
      )
    default:
      return true
  }
})

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

function nextStep() {
  if (!canNext.value) return
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    if (currentStep.value === steps.length - 1) {
      startInstall()
    }
  }
}

async function testConnection() {
  testingConnection.value = true
  await new Promise(resolve => setTimeout(resolve, 1500))
  testingConnection.value = false
}

async function startInstall() {
  for (let i = 0; i < installTasks.value.length; i++) {
    const task = installTasks.value[i]
    if (!task) continue
    task.status = 'running'
    await new Promise(resolve => setTimeout(resolve, 800))
    task.status = 'done'
    installProgress.value = Math.round(((i + 1) / installTasks.value.length) * 100)
  }
}

function finishInstall() {
  if (installProgress.value < 100) return
  navigateTo('/login')
}

async function runEnvironmentChecks() {
  for (const check of environmentChecks.value) {
    await new Promise(resolve => setTimeout(resolve, 600))
    check.current = check.id === 'node' ? 'v20.10.0'
      : check.id === 'database' ? 'PostgreSQL 16.2'
        : check.id === 'redis' ? 'v7.2.3'
          : check.id === 'disk' ? '24.5GB 可用'
            : '8GB'
    check.status = 'passed'
  }
}

onMounted(() => {
  runEnvironmentChecks()
})
</script>