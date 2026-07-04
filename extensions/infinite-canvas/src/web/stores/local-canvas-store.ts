import type { CanvasKind, CanvasNodeType, InfiniteCanvas } from "../types/canvas";

const STORAGE_KEY = "infinite_canvas_v1";

function nowIso() {
    return new Date().toISOString();
}

function readStore(): InfiniteCanvas[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function writeStore(canvases: InfiniteCanvas[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(canvases));
}

export function listLocalCanvases(includeDeleted = false) {
    return readStore()
        .filter((canvas) => includeDeleted || !canvas.deletedAt)
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createLocalCanvas(kind: CanvasKind = "classic", title = "未命名画布") {
    const canvas: InfiniteCanvas = {
        id: `canvas_${Date.now()}`,
        title,
        kind,
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, scale: 1 },
        settings: {},
        updatedAt: nowIso(),
    };
    writeStore([canvas, ...readStore()]);
    return canvas;
}

export function getLocalCanvas(id: string) {
    return readStore().find((canvas) => canvas.id === id);
}

export function saveLocalCanvas(canvas: InfiniteCanvas) {
    const next = readStore().filter((item) => item.id !== canvas.id);
    const saved = { ...canvas, updatedAt: nowIso() };
    writeStore([saved, ...next]);
    return saved;
}

export function trashLocalCanvas(id: string) {
    const next = readStore().map((canvas) =>
        canvas.id === id ? { ...canvas, deletedAt: nowIso(), updatedAt: nowIso() } : canvas,
    );
    writeStore(next);
}

export function restoreLocalCanvas(id: string) {
    const next = readStore().map((canvas) => {
        if (canvas.id !== id) return canvas;
        const { deletedAt: _deletedAt, ...rest } = canvas;
        return { ...rest, updatedAt: nowIso() };
    });
    writeStore(next);
}

export function importLocalCanvas(payload: Partial<InfiniteCanvas>) {
    const imported: InfiniteCanvas = {
        id: `canvas_${Date.now()}`,
        title: payload.title || "导入画布",
        kind: payload.kind || "classic",
        nodes: payload.nodes || [],
        edges: payload.edges || [],
        viewport: payload.viewport || { x: 0, y: 0, scale: 1 },
        settings: payload.settings || {},
        updatedAt: nowIso(),
    };
    writeStore([imported, ...readStore()]);
    return imported;
}

export function createNode(type: CanvasNodeType, x: number, y: number) {
    const titleMap: Record<CanvasNodeType, string> = {
        image: "图片",
        prompt: "提示词",
        generator: "图片生成",
        video: "视频生成",
        loop: "循环",
        llm: "LLM",
        output: "输出",
        comfy: "ComfyUI",
        rh: "RunningHub",
        ltxDirector: "LTX Director",
    };

    return {
        id: `n_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        type,
        x,
        y,
        w: 320,
        h: 220,
        title: titleMap[type],
        data: {},
        status: "idle" as const,
        outputs: [],
    };
}
