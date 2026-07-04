const DEFAULT_VIEWPORT = { x: 0, y: 0, scale: 1 };
const DEFAULT_NODE_SIZE = { w: 320, h: 220 };

function cloneJson(value, fallback) {
    if (value === undefined || value === null) return fallback;
    return JSON.parse(JSON.stringify(value));
}

function normalizeViewport(viewport) {
    return {
        x: Number.isFinite(Number(viewport?.x)) ? Number(viewport.x) : DEFAULT_VIEWPORT.x,
        y: Number.isFinite(Number(viewport?.y)) ? Number(viewport.y) : DEFAULT_VIEWPORT.y,
        scale: Number.isFinite(Number(viewport?.scale))
            ? Math.min(3, Math.max(0.25, Number(viewport.scale)))
            : DEFAULT_VIEWPORT.scale,
    };
}

function normalizeNode(node, index = 0) {
    const type = typeof node?.type === "string" ? node.type : "prompt";
    return {
        id: String(node?.id || `n_${Date.now()}_${index}`),
        type,
        x: Number.isFinite(Number(node?.x)) ? Number(node.x) : index * 360,
        y: Number.isFinite(Number(node?.y)) ? Number(node.y) : index * 80,
        w: Number.isFinite(Number(node?.w)) ? Number(node.w) : DEFAULT_NODE_SIZE.w,
        h: Number.isFinite(Number(node?.h)) ? Number(node.h) : DEFAULT_NODE_SIZE.h,
        title: String(node?.title || type),
        data: cloneJson(node?.data, {}),
        status: node?.status || "idle",
        outputs: Array.isArray(node?.outputs) ? cloneJson(node.outputs, []) : [],
        error: node?.error || "",
    };
}

function normalizeEdge(edge, index = 0) {
    return {
        id: String(edge?.id || `e_${Date.now()}_${index}`),
        from: {
            node: String(edge?.from?.node || edge?.source || ""),
            port: String(edge?.from?.port || "out"),
        },
        to: {
            node: String(edge?.to?.node || edge?.target || ""),
            port: String(edge?.to?.port || "in"),
        },
    };
}

export function normalizeCanvasImport(input) {
    const raw = input?.canvas || input || {};
    return {
        id: raw.id ? String(raw.id) : undefined,
        title: String(raw.title || raw.name || "未命名画布"),
        kind: raw.kind === "smart" ? "smart" : "classic",
        nodes: Array.isArray(raw.nodes) ? raw.nodes.map(normalizeNode) : [],
        edges: Array.isArray(raw.edges) ? raw.edges.map(normalizeEdge) : [],
        viewport: normalizeViewport(raw.viewport),
        settings: cloneJson(raw.settings, {}),
    };
}

export function createCanvasExport(canvas) {
    const normalized = normalizeCanvasImport(canvas);
    return {
        schema: "infinite-canvas",
        version: 1,
        exportedAt: new Date().toISOString(),
        canvas: {
            id: canvas.id,
            title: normalized.title,
            kind: normalized.kind,
            nodes: normalized.nodes,
            edges: normalized.edges,
            viewport: normalized.viewport,
            settings: normalized.settings,
        },
    };
}

export const CANVAS_NODE_TYPES = [
    "image",
    "prompt",
    "generator",
    "video",
    "loop",
    "llm",
    "output",
    "comfy",
    "rh",
    "ltxDirector",
];
