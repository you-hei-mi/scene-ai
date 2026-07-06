<template>
  <div>
    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold">系统设置</h1>
      <p class="text-muted-foreground text-sm mt-1">配置系统全局参数和运营设置</p>
    </div>

    <div class="flex gap-6">
      <!-- 左侧设置菜单 -->
      <div class="w-56 flex-shrink-0">
        <UCard class="p-2 sticky top-6">
          <nav class="space-y-1">
            <button
              v-for="section in settingSections"
              :key="section.id"
              class="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left"
              :class="activeSection === section.id ? 'bg-accent text-accent-foreground' : 'hover:bg-accent/50 text-muted-foreground hover:text-foreground'"
              @click="activeSection = section.id"
            >
              <UIcon :name="section.icon" class="w-4 h-4" />
              {{ section.label }}
            </button>
          </nav>
        </UCard>
      </div>

      <!-- 右侧设置内容 -->
      <div class="flex-1 space-y-6">
        <!-- 基础设置 -->
        <UCard v-show="activeSection === 'basic'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">基础设置</h2>
              <p class="text-sm text-muted-foreground mt-1">网站基础信息配置</p>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5">网站名称</label>
              <UInput v-model="settings.siteName" placeholder="输入网站名称" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">网站描述</label>
              <UTextarea v-model="settings.siteDescription" placeholder="输入网站描述" rows="3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">网站 Logo URL</label>
              <UInput v-model="settings.siteLogo" placeholder="https://example.com/logo.png" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">网站图标 (Favicon)</label>
              <UInput v-model="settings.siteFavicon" placeholder="https://example.com/favicon.ico" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">备案号</label>
              <UInput v-model="settings.icpNumber" placeholder="ICP 备案号" />
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <UButton variant="outline">重置</UButton>
              <UButton @click="saveSettings">保存设置</UButton>
            </div>
          </div>
        </UCard>

        <!-- 注册与访问 -->
        <UCard v-show="activeSection === 'registration'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">注册与访问</h2>
              <p class="text-sm text-muted-foreground mt-1">用户注册和访问控制配置</p>
            </div>
          </template>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div>
                <h3 class="font-medium text-sm">开放注册</h3>
                <p class="text-xs text-muted-foreground mt-0.5">允许新用户注册账号</p>
              </div>
              <UCheckbox :modelValue="settings.enableRegistration" @change="settings.enableRegistration = !settings.enableRegistration" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div>
                <h3 class="font-medium text-sm">邮箱验证</h3>
                <p class="text-xs text-muted-foreground mt-0.5">注册时需要验证邮箱</p>
              </div>
              <UCheckbox :modelValue="settings.requireEmailVerification" @change="settings.requireEmailVerification = !settings.requireEmailVerification" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div>
                <h3 class="font-medium text-sm">邀请注册</h3>
                <p class="text-xs text-muted-foreground mt-0.5">仅允许通过邀请码注册</p>
              </div>
              <UCheckbox :modelValue="settings.inviteOnly" @change="settings.inviteOnly = !settings.inviteOnly" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">默认用户角色</label>
              <USelect v-model="settings.defaultUserRole" :options="roleOptions" class="w-full" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">每日注册上限</label>
              <UInput v-model.number="settings.dailyRegistrationLimit" type="number" placeholder="0 表示不限制" />
              <p class="text-xs text-muted-foreground mt-1">设置为 0 表示不限制每日注册人数</p>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <UButton variant="outline">重置</UButton>
              <UButton @click="saveSettings">保存设置</UButton>
            </div>
          </div>
        </UCard>

        <!-- 邮件设置 -->
        <UCard v-show="activeSection === 'email'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">邮件设置</h2>
              <p class="text-sm text-muted-foreground mt-1">SMTP 邮件服务配置</p>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5">SMTP 服务器</label>
              <UInput v-model="settings.smtpHost" placeholder="smtp.example.com" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5">端口</label>
                <UInput v-model.number="settings.smtpPort" type="number" placeholder="587" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">加密方式</label>
                <USelect v-model="settings.smtpEncryption" :options="encryptionOptions" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">用户名</label>
              <UInput v-model="settings.smtpUser" placeholder="user@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">密码</label>
              <UInput v-model="settings.smtpPass" type="password" placeholder="输入 SMTP 密码" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">发件人地址</label>
              <UInput v-model="settings.mailFromAddress" placeholder="noreply@example.com" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">发件人名称</label>
              <UInput v-model="settings.mailFromName" placeholder="系统通知" />
            </div>
            <div class="flex items-center justify-between">
              <UButton variant="outline" @click="testEmail">
                <template #icon>
                  <UIcon name="lucide:mail" class="w-4 h-4" />
                </template>
                发送测试邮件
              </UButton>
              <div class="flex items-center gap-3">
                <UButton variant="outline">重置</UButton>
                <UButton @click="saveSettings">保存设置</UButton>
              </div>
            </div>
          </div>
        </UCard>

        <!-- 存储设置 -->
        <UCard v-show="activeSection === 'storage'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">存储设置</h2>
              <p class="text-sm text-muted-foreground mt-1">文件存储和上传配置</p>
            </div>
          </template>
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-medium mb-1.5">存储方式</label>
              <USelect v-model="settings.storageType" :options="storageOptions" />
            </div>
            <div v-if="settings.storageType === 'local'">
              <label class="block text-sm font-medium mb-1.5">本地存储路径</label>
              <UInput v-model="settings.localStoragePath" placeholder="/data/uploads" />
            </div>
            <div v-if="settings.storageType === 's3'">
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1.5">S3 Endpoint</label>
                  <UInput v-model="settings.s3Endpoint" placeholder="https://s3.example.com" />
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium mb-1.5">Access Key</label>
                    <UInput v-model="settings.s3AccessKey" placeholder="Access Key" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium mb-1.5">Secret Key</label>
                    <UInput v-model="settings.s3SecretKey" type="password" placeholder="Secret Key" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5">Bucket 名称</label>
                  <UInput v-model="settings.s3Bucket" placeholder="my-bucket" />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1.5">区域</label>
                  <UInput v-model="settings.s3Region" placeholder="us-east-1" />
                </div>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5">单文件大小限制 (MB)</label>
                <UInput v-model.number="settings.maxFileSize" type="number" placeholder="100" />
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">允许的文件类型</label>
                <UInput v-model="settings.allowedFileTypes" placeholder=".pdf,.doc,.txt" />
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <UButton variant="outline">重置</UButton>
              <UButton @click="saveSettings">保存设置</UButton>
            </div>
          </div>
        </UCard>

        <!-- 安全设置 -->
        <UCard v-show="activeSection === 'security'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">安全设置</h2>
              <p class="text-sm text-muted-foreground mt-1">系统安全和防护配置</p>
            </div>
          </template>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div>
                <h3 class="font-medium text-sm">登录验证码</h3>
                <p class="text-xs text-muted-foreground mt-0.5">登录时需要输入验证码</p>
              </div>
              <UCheckbox :modelValue="settings.enableCaptcha" @change="settings.enableCaptcha = !settings.enableCaptcha" />
            </div>
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div>
                <h3 class="font-medium text-sm">双因素认证</h3>
                <p class="text-xs text-muted-foreground mt-0.5">允许用户启用 2FA 认证</p>
              </div>
              <UCheckbox :modelValue="settings.enable2FA" @change="settings.enable2FA = !settings.enable2FA" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5">登录失败锁定次数</label>
                <UInput v-model.number="settings.loginAttempts" type="number" placeholder="5" />
                <p class="text-xs text-muted-foreground mt-1">连续失败后锁定账号</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">锁定时长 (分钟)</label>
                <UInput v-model.number="settings.lockoutDuration" type="number" placeholder="30" />
                <p class="text-xs text-muted-foreground mt-1">账号被锁定的时长</p>
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium mb-1.5">会话超时 (分钟)</label>
                <UInput v-model.number="settings.sessionTimeout" type="number" placeholder="1440" />
                <p class="text-xs text-muted-foreground mt-1">无操作后自动登出</p>
              </div>
              <div>
                <label class="block text-sm font-medium mb-1.5">密码最小长度</label>
                <UInput v-model.number="settings.minPasswordLength" type="number" placeholder="8" />
                <p class="text-xs text-muted-foreground mt-1">用户密码最小字符数</p>
              </div>
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <UButton variant="outline">重置</UButton>
              <UButton @click="saveSettings">保存设置</UButton>
            </div>
          </div>
        </UCard>

        <!-- 运营设置 -->
        <UCard v-show="activeSection === 'operation'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">运营设置</h2>
              <p class="text-sm text-muted-foreground mt-1">公告、通知等运营配置</p>
            </div>
          </template>
          <div class="space-y-6">
            <div class="flex items-center justify-between py-3 border-b border-border">
              <div>
                <h3 class="font-medium text-sm">启用站点公告</h3>
                <p class="text-xs text-muted-foreground mt-0.5">在页面顶部显示公告条</p>
              </div>
              <UCheckbox :modelValue="settings.enableAnnouncement" @change="settings.enableAnnouncement = !settings.enableAnnouncement" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">公告内容</label>
              <UTextarea v-model="settings.announcementContent" placeholder="输入公告内容" rows="3" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">公告类型</label>
              <USelect v-model="settings.announcementType" :options="announcementTypeOptions" />
            </div>
            <div class="flex items-center justify-between py-3 border-t border-border">
              <div>
                <h3 class="font-medium text-sm">维护模式</h3>
                <p class="text-xs text-muted-foreground mt-0.5">开启后普通用户无法访问</p>
              </div>
              <UCheckbox :modelValue="settings.maintenanceMode" @change="settings.maintenanceMode = !settings.maintenanceMode" />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5">维护模式提示</label>
              <UTextarea v-model="settings.maintenanceMessage" placeholder="系统正在维护中，请稍后再试" rows="2" />
            </div>
            <div class="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <UButton variant="outline">重置</UButton>
              <UButton @click="saveSettings">保存设置</UButton>
            </div>
          </div>
        </UCard>

        <!-- 关于系统 -->
        <UCard v-show="activeSection === 'about'">
          <template #header>
            <div>
              <h2 class="text-lg font-semibold">关于系统</h2>
              <p class="text-sm text-muted-foreground mt-1">系统版本和环境信息</p>
            </div>
          </template>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">系统版本</p>
                <p class="text-lg font-bold mt-1">v2.0.0</p>
              </div>
              <div class="p-4 rounded-lg bg-muted/50">
                <p class="text-xs text-muted-foreground">构建时间</p>
                <p class="text-lg font-bold mt-1">2024-06-26</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="flex items-center justify-between py-2 border-b border-border">
                <span class="text-sm text-muted-foreground">前端框架</span>
                <span class="text-sm font-medium">Nuxt 4 + Vue 3</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-border">
                <span class="text-sm text-muted-foreground">后端框架</span>
                <span class="text-sm font-medium">NestJS</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-border">
                <span class="text-sm text-muted-foreground">数据库</span>
                <span class="text-sm font-medium">PostgreSQL + Redis</span>
              </div>
              <div class="flex items-center justify-between py-2 border-b border-border">
                <span class="text-sm text-muted-foreground">Node.js 版本</span>
                <span class="text-sm font-medium">v20.10.0</span>
              </div>
              <div class="flex items-center justify-between py-2">
                <span class="text-sm text-muted-foreground">运行环境</span>
                <span class="text-sm font-medium">生产环境</span>
              </div>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

definePageMeta({
  layout: 'console',
})

/**
 * 设置分区定义
 */
interface SettingSection {
  id: string
  label: string
  icon: string
}

/**
 * 系统设置接口定义
 */
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

/**
 * 当前激活的设置分区
 */
const activeSection = ref('basic')

/**
 * 设置分区列表
 */
const settingSections: SettingSection[] = [
  { id: 'basic', label: '基础设置', icon: 'lucide:settings' },
  { id: 'registration', label: '注册与访问', icon: 'lucide:user-plus' },
  { id: 'email', label: '邮件设置', icon: 'lucide:mail' },
  { id: 'storage', label: '存储设置', icon: 'lucide:hard-drive' },
  { id: 'security', label: '安全设置', icon: 'lucide:shield' },
  { id: 'operation', label: '运营设置', icon: 'lucide:megaphone' },
  { id: 'about', label: '关于系统', icon: 'lucide:info' },
]

/**
 * 角色选项
 */
const roleOptions = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
  { label: '超级管理员', value: 'super_admin' },
]

/**
 * 加密方式选项
 */
const encryptionOptions = [
  { label: '无加密', value: 'none' },
  { label: 'SSL/TLS', value: 'ssl' },
  { label: 'STARTTLS', value: 'starttls' },
]

/**
 * 存储方式选项
 */
const storageOptions = [
  { label: '本地存储', value: 'local' },
  { label: 'S3 兼容存储', value: 's3' },
  { label: '七牛云存储', value: 'qiniu' },
  { label: '阿里云 OSS', value: 'aliyun' },
]

/**
 * 公告类型选项
 */
const announcementTypeOptions = [
  { label: '信息提示', value: 'info' },
  { label: '成功提示', value: 'success' },
  { label: '警告提示', value: 'warning' },
  { label: '错误提示', value: 'error' },
]

/**
 * 系统设置数据
 */
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

/**
 * 保存设置
 */
function saveSettings() {
  console.log('保存系统设置:', settings)
}

/**
 * 发送测试邮件
 */
function testEmail() {
  console.log('发送测试邮件')
}
</script>
