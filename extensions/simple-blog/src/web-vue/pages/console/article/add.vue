<script setup lang="ts">
/**
 * 发布文章页
 * @description 创建新文章
 */
import { useRouter } from "vue-router";
import { useCreateArticle } from "../../../composables/useArticle";
import type { CreateArticleParams } from "../../../composables/useArticle";
import ArticleForm from "./components/form.vue";

const router = useRouter();
const createMutation = useCreateArticle();

const handleSubmit = async (data: CreateArticleParams) => {
    try {
        await createMutation.submit(data);
        alert("创建成功");
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
        <div class="sticky top-0 z-10 mb-4 flex w-full items-center bg-background pb-2">
            <button class="btn btn-secondary btn-icon" @click="router.back()">
                <!-- ArrowLeft SVG -->
                <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="m12 19-7-7 7-7"/>
                    <path d="M19 12H5"/>
                </svg>
            </button>
            <h1 class="ml-4 text-xl font-bold">发布文章</h1>
        </div>

        <ArticleForm
            @submit="handleSubmit"
            @cancel="handleCancel"
            :is-submitting="createMutation.isSubmitting.value"
        />
    </div>
</template>
