<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
    <div class="w-full max-w-md">
      <UCard class="p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold mb-2">欢迎回来</h1>
          <p class="text-muted-foreground">登录到您的 BuildingAI 账户</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">用户名/邮箱</label>
            <UInput v-model="formState.username" placeholder="请输入用户名或邮箱" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">密码</label>
            <UInput v-model="formState.password" type="password" placeholder="请输入密码" />
          </div>

          <div class="flex items-center justify-between text-sm">
            <UCheckbox v-model="formState.remember" label="记住我" />
            <NuxtLink to="/forgot-password" class="text-primary hover:underline">
              忘记密码？
            </NuxtLink>
          </div>

          <UButton type="submit" class="w-full" :loading="loading">
            登录
          </UButton>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">还没有账户？</span>
          <NuxtLink to="/register" class="text-primary hover:underline ml-1">
            立即注册
          </NuxtLink>
        </div>
      </UCard>
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
