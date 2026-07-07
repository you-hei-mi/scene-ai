<template>
  <div class="relative min-h-screen overflow-hidden" :style="{ background: 'var(--bg-deep)' }">
    <!-- 环境光晕 -->
    <div class="ambient-orb ambient-orb--violet"></div>
    <div class="ambient-orb ambient-orb--teal"></div>

    <!-- Hero -->
    <section class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-3xl mx-auto">
        <span class="animate-fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-8"
          :style="{ background: 'var(--glass-bg-1)', backdropFilter: 'blur(12px)', border: '1px solid var(--glass-border)', color: 'var(--accent-soft-text)' }">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" :style="{ background: 'var(--accent-soft)' }"></span>
            <span class="relative inline-flex rounded-full h-2 w-2" :style="{ background: 'var(--accent-soft)' }"></span>
          </span>
          AI 智能体平台
        </span>

        <h1 class="animate-fade-up delay-100 font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
          <span class="block" :style="{ color: 'var(--text-primary)' }">构建你的</span>
          <span class="block text-gradient text-glow">AI 智能体</span>
        </h1>

        <p class="animate-fade-up delay-200 text-lg sm:text-xl leading-relaxed max-w-xl mx-auto mb-10" :style="{ color: 'var(--text-secondary)' }">
          让每个人都能拥有专属 AI 助手。零代码创建、一键部署、无缝集成。
        </p>

        <div class="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button class="btn-glass btn-glass--primary" @click="navigateTo('/chat')">
            开始使用 <UIcon name="lucide:arrow-right" class="w-4 h-4" />
          </button>
          <button class="btn-glass" @click="navigateTo('/agents')">
            探索智能体 <UIcon name="lucide:search" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in delay-700">
        <div class="flex flex-col items-center gap-2" :style="{ color: 'var(--text-secondary)' }">
          <span class="text-xs">向下滚动</span>
          <UIcon name="lucide:chevron-down" class="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>

    <!-- 特性卡片 -->
    <section class="relative z-10 px-4 pb-32">
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="(feat, i) in features" :key="i" class="glass-card p-8 group cursor-default">
          <div class="mb-5 w-12 h-12 rounded-xl flex items-center justify-center"
            :style="{ background: feat.bgColor }">
            <UIcon :name="feat.icon" class="w-6 h-6" :style="{ color: feat.iconColor }" />
          </div>
          <h3 class="font-display text-xl font-bold mb-3" :style="{ color: 'var(--text-primary)' }">{{ feat.title }}</h3>
          <p class="leading-relaxed text-sm" :style="{ color: 'var(--text-secondary)' }">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="relative z-10 px-4 py-8" :style="{ borderTop: '1px solid var(--glass-border-subtle)' }">
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <span class="font-display font-bold text-sm" :style="{ color: 'var(--text-primary)' }">BuildingAI</span>
        <div class="flex items-center gap-6 text-xs">
          <a href="#" class="footer-link">隐私政策</a>
          <a href="#" class="footer-link">服务条款</a>
          <a href="#" class="footer-link">联系我们</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'lucide:bot', title: '智能体创建', desc: '零代码可视化配置，分钟级创建专属 AI 助手。', bgColor: 'var(--accent-soft-bg)', iconColor: 'var(--accent-soft-text)' },
  { icon: 'lucide:database', title: '知识库管理', desc: '上传文档、自动向量化，AI 基于私有知识精准回答。', bgColor: 'var(--accent-bright-bg)', iconColor: 'var(--accent-bright-text)' },
  { icon: 'lucide:app-window', title: '应用集成', desc: '通过 API、嵌入组件，将 AI 能力无缝集成到你的产品。', bgColor: 'var(--accent-soft-bg-subtle)', iconColor: 'var(--accent-soft-hover)' },
]
</script>
