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
          <h1 class="text-2xl font-bold text-white mb-2">正在验证支付结果</h1>
          <p class="text-slate-400">请稍候，正在确认支付状态...</p>

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
          <h1 class="text-2xl font-bold text-white mb-2">支付成功</h1>
          <p class="text-slate-400 mb-6">您的支付已完成</p>

          <!-- Order Info -->
          <div class="bg-white/5 rounded-xl p-4 mb-6 text-left">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">订单编号</span>
                <span class="text-sm text-white font-medium font-mono">{{ orderInfo.orderNo }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">商品名称</span>
                <span class="text-sm text-white">{{ orderInfo.productName }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">支付金额</span>
                <span class="text-sm text-success font-semibold">¥{{ orderInfo.amount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">支付时间</span>
                <span class="text-sm text-white">{{ orderInfo.payTime }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">支付方式</span>
                <span class="text-sm text-white">{{ orderInfo.payMethod }}</span>
              </div>
            </div>
          </div>

          <button
            class="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            @click="navigateTo('/settings')"
          >
            返回会员中心
          </button>
        </div>

        <!-- Failure State -->
        <div v-else-if="status === 'failure'" class="text-center">
          <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-danger/20 flex items-center justify-center">
            <UIcon name="lucide:x-circle" class="w-12 h-12 text-danger" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">支付失败</h1>
          <p class="text-slate-400 mb-2">{{ errorMessage }}</p>

          <!-- Error Info -->
          <div v-if="errorDetail" class="bg-white/5 rounded-xl p-4 mb-6 text-left">
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">错误原因</span>
                <span class="text-sm text-danger-light">{{ errorDetail }}</span>
              </div>
              <div v-if="orderInfo.orderNo" class="flex justify-between items-center">
                <span class="text-sm text-slate-400">订单编号</span>
                <span class="text-sm text-white font-mono">{{ orderInfo.orderNo }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-sm text-slate-400">支付金额</span>
                <span class="text-sm text-white">¥{{ orderInfo.amount.toFixed(2) }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <button
              class="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
              @click="handleRetry"
            >
              重新支付
            </button>
            <button
              class="w-full py-3 px-4 bg-white/5 border border-white/10 text-white font-medium rounded-xl transition-all hover:bg-white/10 active:scale-[0.98]"
              @click="navigateTo('/')"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

type PaymentStatus = 'loading' | 'success' | 'failure'

interface OrderInfo {
  orderNo: string
  productName: string
  amount: number
  payTime: string
  payMethod: string
}

interface PaymentVerifyResult {
  success: boolean
  message?: string
  detail?: string
  order?: OrderInfo
}

const status = ref<PaymentStatus>('loading')
const errorMessage = ref('')
const errorDetail = ref('')

const orderInfo = ref<OrderInfo>({
  orderNo: '',
  productName: '',
  amount: 0,
  payTime: '',
  payMethod: '',
})

/**
 * 模拟支付结果验证
 */
function simulatePaymentVerify(): Promise<PaymentVerifyResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟 85% 成功率
      const success = Math.random() > 0.15
      if (success) {
        const now = new Date()
        const payTime = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
        resolve({
          success: true,
          order: {
            orderNo: `PAY${Date.now().toString(36).toUpperCase()}`,
            productName: 'BuildingAI 高级会员 - 月度',
            amount: 29.90,
            payTime,
            payMethod: '支付宝',
          },
        })
      } else {
        resolve({
          success: false,
          message: '支付验证失败',
          detail: '支付未完成，请确认支付是否已扣款或重新发起支付',
          order: {
            orderNo: `PAY${Date.now().toString(36).toUpperCase()}`,
            productName: 'BuildingAI 高级会员 - 月度',
            amount: 29.90,
            payTime: '',
            payMethod: '支付宝',
          },
        })
      }
    }, 2000 + Math.random() * 1000)
  })
}

function handleRetry() {
  status.value = 'loading'
  errorMessage.value = ''
  errorDetail.value = ''
  verifyPayment()
}

async function verifyPayment() {
  try {
    const result = await simulatePaymentVerify()

    if (result.success && result.order) {
      status.value = 'success'
      orderInfo.value = result.order
    } else {
      status.value = 'failure'
      errorMessage.value = result.message || '支付失败'
      errorDetail.value = result.detail || ''
      if (result.order) {
        orderInfo.value = result.order
      }
    }
  } catch {
    status.value = 'failure'
    errorMessage.value = '服务异常'
    errorDetail.value = '网络请求失败，请检查网络连接后重试'
  }
}

onMounted(() => {
  verifyPayment()
})
</script>