<template>
  <div class="min-h-screen bg-gradient-to-br from-background to-muted flex flex-col items-center p-4">
    <!-- 顶部 Logo 和标题 -->
    <div class="text-center my-8">
      <div class="w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
        <UIcon name="lucide:sparkles" class="w-8 h-8 text-primary-foreground" />
      </div>
      <h1 class="text-2xl font-bold">BuildingAI 安装向导</h1>
      <p class="text-sm text-muted-foreground mt-2">跟随引导完成系统初始化配置</p>
    </div>

    <!-- 安装卡片 -->
    <div class="w-full max-w-2xl">
      <UCard>
        <!-- 步骤进度条 -->
        <div class="mb-8">
          <div class="flex items-center justify-between">
            <template v-for="(step, index) in steps" :key="step.id">
              <!-- 步骤节点 -->
              <div class="flex flex-col items-center flex-1">
                <div
                  class="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all"
                  :class="getStepNodeClass(index)"
                >
                  <UIcon
                    v-if="index < currentStep"
                    name="lucide:check"
                    class="w-5 h-5"
                  />
                  <UIcon
                    v-else
                    :name="step.icon"
                    class="w-5 h-5"
                  />
                </div>
                <div class="mt-2 text-center">
                  <p
                    class="text-xs font-medium transition-colors"
                    :class="index <= currentStep ? 'text-foreground' : 'text-muted-foreground'"
                  >
                    {{ step.title }}
                  </p>
                </div>
              </div>
              <!-- 连接线 -->
              <div
                v-if="index < steps.length - 1"
                class="h-0.5 flex-1 mx-2 mb-5 rounded transition-colors"
                :class="index < currentStep ? 'bg-primary' : 'bg-border'"
              />
            </template>
          </div>
        </div>

        <!-- 步骤1：环境检查 -->
        <div v-show="currentStep === 0">
          <div class="mb-4">
            <h2 class="text-lg font-semibold">环境检查</h2>
            <p class="text-sm text-muted-foreground mt-1">检测服务器运行环境是否满足要求</p>
          </div>
          <div class="space-y-3">
            <div
              v-for="check in environmentChecks"
              :key="check.id"
              class="flex items-center justify-between p-3 rounded-lg border border-border"
            >
              <div class="flex items-center gap-3">
                <div
                  class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  :class="check.iconBg"
                >
                  <UIcon :name="check.icon" class="w-5 h-5" :class="check.iconColor" />
                </div>
                <div>
                  <p class="text-sm font-medium">{{ check.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    需要 {{ check.required }}，当前 {{ check.current || '检测中...' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span
                  v-if="check.status === 'checking'"
                  class="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1"
                >
                  <UIcon name="lucide:loader-2" class="w-3.5 h-3.5 animate-spin" />
                  检测中
                </span>
                <span
                  v-else-if="check.status === 'passed'"
                  class="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"
                >
                  <UIcon name="lucide:check-circle-2" class="w-3.5 h-3.5" />
                  通过
                </span>
                <span
                  v-else
                  class="text-xs text-red-600 dark:text-red-400 flex items-center gap-1"
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

        <!-- 步骤2：数据库配置 -->
        <div v-show="currentStep === 1">
          <div class="mb-4">
            <h2 class="text-lg font-semibold">数据库配置</h2>
            <p class="text-sm text-muted-foreground mt-1">配置系统使用的数据库连接信息</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5">数据库类型</label>
              <USelect v-model="dbConfig.type" :options="dbTypeOptions" class="w-full" />
            </div>
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium mb-1.5">主机地址</label>
                <UInput v-model="dbConfig.host" placeholder="127.0.0.1" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">端口</label>
                <UInput v-model.number="dbConfig.port" type="number" placeholder="5432" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">数据库名</label>
              <UInput v-model="dbConfig.database" placeholder="buildingai" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">用户名</label>
              <UInput v-model="dbConfig.username" placeholder="postgres" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">密码</label>
              <UInput v-model="dbConfig.password" type="password" placeholder="输入数据库密码" />
            </div>
            <div class="flex items-center justify-between pt-2">
              <p class="text-xs text-muted-foreground">配置完成后请先测试连接</p>
              <UButton
                variant="outline"
                :loading="testingConnection"
                @click="testConnection"
              >
                <template #icon>
                  <UIcon name="lucide:plug" class="w-4 h-4" />
                </template>
                测试连接
              </UButton>
            </div>
          </div>
        </div>

        <!-- 步骤3：管理员账户 -->
        <div v-show="currentStep === 2">
          <div class="mb-4">
            <h2 class="text-lg font-semibold">管理员账户</h2>
            <p class="text-sm text-muted-foreground mt-1">创建系统的超级管理员账户</p>
          </div>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1.5">用户名</label>
              <UInput v-model="adminConfig.username" placeholder="admin" />
              <p class="text-xs text-muted-foreground mt-1">3-20 个字符，仅支持字母、数字和下划线</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">邮箱</label>
              <UInput v-model="adminConfig.email" type="email" placeholder="admin@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">密码</label>
              <UInput v-model="adminConfig.password" type="password" placeholder="至少 8 位字符" />
              <p class="text-xs text-muted-foreground mt-1">建议包含大小写字母、数字和特殊字符</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">确认密码</label>
              <UInput v-model="adminConfig.confirmPassword" type="password" placeholder="再次输入密码" />
            </div>
            <label class="flex items-start gap-2 cursor-pointer pt-2">
              <UCheckbox v-model="adminConfig.agreeTerms" />
              <span class="text-xs text-muted-foreground leading-relaxed">
                我已阅读并同意 <NuxtLink to="/license" class="text-primary hover:underline">服务协议</NuxtLink> 和 <NuxtLink to="/privacy" class="text-primary hover:underline">隐私政策</NuxtLink>
              </span>
            </label>
          </div>
        </div>

        <!-- 步骤4：完成安装 -->
        <div v-show="currentStep === 3">
          <div class="mb-4">
            <h2 class="text-lg font-semibold">完成安装</h2>
            <p class="text-sm text-muted-foreground mt-1">系统正在初始化，请稍候</p>
          </div>

          <!-- 安装进度 -->
          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">安装进度</span>
                <span class="text-sm text-muted-foreground">{{ installProgress }}%</span>
              </div>
              <div class="w-full h-2 rounded-full bg-muted overflow-hidden">
                <div
                  class="h-full bg-primary transition-all duration-300"
                  :style="{ width: installProgress + '%' }"
                />
              </div>
            </div>

            <!-- 安装任务列表 -->
            <div class="space-y-2">
              <div
                v-for="task in installTasks"
                :key="task.id"
                class="flex items-center gap-3 text-sm"
              >
                <UIcon
                  v-if="task.status === 'done'"
                  name="lucide:check-circle-2"
                  class="w-4 h-4 text-green-500 flex-shrink-0"
                />
                <UIcon
                  v-else-if="task.status === 'running'"
                  name="lucide:loader-2"
                  class="w-4 h-4 text-primary flex-shrink-0 animate-spin"
                />
                <UIcon
                  v-else
                  name="lucide:circle"
                  class="w-4 h-4 text-muted-foreground flex-shrink-0"
                />
                <span :class="task.status === 'done' ? 'text-foreground' : 'text-muted-foreground'">
                  {{ task.name }}
                </span>
              </div>
            </div>

            <!-- 完成提示 -->
            <UAlert
              v-if="installProgress === 100"
              color="success"
              variant="subtle"
              title="安装完成！"
              description="系统已成功初始化，即将跳转到登录页面。"
              icon="lucide:party-popper"
            />

            <!-- 安装信息摘要 -->
            <div v-if="installProgress === 100" class="grid grid-cols-2 gap-3 pt-2">
              <div class="p-3 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">数据库</p>
                <p class="text-sm font-medium mt-0.5">{{ dbConfig.type }} · {{ dbConfig.host }}</p>
              </div>
              <div class="p-3 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">管理员</p>
                <p class="text-sm font-medium mt-0.5">{{ adminConfig.username || 'admin' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部导航 -->
        <div class="flex items-center justify-between pt-6 mt-6 border-t border-border">
          <UButton
            variant="outline"
            :disabled="currentStep === 0"
            @click="prevStep"
          >
            <template #icon>
              <UIcon name="lucide:arrow-left" class="w-4 h-4" />
            </template>
            上一步
          </UButton>

          <span class="text-xs text-muted-foreground">步骤 {{ currentStep + 1 }} / {{ steps.length }}</span>

          <UButton
            v-if="currentStep < steps.length - 1"
            :disabled="!canNext"
            @click="nextStep"
          >
            下一步
            <template #trailing>
              <UIcon name="lucide:arrow-right" class="w-4 h-4" />
            </template>
          </UButton>
          <UButton
            v-else
            :disabled="installProgress < 100"
            @click="finishInstall"
          >
            <template #icon>
              <UIcon name="lucide:check" class="w-4 h-4" />
            </template>
            完成安装
          </UButton>
        </div>
      </UCard>

      <!-- 底部信息 -->
      <p class="text-center text-xs text-muted-foreground mt-6">
        BuildingAI © 2024 · 遇到问题请查阅
        <NuxtLink to="/help" class="text-primary hover:underline">帮助文档</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: false,
})

/**
 * 环境检查状态类型
 */
type CheckStatus = 'checking' | 'passed' | 'failed'

/**
 * 安装任务状态类型
 */
type TaskStatus = 'pending' | 'running' | 'done'

/**
 * 步骤接口定义
 */
interface Step {
  id: string
  title: string
  icon: string
}

/**
 * 环境检查项接口定义
 */
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

/**
 * 安装任务接口定义
 */
interface InstallTask {
  id: string
  name: string
  status: TaskStatus
}

/**
 * 安装步骤定义
 */
const steps: Step[] = [
  { id: 'environment', title: '环境检查', icon: 'lucide:server' },
  { id: 'database', title: '数据库配置', icon: 'lucide:database' },
  { id: 'admin', title: '管理员账户', icon: 'lucide:user-cog' },
  { id: 'complete', title: '完成安装', icon: 'lucide:check-circle' },
]

/**
 * 当前步骤索引
 */
const currentStep = ref(0)

/**
 * 数据库类型选项
 */
const dbTypeOptions = [
  { label: 'PostgreSQL', value: 'postgresql' },
  { label: 'MySQL', value: 'mysql' },
  { label: 'SQLite', value: 'sqlite' },
]

/**
 * 数据库配置
 */
const dbConfig = ref({
  type: 'postgresql',
  host: '127.0.0.1',
  port: 5432,
  database: 'buildingai',
  username: 'postgres',
  password: '',
})

/**
 * 管理员配置
 */
const adminConfig = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

/**
 * 是否正在测试数据库连接
 */
const testingConnection = ref(false)

/**
 * 安装进度（0-100）
 */
const installProgress = ref(0)

/**
 * 环境检查项
 */
const environmentChecks = ref<EnvironmentCheck[]>([
  {
    id: 'node',
    name: 'Node.js 版本',
    required: 'v18.0.0+',
    current: undefined,
    status: 'checking',
    icon: 'lucide:hexagon',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    id: 'database',
    name: '数据库版本',
    required: 'PostgreSQL 14+',
    current: undefined,
    status: 'checking',
    icon: 'lucide:database',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    id: 'redis',
    name: 'Redis 版本',
    required: 'v6.0+',
    current: undefined,
    status: 'checking',
    icon: 'lucide:layers',
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  {
    id: 'disk',
    name: '磁盘空间',
    required: '至少 5GB 可用',
    current: undefined,
    status: 'checking',
    icon: 'lucide:hard-drive',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 'memory',
    name: '内存容量',
    required: '至少 2GB',
    current: undefined,
    status: 'checking',
    icon: 'lucide:cpu',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
])

/**
 * 安装任务列表
 */
const installTasks = ref<InstallTask[]>([
  { id: 'init-db', name: '初始化数据库表结构', status: 'pending' },
  { id: 'init-data', name: '写入默认配置和初始数据', status: 'pending' },
  { id: 'init-admin', name: '创建管理员账户', status: 'pending' },
  { id: 'init-cache', name: '初始化 Redis 缓存', status: 'pending' },
  { id: 'init-storage', name: '创建存储目录', status: 'pending' },
])

/**
 * 是否存在未通过的环境检查
 */
const hasFailedCheck = computed(() =>
  environmentChecks.value.some(c => c.status === 'failed'),
)

/**
 * 是否可以进入下一步
 */
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

/**
 * 获取步骤节点样式
 * @param index - 步骤索引
 * @returns CSS 类名
 */
function getStepNodeClass(index: number): string {
  if (index < currentStep.value) {
    return 'bg-primary border-primary text-primary-foreground'
  }
  if (index === currentStep.value) {
    return 'border-primary text-primary bg-primary/10'
  }
  return 'border-border text-muted-foreground bg-background'
}

/**
 * 上一步
 */
function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

/**
 * 下一步
 */
function nextStep() {
  if (!canNext.value) return
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    // 进入最后一步时启动安装流程
    if (currentStep.value === steps.length - 1) {
      startInstall()
    }
  }
}

/**
 * 测试数据库连接
 */
async function testConnection() {
  testingConnection.value = true
  // 模拟测试连接过程
  await new Promise(resolve => setTimeout(resolve, 1500))
  testingConnection.value = false
}

/**
 * 启动安装流程
 */
async function startInstall() {
  for (let i = 0; i < installTasks.value.length; i++) {
    const task = installTasks.value[i]
    if (!task) continue
    task.status = 'running'
    // 模拟任务执行
    await new Promise(resolve => setTimeout(resolve, 800))
    task.status = 'done'
    installProgress.value = Math.round(((i + 1) / installTasks.value.length) * 100)
  }
}

/**
 * 完成安装，跳转登录
 */
function finishInstall() {
  if (installProgress.value < 100) return
  navigateTo('/login')
}

/**
 * 模拟环境检测过程
 */
async function runEnvironmentChecks() {
  for (const check of environmentChecks.value) {
    // 模拟检测耗时
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
