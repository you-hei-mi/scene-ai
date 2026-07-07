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
            <UIcon name="lucide:sparkles" class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white mb-2">欢迎回来</h1>
          <p class="text-slate-400">登录到您的 BuildingAI 账户</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div>
            <label class="block text-sm font-medium mb-2 text-white/90">用户名/邮箱</label>
            <div class="relative">
              <UIcon name="lucide:user" class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                v-model="formState.username" 
                placeholder="请输入用户名或邮箱" 
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

          <div class="flex items-center justify-between">
            <label class="flex items-center gap-2 cursor-pointer">
              <UCheckbox v-model="formState.remember" />
              <span class="text-sm text-slate-400">记住我</span>
            </label>
            <NuxtLink to="/forgot-password" class="text-sm text-primary hover:text-primary/80 transition-colors">
              忘记密码？
            </NuxtLink>
          </div>

          <button 
            type="submit" 
            class="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            :disabled="loading"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <UIcon name="lucide:loader-2" class="w-5 h-5 animate-spin" />
              登录中...
            </span>
            <span v-else>登录</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <span class="text-sm text-slate-400">还没有账户？</span>
          <NuxtLink to="/register" class="text-sm text-primary hover:text-primary/80 ml-1 transition-colors">
            立即注册
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
  password: '',
  remember: false,
})

async function handleLogin() {
  if (!formState.value.username || !formState.value.password) {
    toast.add({
      title: '请填写完整信息',
      description: '用户名和密码不能为空',
      color: 'yellow',
    })
    return
  }

  try {
    loading.value = true
    const { data } = await $fetch<{
      code: number
      data: { accessToken: string; user: any }
      message: string
    }>('/api/auth/login', {
      method: 'POST',
      body: {
        username: formState.value.username,
        password: formState.value.password,
      },
    })

    if (data.accessToken) {
      userStore.setToken(data.accessToken)
      userStore.setUserInfo(data.user)
      toast.add({ title: '登录成功', color: 'green' })
      navigateTo('/chat')
    }
  } catch (error: any) {
    toast.add({
      title: '登录失败',
      description: error.data?.message || error.message || '请检查用户名和密码',
      color: 'red',
    })
  } finally {
    loading.value = false
  }
}
</script>