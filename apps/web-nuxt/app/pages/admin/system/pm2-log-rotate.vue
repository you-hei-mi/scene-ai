<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">日志轮转</p>
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
      <button class="btn-glass mt-3 text-sm" @click="fetchData">重试</button>
    </div>

    <div v-else class="space-y-6">
      <!-- 日志轮转配置 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">日志轮转配置</h2>
          <p class="text-sm mt-1 text-slate-500">配置日志文件的自动轮转策略</p>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">日志保留天数</label>
              <UInput v-model.number="config.retentionDays" type="number" placeholder="30" />
              <p class="text-xs mt-1 text-slate-500">超过此天数的日志将被自动清理</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">最大日志文件大小 (MB)</label>
              <UInput v-model.number="config.maxFileSize" type="number" placeholder="100" />
              <p class="text-xs mt-1 text-slate-500">单个日志文件达到此大小后触发轮转</p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">日志轮转间隔</label>
            <USelect v-model="config.rotateInterval" :options="rotateIntervalOptions" class="w-64" />
            <p class="text-xs mt-1 text-slate-500">日志文件轮转的频率</p>
          </div>

          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">压缩旧日志</h3>
              <p class="text-xs mt-0.5 text-slate-500">自动压缩已轮转的旧日志文件以节省空间</p>
            </div>
            <UCheckbox :modelValue="config.compressOld" @change="config.compressOld = !config.compressOld" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">日志级别</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              <label v-for="level in logLevelOptions" :key="level.value" class="flex items-center gap-2 cursor-pointer">
                <UCheckbox :modelValue="config.logLevels.includes(level.value)" @change="toggleLogLevel(level.value)" />
                <span class="text-sm" :class="getLevelColor(level.value)">{{ level.label }}</span>
              </label>
            </div>
            <p class="text-xs mt-2 text-slate-500">选择需要记录的日志级别，选中后该级别及更高级别的日志都会被记录</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">日志存储路径</label>
            <div class="flex items-center gap-2">
              <UIcon name="lucide:folder" class="w-4 h-4 text-slate-400" />
              <code class="text-sm bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 font-mono">{{ config.logPath }}</code>
            </div>
            <p class="text-xs mt-1 text-slate-500">当前系统的日志存储路径，不可修改</p>
          </div>
        </div>
      </div>

      <!-- 立即执行轮转 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">操作</h2>
          <p class="text-sm mt-1 text-slate-500">手动触发日志轮转</p>
        </div>
        <div class="flex items-center gap-4">
          <button class="btn-glass btn-glass--primary" @click="executeRotate" :disabled="isRotating">
            <UIcon name="lucide:rotate-cw" class="w-4 h-4" :class="{ 'animate-spin': isRotating }" />
            {{ isRotating ? '正在执行...' : '立即执行轮转' }}
          </button>
          <p v-if="lastRotateTime" class="text-sm text-slate-500">
            上次轮转时间: {{ lastRotateTime }}
          </p>
        </div>
      </div>

      <!-- 轮转历史 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div class="p-6 border-b border-slate-200 dark:border-slate-700">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">轮转历史</h2>
          <p class="text-sm mt-1 text-slate-500">最近 10 次日志轮转记录</p>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50">
                <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">时间</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">触发方式</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">处理文件数</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">释放空间</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">状态</th>
                <th class="text-left px-6 py-4 text-sm font-medium text-slate-500">耗时</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="record in rotateHistory"
                :key="record.id"
                class="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm text-slate-900 dark:text-white">{{ record.time }}</td>
                <td class="px-6 py-4">
                  <UBadge :variant="record.trigger === 'manual' ? 'secondary' : 'outline'" size="sm">
                    {{ record.trigger === 'manual' ? '手动触发' : '自动触发' }}
                  </UBadge>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ record.fileCount }}</td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ record.freedSpace }}</td>
                <td class="px-6 py-4">
                  <span
                    class="inline-flex items-center gap-1.5 text-sm"
                    :class="record.status === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                  >
                    <span
                      class="w-2 h-2 rounded-full"
                      :class="record.status === 'success' ? 'bg-green-500' : 'bg-red-500'"
                    ></span>
                    {{ record.status === 'success' ? '成功' : '失败' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-slate-500">{{ record.duration }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="rotateHistory.length === 0" class="text-center py-12">
          <UIcon name="lucide:rotate-cw" class="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p class="text-slate-500">暂无轮转记录</p>
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
import { ref, reactive, onMounted } from 'vue'
import { getLogRotateConfig, updateLogRotateConfig, runLogRotate, getLogRotateRecords } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface LogRotateConfig {
  retentionDays: number
  maxFileSize: number
  rotateInterval: string
  compressOld: boolean
  logLevels: string[]
  logPath: string
}

interface RotateRecord {
  id: string
  time: string
  trigger: 'manual' | 'auto'
  fileCount: number
  freedSpace: string
  status: 'success' | 'failed'
  duration: string
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)
const isRotating = ref(false)
const lastRotateTime = ref('')

const rotateIntervalOptions = [
  { label: '每天', value: 'daily' },
  { label: '每小时', value: 'hourly' },
  { label: '每分钟', value: 'minutely' },
]

const logLevelOptions = [
  { label: 'Error', value: 'error' },
  { label: 'Warn', value: 'warn' },
  { label: 'Info', value: 'info' },
  { label: 'Debug', value: 'debug' },
]

const defaultConfig: LogRotateConfig = {
  retentionDays: 30,
  maxFileSize: 100,
  rotateInterval: 'daily',
  compressOld: true,
  logLevels: ['error', 'warn', 'info'],
  logPath: '/var/log/buildingai',
}

const config = reactive<LogRotateConfig>(JSON.parse(JSON.stringify(defaultConfig)))

const rotateHistory = ref<RotateRecord[]>([])

function getLevelColor(level: string): string {
  const map: Record<string, string> = {
    error: 'text-red-600 dark:text-red-400',
    warn: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
    debug: 'text-slate-500 dark:text-slate-400',
  }
  return map[level] || ''
}

function toggleLogLevel(value: string) {
  const idx = config.logLevels.indexOf(value)
  if (idx > -1) {
    config.logLevels.splice(idx, 1)
  } else {
    config.logLevels.push(value)
  }
}

async function fetchData() {
  loading.value = true
  error.value = null
  try {
    const data = await getLogRotateConfig()
    if (data) {
      config.retentionDays = data.keepDays ?? defaultConfig.retentionDays
      config.maxFileSize = parseInt(data.maxFileSize as string) || defaultConfig.maxFileSize
      config.rotateInterval = data.rotateInterval ?? defaultConfig.rotateInterval
      config.compressOld = data.compressOldLogs ?? defaultConfig.compressOld
      config.logLevels = data.logLevels ?? defaultConfig.logLevels
      config.logPath = (data as any).storagePath ?? data.logPath ?? defaultConfig.logPath
    }
    // Fetch records
    const records = await getLogRotateRecords()
    rotateHistory.value = records.map((r: any) => ({
      id: r.id,
      time: r.time ?? '',
      trigger: 'auto',
      fileCount: r.logCount ?? 0,
      freedSpace: r.freedSpace ?? '',
      status: r.status ?? 'success',
      duration: r.duration ?? '',
    }))
    if (rotateHistory.value.length > 0) {
      lastRotateTime.value = rotateHistory.value[0].time
    }
  } catch (e: any) {
    error.value = e.message || '加载日志轮转配置失败'
  } finally {
    loading.value = false
  }
}

async function executeRotate() {
  if (isRotating.value) return
  isRotating.value = true
  try {
    await runLogRotate()
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
    const newRecord: RotateRecord = {
      id: Date.now().toString(),
      time: timeStr,
      trigger: 'manual',
      fileCount: 0,
      freedSpace: '0 MB',
      status: 'success',
      duration: '0s',
    }
    rotateHistory.value.unshift(newRecord)
    lastRotateTime.value = timeStr
    // Refresh records
    const records = await getLogRotateRecords()
    rotateHistory.value = records.map((r: any) => ({
      id: r.id,
      time: r.time ?? '',
      trigger: 'auto',
      fileCount: r.logCount ?? 0,
      freedSpace: r.freedSpace ?? '',
      status: r.status ?? 'success',
      duration: r.duration ?? '',
    }))
  } catch (e: any) {
    error.value = e.message || '日志轮转执行失败'
  } finally {
    isRotating.value = false
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
    await updateLogRotateConfig({
      keepDays: config.retentionDays,
      maxFileSize: String(config.maxFileSize),
      rotateInterval: config.rotateInterval,
      compressOldLogs: config.compressOld,
      logLevels: config.logLevels,
    } as any)
  } catch (e: any) {
    error.value = e.message || '保存日志轮转配置失败'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>