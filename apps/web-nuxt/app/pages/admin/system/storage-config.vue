<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">存储配置</p>
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
      <!-- 存储类型 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">存储类型</h2>
          <p class="text-sm mt-1 text-slate-500">选择文件存储服务提供商</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">存储类型</label>
            <USelect v-model="config.storageType" :options="storageTypeOptions" class="w-64" />
          </div>

          <template v-if="config.storageType === 'local'">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">本地存储路径</label>
              <UInput v-model="config.localStoragePath" placeholder="/data/uploads" />
            </div>
          </template>

          <template v-else>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Bucket 名称</label>
                <UInput v-model="config.bucket" placeholder="my-bucket" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Region 区域</label>
                <UInput v-model="config.region" placeholder="cn-beijing" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Access Key</label>
                <UInput v-model="config.accessKey" placeholder="输入 Access Key" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Secret Key</label>
                <UInput v-model="config.secretKey" type="password" placeholder="输入 Secret Key" />
              </div>
            </div>
            <div v-if="config.storageType === 'aliyun'">
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Endpoint</label>
              <UInput v-model="config.endpoint" placeholder="oss-cn-beijing.aliyuncs.com" />
            </div>
            <div v-if="config.storageType === 'tencent'">
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">AppId</label>
              <UInput v-model="config.appId" placeholder="输入腾讯云 AppId" />
            </div>
          </template>
        </div>
      </div>

      <!-- 上传限制 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">上传限制</h2>
          <p class="text-sm mt-1 text-slate-500">文件上传大小和类型限制</p>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">最大文件大小 (MB)</label>
            <UInput v-model.number="config.maxFileSize" type="number" placeholder="100" class="w-64" />
            <p class="text-xs mt-1 text-slate-500">单个文件上传的最大大小限制</p>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">允许的文件类型</label>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              <label v-for="ft in fileTypeOptions" :key="ft.value" class="flex items-center gap-2 cursor-pointer">
                <UCheckbox :modelValue="config.allowedFileTypes.includes(ft.value)" @change="toggleFileType(ft.value)" />
                <span class="text-sm text-slate-700 dark:text-slate-300">{{ ft.label }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件管理 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">文件管理</h2>
          <p class="text-sm mt-1 text-slate-500">存储使用情况概览</p>
        </div>
        <div class="space-y-4">
          <div>
            <div class="flex items-center justify-between mb-2">
              <span class="text-sm text-slate-700 dark:text-slate-300">总存储使用量</span>
              <span class="text-sm font-medium text-slate-900 dark:text-white">{{ storageStats.usedGB }} GB / {{ storageStats.totalGB }} GB</span>
            </div>
            <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
              <div
                class="bg-gradient-to-r from-primary to-accent h-3 rounded-full transition-all duration-500"
                :style="{ width: storageStats.percentage + '%' }"
              ></div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p class="text-xs text-slate-500">总文件数</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ storageStats.fileCount.toLocaleString() }}</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p class="text-xs text-slate-500">已使用空间</p>
              <p class="text-xl font-bold text-slate-900 dark:text-white mt-1">{{ storageStats.usedGB }} GB</p>
            </div>
            <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
              <p class="text-xs text-slate-500">剩余空间</p>
              <p class="text-xl font-bold text-green-600 dark:text-green-400 mt-1">{{ storageStats.remainingGB }} GB</p>
            </div>
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
import { reactive, ref, computed, onMounted } from 'vue'
import { getStorageConfig, updateStorageConfig } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface StorageConfig {
  storageType: string
  localStoragePath: string
  bucket: string
  region: string
  accessKey: string
  secretKey: string
  endpoint: string
  appId: string
  maxFileSize: number
  allowedFileTypes: string[]
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)

const storageTypeOptions = [
  { label: '本地存储', value: 'local' },
  { label: '阿里云 OSS', value: 'aliyun' },
  { label: '腾讯云 COS', value: 'tencent' },
  { label: 'AWS S3', value: 'aws' },
]

const fileTypeOptions = [
  { label: '图片 (.jpg, .png, .gif)', value: 'images' },
  { label: '文档 (.pdf, .doc, .docx)', value: 'documents' },
  { label: '表格 (.xls, .xlsx, .csv)', value: 'spreadsheets' },
  { label: '文本 (.txt, .md)', value: 'text' },
  { label: '压缩包 (.zip, .rar)', value: 'archives' },
  { label: '音视频 (.mp3, .mp4)', value: 'media' },
  { label: '代码 (.js, .ts, .py)', value: 'code' },
  { label: 'JSON / XML', value: 'data' },
]

const defaultConfig: StorageConfig = {
  storageType: 'local',
  localStoragePath: '/data/uploads',
  bucket: 'my-bucket',
  region: 'cn-beijing',
  accessKey: '',
  secretKey: '',
  endpoint: '',
  appId: '',
  maxFileSize: 100,
  allowedFileTypes: ['images', 'documents', 'spreadsheets', 'text', 'archives', 'media', 'code', 'data'],
}

const config = reactive<StorageConfig>(JSON.parse(JSON.stringify(defaultConfig)))

const storageStats = computed(() => {
  const totalGB = 100
  const usedGB = 42.5
  return {
    totalGB,
    usedGB,
    remainingGB: +(totalGB - usedGB).toFixed(1),
    percentage: +((usedGB / totalGB) * 100).toFixed(1),
    fileCount: 12583,
  }
})

async function fetchConfig() {
  loading.value = true
  error.value = null
  try {
    const data = await getStorageConfig()
    if (data) {
      config.storageType = data.storageType ?? defaultConfig.storageType
      config.region = data.region ?? ''
      config.bucket = data.bucket ?? ''
      config.accessKey = data.accessKey ?? ''
      config.secretKey = data.secretKey ?? ''
      config.maxFileSize = data.maxFileSize ?? defaultConfig.maxFileSize
      config.allowedFileTypes = data.allowedFileTypes ?? defaultConfig.allowedFileTypes
    }
  } catch (e: any) {
    error.value = e.message || '加载存储配置失败'
  } finally {
    loading.value = false
  }
}

function toggleFileType(value: string) {
  const idx = config.allowedFileTypes.indexOf(value)
  if (idx > -1) {
    config.allowedFileTypes.splice(idx, 1)
  } else {
    config.allowedFileTypes.push(value)
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
    await updateStorageConfig({
      storageType: config.storageType,
      region: config.region,
      bucket: config.bucket,
      accessKey: config.accessKey,
      secretKey: config.secretKey,
      maxFileSize: config.maxFileSize,
      allowedFileTypes: config.allowedFileTypes,
    } as any)
  } catch (e: any) {
    error.value = e.message || '保存存储配置失败'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>