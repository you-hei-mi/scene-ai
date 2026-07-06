<script setup lang="ts">
/**
 * 文章详情页
 * @description 展示单篇文章的完整内容
 */
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWebArticleDetail } from "../../composables/useArticle";

const route = useRoute();
const router = useRouter();
const id = ref(route.params.id as string);

const { article, isLoading, fetch } = useWebArticleDetail();

onMounted(() => {
    if (id.value) {
        fetch(id.value);
    }
});

// 格式化相对时间
const formatRelativeTime = (date: Date | string | undefined) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
        return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    }
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return "刚刚";
};
</script>

<template>
    <div class="bg-background min-h-screen py-12">
        <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="flex items-center justify-center py-20">
                <svg class="text-muted-foreground size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>

            <!-- 文章不存在 -->
            <div v-else-if="!article" class="flex items-center justify-center py-20">
                <p class="text-muted-foreground text-lg">文章不存在</p>
            </div>

            <!-- 文章内容 -->
            <article v-else>
                <h1 class="text-foreground text-3xl leading-tight font-bold">
                    {{ article.title }}
                </h1>

                <div class="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm leading-none">
                    <button
                        @click="router.back()"
                        class="flex items-center gap-0.5 hover:underline hover:underline-offset-2"
                    >
                        <!-- ChevronLeft SVG -->
                        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="m15 18-6-6 6-6"/>
                        </svg>
                        <span>返回</span>
                    </button>
                    <span class="inline-block h-3.5 w-px bg-border"></span>
                    <div class="flex items-center gap-0.5">
                        <!-- User SVG -->
                        <svg class="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                            <circle cx="12" cy="7" r="4"/>
                        </svg>
                        {{ article.author?.nickname || article.author?.username || "未知作者" }}
                    </div>
                    <span class="inline-block h-3.5 w-px bg-border"></span>
                    <span>{{ formatRelativeTime(article.publishedAt || article.createdAt) }}</span>
                    <span class="inline-block h-3.5 w-px bg-border"></span>
                    <span v-if="article.category?.name">{{ article.category.name }}</span>
                    <span v-if="article.category?.name" class="inline-block h-3.5 w-px bg-border"></span>
                    <span>{{ article.viewCount || 0 }} 次阅读</span>
                </div>

                <div v-if="article.cover" class="mt-2 h-96 overflow-hidden rounded-lg">
                    <img
                        :src="article.cover"
                        :alt="article.title"
                        class="h-full w-full object-contain"
                    />
                </div>

                <p v-if="article.summary" class="bg-muted text-muted-foreground mt-4 rounded-lg p-2 text-sm leading-relaxed">
                    {{ article.summary }}
                </p>

                <div class="prose prose-lg dark:prose-invert mt-6 max-w-none pb-10">
                    <!-- 富文本内容直接渲染（HTML） -->
                    <div v-html="article.content"></div>
                </div>
            </article>
        </div>
    </div>
</template>
