/**
 * 分类相关组合式函数
 * @description 提供分类列表、详情、创建、更新、删除等 API 调用
 */

import { ref } from "vue";
import { apiHttpClient, consoleHttpClient } from "../../web/services/base";
import type {
    Category,
    CreateCategoryParams,
    QueryCategoryParams,
    UpdateCategoryParams,
} from "../../web/services/types/category";
import type { OperationResult } from "../../web/services/types/common";

export type { Category, CreateCategoryParams, QueryCategoryParams, UpdateCategoryParams };
export type { OperationResult };

// 前台分类列表
export function useWebCategoryList() {
    const categories = ref<Category[]>([]);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (params?: QueryCategoryParams) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await apiHttpClient.get<Category[]>("/category", { params });
            categories.value = res || [];
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { categories, isLoading, error, fetch };
}

// 后台分类列表
export function useCategoryList() {
    const categories = ref<Category[]>([]);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (params?: QueryCategoryParams) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.get<Category[]>("/category", { params });
            categories.value = res || [];
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { categories, isLoading, error, fetch };
}

// 分类详情
export function useCategoryDetail() {
    const category = ref<Category | null>(null);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (id: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.get<Category>(`/category/${id}`);
            category.value = res || null;
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { category, isLoading, error, fetch };
}

// 创建分类
export function useCreateCategory() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (data: CreateCategoryParams) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.post<Partial<Category>>("/category", data);
            return res;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isSubmitting.value = false;
        }
    };

    return { submit, isSubmitting, error };
}

// 更新分类
export function useUpdateCategory() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (id: string, data: UpdateCategoryParams) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.patch<Category>(`/category/${id}`, data);
            return res;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isSubmitting.value = false;
        }
    };

    return { submit, isSubmitting, error };
}

// 删除分类
export function useDeleteCategory() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (id: string) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.delete<OperationResult>(`/category/${id}`);
            return res;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isSubmitting.value = false;
        }
    };

    return { submit, isSubmitting, error };
}

// 批量删除分类
export function useBatchDeleteCategories() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (ids: string[]) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.post<OperationResult>("/category/batch-delete", {
                ids,
            });
            return res;
        } catch (err) {
            error.value = err as Error;
            throw err;
        } finally {
            isSubmitting.value = false;
        }
    };

    return { submit, isSubmitting, error };
}
