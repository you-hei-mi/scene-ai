<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto rounded-full bg-warning/20 flex items-center justify-center">
            <UIcon name="lucide:lock-keyhole" class="w-14 h-14 text-warning" />
          </div>
        </div>

        <h1 class="text-7xl font-bold text-white mb-2 tracking-tight">401</h1>
        <h2 class="text-xl font-semibold text-white mb-2">未授权访问</h2>
        <p class="text-slate-400 mb-8">
          您需要登录后才能访问此页面。请先登录您的账户，或注册一个新账户。
        </p>

        <div class="space-y-3">
          <button
            class="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
            @click="navigateTo('/login')"
          >
            前往登录
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
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>