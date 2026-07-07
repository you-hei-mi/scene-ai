<template>
  <div style="background: var(--bg-deep); min-height: 100vh; display: flex; flex-direction: column; align-items: center; padding: 1rem;">
    <!-- 顶部 Logo 和标题 -->
    <div style="text-align: center; margin-top: 2rem; margin-bottom: 2rem;">
      <div style="width: 4rem; height: 4rem; margin: 0 auto; border-radius: 1rem; background: var(--accent-soft-bg); display: flex; align-items: center; justify-content: center; margin-bottom: 1rem; box-shadow: var(--shadow-glass);">
        <UIcon name="lucide:sparkles" style="width: 2rem; height: 2rem; color: var(--accent-soft-text);" />
      </div>
      <h1 class="font-display text-gradient" style="font-size: 1.5rem; font-weight: 700;">BuildingAI 安装向导</h1>
      <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.5rem;">跟随引导完成系统初始化配置</p>
    </div>

    <!-- 安装卡片 -->
    <div style="width: 100%; max-width: 42rem;">
      <div class="glass-card" style="padding: 1.5rem;">
        <!-- 步骤进度条 -->
        <div style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between;">
            <template v-for="(step, index) in steps" :key="step.id">
              <!-- 步骤节点 -->
              <div style="display: flex; flex-direction: column; align-items: center; flex: 1;">
                <div
                  style="width: 2.5rem; height: 2.5rem; border-radius: 50%; display: flex; align-items: center; justify-content: center; border-width: 2px; border-style: solid;"
                  :style="{
                    backgroundColor: index < currentStep ? 'var(--accent-soft-bg)' : index === currentStep ? 'var(--accent-soft-bg-subtle)' : 'transparent',
                    borderColor: index <= currentStep ? 'var(--accent-soft-text)' : 'var(--glass-border)',
                    color: index <= currentStep ? 'var(--accent-soft-text)' : 'var(--text-muted)',
                  }"
                >
                  <UIcon
                    v-if="index < currentStep"
                    name="lucide:check"
                    style="width: 1.25rem; height: 1.25rem;"
                  />
                  <UIcon
                    v-else
                    :name="step.icon"
                    style="width: 1.25rem; height: 1.25rem;"
                  />
                </div>
                <div style="margin-top: 0.5rem; text-align: center;">
                  <p
                    style="font-size: 0.75rem; font-weight: 500;"
                    :style="{ color: index <= currentStep ? 'var(--text-primary)' : 'var(--text-muted)' }"
                  >
                    {{ step.title }}
                  </p>
                </div>
              </div>
              <!-- 连接线 -->
              <div
                v-if="index < steps.length - 1"
                style="height: 2px; flex: 1; margin: 0 0.5rem; margin-bottom: 1.25rem; border-radius: 2px;"
                :style="{ backgroundColor: index < currentStep ? 'var(--accent-soft-text)' : 'var(--glass-border)' }"
              />
            </template>
          </div>
        </div>

        <!-- 步骤1：环境检查 -->
        <div v-show="currentStep === 0">
          <div style="margin-bottom: 1rem;">
            <h2 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">环境检查</h2>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">检测服务器运行环境是否满足要求</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.75rem;">
            <div
              v-for="check in environmentChecks"
              :key="check.id"
              style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid var(--glass-border);"
            >
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <div
                  style="width: 2.25rem; height: 2.25rem; border-radius: 0.5rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0;"
                  :style="{
                    backgroundColor: check.id === 'node' ? 'rgba(34, 197, 94, 0.12)' : check.id === 'database' ? 'rgba(59, 130, 246, 0.12)' : check.id === 'redis' ? 'rgba(239, 68, 68, 0.12)' : check.id === 'disk' ? 'rgba(249, 115, 22, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                  }"
                >
                  <UIcon :name="check.icon" style="width: 1.25rem; height: 1.25rem;" :style="{
                    color: check.id === 'node' ? '#22c55e' : check.id === 'database' ? '#3b82f6' : check.id === 'redis' ? '#ef4444' : check.id === 'disk' ? '#f97316' : '#a855f7',
                  }" />
                </div>
                <div>
                  <p style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary);">{{ check.name }}</p>
                  <p style="font-size: 0.75rem; color: var(--text-secondary);">
                    需要 {{ check.required }}，当前 {{ check.current || '检测中...' }}
                  </p>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span
                  v-if="check.status === 'checking'"
                  style="font-size: 0.75rem; color: #eab308; display: flex; align-items: center; gap: 0.25rem;"
                >
                  <UIcon name="lucide:loader-2" style="width: 0.875rem; height: 0.875rem; animation: spin 1s linear infinite;" />
                  检测中
                </span>
                <span
                  v-else-if="check.status === 'passed'"
                  style="font-size: 0.75rem; color: #22c55e; display: flex; align-items: center; gap: 0.25rem;"
                >
                  <UIcon name="lucide:check-circle-2" style="width: 0.875rem; height: 0.875rem;" />
                  通过
                </span>
                <span
                  v-else
                  style="font-size: 0.75rem; color: #ef4444; display: flex; align-items: center; gap: 0.25rem;"
                >
                  <UIcon name="lucide:x-circle" style="width: 0.875rem; height: 0.875rem;" />
                  未通过
                </span>
              </div>
            </div>
          </div>
          <UAlert
            v-if="hasFailedCheck"
            style="margin-top: 1rem;"
            color="error"
            variant="subtle"
            title="环境检测未通过"
            description="请修复上述未通过的检测项后重试，或联系系统管理员。"
            icon="lucide:alert-triangle"
          />
        </div>

        <!-- 步骤2：数据库配置 -->
        <div v-show="currentStep === 1">
          <div style="margin-bottom: 1rem;">
            <h2 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">数据库配置</h2>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">配置系统使用的数据库连接信息</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">数据库类型</label>
              <USelect v-model="dbConfig.type" :options="dbTypeOptions" style="width: 100%;" />
            </div>
            <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 1rem;">
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">主机地址</label>
                <input v-model="dbConfig.host" placeholder="127.0.0.1" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">端口</label>
                <input v-model.number="dbConfig.port" type="number" placeholder="5432" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
              </div>
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">数据库名</label>
              <input v-model="dbConfig.database" placeholder="buildingai" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">用户名</label>
              <input v-model="dbConfig.username" placeholder="postgres" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">密码</label>
              <input v-model="dbConfig.password" type="password" placeholder="输入数据库密码" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
            </div>
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.5rem;">
              <p style="font-size: 0.75rem; color: var(--text-secondary);">配置完成后请先测试连接</p>
              <button
                class="btn-glass"
                :loading="testingConnection"
                @click="testConnection"
              >
                <UIcon name="lucide:plug" style="width: 1rem; height: 1rem;" />
                测试连接
              </button>
            </div>
          </div>
        </div>

        <!-- 步骤3：管理员账户 -->
        <div v-show="currentStep === 2">
          <div style="margin-bottom: 1rem;">
            <h2 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">管理员账户</h2>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">创建系统的超级管理员账户</p>
          </div>
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">用户名</label>
              <input v-model="adminConfig.username" placeholder="admin" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">3-20 个字符，仅支持字母、数字和下划线</p>
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">邮箱</label>
              <input v-model="adminConfig.email" type="email" placeholder="admin@example.com" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">密码</label>
              <input v-model="adminConfig.password" type="password" placeholder="至少 8 位字符" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
              <p style="font-size: 0.75rem; color: var(--text-secondary); margin-top: 0.25rem;">建议包含大小写字母、数字和特殊字符</p>
            </div>
            <div>
              <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">确认密码</label>
              <input v-model="adminConfig.confirmPassword" type="password" placeholder="再次输入密码" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
            </div>
            <label style="display: flex; align-items: flex-start; gap: 0.5rem; cursor: pointer; padding-top: 0.5rem;">
              <UCheckbox v-model="adminConfig.agreeTerms" />
              <span style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.375;">
                我已阅读并同意 <NuxtLink to="/license" style="color: var(--accent-soft-text); text-decoration: underline;">服务协议</NuxtLink> 和 <NuxtLink to="/privacy" style="color: var(--accent-soft-text); text-decoration: underline;">隐私政策</NuxtLink>
              </span>
            </label>
          </div>
        </div>

        <!-- 步骤4：完成安装 -->
        <div v-show="currentStep === 3">
          <div style="margin-bottom: 1rem;">
            <h2 style="font-size: 1.125rem; font-weight: 600; color: var(--text-primary);">完成安装</h2>
            <p style="font-size: 0.875rem; color: var(--text-secondary); margin-top: 0.25rem;">系统正在初始化，请稍候</p>
          </div>

          <!-- 安装进度 -->
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            <div>
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                <span style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary);">安装进度</span>
                <span style="font-size: 0.875rem; color: var(--text-secondary);">{{ installProgress }}%</span>
              </div>
              <div style="width: 100%; height: 0.5rem; border-radius: 9999px; background: var(--glass-bg-1); overflow: hidden;">
                <div
                  style="height: 100%; background: var(--accent-soft-text); transition: width 300ms;"
                  :style="{ width: installProgress + '%' }"
                />
              </div>
            </div>

            <!-- 安装任务列表 -->
            <div style="display: flex; flex-direction: column; gap: 0.5rem;">
              <div
                v-for="task in installTasks"
                :key="task.id"
                style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.875rem;"
              >
                <UIcon
                  v-if="task.status === 'done'"
                  name="lucide:check-circle-2"
                  style="width: 1rem; height: 1rem; color: #22c55e; flex-shrink: 0;"
                />
                <UIcon
                  v-else-if="task.status === 'running'"
                  name="lucide:loader-2"
                  style="width: 1rem; height: 1rem; color: var(--accent-soft-text); flex-shrink: 0; animation: spin 1s linear infinite;"
                />
                <UIcon
                  v-else
                  name="lucide:circle"
                  style="width: 1rem; height: 1rem; color: var(--text-muted); flex-shrink: 0;"
                />
                <span :style="{ color: task.status === 'done' ? 'var(--text-primary)' : 'var(--text-secondary)' }">
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
            <div v-if="installProgress === 100" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; padding-top: 0.5rem;">
              <div style="padding: 0.75rem; border-radius: 0.5rem; background: var(--glass-bg-1);">
                <p style="font-size: 0.75rem; color: var(--text-secondary);">数据库</p>
                <p style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary); margin-top: 0.125rem;">{{ dbConfig.type }} · {{ dbConfig.host }}</p>
              </div>
              <div style="padding: 0.75rem; border-radius: 0.5rem; background: var(--glass-bg-1);">
                <p style="font-size: 0.75rem; color: var(--text-secondary);">管理员</p>
                <p style="font-size: 0.875rem; font-weight: 500; color: var(--text-primary); margin-top: 0.125rem;">{{ adminConfig.username || 'admin' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 底部导航 -->
        <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 1.5rem; margin-top: 1.5rem; border-top: 1px solid var(--glass-border);">
          <button
            class="btn-glass"
            :disabled="currentStep === 0"
            @click="prevStep"
          >
            <UIcon name="lucide:arrow-left" style="width: 1rem; height: 1rem;" />
            上一步
          </button>

          <span style="font-size: 0.75rem; color: var(--text-secondary);">步骤 {{ currentStep + 1 }} / {{ steps.length }}</span>

          <button
            v-if="currentStep < steps.length - 1"
            class="btn-glass btn-glass--primary"
            :disabled="!canNext"
            @click="nextStep"
          >
            下一步
            <UIcon name="lucide:arrow-right" style="width: 1rem; height: 1rem;" />
          </button>
          <button
            v-else
            class="btn-glass btn-glass--primary"
            :disabled="installProgress < 100"
            @click="finishInstall"
          >
            <UIcon name="lucide:check" style="width: 1rem; height: 1rem;" />
            完成安装
          </button>
        </div>
      </div>

      <!-- 底部信息 -->
      <p style="text-align: center; font-size: 0.75rem; color: var(--text-secondary); margin-top: 1.5rem;">
        BuildingAI © 2024 · 遇到问题请查阅
        <NuxtLink to="/help" style="color: var(--accent-soft-text); text-decoration: underline;">帮助文档</NuxtLink>
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
function getStepNodeClass(index: number): Record<string, string> {
  if (index < currentStep.value) {
    return { background: 'var(--accent-soft)', borderColor: 'var(--accent-soft)', color: 'white' }
  }
  if (index === currentStep.value) {
    return { borderColor: 'var(--accent-soft)', color: 'var(--accent-soft-text)', background: 'var(--accent-soft-bg)' }
  }
  return { borderColor: 'var(--glass-border)', color: 'var(--text-secondary)', background: 'var(--bg-deep)' }
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
