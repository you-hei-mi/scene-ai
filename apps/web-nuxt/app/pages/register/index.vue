<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <UIcon name="lucide:user-plus" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">创建账户</h1>
          <p class="text-slate-400">注册 BuildingAI 新账户</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2 text-white/90">用户名</label>
            <div class="relative">
              <UIcon name="lucide:user" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="formState.username" 
                placeholder="请输入用户名" 
                class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-white/90">邮箱</label>
            <div class="relative">
              <UIcon name="lucide:mail" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="formState.email" 
                type="email" 
                placeholder="请输入邮箱" 
                class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-white/90">密码</label>
            <div class="relative">
              <UIcon name="lucide:lock" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="formState.password" 
                type="password" 
                placeholder="请输入密码" 
                class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2 text-white/90">确认密码</label>
            <div class="relative">
              <UIcon name="lucide:lock-check" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="formState.confirmPassword" 
                type="password" 
                placeholder="请再次输入密码" 
                class="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          </div>

          <label class="flex items-start gap-2 cursor-pointer">
            <UCheckbox v-model="formState.agreeTerms" />
            <span class="text-sm text-slate-400">我已阅读并同意</span>
            <NuxtLink to="/terms" class="text-sm text-primary hover:text-primary/80 transition-colors">服务协议</NuxtLink>
            <span class="text-sm text-slate-400">和</span>
            <NuxtLink to="/privacy" class="text-sm text-primary hover:text-primary/80 transition-colors">隐私政策</NuxtLink>
          </label>

          <button 
            type="submit" 
            class="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <UIcon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              注册中...
            </span>
            <span v-else>注册</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-slate-400">已有账户？</span>
          <NuxtLink to="/login" class="text-sm text-primary hover:text-primary/80 ml-1 transition-colors">
            立即登录
          </NuxtLink>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-white/10"></div>
            </div>
            <div class="relative flex justify-center text-xs">
              <span class="px-2 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-400">或</span>
            </div>
          </div>
          
          <div class="mt-4 grid grid-cols-2 gap-3">
            <button class="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-colors">
              <UIcon name="lucide:github" class="w-5 h-5" />
              GitHub
            </button>
            <button class="flex items-center justify-center gap-2 py-2.5 px-4 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:bg-white/10 transition-colors">
              <UIcon name="lucide:google" class="w-5 h-5" />
              Google
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const userStore = useUserStore()
const toast = useToast()
const loading = ref(false)

const formState = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeTerms: false,
})

async function handleRegister() {
  if (!formState.value.username || !formState.value.email || !formState.value.password) {
    toast.add({
      title: '请填写完整信息',
      description: '所有字段都不能为空',
      color: 'yellow',
    })
    return
  }

  if (formState.value.password !== formState.value.confirmPassword) {
    toast.add({
      title: '密码不一致',
      description: '两次输入的密码不相同',
      color: 'yellow',
    })
    return
  }

  if (!formState.value.agreeTerms) {
    toast.add({
      title: '请同意服务协议',
      description: '请先阅读并同意服务协议和隐私政策',
      color: 'yellow',
    })
    return
  }

  try {
    loading.value = true
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: formState.value.username,
        email: formState.value.email,
        password: formState.value.password,
      },
    })

    toast.add({ title: '注册成功，请登录', color: 'green' })
    navigateTo('/login')
  } catch (error: any) {
    toast.add({
      title: '注册失败',
      description: error.data?.message || error.message || '请稍后重试',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>