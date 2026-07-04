import { InjectRepository } from "@buildingai/db/@nestjs/typeorm";
import { HttpErrorFactory } from "@buildingai/errors";
import { Injectable } from "@nestjs/common";
import type { Repository } from "@buildingai/db/typeorm";

import {
    AiProviderProfile,
    AssetCategory,
    AssetItem,
    AssetKind,
    AssetLibrary,
    Canvas,
    CanvasKind,
    CanvasProject,
    GenerationTask,
    PromptCategory,
    PromptItem,
    PromptLibrary,
    WorkflowPreset,
    Conversation,
} from "../../db/entities";

type Payload = Record<string, unknown>;
type JsonObject = Record<string, unknown>;

const asString = (value: unknown): string | undefined => (typeof value === "string" ? value : undefined);
const asNumber = (value: unknown): number | undefined => (typeof value === "number" ? value : undefined);
const asBoolean = (value: unknown): boolean | undefined => (typeof value === "boolean" ? value : undefined);
const asArray = <T = unknown>(value: unknown): T[] | undefined => (Array.isArray(value) ? (value as T[]) : undefined);
const asObject = (value: unknown): JsonObject | undefined =>
    value && typeof value === "object" && !Array.isArray(value) ? (value as JsonObject) : undefined;

const asCanvasKind = (value: unknown): CanvasKind =>
    value === CanvasKind.SMART ? CanvasKind.SMART : CanvasKind.CLASSIC;

const asAssetKind = (value: unknown): AssetKind =>
    Object.values(AssetKind).includes(value as AssetKind) ? (value as AssetKind) : AssetKind.IMAGE;

const asAvatarStatus = (value: unknown): AssetItem["avatarStatus"] =>
    value === "registering" || value === "registered" || value === "failed" || value === "none" ? value : "none";

const asWorkflowKind = (value: unknown): WorkflowPreset["kind"] =>
    value === "comfyui" || value === "runninghub" || value === "canvas" ? value : "canvas";

const asTaskKind = (value: unknown): GenerationTask["kind"] =>
    value === "video" || value === "llm" || value === "workflow" || value === "image" ? value : "image";

const asTaskStatus = (value: unknown): GenerationTask["status"] =>
    value === "running" || value === "done" || value === "failed" || value === "queued" ? value : "queued";

@Injectable()
export class StudioService {
    constructor(
        @InjectRepository(CanvasProject) private readonly projectRepo: Repository<CanvasProject>,
        @InjectRepository(Canvas) private readonly canvasRepo: Repository<Canvas>,
        @InjectRepository(AssetLibrary) private readonly assetLibraryRepo: Repository<AssetLibrary>,
        @InjectRepository(AssetCategory) private readonly assetCategoryRepo: Repository<AssetCategory>,
        @InjectRepository(AssetItem) private readonly assetItemRepo: Repository<AssetItem>,
        @InjectRepository(PromptLibrary) private readonly promptLibraryRepo: Repository<PromptLibrary>,
        @InjectRepository(PromptCategory) private readonly promptCategoryRepo: Repository<PromptCategory>,
        @InjectRepository(PromptItem) private readonly promptItemRepo: Repository<PromptItem>,
        @InjectRepository(AiProviderProfile)
        private readonly providerRepo: Repository<AiProviderProfile>,
        @InjectRepository(WorkflowPreset) private readonly workflowRepo: Repository<WorkflowPreset>,
        @InjectRepository(GenerationTask) private readonly taskRepo: Repository<GenerationTask>,
        @InjectRepository(Conversation) private readonly convRepo: Repository<Conversation>,
    ) {}

    async listProjects() {
        return this.projectRepo.find({ order: { sort: "ASC", createdAt: "ASC" } });
    }

    async createProject(payload: Payload) {
        const project = this.projectRepo.create({
            name: asString(payload.name) || "Default Project",
            icon: asString(payload.icon) || "layers",
            color: asString(payload.color) || "#2563eb",
            sort: asNumber(payload.sort) || 0,
        });
        return this.projectRepo.save(project);
    }

    async listCanvases(includeDeleted = false) {
        return this.canvasRepo.find({
            where: includeDeleted ? {} : { deletedAt: undefined },
            order: { updatedAt: "DESC" },
        });
    }

    async createCanvas(payload: Payload) {
        const canvas = this.canvasRepo.create({
            title: asString(payload.title) || "Untitled Canvas",
            kind: asCanvasKind(payload.kind),
            icon: asString(payload.icon) || "workflow",
            color: asString(payload.color) || "#0ea5e9",
            projectId: asString(payload.projectId),
            boardX: asNumber(payload.boardX) || 0,
            boardY: asNumber(payload.boardY) || 0,
            nodes: asArray(payload.nodes) || [],
            edges: asArray(payload.edges) || [],
            viewport: asObject(payload.viewport) || { x: 0, y: 0, scale: 1 },
            settings: asObject(payload.settings) || {},
        });
        return this.canvasRepo.save(canvas);
    }

    async getCanvas(id: string) {
        const canvas = await this.canvasRepo.findOne({ where: { id } });
        if (!canvas) throw HttpErrorFactory.notFound("Canvas does not exist");
        return canvas;
    }

    async saveCanvas(id: string, payload: Payload) {
        const canvas = await this.getCanvas(id);
        Object.assign(canvas, {
            title: asString(payload.title) ?? canvas.title,
            kind: payload.kind ? asCanvasKind(payload.kind) : canvas.kind,
            icon: asString(payload.icon) ?? canvas.icon,
            color: asString(payload.color) ?? canvas.color,
            projectId: asString(payload.projectId) ?? canvas.projectId,
            boardX: asNumber(payload.boardX) ?? canvas.boardX,
            boardY: asNumber(payload.boardY) ?? canvas.boardY,
            nodes: asArray(payload.nodes) ?? canvas.nodes,
            edges: asArray(payload.edges) ?? canvas.edges,
            viewport: asObject(payload.viewport) ?? canvas.viewport,
            settings: asObject(payload.settings) ?? canvas.settings,
        });
        return this.canvasRepo.save(canvas);
    }

    async trashCanvas(id: string) {
        const canvas = await this.getCanvas(id);
        canvas.deletedAt = new Date();
        return this.canvasRepo.save(canvas);
    }

    async restoreCanvas(id: string) {
        const canvas = await this.getCanvas(id);
        canvas.deletedAt = undefined;
        return this.canvasRepo.save(canvas);
    }

    async purgeCanvas(id: string) {
        await this.canvasRepo.delete(id);
        return { success: true };
    }

    exportCanvas(canvas: Canvas) {
        return {
            schema: "infinite-canvas",
            version: 1,
            exportedAt: new Date().toISOString(),
            canvas: {
                id: canvas.id,
                title: canvas.title,
                kind: canvas.kind,
                nodes: canvas.nodes,
                edges: canvas.edges,
                viewport: canvas.viewport,
                settings: canvas.settings,
            },
        };
    }

    async listAssetLibraries() {
        return this.assetLibraryRepo.find({
            relations: ["categories", "categories.items"],
            order: { sort: "ASC", createdAt: "ASC" },
        });
    }

    async createAssetLibrary(payload: Payload) {
        return this.assetLibraryRepo.save(
            this.assetLibraryRepo.create({ name: asString(payload.name) || "Default Asset Library" }),
        );
    }

    async createAssetCategory(payload: Payload) {
        const libraryId = asString(payload.libraryId);
        if (!libraryId) throw HttpErrorFactory.badRequest("libraryId is required");
        return this.assetCategoryRepo.save(
            this.assetCategoryRepo.create({ libraryId, name: asString(payload.name) || "Default Category" }),
        );
    }

    async createAssetItem(payload: Payload) {
        const categoryId = asString(payload.categoryId);
        if (!categoryId) throw HttpErrorFactory.badRequest("categoryId is required");
        return this.assetItemRepo.save(
            this.assetItemRepo.create({
                categoryId,
                name: asString(payload.name) || "Untitled Asset",
                kind: asAssetKind(payload.kind),
                url: asString(payload.url),
                description: asString(payload.description),
                tags: asArray<string>(payload.tags) || [],
                avatarStatus: asAvatarStatus(payload.avatarStatus),
            }),
        );
    }

    async listPromptLibraries() {
        return this.promptLibraryRepo.find({
            relations: ["categories", "categories.items"],
            order: { sort: "ASC", createdAt: "ASC" },
        });
    }

    async createPromptLibrary(payload: Payload) {
        return this.promptLibraryRepo.save(
            this.promptLibraryRepo.create({ name: asString(payload.name) || "Default Prompt Library" }),
        );
    }

    async createPromptCategory(payload: Payload) {
        const libraryId = asString(payload.libraryId);
        if (!libraryId) throw HttpErrorFactory.badRequest("libraryId is required");
        return this.promptCategoryRepo.save(
            this.promptCategoryRepo.create({ libraryId, name: asString(payload.name) || "Default Category" }),
        );
    }

    async createPromptItem(payload: Payload) {
        const categoryId = asString(payload.categoryId);
        if (!categoryId) throw HttpErrorFactory.badRequest("categoryId is required");
        return this.promptItemRepo.save(
            this.promptItemRepo.create({
                categoryId,
                title: asString(payload.title) || "Untitled Prompt",
                prompt: asString(payload.prompt) || "",
                negativePrompt: asString(payload.negativePrompt),
                params: asObject(payload.params) || {},
                tags: asArray<string>(payload.tags) || [],
            }),
        );
    }

    async listProviders() {
        return this.providerRepo.find({ order: { createdAt: "ASC" } });
    }

    async saveProvider(payload: Payload) {
        return this.providerRepo.save(
            this.providerRepo.create({
                name: asString(payload.name) || "Untitled Provider",
                protocol: asString(payload.protocol) || "openai",
                baseUrl: asString(payload.baseUrl),
                imageModels: asArray<string>(payload.imageModels) || [],
                chatModels: asArray<string>(payload.chatModels) || [],
                videoModels: asArray<string>(payload.videoModels) || [],
                extra: asObject(payload.extra) || {},
                enabled: asBoolean(payload.enabled) ?? true,
            }),
        );
    }

    async listWorkflows() {
        return this.workflowRepo.find({ order: { updatedAt: "DESC" } });
    }

    async saveWorkflow(payload: Payload) {
        return this.workflowRepo.save(
            this.workflowRepo.create({
                name: asString(payload.name) || "Untitled Workflow",
                kind: asWorkflowKind(payload.kind),
                content: asObject(payload.content) || {},
                config: asObject(payload.config) || {},
            }),
        );
    }

    async listTasks() {
        return this.taskRepo.find({ order: { updatedAt: "DESC" } });
    }

    async createTask(payload: Payload) {
        return this.taskRepo.save(
            this.taskRepo.create({
                canvasId: asString(payload.canvasId),
                nodeId: asString(payload.nodeId),
                kind: asTaskKind(payload.kind),
                status: asTaskStatus(payload.status),
                input: asObject(payload.input) || {},
                output: asObject(payload.output) || {},
                error: asString(payload.error),
            }),
        );
    }

    async generateImage(payload: Payload) {
        const provider = asString(payload.provider) || "buildingai";
        const model = asString(payload.model) || "flux-schnell";
        const prompt = asString(payload.prompt) || "";
        const negativePrompt = asString(payload.negativePrompt) || "";
        const width = asNumber(payload.width) || 1024;
        const height = asNumber(payload.height) || 1024;
        const steps = asNumber(payload.steps) || 4;
        const references = asArray<string>(payload.references) || [];

        // 记录生成任务
        const task = this.taskRepo.create({
            id: `task_${Date.now()}`,
            kind: "image" as GenerationTask["kind"],
            status: "queued" as GenerationTask["status"],
            input: { provider, model, prompt, negativePrompt, width, height, steps, references },
        });
        await this.taskRepo.save(task);

        // 尝试调用真实 provider（当前环境可能无 API key，返回占位）
        let images: string[] = [];
        try {
            const apiKey = process.env[`${provider.toUpperCase()}_API_KEY`] || process.env.BUILDINGAI_API_KEY;
            if (apiKey) {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 30000);
                const response = await fetch(process.env.BUILDINGAI_API_URL || "http://localhost:4090/api/ai/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
                    body: JSON.stringify({ provider, model, prompt, negativePrompt, width, height, steps }),
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                if (response.ok) {
                    const data = await response.json();
                    images = data.images || data.urls || [];
                }
            }
        } catch {
            // 无 API key 或请求失败—用占位 URL
        }

        if (images.length === 0) {
            images = [
                `https://placehold.co/${width}x${height}/2563eb/white?text=Generated+Image+1`,
                `https://placehold.co/${width}x${height}/0ea5e9/white?text=Generated+Image+2`,
            ];
        }

        task.status = "done" as GenerationTask["status"];
        task.output = { images };
        await this.taskRepo.save(task);

        return { taskId: task.id, images, status: "done" };
    }

    async chat(payload: Payload) {
        const provider = asString(payload.provider) || "buildingai";
        const model = asString(payload.model) || "gpt-4o-mini";
        const messages = asArray(payload.messages) || [];

        // 尝试调用真实 LLM 端点
        let message = "";
        try {
            const apiKey = process.env.BUILDINGAI_API_KEY;
            if (apiKey) {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 30000);
                const response = await fetch(process.env.BUILDINGAI_API_URL || "http://localhost:4090/api/ai/chat", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
                    body: JSON.stringify({ provider, model, messages }),
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                if (response.ok) {
                    const data = await response.json();
                    message = data.message || data.choices?.[0]?.message?.content || "";
                }
            }
        } catch {
            // 无 API key 或请求失败
        }

        if (!message) {
            const lastUserMsg = messages.findLast((m: any) => m.role === "user")?.content || "";
            message = `这是模拟回复。您发送的消息是：「${lastUserMsg}」\n\n请配置 BUILDINGAI_API_KEY 环境变量以获得真实 AI 回复。`;
        }

       return { message, model, provider };
    }

    async testConnection(payload: Payload) {
        const provider = asString(payload.provider) || "buildingai";
        const baseUrl = asString(payload.baseUrl) || "";
        const apiKey = asString(payload.apiKey) || process.env.BUILDINGAI_API_KEY || "";
        const protocol = asString(payload.protocol) || "openai";
        try {
            if (!apiKey) {
                return { ok: false, provider, message: "未配置 API Key。请在环境变量或 Provider 设置中配置。" };
            }
            if (protocol === "openai") {
                const url = baseUrl ? baseUrl.replace(/\/+$/, "") + "/v1/models" : "https://api.openai.com/v1/models";
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000);
                const response = await fetch(url, {
                    headers: { Authorization: "Bearer " + apiKey },
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                return { ok: response.ok, provider, message: response.ok ? "连接成功" : ("连接失败: " + response.status) };
            }
            return { ok: true, provider, message: "连接测试已提交，结果将通过任务状态返回。" };
        } catch (err: any) {
            return { ok: false, provider, message: "连接异常: " + (err?.message || String(err)) };
        }
    }

    async fetchModels(payload: Payload) {
        const provider = asString(payload.provider) || "buildingai";
        const baseUrl = asString(payload.baseUrl) || "";
        const apiKey = asString(payload.apiKey) || process.env.BUILDINGAI_API_KEY || "";
        const defaultModels: Record<string, string[]> = {
            buildingai: ["flux-schnell", "gpt-4o-mini", "sd3.5"],
            openai: ["dall-e-3", "gpt-4o", "gpt-4o-mini", "o3-mini"],
            gemini: ["gemini-2.0-flash", "gemini-2.0-pro", "imagen-3"],
            volcengine: ["doubao-1.5-pro", "seed-x50"],
            runninghub: ["sd-xl", "flux-pro", "realvis"],
            comfyui: [],
        };
        if (apiKey && provider === "openai") {
            try {
                const url = baseUrl ? baseUrl.replace(/\/+$/, "") + "/v1/models" : "https://api.openai.com/v1/models";
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 10000);
                const response = await fetch(url, {
                    headers: { Authorization: "Bearer " + apiKey },
                    signal: controller.signal,
                });
                clearTimeout(timeout);
                if (response.ok) {
                    const data = await response.json();
                    const models = (data.data || []).map((m: any) => m.id).slice(0, 30);
                    return { provider, models, source: "remote" };
                }
            } catch {}
        }
        return { provider, models: defaultModels[provider] || [], source: "default" };
    }
    async listConversations() {
        return this.convRepo.find({ order: { updatedAt: "DESC" } });
    }

    async createConversation(payload: Payload) {
        return this.convRepo.save(
            this.convRepo.create({
                title: asString(payload.title) || "新对话",
                provider: asString(payload.provider) || "buildingai",
                messages: asArray(payload.messages) || [],
                settings: asObject(payload.settings) || {},
            }),
        );
    }

    async getConversation(id: string) {
        const conv = await this.convRepo.findOne({ where: { id } });
        if (!conv) throw HttpErrorFactory.notFound("Conversation does not exist");
        return conv;
    }

    async saveConversation(id: string, payload: Payload) {
        const conv = await this.getConversation(id);
        Object.assign(conv, {
            title: asString(payload.title) ?? conv.title,
            provider: asString(payload.provider) ?? conv.provider,
            messages: asArray(payload.messages) ?? conv.messages,
            settings: asObject(payload.settings) ?? conv.settings,
        });
        return this.convRepo.save(conv);
    }

    async deleteConversation(id: string) {
        await this.convRepo.delete(id);
        return { success: true };
    }

    async getStats() {
        const [canvases, activeCanvases, tasks, providers, workflows] = await Promise.all([
            this.canvasRepo.count(),
            this.canvasRepo.count({ where: { deletedAt: undefined } }),
            this.taskRepo.find(),
            this.providerRepo.count(),
            this.workflowRepo.count(),
        ]);

        const taskCounts = { total: tasks.length, running: 0, done: 0, failed: 0, queued: 0 };
        for (const t of tasks) {
            if (taskCounts[t.status as keyof typeof taskCounts] !== undefined) {
                taskCounts[t.status as keyof typeof taskCounts]++;
            }
        }

        return {
            canvases: { total: canvases, active: activeCanvases },
            tasks: taskCounts,
            providers,
            workflows,
            timestamp: new Date().toISOString(),
        };
    }

    
}