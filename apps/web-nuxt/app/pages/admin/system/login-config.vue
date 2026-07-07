<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">登录配置</p>
    </div>

    <AdminSystemTabs />

    <div class="space-y-6">
      <!-- 登录方式 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">登录方式</h2>
          <p class="text-sm mt-1 text-slate-500">配置用户可用的登录方式</p>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">账号密码登录</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许用户使用账号和密码登录</p>
            </div>
            <UCheckbox :modelValue="config.loginMethods.password" @change="config.loginMethods.password = !config.loginMethods.password" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">手机验证码登录</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许用户使用手机号+验证码登录</p>
            </div>
            <UCheckbox :modelValue="config.loginMethods.sms" @change="config.loginMethods.sms = !config.loginMethods.sms" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">邮箱验证码登录</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许用户使用邮箱+验证码登录</p>
            </div>
            <UCheckbox :modelValue="config.loginMethods.email" @change="config.loginMethods.email = !config.loginMethods.email" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">微信扫码登录</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许用户使用微信扫码登录</p>
            </div>
            <UCheckbox :modelValue="config.loginMethods.wechat" @change="config.loginMethods.wechat = !config.loginMethods.wechat" />
          </div>
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">OAuth 第三方登录</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许用户通过 GitHub、Google 等第三方 OAuth 登录</p>
            </div>
            <UCheckbox :modelValue="config.loginMethods.oauth" @change="config.loginMethods.oauth = !config.loginMethods.oauth" />
          </div>
        </div>
      </div>

      <!-- 注册设置 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">注册设置</h2>
          <p class="text-sm mt-1 text-slate-500">用户注册相关配置</p>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">开放注册</h3>
              <p class="text-xs mt-0.5 text-slate-500">允许新用户注册账号</p>
            </div>
            <UCheckbox :modelValue="config.registration.openRegistration" @change="config.registration.openRegistration = !config.registration.openRegistration" />
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">注册审核</h3>
              <p class="text-xs mt-0.5 text-slate-500">新用户注册后需管理员审核通过</p>
            </div>
            <UCheckbox :modelValue="config.registration.reviewRequired" @change="config.registration.reviewRequired = !config.registration.reviewRequired" />
          </div>
          <div class="py-3">
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">默认角色</label>
            <USelect v-model="config.registration.defaultRole" :options="roleOptions" class="w-64" />
            <p class="text-xs mt-1 text-slate-500">新用户注册后的默认角色</p>
          </div>
        </div>
      </div>

      <!-- 安全设置 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">安全设置</h2>
          <p class="text-sm mt-1 text-slate-500">登录安全相关配置</p>
        </div>
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">登录失败次数限制</label>
              <UInput v-model.number="config.security.maxLoginAttempts" type="number" placeholder="5" />
              <p class="text-xs mt-1 text-slate-500">超过此次数后锁定账号</p>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">锁定时间 (分钟)</label>
              <UInput v-model.number="config.security.lockoutDuration" type="number" placeholder="30" />
              <p class="text-xs mt-1 text-slate-500">账号被锁定的时长</p>
            </div>
          </div>
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">启用验证码</h3>
              <p class="text-xs mt-0.5 text-slate-500">登录时需要输入验证码</p>
            </div>
            <UCheckbox :modelValue="config.security.enableCaptcha" @change="config.security.enableCaptcha = !config.security.enableCaptcha" />
          </div>
          <div class="py-3">
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">会话超时 (分钟)</label>
            <UInput v-model.number="config.security.sessionTimeout" type="number" placeholder="1440" class="w-64" />
            <p class="text-xs mt-1 text-slate-500">无操作后自动登出，0 表示永不过期</p>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3">
        <button class="btn-glass" @click="resetConfig">重置</button>
        <button class="btn-glass btn-glass--primary" @click="saveConfig">保存设置</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

definePageMeta({
  layout: 'console',
})

interface LoginMethods {
  password: boolean
  sms: boolean
  email: boolean
  wechat: boolean
  oauth: boolean
}

interface RegistrationConfig {
  openRegistration: boolean
  reviewRequired: boolean
  defaultRole: string
}

interface SecurityConfig {
  maxLoginAttempts: number
  lockoutDuration: number
  enableCaptcha: boolean
  sessionTimeout: number
}

interface LoginConfig {
  loginMethods: LoginMethods
  registration: RegistrationConfig
  security: SecurityConfig
}

const roleOptions = [
  { label: '普通用户', value: 'user' },
  { label: '管理员', value: 'admin' },
  { label: '超级管理员', value: 'super_admin' },
]

const defaultConfig: LoginConfig = {
  loginMethods: {
    password: true,
    sms: false,
    email: false,
    wechat: false,
    oauth: false,
  },
  registration: {
    openRegistration: true,
    reviewRequired: false,
    defaultRole: 'user',
  },
  security: {
    maxLoginAttempts: 5,
    lockoutDuration: 30,
    enableCaptcha: false,
    sessionTimeout: 1440,
  },
}

const config = reactive<LoginConfig>(JSON.parse(JSON.stringify(defaultConfig)))

function resetConfig() {
  Object.assign(config, JSON.parse(JSON.stringify(defaultConfig)))
}

function saveConfig() {
  console.log('保存登录配置:', config)
}
</script>