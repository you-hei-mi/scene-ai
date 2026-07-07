<template>
  <div style="background: var(--bg-deep); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem;">
    <div style="width: 100%; max-width: 28rem;">
      <div class="glass-card" style="padding: 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 class="font-display text-gradient" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">欢迎回来</h1>
          <p style="color: var(--text-secondary);">登录到您的 BuildingAI 账户</p>
        </div>

        <form @submit.prevent="handleLogin" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">用户名/邮箱</label>
            <input v-model="formState.username" placeholder="请输入用户名或邮箱" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">密码</label>
            <input v-model="formState.password" type="password" placeholder="请输入密码" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.875rem;">
            <UCheckbox v-model="formState.remember" label="记住我" />
            <NuxtLink to="/forgot-password" style="color: var(--accent-soft-text); text-decoration: underline;">
              忘记密码？
            </NuxtLink>
          </div>

          <button type="submit" class="btn-glass btn-glass--primary" :loading="loading" style="width: 100%;">
            登录
          </button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.875rem;">
          <span style="color: var(--text-secondary);">还没有账户？</span>
          <NuxtLink to="/register" style="color: var(--accent-soft-text); text-decoration: underline; margin-left: 0.25rem;">
            立即注册
          </NuxtLink>
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
