<template>
  <div style="background: var(--bg-deep); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 1rem;">
    <div style="width: 100%; max-width: 28rem;">
      <div class="glass-card" style="padding: 2rem;">
        <div style="text-align: center; margin-bottom: 2rem;">
          <h1 class="font-display text-gradient" style="font-size: 1.5rem; font-weight: 700; margin-bottom: 0.5rem;">创建账户</h1>
          <p style="color: var(--text-secondary);">注册 BuildingAI 新账户</p>
        </div>

        <form @submit.prevent="handleRegister" style="display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">用户名</label>
            <input v-model="formState.username" placeholder="请输入用户名" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">邮箱</label>
            <input v-model="formState.email" type="email" placeholder="请输入邮箱" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">密码</label>
            <input v-model="formState.password" type="password" placeholder="请输入密码" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
          </div>

          <div>
            <label style="display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.375rem; color: var(--text-primary);">确认密码</label>
            <input v-model="formState.confirmPassword" type="password" placeholder="请再次输入密码" style="background: var(--glass-bg-1); border: 1px solid var(--glass-border); border-radius: 0.75rem; padding: 0.5rem 1rem; color: var(--text-primary); outline: none; width: 100%;" />
          </div>

          <button type="submit" class="btn-glass btn-glass--primary" :loading="loading" style="width: 100%;">
            注册
          </button>
        </form>

        <div style="margin-top: 1.5rem; text-align: center; font-size: 0.875rem;">
          <span style="color: var(--text-secondary);">已有账户？</span>
          <NuxtLink to="/login" style="color: var(--accent-soft-text); text-decoration: underline; margin-left: 0.25rem;">
            立即登录
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
