import { Download, MousePointer2, Redo2, Save, Trash2, Undo2, Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type PointerEvent } from "react";

import { createCanvasExport, normalizeCanvasImport } from "../../lib/canvas-compat.js";
import { createNode, saveLocalCanvas } from "../../stores/local-canvas-store";
import type { CanvasEdge, CanvasNode, CanvasNodeType, InfiniteCanvas } from "../../types/canvas";
import { NodeCard } from "./node-card";

const nodeTypes: CanvasNodeType[] = [
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

function edgePath(from?: CanvasNode, to?: CanvasNode) {
    if (!from || !to) return "";
    const x1 = from.x + from.w;
    const y1 = from.y + from.h / 2;
    const x2 = to.x;
    const y2 = to.y + to.h / 2;
    const mid = Math.max(80, Math.abs(x2 - x1) / 2);
    return `M ${x1} ${y1} C ${x1 + mid} ${y1}, ${x2 - mid} ${y2}, ${x2} ${y2}`;
}

export function CanvasEditor({ initialCanvas }: { initialCanvas: InfiniteCanvas }) {
    const [canvas, setCanvas] = useState(initialCanvas);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [connectFrom, setConnectFrom] = useState<string | null>(null);
    const [undoStack, setUndoStack] = useState<InfiniteCanvas[]>([]);
    const [redoStack, setRedoStack] = useState<InfiniteCanvas[]>([]);
    const [saveState, setSaveState] = useState("已保存");
    const dragRef = useRef<{ id: string; startX: number; startY: number; nodeX: number; nodeY: number } | null>(null);
    const panRef = useRef<{ startX: number; startY: number; x: number; y: number } | null>(null);

    const nodeMap = useMemo(() => new Map(canvas.nodes.map((node) => [node.id, node])), [canvas.nodes]);

    function commit(next: InfiniteCanvas) {
        setUndoStack((stack) => [canvas, ...stack].slice(0, 50));
        setRedoStack([]);
        setCanvas(next);
        setSaveState("未保存");
    }

    function addNode(type: CanvasNodeType) {
        const nextNode = createNode(type, 80 - canvas.viewport.x, 80 - canvas.viewport.y);
        commit({ ...canvas, nodes: [...canvas.nodes, nextNode] });
        setSelectedIds(new Set([nextNode.id]));
    }

    function handleNodePointerDown(node: CanvasNode, event: PointerEvent<HTMLDivElement>) {
        event.stopPropagation();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragRef.current = { id: node.id, startX: event.clientX, startY: event.clientY, nodeX: node.x, nodeY: node.y };
        setSelectedIds((current) => {
            const next = new Set(event.shiftKey ? current : []);
            next.add(node.id);
            return next;
        });
    }

    function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
        if (dragRef.current) {
            const drag = dragRef.current;
            const dx = (event.clientX - drag.startX) / canvas.viewport.scale;
            const dy = (event.clientY - drag.startY) / canvas.viewport.scale;
            setCanvas((current) => ({
                ...current,
                nodes: current.nodes.map((node) =>
                    node.id === drag.id ? { ...node, x: drag.nodeX + dx, y: drag.nodeY + dy } : node,
                ),
            }));
            setSaveState("未保存");
            return;
        }
        if (panRef.current) {
            const pan = panRef.current;
            setCanvas((current) => ({
                ...current,
                viewport: {
                    ...current.viewport,
                    x: pan.x + event.clientX - pan.startX,
                    y: pan.y + event.clientY - pan.startY,
                },
            }));
            setSaveState("未保存");
        }
    }

    function handlePointerUp() {
        if (dragRef.current || panRef.current) {
            setCanvas((current) => saveLocalCanvas(current));
            setSaveState("已保存");
        }
        dragRef.current = null;
        panRef.current = null;
    }

    function connectNode(targetId: string) {
        if (!connectFrom || connectFrom === targetId) {
            setConnectFrom(targetId);
            return;
        }
        const edge: CanvasEdge = {
            id: `e_${Date.now()}`,
            from: { node: connectFrom, port: "out" },
            to: { node: targetId, port: "in" },
        };
        commit({ ...canvas, edges: [...canvas.edges, edge] });
        setConnectFrom(null);
    }

    function saveCanvas() {
        setCanvas(saveLocalCanvas(canvas));
        setSaveState("已保存");
    }

    function undo() {
        const [previous, ...rest] = undoStack;
        if (!previous) return;
        setRedoStack((stack) => [canvas, ...stack]);
        setUndoStack(rest);
        setCanvas(previous);
        setSaveState("未保存");
    }

    function redo() {
        const [next, ...rest] = redoStack;
        if (!next) return;
        setUndoStack((stack) => [canvas, ...stack]);
        setRedoStack(rest);
        setCanvas(next);
        setSaveState("未保存");
    }

    function removeSelected() {
        if (selectedIds.size === 0) return;
        commit({
            ...canvas,
            nodes: canvas.nodes.filter((node) => !selectedIds.has(node.id)),
            edges: canvas.edges.filter((edge) => !selectedIds.has(edge.from.node) && !selectedIds.has(edge.to.node)),
        });
        setSelectedIds(new Set());
    }

    function exportCanvas() {
        const blob = new Blob([JSON.stringify(createCanvasExport(canvas), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `${canvas.title || "canvas"}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }

    function importCanvas(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const parsed = normalizeCanvasImport(JSON.parse(String(reader.result)));
            commit({ ...canvas, ...parsed, id: canvas.id, updatedAt: new Date().toISOString() } as InfiniteCanvas);
        };
        reader.readAsText(file);
    }

    useEffect(() => {
        const timer = window.setInterval(() => {
            setCanvas((current) => {
                const saved = saveLocalCanvas(current);
                return saved;
            });
            setSaveState("自动保存");
        }, 5000);
        return () => window.clearInterval(timer);
    }, []);

    return (
        <div className="ic-editor">
            <div className="ic-topbar">
                <div>
                    <strong>{canvas.title}</strong>
                    <span>{canvas.kind === "smart" ? "智能画布" : "经典画布"} / {saveState}</span>
                </div>
                <div className="ic-actions">
                    <button type="button" onClick={undo} title="撤销"><Undo2 size={16} /></button>
                    <button type="button" onClick={redo} title="重做"><Redo2 size={16} /></button>
                    <button type="button" onClick={saveCanvas} title="保存"><Save size={16} /></button>
                    <button type="button" onClick={removeSelected} title="删除"><Trash2 size={16} /></button>
                    <button type="button" onClick={exportCanvas} title="导出"><Download size={16} /></button>
                    <label className="ic-icon-button" title="导入">
                        <Upload size={16} />
                        <input type="file" accept="application/json" onChange={importCanvas} />
                    </label>
                </div>
            </div>
            <div className="ic-toolbar">
                <span><MousePointer2 size={15} /> 节点</span>
                {nodeTypes.map((type) => (
                    <button key={type} type="button" onClick={() => addNode(type)}>{type}</button>
                ))}
            </div>
            <div
                className="ic-board"
                onPointerDown={(event) => {
                    setSelectedIds(new Set());
                    panRef.current = { startX: event.clientX, startY: event.clientY, x: canvas.viewport.x, y: canvas.viewport.y };
                }}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onWheel={(event) => {
                    event.preventDefault();
                    const scale = Math.min(3, Math.max(0.25, canvas.viewport.scale + (event.deltaY > 0 ? -0.05 : 0.05)));
                    setCanvas((current) => ({ ...current, viewport: { ...current.viewport, scale } }));
                    setSaveState("未保存");
                }}
            >
                <div
                    className="ic-stage"
                    style={{
                        transform: `translate(${canvas.viewport.x}px, ${canvas.viewport.y}px) scale(${canvas.viewport.scale})`,
                    }}
                >
                    <svg className="ic-edges">
                        {canvas.edges.map((edge) => (
                            <path key={edge.id} d={edgePath(nodeMap.get(edge.from.node), nodeMap.get(edge.to.node))} />
                        ))}
                    </svg>
                    {canvas.nodes.map((node) => (
                        <NodeCard
                            key={node.id}
                            node={node}
                            selected={selectedIds.has(node.id) || connectFrom === node.id}
                            onConnect={() => connectNode(node.id)}
                            onPointerDown={(event) => handleNodePointerDown(node, event)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
