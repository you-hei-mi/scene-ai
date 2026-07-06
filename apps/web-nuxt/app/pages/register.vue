<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
    <div class="w-full max-w-md">
      <UCard class="p-8">
        <div class="text-center mb-8">
          <h1 class="text-2xl font-bold mb-2">创建账户</h1>
          <p class="text-muted-foreground">注册 BuildingAI 新账户</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1.5">用户名</label>
            <UInput v-model="formState.username" placeholder="请输入用户名" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">邮箱</label>
            <UInput v-model="formState.email" type="email" placeholder="请输入邮箱" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">密码</label>
            <UInput v-model="formState.password" type="password" placeholder="请输入密码" />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1.5">确认密码</label>
            <UInput v-model="formState.confirmPassword" type="password" placeholder="请再次输入密码" />
          </div>

          <UButton type="submit" class="w-full" :loading="loading">
            注册
          </UButton>
        </form>

        <div class="mt-6 text-center text-sm">
          <span class="text-muted-foreground">已有账户？</span>
          <NuxtLink to="/login" class="text-primary hover:underline ml-1">
            立即登录
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
  email: '',
  password: '',
  confirmPassword: '',
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
