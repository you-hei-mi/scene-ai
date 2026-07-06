/**
 * 文章相关组合式函数
 * @description 提供文章列表、详情、创建、更新、删除等 API 调用
 */

import { ref, type Ref } from "vue";
import { apiHttpClient, consoleHttpClient } from "../../web/services/base";
import type {
    Article,
    CreateArticleParams,
    QueryArticleParams,
    UpdateArticleParams,
} from "../../web/services/types/article";
import { ArticleStatus } from "../../web/services/types/article";
import type { OperationResult } from "../../web/services/types/common";
import type { PaginatedResponse } from "@buildingai/web-types";

export type { Article, CreateArticleParams, QueryArticleParams, UpdateArticleParams };
export { ArticleStatus };
export type { OperationResult };

// 前台文章列表（已发布）
export function useWebPublishedArticles() {
    const articles = ref<Article[]>([]);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (categoryId?: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await apiHttpClient.get<Article[]>("/article/published", {
                params: { categoryId },
            });
            articles.value = res || [];
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { articles, isLoading, error, fetch };
}

// 前台文章详情
export function useWebArticleDetail() {
    const article = ref<Article | null>(null);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (id: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await apiHttpClient.get<Article>(`/article/${id}`);
            article.value = res || null;
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { article, isLoading, error, fetch };
}

// 后台文章列表（分页）
export function useArticleList() {
    const articleData = ref<PaginatedResponse<Article> | null>(null);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (params?: QueryArticleParams) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.get<PaginatedResponse<Article>>("/article", {
                params,
            });
            articleData.value = res || null;
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { articleData, isLoading, error, fetch };
}

// 后台文章详情
export function useArticleDetail() {
    const article = ref<Article | null>(null);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const fetch = async (id: string) => {
        isLoading.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.get<Article>(`/article/${id}`);
            article.value = res || null;
        } catch (err) {
            error.value = err as Error;
        } finally {
            isLoading.value = false;
        }
    };

    return { article, isLoading, error, fetch };
}

// 创建文章
export function useCreateArticle() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (data: CreateArticleParams) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.post<Partial<Article>>("/article", data);
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

// 更新文章
export function useUpdateArticle() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (id: string, data: UpdateArticleParams) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.patch<Article>(`/article/${id}`, data);
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

// 删除文章
export function useDeleteArticle() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (id: string) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.delete<OperationResult>(`/article/${id}`);
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

// 批量删除文章
export function useBatchDeleteArticles() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (ids: string[]) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.post<OperationResult>("/article/batch-delete", {
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

// 发布文章
export function usePublishArticle() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (id: string) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.post<OperationResult>(`/article/${id}/publish`);
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

// 取消发布文章
export function useUnpublishArticle() {
    const isSubmitting = ref(false);
    const error = ref<Error | null>(null);

    const submit = async (id: string) => {
        isSubmitting.value = true;
        error.value = null;
        try {
            const res = await consoleHttpClient.post<OperationResult>(`/article/${id}/unpublish`);
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
