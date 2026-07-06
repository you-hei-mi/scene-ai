<script setup lang="ts">
/**
 * 分类编辑对话框
 * @description 创建/编辑分类的弹窗组件
 */
import { ref, watch } from "vue";
import {
    useCategoryDetail,
    useCreateCategory,
    useUpdateCategory,
} from "../../../composables/useCategory";
import type { CreateCategoryParams, UpdateCategoryParams } from "../../../composables/useCategory";

interface Props {
    open: boolean;
    id: string | null;
}

const props = defineProps<Props>();

const emit = defineEmits<{
    close: [shouldRefresh?: boolean];
}>();

const formData = ref<CreateCategoryParams | UpdateCategoryParams>({
    name: "",
    description: "",
    sort: 0,
});

const { category, isLoading, fetch } = useCategoryDetail();
const createMutation = useCreateCategory();
const updateMutation = useUpdateCategory();

// 监听弹窗打开与ID变化
watch(
    () => [props.open, props.id],
    ([open, id]) => {
        if (open && id) {
            fetch(id as string);
        } else if (open) {
            formData.value = { name: "", description: "", sort: 0 };
        }
    }
);

// 监听分类详情返回
watch(category, (newVal) => {
    if (newVal && props.id) {
        formData.value = {
            name: newVal.name,
            description: newVal.description || "",
            sort: newVal.sort || 0,
        };
    }
});

const handleSubmit = async (e: Event) => {
    e.preventDefault();

    if (!formData.value.name?.trim()) {
        alert("请输入分类名称");
        return;
    }

    try {
        if (props.id) {
            const updateData: UpdateCategoryParams = {
                name: formData.value.name,
                description: formData.value.description,
                sort: formData.value.sort,
            };
            await updateMutation.submit(props.id, updateData);
            alert("更新成功");
        } else {
            const createData: CreateCategoryParams = {
                name: formData.value.name,
                description: formData.value.description,
                sort: formData.value.sort,
            };
            await createMutation.submit(createData);
            alert("创建成功");
        }
        emit("close", true);
    } catch (error) {
        console.error(error);
    }
};

const isSubmitting = createMutation.isSubmitting.value || updateMutation.isSubmitting.value;
</script>

<template>
    <div v-if="open" class="dialog-overlay" @click.self="emit('close')">
        <div class="dialog-content sm:max-w-[425px]">
            <div class="dialog-header">
                <div class="dialog-title">{{ id ? "编辑分类" : "新建分类" }}</div>
                <div class="dialog-description">
                    {{ id ? "编辑分类信息" : "创建新的文章分类" }}
                </div>
            </div>

            <div v-if="isLoading && id" class="flex items-center justify-center py-20">
                <svg class="size-8 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>

            <form v-else @submit="handleSubmit" class="space-y-4">
                <div class="space-y-2">
                    <label class="label" for="name">
                        名称 <span class="text-destructive">*</span>
                    </label>
                    <input
                        id="name"
                        class="input"
                        v-model="formData.name"
                        placeholder="请输入分类名称"
                        required
                    />
                </div>

                <div class="space-y-2">
                    <label class="label" for="description">描述</label>
                    <textarea
                        id="description"
                        class="textarea"
                        v-model="formData.description"
                        placeholder="请输入分类描述"
                        rows="3"
                    ></textarea>
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

                <div class="dialog-footer">
                    <button
                        type="button"
                        class="btn btn-outline"
                        @click="emit('close')"
                        :disabled="isSubmitting"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        class="btn btn-primary"
                        :disabled="isSubmitting"
                    >
                        {{ isSubmitting ? "保存中..." : "保存" }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
