import { apiHttpClient } from "./base";
import type { InfiniteCanvas } from "../types/canvas";

export const studioApi = {
    // === canvases ===
    listCanvases(includeDeleted?: boolean) {
        return apiHttpClient.get<InfiniteCanvas[]>("/canvases", {
            params: includeDeleted ? { includeDeleted: "true" } : undefined,
        });
    },
    createCanvas(payload: Partial<InfiniteCanvas>) {
        return apiHttpClient.post<InfiniteCanvas>("/canvases", payload);
    },
    getCanvas(id: string) {
        return apiHttpClient.get<InfiniteCanvas>(`/canvases/${id}`);
    },
    saveCanvas(id: string, payload: Partial<InfiniteCanvas>) {
        return apiHttpClient.put<InfiniteCanvas>(`/canvases/${id}`, payload);
    },
    deleteCanvas(id: string) {
        return apiHttpClient.delete<void>(`/canvases/${id}`);
    },
    restoreCanvas(id: string) {
        return apiHttpClient.post<void>(`/canvases/${id}/restore`);
    },
    purgeCanvas(id: string) {
        return apiHttpClient.delete<void>(`/canvases/${id}/purge`);
    },
    exportCanvas(id: string) {
        return apiHttpClient.get<Record<string, unknown>>(`/canvases/${id}/export`);
    },
    importCanvas(payload: Record<string, unknown>) {
        return apiHttpClient.post<InfiniteCanvas>("/canvases/import", payload);
    },

    // === projects ===
    listProjects() {
        return apiHttpClient.get<unknown[]>("/projects");
    },
    createProject(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/projects", payload);
    },

    // === assets ===
    listAssetLibraries() {
        return apiHttpClient.get<unknown[]>("/asset-libraries");
    },
    createAssetLibrary(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/asset-libraries", payload);
    },
    createAssetCategory(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/asset-categories", payload);
    },
    createAssetItem(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/asset-items", payload);
    },

    // === prompts ===
    listPromptLibraries() {
        return apiHttpClient.get<unknown[]>("/prompt-libraries");
    },
    createPromptLibrary(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/prompt-libraries", payload);
    },
    createPromptCategory(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/prompt-categories", payload);
    },
    createPromptItem(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/prompt-items", payload);
    },

    // === providers ===
    listProviders() {
        return apiHttpClient.get<unknown[]>("/providers");
    },
    saveProvider(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/providers", payload);
    },

    // === workflows ===
    listWorkflows() {
        return apiHttpClient.get<unknown[]>("/workflows");
    },
    saveWorkflow(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/workflows", payload);
    },

    // === tasks ===
    listTasks() {
        return apiHttpClient.get<unknown[]>("/tasks");
    },
    createTask(payload: Record<string, unknown>) {
        return apiHttpClient.post<unknown>("/tasks", payload);
    },

    // === actions ===
    generateImage(payload: Record<string, unknown>) {
        return apiHttpClient.post<{ images: string[]; taskId: string; status: string }>("/actions/generate", payload);
    },
    chat(payload: Record<string, unknown>) {
        return apiHttpClient.post<{ message: string; model: string; provider: string }>("/actions/chat", payload);
    },
};
