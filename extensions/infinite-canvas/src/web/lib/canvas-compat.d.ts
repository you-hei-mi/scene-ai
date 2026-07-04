import type { InfiniteCanvas } from "../types/canvas";

export const CANVAS_NODE_TYPES: string[];
export function normalizeCanvasImport(input: unknown): Partial<InfiniteCanvas>;
export function createCanvasExport(canvas: InfiniteCanvas): {
    schema: "infinite-canvas";
    version: number;
    exportedAt: string;
    canvas: Pick<
        InfiniteCanvas,
        "id" | "title" | "kind" | "nodes" | "edges" | "viewport" | "settings"
    >;
};
