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
}
