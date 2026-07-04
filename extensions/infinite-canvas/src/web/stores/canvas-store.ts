import { studioApi } from "../services/studio";
import type { CanvasKind, InfiniteCanvas } from "../types/canvas";
import {
    listLocalCanvases,
    createLocalCanvas,
    getLocalCanvas,
    saveLocalCanvas,
    trashLocalCanvas,
    restoreLocalCanvas,
    importLocalCanvas,
    createNode,
} from "./local-canvas-store";

// 优先尝试 API，后端不可用时降级到 localStorage

export async function listCanvasesApi(includeDeleted = false): Promise<InfiniteCanvas[]> {
    try {
        const result = await studioApi.listCanvases(includeDeleted);
        return result as unknown as InfiniteCanvas[];
    } catch {
        return listLocalCanvases(includeDeleted);
    }
}

export async function createCanvasApi(kind: CanvasKind = "classic", title = "未命名画布"): Promise<InfiniteCanvas> {
    try {
        const canvas = await studioApi.createCanvas({ kind, title, nodes: [], edges: [], viewport: { x: 0, y: 0, scale: 1 }, settings: {} });
        return canvas as unknown as InfiniteCanvas;
    } catch {
        return createLocalCanvas(kind, title);
    }
}

export async function getCanvasApi(id: string): Promise<InfiniteCanvas | undefined> {
    try {
        const canvas = await studioApi.getCanvas(id);
        return canvas as unknown as InfiniteCanvas;
    } catch {
        return getLocalCanvas(id);
    }
}

export async function saveCanvasApi(canvas: InfiniteCanvas): Promise<InfiniteCanvas> {
    try {
        const result = await studioApi.saveCanvas(canvas.id, canvas);
        return result as unknown as InfiniteCanvas;
    } catch {
        return saveLocalCanvas(canvas);
    }
}

export async function trashCanvasApi(id: string): Promise<void> {
    try {
        await studioApi.deleteCanvas(id);
    } catch {
        trashLocalCanvas(id);
    }
}

export async function restoreCanvasApi(id: string): Promise<void> {
    try {
        await studioApi.restoreCanvas(id);
    } catch {
        restoreLocalCanvas(id);
    }
}

export async function importCanvasApi(payload: Partial<InfiniteCanvas>): Promise<InfiniteCanvas> {
    try {
        const result = await studioApi.importCanvas(payload);
        return result as unknown as InfiniteCanvas;
    } catch {
        return importLocalCanvas(payload);
    }
}

export { createNode, getLocalCanvas, saveLocalCanvas };
