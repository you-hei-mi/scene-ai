<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <!-- Loading State -->
        <div v-if="status === 'loading'" class="text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <UIcon name="lucide:loader-2" class="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">正在处理授权</h1>
          <p class="text-slate-400">请稍候，正在验证您的身份信息...</p>

          <div class="mt-8 flex justify-center">
            <div class="flex gap-1.5">
              <span class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay: 0ms"></span>
              <span class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay: 150ms"></span>
              <span class="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style="animation-delay: 300ms"></span>
            </div>
          </div>
        </div>

        <!-- Success State -->
        <div v-else-if="status === 'success'" class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-success/20 flex items-center justify-center">
            <UIcon name="lucide:check-circle" class="w-12 h-12 text-success" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">授权成功</h1>
          <p class="text-slate-400 mb-1">登录成功，正在跳转...</p>
          <p class="text-sm text-slate-500">{{ countdown }} 秒后自动跳转</p>

          <button
            class="mt-6 w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            @click="handleGoHome"
          >
            立即跳转
          </button>
        </div>

        <!-- Error State -->
        <div v-else-if="status === 'error'" class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-danger/20 flex items-center justify-center">
            <UIcon name="lucide:x-circle" class="w-12 h-12 text-danger" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">授权失败</h1>
          <p class="text-slate-400 mb-2">{{ errorMessage }}</p>
          <p v-if="errorDetail" class="text-sm text-slate-500 mb-4">{{ errorDetail }}</p>

          <button
            class="mt-2 w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            @click="navigateTo('/login')"
          >
            返回登录
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type OAuthStatus = 'loading' | 'success' | 'error'

interface OAuthCallbackResult {
  success: boolean
  message?: string
  detail?: string
}

const status = ref<OAuthStatus>('loading')
const errorMessage = ref('')
const errorDetail = ref('')
const countdown = ref(3)
let countdownTimer: ReturnType<typeof setInterval> | null = null

/**
 * 模拟 OAuth 回调处理流程
 */
function simulateOAuthCallback(): Promise<OAuthCallbackResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟 80% 成功率
      const success = Math.random() > 0.2
      if (success) {
        resolve({
          success: true,
          message: '授权成功',
        })
      } else {
        resolve({
          success: false,
          message: '授权验证失败',
          detail: '授权码已过期或无效，请重新发起授权',
        })
      }
    }, 2000 + Math.random() * 1000)
  })
}

function handleGoHome() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  navigateTo('/')
}

onMounted(async () => {
  try {
    const result = await simulateOAuthCallback()

    if (result.success) {
      status.value = 'success'
      // 开始倒计时
      countdownTimer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
          if (countdownTimer) {
            clearInterval(countdownTimer)
          }
          navigateTo('/')
        }
      }, 1000)
    } else {
      status.value = 'error'
      errorMessage.value = result.message || '授权失败'
      errorDetail.value = result.detail || ''
    }
  } catch {
    status.value = 'error'
    errorMessage.value = '服务异常'
    errorDetail.value = '网络请求失败，请检查网络连接后重试'
  }
})

onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
})
</script>