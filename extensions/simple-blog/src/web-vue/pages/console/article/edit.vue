<script setup lang="ts">
/**
 * 编辑文章页
 * @description 修改已有文章
 */
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useArticleDetail, useUpdateArticle } from "../../../composables/useArticle";
import type { Article, UpdateArticleParams } from "../../../composables/useArticle";
import ArticleForm from "./components/form.vue";

const router = useRouter();
const route = useRoute();
const id = ref((route.query.id as string) || "");

const { article, isLoading, fetch } = useArticleDetail();
const updateMutation = useUpdateArticle();

onMounted(() => {
    if (id.value) {
        fetch(id.value);
    }
});

const handleSubmit = async (data: Partial<Article>) => {
    try {
        const updateData: UpdateArticleParams = {
            title: data.title,
            summary: data.summary,
            content: data.content,
            cover: data.cover,
            status: data.status,
            sort: data.sort,
            categoryId: data.categoryId,
        };
        await updateMutation.submit(id.value, updateData);
        alert("更新成功");
        setTimeout(() => router.back(), 1000);
    } catch (error) {
        console.error(error);
    }
};

const handleCancel = () => {
    router.back();
};
</script>

<template>
    <div class="p-4">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="relative">
            <div class="sticky top-0 z-10 mb-4 flex w-full items-center bg-background pb-2">
                <button class="btn btn-secondary btn-icon" @click="router.back()">
                    <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                    </svg>
                </button>
                <h1 class="ml-4 text-xl font-bold">编辑文章</h1>
            </div>
            <div class="flex items-center justify-center py-10">
                <svg class="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        </div>

        <!-- 编辑表单 -->
        <template v-else>
            <div class="sticky top-0 z-10 mb-4 flex w-full items-center bg-background pb-2">
                <button class="btn btn-ghost" @click="router.back()">
                    <svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m12 19-7-7 7-7"/>
                        <path d="M19 12H5"/>
                    </svg>
                    <span class="text-base font-medium">返回</span>
                </button>
                <h1 class="ml-4 text-xl font-bold">编辑文章</h1>
            </div>

            <ArticleForm
                v-if="article"
                :initial-data="article"
                @submit="handleSubmit"
                @cancel="handleCancel"
                :is-submitting="updateMutation.isSubmitting.value"
            />
        </template>
    </div>
</template>
