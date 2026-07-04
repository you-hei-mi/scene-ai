export type CanvasKind = "classic" | "smart";

export type CanvasNodeType =
    | "image"
    | "prompt"
    | "generator"
    | "video"
    | "loop"
    | "llm"
    | "output"
    | "comfy"
    | "rh"
    | "ltxDirector";

export type CanvasNodeStatus = "idle" | "running" | "done" | "failed";

export interface CanvasNode {
    id: string;
    type: CanvasNodeType;
    x: number;
    y: number;
    w: number;
    h: number;
    title: string;
    data: Record<string, unknown>;
    status: CanvasNodeStatus;
    outputs: string[];
    error?: string;
}

export interface CanvasEdge {
    id: string;
    from: { node: string; port: string };
    to: { node: string; port: string };
}

export interface CanvasViewport {
    x: number;
    y: number;
    scale: number;
}

export interface InfiniteCanvas {
    id: string;
    title: string;
    kind: CanvasKind;
    nodes: CanvasNode[];
    edges: CanvasEdge[];
    viewport: CanvasViewport;
    settings: Record<string, unknown>;
    updatedAt: string;
    deletedAt?: string;
}

export interface AssetItem {
    id: string;
    name: string;
    kind: "image" | "video" | "audio" | "workflow";
    url?: string;
    tags: string[];
}

export interface PromptItem {
    id: string;
    title: string;
    prompt: string;
    negativePrompt?: string;
    tags: string[];
}
