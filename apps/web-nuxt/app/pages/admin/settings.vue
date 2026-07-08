<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="flex items-center justify-between mb-6">
      <div>
        <div class="flex items-center gap-4 mb-2">
          <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
          <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
        </div>
        <p class="text-slate-600 dark:text-slate-400 ml-5">配置系统全局参数和运营设置</p>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="flex items-center justify-center py-20">
      <div class="flex flex-col items-center gap-3">
        <div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        <p class="text-sm text-slate-500">正在加载系统设置...</p>
      </div>
    </div>

    <!-- Error Banner -->
    <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
      <UIcon name="lucide:alert-triangle" class="w-5 h-5 text-red-500 flex-shrink-0" />
      <div class="flex-1">
        <p class="text-sm font-medium text-red-700 dark:text-red-400">系统信息加载失败</p>
        <p class="text-xs text-red-500 mt-0.5">{{ error }}，已使用本地缓存数据。</p>
      </div>
      <button class="btn-glass text-sm px-3 py-1.5" @click="fetchSystemData">重试</button>
    </div>

    <div class="flex gap-6">
      <div class="w-56 flex-shrink-0">
        <div class="bg-white dark:bg-slate-800 rounded-2xl p-3 sticky top-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <nav class="space-y-1">
            <button
              v-for="section in settingSections"
              :key="section.id"
              class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left"
              :class="activeSection === section.id ? 'bg-gradient-to-r from-primary/10 to-accent/10 text-primary dark:from-primary/20 dark:to-accent/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'"
              @click="activeSection = section.id"
            >
              <UIcon :name="section.icon" class="w-4 h-4" />
              {{ section.label }}
            </button>
          </nav>
        </div>
      </div>

      <div class="flex-1 space-y-6">
        <div v-show="activeSection === 'basic'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">基础设置</h2>
            <p class="text-sm mt-1 text-slate-500">网站基础信息配置</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">网站名称</label>
              <UInput v-model="settings.siteName" placeholder="输入网站名称" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">网站描述</label>
              <UTextarea v-model="settings.siteDescription" placeholder="输入网站描述" rows="3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">网站 Logo URL</label>
              <UInput v-model="settings.siteLogo" placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">网站图标 (Favicon)</label>
              <UInput v-model="settings.siteFavicon" placeholder="https://example.com/favicon.ico" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">备案号</label>
              <UInput v-model="settings.icpNumber" placeholder="ICP 备案号" />
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button class="btn-glass">重置</button>
              <button class="btn-glass btn-glass--primary" @click="saveSettings">保存设置</button>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'registration'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">注册与访问</h2>
            <p class="text-sm mt-1 text-slate-500">用户注册和访问控制配置</p>
          </div>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">开放注册</h3>
                <p class="text-xs mt-0.5 text-slate-500">允许新用户注册账号</p>
              </div>
              <UCheckbox :modelValue="settings.enableRegistration" @change="settings.enableRegistration = !settings.enableRegistration" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">邮箱验证</h3>
                <p class="text-xs mt-0.5 text-slate-500">注册时需要验证邮箱</p>
              </div>
              <UCheckbox :modelValue="settings.requireEmailVerification" @change="settings.requireEmailVerification = !settings.requireEmailVerification" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">邀请注册</h3>
                <p class="text-xs mt-0.5 text-slate-500">仅允许通过邀请码注册</p>
              </div>
              <UCheckbox :modelValue="settings.inviteOnly" @change="settings.inviteOnly = !settings.inviteOnly" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">默认用户角色</label>
              <USelect v-model="settings.defaultUserRole" :options="roleOptions" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">每日注册上限</label>
              <UInput v-model.number="settings.dailyRegistrationLimit" type="number" placeholder="0 表示不限制" />
              <p class="text-xs mt-1 text-slate-500">设置为 0 表示不限制每日注册人数</p>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button class="btn-glass">重置</button>
              <button class="btn-glass btn-glass--primary" @click="saveSettings">保存设置</button>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'email'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">邮件设置</h2>
            <p class="text-sm mt-1 text-slate-500">SMTP 邮件服务配置</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">SMTP 服务器</label>
              <UInput v-model="settings.smtpHost" placeholder="smtp.example.com" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">端口</label>
                <UInput v-model.number="settings.smtpPort" type="number" placeholder="587" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">加密方式</label>
                <USelect v-model="settings.smtpEncryption" :options="encryptionOptions" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">用户名</label>
              <UInput v-model="settings.smtpUser" placeholder="user@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">密码</label>
              <UInput v-model="settings.smtpPass" type="password" placeholder="输入 SMTP 密码" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">发件人地址</label>
              <UInput v-model="settings.mailFromAddress" placeholder="noreply@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">发件人名称</label>
              <UInput v-model="settings.mailFromName" placeholder="系统通知" />
            </div>
            <div class="flex items-center justify-between">
              <button class="btn-glass" @click="testEmail">
                <UIcon name="lucide:mail" class="w-4 h-4" />
                发送测试邮件
              </button>
              <div class="flex items-center gap-3">
                <button class="btn-glass">重置</button>
                <button class="btn-glass btn-glass--primary" @click="saveSettings">保存设置</button>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'storage'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">存储设置</h2>
            <p class="text-sm mt-1 text-slate-500">文件存储和上传配置</p>
          </div>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">存储方式</label>
              <USelect v-model="settings.storageType" :options="storageOptions" />
            </div>
            <div v-if="settings.storageType === 'local'">
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">本地存储路径</label>
              <UInput v-model="settings.localStoragePath" placeholder="/data/uploads" />
            </div>
            <div v-if="settings.storageType === 's3'">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">S3 Endpoint</label>
                  <UInput v-model="settings.s3Endpoint" placeholder="https://s3.example.com" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Access Key</label>
                    <UInput v-model="settings.s3AccessKey" placeholder="Access Key" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Secret Key</label>
                    <UInput v-model="settings.s3SecretKey" type="password" placeholder="Secret Key" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Bucket 名称</label>
                  <UInput v-model="settings.s3Bucket" placeholder="my-bucket" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">区域</label>
                  <UInput v-model="settings.s3Region" placeholder="us-east-1" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">单文件大小限制 (MB)</label>
                <UInput v-model.number="settings.maxFileSize" type="number" placeholder="100" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">允许的文件类型</label>
                <UInput v-model="settings.allowedFileTypes" placeholder=".pdf,.doc,.txt" />
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button class="btn-glass">重置</button>
              <button class="btn-glass btn-glass--primary" @click="saveSettings">保存设置</button>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'security'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">安全设置</h2>
            <p class="text-sm mt-1 text-slate-500">系统安全和防护配置</p>
          </div>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">登录验证码</h3>
                <p class="text-xs mt-0.5 text-slate-500">登录时需要输入验证码</p>
              </div>
              <UCheckbox :modelValue="settings.enableCaptcha" @change="settings.enableCaptcha = !settings.enableCaptcha" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">双因素认证</h3>
                <p class="text-xs mt-0.5 text-slate-500">允许用户启用 2FA 认证</p>
              </div>
              <UCheckbox :modelValue="settings.enable2FA" @change="settings.enable2FA = !settings.enable2FA" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">登录失败锁定次数</label>
                <UInput v-model.number="settings.loginAttempts" type="number" placeholder="5" />
                <p class="text-xs mt-1 text-slate-500">连续失败后锁定账号</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">锁定时长 (分钟)</label>
                <UInput v-model.number="settings.lockoutDuration" type="number" placeholder="30" />
                <p class="text-xs mt-1 text-slate-500">账号被锁定的时长</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">会话超时 (分钟)</label>
                <UInput v-model.number="settings.sessionTimeout" type="number" placeholder="1440" />
                <p class="text-xs mt-1 text-slate-500">无操作后自动登出</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">密码最小长度</label>
                <UInput v-model.number="settings.minPasswordLength" type="number" placeholder="8" />
                <p class="text-xs mt-1 text-slate-500">用户密码最小字符数</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button class="btn-glass">重置</button>
              <button class="btn-glass btn-glass--primary" @click="saveSettings">保存设置</button>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'operation'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">运营设置</h2>
            <p class="text-sm mt-1 text-slate-500">公告、通知等运营配置</p>
          </div>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">启用站点公告</h3>
                <p class="text-xs mt-0.5 text-slate-500">在页面顶部显示公告条</p>
              </div>
              <UCheckbox :modelValue="settings.enableAnnouncement" @change="settings.enableAnnouncement = !settings.enableAnnouncement" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公告内容</label>
              <UTextarea v-model="settings.announcementContent" placeholder="输入公告内容" rows="3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">公告类型</label>
              <USelect v-model="settings.announcementType" :options="announcementTypeOptions" />
            </div>
            <div class="flex items-center justify-between py-3 border-t border-slate-200 dark:border-slate-700">
              <div>
                <h3 class="font-medium text-sm text-slate-900 dark:text-white">维护模式</h3>
                <p class="text-xs mt-0.5 text-slate-500">开启后普通用户无法访问</p>
              </div>
              <UCheckbox :modelValue="settings.maintenanceMode" @change="settings.maintenanceMode = !settings.maintenanceMode" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">维护模式提示</label>
              <UTextarea v-model="settings.maintenanceMessage" placeholder="系统正在维护中，请稍后再试" rows="2" />
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button class="btn-glass">重置</button>
              <button class="btn-glass btn-glass--primary" @click="saveSettings">保存设置</button>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'about'" class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">关于系统</h2>
            <p class="text-sm mt-1 text-slate-500">系统版本和环境信息</p>
          </div>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p class="text-xs text-slate-500">系统版本</p>
                <p class="text-lg font-bold mt-1 text-slate-900 dark:text-white">{{ systemInfo.version }}</p>
              </div>
              <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                <p class="text-xs text-slate-500">构建时间</p>
                <p class="text-lg font-bold mt-1 text-slate-900 dark:text-white">{{ systemInfo.buildTime }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span class="text-sm text-slate-500">前端框架</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ systemInfo.frontendFramework }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span class="text-sm text-slate-500">后端框架</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ systemInfo.backendFramework }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span class="text-sm text-slate-500">数据库</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ systemInfo.database }}</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700">
                <span class="text-sm text-slate-500">Node.js 版本</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ systemInfo.nodeVersion }}</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-slate-500">运行环境</span>
                <span class="text-sm font-medium text-slate-900 dark:text-white">{{ systemInfo.environment }}</span>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button
                class="btn-glass text-sm"
                :disabled="restarting"
                @click="handleRestart"
              >
                <UIcon name="lucide:refresh-cw" class="w-4 h-4" :class="{ 'animate-spin': restarting }" />
                {{ restarting ? '重启中...' : '重启应用' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { getSystemInfo, getRuntimeInfo, restartApplication } from '~/composables/api/core'

definePageMeta({
  layout: 'console',
})

interface SettingSection {
  id: string
  label: string
  icon: string
}

interface SystemSettings {
  siteName: string
  siteDescription: string
  siteLogo: string
  siteFavicon: string
  icpNumber: string
  enableRegistration: boolean
  requireEmailVerification: boolean
  inviteOnly: boolean
  defaultUserRole: string
  dailyRegistrationLimit: number
  smtpHost: string
  smtpPort: number
  smtpEncryption: string
  smtpUser: string
  smtpPass: string
  mailFromAddress: string
  mailFromName: string
  storageType: string
  localStoragePath: string
  s3Endpoint: string
  s3AccessKey: string
  s3SecretKey: string
  s3Bucket: string
  s3Region: string
  maxFileSize: number
  allowedFileTypes: string
  enableCaptcha: boolean
  enable2FA: boolean
  loginAttempts: number
  lockoutDuration: number
  sessionTimeout: number
  minPasswordLength: number
  enableAnnouncement: boolean
  announcementContent: string
  announcementType: string
  maintenanceMode: boolean
  maintenanceMessage: string
}

interface SystemInfoDisplay {
  version: string
  buildTime: string
  frontendFramework: string
  backendFramework: string
  database: string
  nodeVersion: string
  environment: string
}

const loading = ref(false)
const error = ref<string | null>(null)
const restarting = ref(false)

const activeSection = ref('basic')

const settingSections: SettingSection[] = [
  { id: 'basic', label: '基础设置', icon: 'lucide:settings' },
  { id: 'registration', label: '注册与访问', icon: 'lucide:user-plus' },
  { id: 'email', label: '邮件设置', icon: 'lucide:mail' },
  { id: 'storage', label: '存储设置', icon: 'lucide:hard-drive' },
  { id: 'security', label: '安全设置', icon: 'lucide:shield' },
  { id: 'operation', label: '运营设置', icon: 'lucide:megaphone' },
  { id: 'about', label: '关于系统', icon: 'lucide:info' },
]

const roleOptions = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
  { label: '超级管理员', value: 'super_admin' },
]

const encryptionOptions = [
  { label: '无加密', value: 'none' },
  { label: 'SSL/TLS', value: 'ssl' },
  { label: 'STARTTLS', value: 'starttls' },
]

const storageOptions = [
  { label: '本地存储', value: 'local' },
  { label: 'S3 兼容存储', value: 's3' },
  { label: '七牛云存储', value: 'qiniu' },
  { label: '阿里云 OSS', value: 'aliyun' },
]

const announcementTypeOptions = [
  { label: '信息提示', value: 'info' },
  { label: '成功提示', value: 'success' },
  { label: '警告提示', value: 'warning' },
  { label: '错误提示', value: 'error' },
]

const defaultSystemInfo: SystemInfoDisplay = {
  version: 'v2.0.0',
  buildTime: '2024-06-26',
  frontendFramework: 'Nuxt 4 + Vue 3',
  backendFramework: 'NestJS',
  database: 'PostgreSQL + Redis',
  nodeVersion: 'v20.10.0',
  environment: '生产环境',
}

const systemInfo = reactive<SystemInfoDisplay>({ ...defaultSystemInfo })

const settings = reactive<SystemSettings>({
  siteName: 'BuildingAI',
  siteDescription: '专业的 AI 助手平台，支持多模型对话、Agent 编排、知识库管理',
  siteLogo: '',
  siteFavicon: '',
  icpNumber: '京ICP备12345678号',
  enableRegistration: true,
  requireEmailVerification: false,
  inviteOnly: false,
  defaultUserRole: 'user',
  dailyRegistrationLimit: 0,
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpEncryption: 'starttls',
  smtpUser: 'noreply@example.com',
  smtpPass: '',
  mailFromAddress: 'noreply@example.com',
  mailFromName: 'BuildingAI 系统通知',
  storageType: 'local',
  localStoragePath: '/data/uploads',
  s3Endpoint: '',
  s3AccessKey: '',
  s3SecretKey: '',
  s3Bucket: '',
  s3Region: 'us-east-1',
  maxFileSize: 100,
  allowedFileTypes: '.pdf,.doc,.docx,.txt,.md,.csv,.xlsx,.xls',
  enableCaptcha: false,
  enable2FA: true,
  loginAttempts: 5,
  lockoutDuration: 30,
  sessionTimeout: 1440,
  minPasswordLength: 8,
  enableAnnouncement: true,
  announcementContent: '欢迎使用 BuildingAI v2.0，全新的 Vue3 + Nuxt4 架构带来更流畅的体验！',
  announcementType: 'info',
  maintenanceMode: false,
  maintenanceMessage: '系统正在维护升级中，请稍后再试。预计维护时间：2小时。',
})

async function fetchSystemData() {
  loading.value = true
  error.value = null
  try {
    const [systemRes, runtimeRes] = await Promise.all([
      getSystemInfo(),
      getRuntimeInfo(),
    ])

    // 从 API 响应中尝试提取系统信息
    if (systemRes) {
      if (systemRes.version) systemInfo.version = systemRes.version
      if (systemRes.buildTime) systemInfo.buildTime = systemRes.buildTime
      if (systemRes.environment) systemInfo.environment = systemRes.environment
      if (systemRes.siteName) settings.siteName = systemRes.siteName
    }

    if (runtimeRes) {
      if (runtimeRes.nodeVersion) systemInfo.nodeVersion = runtimeRes.nodeVersion
      if (runtimeRes.platform) systemInfo.environment = runtimeRes.platform
    }
  } catch (err: any) {
    const message = err?.message || err?.statusMessage || '网络请求失败'
    error.value = message
    // 降级使用默认 mock 数据
    Object.assign(systemInfo, defaultSystemInfo)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchSystemData()
})

async function handleRestart() {
  restarting.value = true
  try {
    await restartApplication()
  } catch (err: any) {
    const message = err?.message || err?.statusMessage || '重启请求失败'
    error.value = message
  } finally {
    restarting.value = false
  }
}

function saveSettings() {
  console.log('保存系统设置:', settings)
}

function testEmail() {
  console.log('发送测试邮件')
}
</script>