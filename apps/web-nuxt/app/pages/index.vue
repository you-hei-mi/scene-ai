<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950/30">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute top-1/2 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 1s"></div>
      <div class="absolute -bottom-40 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <section class="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
      <div class="text-center max-w-4xl mx-auto">
        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-primary shadow-lg">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          AI 智能体平台
        </span>

        <h1 class="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6">
          <span class="block text-slate-900 dark:text-white">构建你的</span>
          <span class="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">AI 智能体</span>
        </h1>

        <p class="text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto mb-12 text-slate-600 dark:text-slate-300">
          让每个人都能拥有专属 AI 助手。零代码创建、一键部署、无缝集成。
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/login" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
            开始使用
            <UIcon name="lucide:arrow-right" class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink to="/agents" class="w-full sm:w-auto px-8 py-3.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-white dark:hover:bg-slate-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2">
            探索智能体
            <UIcon name="lucide:search" class="w-4 h-4" />
          </NuxtLink>
        </div>

        <div class="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div v-for="stat in stats" :key="stat.label" class="text-center">
            <p class="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">{{ stat.value }}</p>
            <p class="text-sm text-slate-500 dark:text-slate-400">{{ stat.label }}</p>
          </div>
        </div>
      </div>

      <div class="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="flex flex-col items-center gap-2 text-slate-500 dark:text-slate-400">
          <span class="text-xs">向下滚动</span>
          <UIcon name="lucide:chevron-down" class="w-5 h-5" />
        </div>
      </div>
    </section>

    <section class="relative z-10 px-4 py-24">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">核心功能</h2>
          <p class="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">强大的 AI 能力，简单易用的操作体验</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(feat, i) in features" :key="i" class="group bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-slate-200 dark:border-slate-700 rounded-2xl p-8 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 transition-all duration-300 cursor-default">
            <div class="w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110" :class="feat.bgClass">
              <UIcon :name="feat.icon" class="w-7 h-7" :class="feat.iconClass" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-3">{{ feat.title }}</h3>
            <p class="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="relative z-10 px-4 py-24 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-6">准备好开始了吗？</h2>
        <p class="text-lg text-slate-600 dark:text-slate-300 mb-10">加入数千名开发者，用 AI 智能体构建更智能的应用</p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink to="/login" class="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
            免费开始
            <UIcon name="lucide:sparkles" class="w-4 h-4" />
          </NuxtLink>
          <NuxtLink to="/contact" class="w-full sm:w-auto px-8 py-3.5 border-2 border-primary text-primary font-semibold rounded-xl hover:bg-primary hover:text-white transition-all duration-300 flex items-center justify-center gap-2">
            预约演示
            <UIcon name="lucide:calendar" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <footer class="relative z-10 px-4 py-12 border-t border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <UIcon name="lucide:bot" class="w-5 h-5 text-white" />
              </div>
              <span class="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">BuildingAI</span>
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">构建未来的 AI 智能体平台</p>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 dark:text-white mb-4">产品</h4>
            <ul class="space-y-2">
              <li><a href="/agents" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">智能体广场</a></li>
              <li><a href="/datasets" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">知识库</a></li>
              <li><a href="/apps" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">应用中心</a></li>
              <li><a href="/pricing" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">定价方案</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 dark:text-white mb-4">资源</h4>
            <ul class="space-y-2">
              <li><a href="/help" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">帮助中心</a></li>
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">API 文档</a></li>
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">开发者社区</a></li>
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">更新日志</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold text-slate-900 dark:text-white mb-4">公司</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">关于我们</a></li>
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">隐私政策</a></li>
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">服务条款</a></li>
              <li><a href="#" class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">联系我们</a></li>
            </ul>
          </div>
        </div>
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
          <p class="text-sm text-slate-500 dark:text-slate-400">2024 BuildingAI. All rights reserved.</p>
          <div class="flex items-center gap-4">
            <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <UIcon name="lucide:github" class="w-5 h-5" />
            </a>
            <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <UIcon name="lucide:twitter" class="w-5 h-5" />
            </a>
            <a href="#" class="text-slate-500 dark:text-slate-400 hover:text-primary transition-colors">
              <UIcon name="lucide:linkedin" class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const features = [
  { icon: 'lucide:bot', title: '智能体创建', desc: '零代码可视化配置，分钟级创建专属 AI 助手。', bgClass: 'bg-gradient-to-br from-primary/10 to-primary/5', iconClass: 'text-primary' },
  { icon: 'lucide:database', title: '知识库管理', desc: '上传文档、自动向量化，AI 基于私有知识精准回答。', bgClass: 'bg-gradient-to-br from-accent/10 to-accent/5', iconClass: 'text-accent' },
  { icon: 'lucide:app-window', title: '应用集成', desc: '通过 API、嵌入组件，将 AI 能力无缝集成到你的产品。', bgClass: 'bg-gradient-to-br from-secondary/10 to-secondary/5', iconClass: 'text-secondary' },
  { icon: 'lucide:message-square', title: '智能对话', desc: '支持多轮对话、上下文理解，打造自然流畅的交互体验。', bgClass: 'bg-gradient-to-br from-success/10 to-success/5', iconClass: 'text-success' },
  { icon: 'lucide:layers', title: '工作流编排', desc: '可视化编排复杂工作流，连接多个智能体协同工作。', bgClass: 'bg-gradient-to-br from-warning/10 to-warning/5', iconClass: 'text-warning' },
  { icon: 'lucide:shield', title: '安全保障', desc: '端到端加密、权限管理、审计日志，保护你的数据安全。', bgClass: 'bg-gradient-to-br from-danger/10 to-danger/5', iconClass: 'text-danger' },
]

const stats = [
  { value: '10K+', label: '活跃智能体' },
  { value: '100K+', label: '日均对话' },
  { value: '99.9%', label: '服务可用性' },
]
</script>
