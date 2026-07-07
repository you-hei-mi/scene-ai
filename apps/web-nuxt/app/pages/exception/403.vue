<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
    </div>

    <div class="relative w-full max-w-md">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl text-center">
        <div class="mb-6">
          <div class="w-24 h-24 mx-auto rounded-full bg-danger/20 flex items-center justify-center">
            <UIcon name="lucide:shield-ban" class="w-14 h-14 text-danger" />
          </div>
        </div>

        <h1 class="text-7xl font-bold text-white mb-2 tracking-tight">403</h1>
        <h2 class="text-xl font-semibold text-white mb-2">访问被拒绝</h2>
        <p class="text-slate-400 mb-8">
          您没有权限访问此页面。如果您认为这是一个错误，请联系系统管理员获取帮助。
        </p>

        <button
          class="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-xl transition-all hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
          @click="navigateTo('/')"
        >
          返回首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
</script>