<script setup lang="ts">
/**
 * 博客首页
 * @description 展示文章列表与分类侧边栏
 */
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useWebCategoryList } from "../../composables/useCategory";
import { useWebPublishedArticles } from "../../composables/useArticle";

const router = useRouter();
const selectedCategoryId = ref<string | undefined>(undefined);

// 分类数据
const { categories, fetch: fetchCategories } = useWebCategoryList();

// 文章数据
const { articles, isLoading: articlesLoading, fetch: fetchArticles } = useWebPublishedArticles();

onMounted(() => {
    fetchCategories();
    fetchArticles();
});

// 分类切换时重新获取文章
watch(selectedCategoryId, (newVal) => {
    fetchArticles(newVal);
});

const handleCategorySelect = (categoryId?: string) => {
    selectedCategoryId.value = categoryId;
};

const handleArticleClick = (articleId: string) => {
    router.push(`/article/${articleId}`);
};

// 格式化相对时间（简单实现）
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
        <div class="mx-auto flex max-w-6xl gap-10 px-4 sm:px-6 lg:px-8">
            <div class="flex-1">
                <!-- 移动端分类筛选 -->
                <div class="mb-8 lg:hidden">
                    <div class="flex flex-wrap items-center gap-2">
                        <button
                            class="btn btn-sm"
                            :class="selectedCategoryId === undefined ? 'btn-primary' : 'btn-outline'"
                            @click="handleCategorySelect(undefined)"
                        >
                            全部
                        </button>
                        <button
                            v-for="category in categories"
                            :key="category.id"
                            class="btn btn-sm"
                            :class="selectedCategoryId === category.id ? 'btn-primary' : 'btn-outline'"
                            @click="handleCategorySelect(category.id)"
                        >
                            {{ category.name }}
                            <span v-if="category.articleCount > 0" class="ml-1 text-xs opacity-70">
                                ({{ category.articleCount }})
                            </span>
                        </button>
                    </div>
                </div>

                <!-- 加载状态 -->
                <div v-if="articlesLoading" class="flex items-center justify-center py-20">
                    <svg class="text-muted-foreground size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>

                <!-- 空状态 -->
                <div v-else-if="articles.length === 0" class="flex items-center justify-center py-20">
                    <p class="text-muted-foreground text-lg">暂无文章</p>
                </div>

                <!-- 文章列表 -->
                <div v-else class="space-y-8">
                    <article
                        v-for="article in articles"
                        :key="article.id"
                        class="group flex cursor-pointer gap-6 pb-10 transition-all"
                        @click="handleArticleClick(article.id)"
                    >
                        <div class="flex-1">
                            <h2 class="text-foreground group-hover:text-primary mb-1 text-xl leading-tight font-bold transition-colors">
                                {{ article.title }}
                            </h2>

                            <p v-if="article.summary" class="text-muted-foreground line-clamp-1 text-sm leading-relaxed">
                                {{ article.summary }}
                            </p>

                            <div class="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs leading-none">
                                <span>
                                    {{ article.author?.nickname || article.author?.username || "未知作者" }}
                                </span>
                                <span class="inline-block h-3.5 w-px bg-border"></span>
                                <span>{{ formatRelativeTime(article.publishedAt || article.createdAt) }}</span>
                                <span class="inline-block h-3.5 w-px bg-border"></span>
                                <template v-if="article.category?.name">
                                    <span>{{ article.category.name }}</span>
                                    <span class="text-muted-foreground/50">|</span>
                                </template>
                                <span>{{ article.viewCount || 0 }} 次阅读</span>
                            </div>
                        </div>
                    </article>
                </div>
            </div>

            <!-- 桌面端侧边栏 -->
            <aside class="sticky top-12 hidden h-fit w-48 shrink-0 lg:block">
                <div class="space-y-1">
                    <h3 class="text-foreground mb-4 text-sm font-medium">分类</h3>
                    <button
                        class="btn btn-sm w-full justify-start"
                        :class="selectedCategoryId === undefined ? 'btn-primary' : 'btn-ghost'"
                        @click="handleCategorySelect(undefined)"
                    >
                        全部
                    </button>
                    <button
                        v-for="category in categories"
                        :key="category.id"
                        class="btn btn-sm w-full justify-start"
                        :class="selectedCategoryId === category.id ? 'btn-primary' : 'btn-ghost'"
                        @click="handleCategorySelect(category.id)"
                    >
                        <div class="flex w-full items-center justify-between">
                            <span>{{ category.name }}</span>
                            <span v-if="category.articleCount > 0" class="text-muted-foreground/60 text-xs">
                                {{ category.articleCount }}
                            </span>
                        </div>
                    </button>
                </div>
            </aside>
        </div>
    </div>
</template>
