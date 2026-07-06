<script setup lang="ts">
/**
 * 文章列表管理页
 * @description 提供文章搜索、筛选、分页、批量删除与状态切换功能
 */
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import {
    ArticleStatus,
    useArticleList,
    useBatchDeleteArticles,
    useCategoryList,
    useDeleteArticle,
    usePublishArticle,
    useUnpublishArticle,
} from "../../../composables/useArticle";
import type { QueryArticleParams } from "../../../composables/useArticle";

const router = useRouter();
const selectedIds = ref<Set<string>>(new Set());
const searchParams = ref<QueryArticleParams>({
    page: 1,
    pageSize: 10,
    title: "",
    status: undefined,
    categoryId: undefined,
});

const { articleData, isLoading, fetch: fetchArticles } = useArticleList();
const { categories, fetch: fetchCategories } = useCategoryList();

const deleteMutation = useDeleteArticle();
const batchDeleteMutation = useBatchDeleteArticles();
const publishMutation = usePublishArticle();
const unpublishMutation = useUnpublishArticle();

const articles = computed(() => articleData.value?.items || []);
const total = computed(() => articleData.value?.total || 0);
const totalPages = computed(() => Math.ceil(total.value / (searchParams.value.pageSize || 10)));

onMounted(() => {
    fetchArticles(searchParams.value);
    fetchCategories();
});

// 分页页码列表
const pageNumbers = computed(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;
    const current = searchParams.value.page || 1;
    const totalP = totalPages.value;

    if (totalP <= maxVisible) {
        for (let i = 1; i <= totalP; i++) pages.push(i);
    } else {
        if (current <= 3) {
            for (let i = 1; i <= 4; i++) pages.push(i);
            pages.push("...");
            pages.push(totalP);
        } else if (current >= totalP - 2) {
            pages.push(1);
            pages.push("...");
            for (let i = totalP - 3; i <= totalP; i++) pages.push(i);
        } else {
            pages.push(1);
            pages.push("...");
            for (let i = current - 1; i <= current + 1; i++) pages.push(i);
            pages.push("...");
            pages.push(totalP);
        }
    }
    return pages;
});

const handleToggleAll = () => {
    const allCurrentPageSelected =
        articles.value.length > 0 && articles.value.every((art) => selectedIds.value.has(art.id));

    const newSelected = new Set(selectedIds.value);
    if (allCurrentPageSelected) {
        articles.value.forEach((art) => newSelected.delete(art.id));
    } else {
        articles.value.forEach((art) => newSelected.add(art.id));
    }
    selectedIds.value = newSelected;
};

const handleToggleRow = (id: string) => {
    const newSelected = new Set(selectedIds.value);
    if (newSelected.has(id)) {
        newSelected.delete(id);
    } else {
        newSelected.add(id);
    }
    selectedIds.value = newSelected;
};

const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这篇文章吗？")) return;
    try {
        await deleteMutation.submit(id);
        alert("删除成功");
        fetchArticles(searchParams.value);
    } catch (error) {
        console.error(error);
    }
};

const handleBatchDelete = async () => {
    if (selectedIds.value.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.value.size} 篇文章吗？`)) return;
    try {
        await batchDeleteMutation.submit(Array.from(selectedIds.value));
        alert("批量删除成功");
        selectedIds.value = new Set();
        fetchArticles(searchParams.value);
    } catch (error) {
        console.error(error);
    }
};

const handleStatusChange = async (id: string, currentStatus: string) => {
    try {
        if (currentStatus === ArticleStatus.PUBLISHED) {
            await unpublishMutation.submit(id);
            alert("已设为草稿");
        } else {
            await publishMutation.submit(id);
            alert("发布成功");
        }
        fetchArticles(searchParams.value);
    } catch (error) {
        console.error(error);
    }
};

const handleSearch = () => {
    searchParams.value.page = 1;
    fetchArticles(searchParams.value);
};

const handlePageChange = (page: number) => {
    searchParams.value.page = page;
    fetchArticles(searchParams.value);
};

// 下拉菜单显隐控制
const openDropdownId = ref<string | null>(null);
const toggleDropdown = (id: string) => {
    openDropdownId.value = openDropdownId.value === id ? null : id;
};

// 点击外部关闭下拉菜单
const dropdownRef = ref<HTMLElement | null>(null);
</script>

<template>
    <div class="p-4">
        <div class="mb-4 flex flex-wrap gap-4">
            <div class="flex flex-1 flex-wrap gap-4">
                <input
                    class="input max-w-xs max-sm:max-w-full"
                    placeholder="搜索文章标题..."
                    v-model="searchParams.title"
                    @keydown.enter="handleSearch"
                />

                <select
                    class="select w-[180px] max-sm:w-full"
                    v-model="searchParams.status"
                >
                    <option :value="undefined">全部状态</option>
                    <option :value="ArticleStatus.DRAFT">草稿</option>
                    <option :value="ArticleStatus.PUBLISHED">已发布</option>
                </select>

                <select
                    class="select w-[180px] max-sm:w-full"
                    v-model="searchParams.categoryId"
                >
                    <option :value="undefined">全部分类</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                        {{ cat.name }}
                    </option>
                </select>
            </div>

            <div class="flex gap-2">
                <button
                    v-if="selectedIds.size > 1"
                    class="btn btn-outline"
                    @click="selectedIds = new Set()"
                >
                    取消全选
                </button>

                <button
                    class="btn btn-destructive"
                    :disabled="selectedIds.size === 0"
                    @click="handleBatchDelete"
                >
                    <!-- Trash SVG -->
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    </svg>
                    批量删除 ({{ selectedIds.size }})
                </button>

                <button class="btn btn-primary" @click="router.push('/console/article/add')">
                    <!-- Plus SVG -->
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"/>
                        <path d="M12 5v14"/>
                    </svg>
                    新建文章
                </button>
            </div>
        </div>

        <!-- 加载状态 -->
        <div v-if="isLoading" class="mb-4 flex flex-1 items-center justify-center py-20">
            <svg class="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>

        <!-- 表格 -->
        <div v-else class="mb-4 overflow-hidden rounded-md border">
            <table class="simple-table">
                <thead>
                    <tr>
                        <th class="w-12">
                            <input
                                type="checkbox"
                                class="checkbox"
                                :checked="articles.length > 0 && articles.every((art) => selectedIds.has(art.id))"
                                @change="handleToggleAll"
                            />
                        </th>
                        <th>标题</th>
                        <th>状态</th>
                        <th>浏览量</th>
                        <th>创建时间</th>
                        <th class="w-24">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="articles.length > 0">
                        <tr
                            v-for="article in articles"
                            :key="article.id"
                            :data-state="selectedIds.has(article.id) ? 'selected' : undefined"
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    class="checkbox"
                                    :checked="selectedIds.has(article.id)"
                                    @change="handleToggleRow(article.id)"
                                />
                            </td>
                            <td>
                                <div class="flex items-center gap-3">
                                    <img
                                        v-if="article.cover"
                                        :src="article.cover"
                                        :alt="article.title"
                                        class="h-12 w-12 shrink-0 rounded-lg object-cover"
                                    />
                                    <div v-else class="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
                                        <!-- FileText SVG -->
                                        <svg class="h-6 w-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
                                            <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
                                        </svg>
                                    </div>
                                    <div class="min-w-0 flex-1">
                                        <p class="text-secondary-foreground truncate font-medium" :title="article.title">
                                            {{ article.title }}
                                        </p>
                                        <p v-if="article.summary" class="text-muted-foreground max-w-xs truncate text-sm" :title="article.summary">
                                            {{ article.summary }}
                                        </p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <span
                                    class="badge"
                                    :class="article.status === ArticleStatus.PUBLISHED ? 'badge-default' : 'badge-secondary'"
                                >
                                    {{ article.status === ArticleStatus.PUBLISHED ? "已发布" : "草稿" }}
                                </span>
                            </td>
                            <td>
                                <span class="text-sm">{{ (article.viewCount || 0).toLocaleString() }}</span>
                            </td>
                            <td>
                                <span v-if="article.createdAt">
                                    {{ new Date(article.createdAt).getFullYear() }}/{{ String(new Date(article.createdAt).getMonth() + 1).padStart(2, '0') }}/{{ String(new Date(article.createdAt).getDate()).padStart(2, '0') }} {{ String(new Date(article.createdAt).getHours()).padStart(2, '0') }}:{{ String(new Date(article.createdAt).getMinutes()).padStart(2, '0') }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <div class="dropdown-menu" ref="dropdownRef">
                                    <button class="btn btn-ghost btn-icon-sm" @click="toggleDropdown(article.id)">
                                        <!-- MoreVertical SVG -->
                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <circle cx="12" cy="12" r="1"/>
                                            <circle cx="12" cy="5" r="1"/>
                                            <circle cx="12" cy="19" r="1"/>
                                        </svg>
                                    </button>
                                    <div v-if="openDropdownId === article.id" class="dropdown-menu-content">
                                        <button
                                            class="dropdown-menu-item"
                                            @click="router.push(`/console/article/edit?id=${article.id}`); openDropdownId = null"
                                        >
                                            <!-- Pencil SVG -->
                                            <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                                <path d="m15 5 4 4"/>
                                            </svg>
                                            编辑
                                        </button>
                                        <button
                                            class="dropdown-menu-item"
                                            @click="handleStatusChange(article.id, article.status); openDropdownId = null"
                                        >
                                            <template v-if="article.status === ArticleStatus.PUBLISHED">
                                                <!-- EyeOff SVG -->
                                                <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                                                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                                                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                                                    <line x1="2" x2="22" y1="2" y2="22"/>
                                                </svg>
                                                设为草稿
                                            </template>
                                            <template v-else>
                                                <!-- Eye SVG -->
                                                <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                                    <circle cx="12" cy="12" r="3"/>
                                                </svg>
                                                发布
                                            </template>
                                        </button>
                                        <button
                                            class="dropdown-menu-item text-destructive"
                                            @click="handleDelete(article.id); openDropdownId = null"
                                        >
                                            <!-- Trash SVG -->
                                            <svg class="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <path d="M3 6h18"/>
                                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                            </svg>
                                            删除
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </template>
                    <tr v-else>
                        <td colspan="6" class="h-24 text-center">暂无数据</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- 分页 -->
        <div class="flex items-center justify-between">
            <div class="pagination">
                <button
                    class="pagination-btn"
                    :disabled="(searchParams.page || 1) <= 1"
                    @click="handlePageChange((searchParams.page || 1) - 1)"
                >
                    &lt;
                </button>
                <button
                    v-for="page in pageNumbers"
                    :key="page"
                    class="pagination-btn"
                    :class="{ active: page === (searchParams.page || 1) }"
                    :disabled="page === '...'"
                    @click="typeof page === 'number' && handlePageChange(page)"
                >
                    {{ page }}
                </button>
                <button
                    class="pagination-btn"
                    :disabled="(searchParams.page || 1) >= totalPages"
                    @click="handlePageChange((searchParams.page || 1) + 1)"
                >
                    &gt;
                </button>
            </div>
            <div class="text-muted-foreground text-sm">共 {{ total }} 条数据</div>
        </div>
    </div>
</template>
