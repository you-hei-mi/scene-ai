<script setup lang="ts">
/**
 * 文章表单组件
 * @description 文章创建/编辑共用表单
 */
import { ref, watch } from "vue";
import { ArticleStatus, useCategoryList } from "../../../../composables/useArticle";
import type { Article, CreateArticleParams, UpdateArticleParams } from "../../../../composables/useArticle";

interface Props {
    initialData?: Partial<Article> | null;
    isSubmitting?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
    initialData: null,
    isSubmitting: false,
});

const emit = defineEmits<{
    submit: [data: CreateArticleParams | UpdateArticleParams];
    cancel: [];
}>();

const { categories, fetch: fetchCategories } = useCategoryList();

// 初始化表单数据
const formData = ref<Partial<Article>>({
    title: "",
    content: "",
    summary: "",
    cover: "",
    status: ArticleStatus.DRAFT,
    sort: 0,
    categoryId: undefined,
});

// 监听初始数据变化
watch(
    () => props.initialData,
    (newVal) => {
        if (newVal) {
            formData.value = { ...formData.value, ...newVal };
        }
    },
    { immediate: true }
);

// 组件挂载时获取分类列表
fetchCategories();

const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!formData.value.title?.trim()) {
        alert("请输入文章标题");
        return;
    }

    if (!formData.value.content?.trim()) {
        alert("请输入文章内容");
        return;
    }

    try {
        emit("submit", formData.value as CreateArticleParams | UpdateArticleParams);
    } catch (error) {
        console.error("提交失败:", error);
    }
};

// 图片上传模拟
const handleImageUpload = () => {
    const url = prompt("请输入图片 URL:");
    if (url) {
        formData.value.cover = url;
    }
};
</script>

<template>
    <form @submit="handleSubmit" class="flex flex-1 flex-col">
        <div class="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-4">
            <!-- 左侧：文章主体内容 -->
            <div class="flex h-full flex-col gap-4 lg:col-span-3">
                <h3 class="text-lg font-semibold">文章设置</h3>

                <div class="space-y-2">
                    <label class="label" for="title">
                        标题 <span class="text-destructive">*</span>
                    </label>
                    <input
                        id="title"
                        class="input"
                        v-model="formData.title"
                        placeholder="请输入文章标题"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label class="label" for="summary">摘要</label>
                    <textarea
                        id="summary"
                        class="textarea"
                        v-model="formData.summary"
                        placeholder="请输入文章摘要"
                        rows="3"
                    ></textarea>
                </div>

                <div class="flex flex-1 flex-col space-y-2">
                    <label class="label" for="content">
                        内容 <span class="text-destructive">*</span>
                    </label>
                    <textarea
                        id="content"
                        class="textarea flex-1"
                        v-model="formData.content"
                        placeholder="请输入文章内容（支持 Markdown / HTML）"
                        rows="12"
                    ></textarea>
                </div>
            </div>

            <!-- 右侧：发布设置 -->
            <div class="space-y-4">
                <h3 class="text-lg font-semibold">发布设置</h3>

                <div class="space-y-2">
                    <label class="label" for="status">
                        状态 <span class="text-destructive">*</span>
                    </label>
                    <select id="status" class="select" v-model="formData.status">
                        <option :value="ArticleStatus.DRAFT">草稿</option>
                        <option :value="ArticleStatus.PUBLISHED">已发布</option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label class="label" for="categoryId">分类</label>
                    <select id="categoryId" class="select" v-model="formData.categoryId">
                        <option :value="undefined">无分类</option>
                        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                            {{ cat.name }}
                        </option>
                    </select>
                </div>

                <div class="space-y-2">
                    <label class="label" for="cover">封面图</label>
                    <div class="image-upload" @click="handleImageUpload">
                        <img v-if="formData.cover" :src="formData.cover" alt="cover" />
                        <span v-else class="text-sm">点击上传封面图</span>
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="label" for="sort">排序</label>
                    <input
                        id="sort"
                        class="input"
                        type="number"
                        v-model.number="formData.sort"
                        placeholder="数字越大越靠前"
                    />
                </div>

                <div class="flex flex-col gap-2 pt-4">
                    <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
                        {{ isSubmitting ? "提交中..." : "提交" }}
                    </button>
                    <button
                        type="button"
                        class="btn btn-outline"
                        @click="emit('cancel')"
                        :disabled="isSubmitting"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    </form>
</template>
