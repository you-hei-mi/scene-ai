<script setup lang="ts">
/**
 * 栏目（分类）列表管理页
 * @description 提供分类搜索、批量删除与编辑功能
 */
import { ref, onMounted } from "vue";
import {
    useBatchDeleteCategories,
    useCategoryList,
    useDeleteCategory,
} from "../../../composables/useCategory";
import CategoryEditDialog from "./edit.vue";

const searchName = ref("");
const editDialogOpen = ref(false);
const editingId = ref<string | null>(null);
const selectedIds = ref<Set<string>>(new Set());

const { categories, isLoading, fetch: refetch } = useCategoryList();
const deleteMutation = useDeleteCategory();
const batchDeleteMutation = useBatchDeleteCategories();

onMounted(() => {
    refetch();
});

// 监听搜索词变化
const handleSearch = () => {
    refetch({ name: searchName.value });
};

const handleToggleAll = () => {
    const allCurrentPageSelected =
        categories.value.length > 0 && categories.value.every((cat) => selectedIds.value.has(cat.id));

    const newSelected = new Set(selectedIds.value);
    if (allCurrentPageSelected) {
        categories.value.forEach((cat) => newSelected.delete(cat.id));
    } else {
        categories.value.forEach((cat) => newSelected.add(cat.id));
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

const handleEdit = (id: string) => {
    editingId.value = id;
    editDialogOpen.value = true;
};

const handleCreate = () => {
    editingId.value = null;
    editDialogOpen.value = true;
};

const handleDelete = async (id: string) => {
    if (!confirm("确定要删除这个分类吗？")) return;
    try {
        await deleteMutation.submit(id);
        alert("删除成功");
        refetch();
    } catch (error) {
        console.error(error);
    }
};

const handleBatchDelete = async () => {
    if (selectedIds.value.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIds.value.size} 个分类吗？`)) return;
    try {
        await batchDeleteMutation.submit(Array.from(selectedIds.value));
        alert("批量删除成功");
        selectedIds.value = new Set();
        refetch();
    } catch (error) {
        console.error(error);
    }
};

const handleDialogClose = (shouldRefresh?: boolean) => {
    editDialogOpen.value = false;
    editingId.value = null;
    if (shouldRefresh) {
        refetch();
    }
};
</script>

<template>
    <div class="p-4">
        <div class="mb-4 flex flex-wrap gap-4">
            <input
                class="input max-w-xs"
                placeholder="搜索分类名称..."
                v-model="searchName"
                @keydown.enter="handleSearch"
            />

            <div class="ml-auto flex items-end gap-2">
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

                <button class="btn btn-primary" @click="handleCreate">
                    <!-- Plus SVG -->
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"/>
                        <path d="M12 5v14"/>
                    </svg>
                    新建分类
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
                                :checked="categories.length > 0 && categories.every((cat) => selectedIds.has(cat.id))"
                                @change="handleToggleAll"
                            />
                        </th>
                        <th>名称</th>
                        <th>排序</th>
                        <th>文章数</th>
                        <th>创建时间</th>
                        <th class="w-24">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-if="categories.length > 0">
                        <tr
                            v-for="category in categories"
                            :key="category.id"
                            :data-state="selectedIds.has(category.id) ? 'selected' : undefined"
                        >
                            <td>
                                <input
                                    type="checkbox"
                                    class="checkbox"
                                    :checked="selectedIds.has(category.id)"
                                    @change="handleToggleRow(category.id)"
                                />
                            </td>
                            <td>
                                <div>
                                    <p class="font-medium">{{ category.name }}</p>
                                    <p v-if="category.description" class="text-muted-foreground truncate text-sm">
                                        {{ category.description }}
                                    </p>
                                </div>
                            </td>
                            <td>
                                <span class="text-accent-foreground">{{ category.sort || 0 }}</span>
                            </td>
                            <td>
                                <span class="text-accent-foreground">{{ category.articleCount || 0 }}</span>
                            </td>
                            <td>
                                <span v-if="category.createdAt">
                                    {{ new Date(category.createdAt).getFullYear() }}/{{ String(new Date(category.createdAt).getMonth() + 1).padStart(2, '0') }}/{{ String(new Date(category.createdAt).getDate()).padStart(2, '0') }} {{ String(new Date(category.createdAt).getHours()).padStart(2, '0') }}:{{ String(new Date(category.createdAt).getMinutes()).padStart(2, '0') }}
                                </span>
                                <span v-else>-</span>
                            </td>
                            <td>
                                <div class="flex items-center gap-1">
                                    <button class="btn btn-ghost btn-icon-sm" @click="handleEdit(category.id)">
                                        <!-- Pencil SVG -->
                                        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                                            <path d="m15 5 4 4"/>
                                        </svg>
                                    </button>
                                    <button class="btn btn-ghost btn-icon-sm" @click="handleDelete(category.id)">
                                        <!-- Trash SVG -->
                                        <svg class="h-4 w-4 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                                        </svg>
                                    </button>
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

        <div class="flex items-center justify-between">
            <div class="text-muted-foreground text-sm">
                已选择 {{ selectedIds.size }} / {{ categories.length }} 项
            </div>
        </div>

        <CategoryEditDialog
            :open="editDialogOpen"
            :id="editingId"
            @close="handleDialogClose"
        />
    </div>
</template>
