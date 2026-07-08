<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="mb-6">
      <div class="flex items-center gap-4 mb-2">
        <div class="w-1 h-8 bg-gradient-to-b from-primary to-accent rounded-full"></div>
        <h1 class="font-display text-3xl font-bold text-slate-900 dark:text-white">系统设置</h1>
      </div>
      <p class="text-slate-600 dark:text-slate-400 ml-5">支付配置</p>
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
      <!-- 支付宝配置 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
              <UIcon name="lucide:wallet" class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">支付宝配置</h2>
              <p class="text-sm mt-0.5 text-slate-500">支付宝支付相关参数</p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">AppID</label>
            <UInput v-model="config.alipay.appId" placeholder="输入支付宝 AppID" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">商户私钥</label>
            <UTextarea v-model="config.alipay.merchantPrivateKey" placeholder="输入商户私钥" rows="3" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">支付宝公钥</label>
            <UTextarea v-model="config.alipay.alipayPublicKey" placeholder="输入支付宝公钥" rows="3" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">回调地址</label>
            <UInput v-model="config.alipay.notifyUrl" placeholder="https://example.com/api/payment/alipay/notify" />
          </div>
        </div>
      </div>

      <!-- 微信支付配置 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center bg-green-100 dark:bg-green-900/30">
              <UIcon name="lucide:smartphone" class="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">微信支付配置</h2>
              <p class="text-sm mt-0.5 text-slate-500">微信支付相关参数</p>
            </div>
          </div>
        </div>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">商户号 (MchID)</label>
            <UInput v-model="config.wechat.mchId" placeholder="输入微信支付商户号" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">API 密钥</label>
            <UInput v-model="config.wechat.apiKey" type="password" placeholder="输入 API 密钥" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">证书路径</label>
            <UInput v-model="config.wechat.certPath" placeholder="/etc/ssl/wechat/apiclient_cert.pem" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">证书密钥路径</label>
            <UInput v-model="config.wechat.keyPath" placeholder="/etc/ssl/wechat/apiclient_key.pem" />
          </div>
        </div>
      </div>

      <!-- 支付开关 -->
      <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <div class="mb-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">支付开关</h2>
          <p class="text-sm mt-1 text-slate-500">控制支付渠道的启用状态</p>
        </div>
        <div class="space-y-4">
          <div class="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">支付宝支付</h3>
              <p class="text-xs mt-0.5 text-slate-500">启用支付宝扫码支付和网页支付</p>
            </div>
            <UCheckbox :modelValue="config.switches.alipay" @change="config.switches.alipay = !config.switches.alipay" />
          </div>
          <div class="flex items-center justify-between py-3">
            <div>
              <h3 class="font-medium text-sm text-slate-900 dark:text-white">微信支付</h3>
              <p class="text-xs mt-0.5 text-slate-500">启用微信扫码支付和 JSAPI 支付</p>
            </div>
            <UCheckbox :modelValue="config.switches.wechat" @change="config.switches.wechat = !config.switches.wechat" />
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
import { reactive, ref, onMounted } from 'vue'
import { getPayConfig, updatePayConfig } from '~/composables/api/system'

definePageMeta({
  layout: 'console',
})

interface AlipayConfig {
  appId: string
  merchantPrivateKey: string
  alipayPublicKey: string
  notifyUrl: string
}

interface WechatConfig {
  mchId: string
  apiKey: string
  certPath: string
  keyPath: string
}

interface PaymentSwitches {
  alipay: boolean
  wechat: boolean
}

interface PayConfig {
  alipay: AlipayConfig
  wechat: WechatConfig
  switches: PaymentSwitches
}

const loading = ref(true)
const error = ref<string | null>(null)
const saving = ref(false)

const defaultConfig: PayConfig = {
  alipay: {
    appId: '',
    merchantPrivateKey: '',
    alipayPublicKey: '',
    notifyUrl: '',
  },
  wechat: {
    mchId: '',
    apiKey: '',
    certPath: '',
    keyPath: '',
  },
  switches: {
    alipay: true,
    wechat: true,
  },
}

const config = reactive<PayConfig>(JSON.parse(JSON.stringify(defaultConfig)))

async function fetchConfig() {
  loading.value = true
  error.value = null
  try {
    const data = await getPayConfig()
    if (data) {
      config.alipay = {
        appId: (data.alipay as any)?.appId ?? '',
        merchantPrivateKey: (data.alipay as any)?.privateKey ?? '',
        alipayPublicKey: (data.alipay as any)?.publicKey ?? '',
        notifyUrl: (data.alipay as any)?.callbackUrl ?? '',
      }
      config.wechat = {
        mchId: (data.wechatPay as any)?.merchantId ?? '',
        apiKey: (data.wechatPay as any)?.apiKey ?? '',
        certPath: (data.wechatPay as any)?.certPath ?? '',
        keyPath: '',
      }
      config.switches = {
        alipay: (data.paymentSwitch as any)?.alipay ?? true,
        wechat: (data.paymentSwitch as any)?.wechatPay ?? true,
      }
    }
  } catch (e: any) {
    error.value = e.message || '加载支付配置失败'
  } finally {
    loading.value = false
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
    await updatePayConfig({
      alipay: {
        appId: config.alipay.appId,
        privateKey: config.alipay.merchantPrivateKey,
        publicKey: config.alipay.alipayPublicKey,
        callbackUrl: config.alipay.notifyUrl,
      },
      wechatPay: {
        merchantId: config.wechat.mchId,
        apiKey: config.wechat.apiKey,
        certPath: config.wechat.certPath,
      },
      paymentSwitch: {
        alipay: config.switches.alipay,
        wechatPay: config.switches.wechat,
      },
    } as any)
  } catch (e: any) {
    error.value = e.message || '保存支付配置失败'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchConfig()
})
</script>