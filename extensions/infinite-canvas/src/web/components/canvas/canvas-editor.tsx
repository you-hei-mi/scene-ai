import { ArrowLeft, Box, Bot, Clapperboard, Download, Image, MessageSquare, Play, Redo2, Repeat, Save, Send, Sparkles, Trash2, Undo2, Upload, Workflow, PanelRight, Settings2, MousePointer2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import { createCanvasExport, normalizeCanvasImport } from "../../lib/canvas-compat.js";
import { createNode, saveLocalCanvas } from "../../stores/local-canvas-store";
import { saveCanvasApi } from "../../stores/canvas-store";
import type { CanvasEdge, CanvasNode, CanvasNodeType, InfiniteCanvas } from "../../types/canvas";
import { NodeCard } from "./node-card";

const nodeTypes: CanvasNodeType[] = [
    "image", "prompt", "generator", "video", "loop", "llm", "output", "comfy", "rh", "ltxDirector",
];

const nodeIcons: Record<string, any> = {
    image: Image, prompt: MessageSquare, generator: Sparkles, video: Clapperboard,
    loop: Repeat, llm: Bot, output: Send, comfy: Workflow, rh: Play, ltxDirector: Box,
};

const nodeLabels: Record<string, string> = {
    image: "图片", prompt: "提示词", generator: "生成器", video: "视频生成",
    loop: "循环", llm: "LLM", output: "输出", comfy: "ComfyUI", rh: "RunningHub", ltxDirector: "LTX Director",
};

interface Point { x: number; y: number; }

function bezierPath(x1: number, y1: number, x2: number, y2: number): string {
    const dx = Math.max(80, Math.abs(x2 - x1) * 0.45);
    return "M " + x1 + " " + y1 + " C " + (x1 + dx) + " " + y1 + ", " + (x2 - dx) + " " + y2 + ", " + x2 + " " + y2;
}

function screenToWorld(cx: number, cy: number, r: DOMRect, vp: { x: number; y: number; scale: number }) {
    return { x: (cx - r.left - vp.x) / vp.scale, y: (cy - r.top - vp.y) / vp.scale };
}

function portPos(node: CanvasNode, kind: "in" | "out"): Point {
    return kind === "out"
        ? { x: node.x + node.w, y: node.y + node.h / 2 }
        : { x: node.x, y: node.y + node.h / 2 };
}

function nearestPort(cx: number, cy: number, kind: string, board: HTMLElement): HTMLElement | null {
    const direct = document.elementFromPoint(cx, cy)?.closest(".ic-port-" + kind) as HTMLElement | null;
    if (direct) return direct;
    let best: HTMLElement | null = null;
    let bestD = Infinity;
    board.querySelectorAll(".ic-port-" + kind).forEach((p) => {
        const r = p.getBoundingClientRect();
        const d = Math.hypot(cx - (r.left + r.width / 2), cy - (r.top + r.height / 2));
        if (d < bestD) { bestD = d; best = p as HTMLElement; }
    });
    return bestD <= 48 ? best : null;
}

const CANVAS_GEN = ["generator", "msgen", "comfy", "ltxDirector", "video", "rh"];
const CANVAS_MEDIA = ["generator", "msgen", "comfy", "ltxDirector", "video", "rh"];

function canConnect(from: CanvasNode | undefined, to: CanvasNode | undefined): boolean {
    if (!from || !to || from.id === to.id) return false;
    if (CANVAS_GEN.includes(from.type)) {
        if (to.type === "output") return true;
        if (CANVAS_MEDIA.includes(from.type) && CANVAS_GEN.includes(to.type)) return true;
        return false;
    }
    if (to.type === "loop") {
        const allowImg = ["image", "group", "output"].includes(from.type);
        const allowPrompt = ["prompt", "promptGroup", "loop", "llm"].includes(from.type);
        return allowImg || allowPrompt;
    }
    if (to.type === "llm") return ["prompt", "loop", "promptGroup", "llm", "image", "group", "output"].includes(from.type);
    if (from.type === "llm") return CANVAS_GEN.includes(to.type);
    return CANVAS_GEN.includes(to.type) && ["image", "prompt", "loop", "group", "promptGroup", "output", "llm"].includes(from.type);
}

interface NodeGroup { id: string; name: string; color: string; nodeIds: string[]; order: number; }

export function CanvasEditor({ initialCanvas, smartMode, groups }: { initialCanvas: InfiniteCanvas; smartMode?: boolean; groups?: NodeGroup[] }) {
    const [canvas, setCanvas] = useState(initialCanvas);

    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [activeNodeType, setActiveNodeType] = useState<CanvasNodeType | null>(null);
    const [undoStack, setUndoStack] = useState<InfiniteCanvas[]>([]);
    const [redoStack, setRedoStack] = useState<InfiniteCanvas[]>([]);
    const [saveState, setSaveState] = useState("已保存");
    const [showPanel, setShowPanel] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);
    const [connectFrom, setConnectFrom] = useState<string | null>(null);

    const boardRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef(initialCanvas);
    const dragRef = useRef<{ id: string; sx: number; sy: number; nx: number; ny: number } | null>(null);
    const panRef = useRef<{ sx: number; sy: number; x: number; y: number } | null>(null);
    const connDragRef = useRef<{ fromId: string; sx: number; sy: number; cx: number; cy: number } | null>(null);

    useEffect(() => { canvasRef.current = canvas; }, [canvas]);
    const nodeMap = useMemo(() => new Map(canvas.nodes.map((n) => [n.id, n])), [canvas.nodes]);
    const selectedNode = selectedIds.size === 1 ? nodeMap.get([...selectedIds][0]) : null;

    function commit(next: InfiniteCanvas) {
        setUndoStack((s) => [canvas, ...s].slice(0, 50));
        setRedoStack([]);
        setCanvas(next);
        setSaveState("未保存");
    }

    function addNode(type: CanvasNodeType) {
        var cur = canvasRef.current;
        if (!cur) return;
        var n = createNode(type, 60 - cur.viewport.x, 60 - cur.viewport.y);
        var next = {...cur, nodes: [...cur.nodes, n]};
        canvasRef.current = next;
        setCanvas(next);
        setSelectedIds(new Set([n.id]));
        setActiveNodeType(type);
        setSaveState('未保存');
    }
    function handleConnectStart(nodeId: string, e: PointerEvent<HTMLButtonElement>) {
        e.preventDefault();
        e.stopPropagation();
        const board = boardRef.current;
        if (!board) return;
        const r = board.getBoundingClientRect();
        connDragRef.current = { fromId: nodeId, sx: e.clientX, sy: e.clientY, cx: e.clientX - r.left, cy: e.clientY - r.top };
        const svg = board.querySelector(".ic-edges") as SVGSVGElement;
        if (svg) {
            const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
            el.setAttribute("class", "link temp");
            el.setAttribute("d", "");
            svg.appendChild(el);
            (window as any).__tempLinkEl = el;
        }
    }

    function handleConnectEnd(targetId: string) {
        const drag = connDragRef.current;
        if (!drag) return;
        const from = nodeMap.get(drag.fromId);
        const to = nodeMap.get(targetId);
        if (from && to && canConnect(from, to) && !canvas.edges.some((e) => e.from.node === drag.fromId && e.to.node === targetId)) {
            const edge: CanvasEdge = { id: "e_" + Date.now(), from: { node: drag.fromId, port: "out" }, to: { node: targetId, port: "in" } };
            commit({ ...canvas, edges: [...canvas.edges, edge] });
        }
        connDragRef.current = null;
        const el = (window as any).__tempLinkEl;
        if (el) { el.remove(); (window as any).__tempLinkEl = null; }
    }

    function deleteEdge(edgeId: string) {
        commit({ ...canvas, edges: canvas.edges.filter((e) => e.id !== edgeId) });
    }

    function handleNodePointerDown(node: CanvasNode, e: PointerEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragRef.current = { id: node.id, sx: e.clientX, sy: e.clientY, nx: node.x, ny: node.y };
        document.body.classList.add("canvas-node-drag");
        setSelectedIds((cur) => {
            const next = new Set(e.shiftKey ? cur : []);
            next.add(node.id);
            return next;
        });
    }

    function handlePointerMove(e: PointerEvent<HTMLDivElement>) {
        const board = boardRef.current;
        if (!board) return;

        // Connection drag
        const conn = connDragRef.current;
        if (conn) {
            const fromNode = nodeMap.get(conn.fromId);
            if (fromNode) {
                conn.cx = e.clientX;
                conn.cy = e.clientY;
                const r = board.getBoundingClientRect();
                const wEnd = screenToWorld(e.clientX, e.clientY, r, canvas.viewport);
                const start = portPos(fromNode, "out");
                const d = "M " + start.x + " " + start.y + " C " + (start.x + 80) + " " + start.y + ", " + (wEnd.x - 80) + " " + wEnd.y + ", " + wEnd.x + " " + wEnd.y;
                const el = (window as any).__tempLinkEl;
                if (el) el.setAttribute("d", d);
            }
            return;
        }

        // Node drag
        if (dragRef.current) {
            const d = dragRef.current;
            const dx = (e.clientX - d.sx) / canvas.viewport.scale;
            const dy = (e.clientY - d.sy) / canvas.viewport.scale;
            setCanvas((cur) => ({ ...cur, nodes: cur.nodes.map((n) => n.id === d.id ? { ...n, x: d.nx + dx, y: d.ny + dy } : n) }));
            setSaveState("未保存");
            return;
        }

        // Pan
        if (panRef.current) {
            const p = panRef.current;
            setCanvas((cur) => ({ ...cur, viewport: { ...cur.viewport, x: p.x + e.clientX - p.sx, y: p.y + e.clientY - p.sy } }));
            setSaveState("未保存");
            return;
        }
    }

    function handlePointerUp(e: PointerEvent<HTMLDivElement>) {
        if (connDragRef.current) {
            const board = boardRef.current;
            if (board) {
                const tp = nearestPort(e.clientX, e.clientY, "in", board);
                if (tp) {
                    const nodeEl = tp.closest(".ic-node") as HTMLElement;
                    const nid = nodeEl?.dataset?.nodeId;
                    if (nid) handleConnectEnd(nid);
                }
            }
            connDragRef.current = null;
            const el = (window as any).__tempLinkEl;
            if (el) { el.remove(); (window as any).__tempLinkEl = null; }
            return;
        }

        if (dragRef.current || panRef.current) {
            setCanvas((cur) => { const s = saveLocalCanvas(cur); saveCanvasApi(s).catch(() => {}); return s; });
            setSaveState("已保存");
        }
        document.body.classList.remove("canvas-node-drag");
        dragRef.current = null;
        panRef.current = null;
    }

    function handleBoardPointerDown(e: PointerEvent<HTMLDivElement>) {
        const t = e.target as HTMLElement;
        if (t === boardRef.current || t.closest(".ic-board")) {
            setSelectedIds(new Set());
            panRef.current = { sx: e.clientX, sy: e.clientY, x: canvas.viewport.x, y: canvas.viewport.y };
        }
    }

    function handleWheel(e: { deltaY: number; preventDefault: () => void }) {
        e.preventDefault();
        const scale = Math.min(3, Math.max(0.25, canvas.viewport.scale + (e.deltaY > 0 ? -0.1 : 0.1)));
        setCanvas((cur) => ({ ...cur, viewport: { ...cur.viewport, scale } }));
        setSaveState("未保存");
    }

    function saveCanvas() {
        const s = saveLocalCanvas(canvas);
        setCanvas(s);
        setSaveState("已保存");
        saveCanvasApi(s).catch(() => {});
    }

    function undo() {
        const [prev, ...rest] = undoStack;
        if (!prev) return;
        setRedoStack((s) => [canvas, ...s]);
        setUndoStack(rest);
        setCanvas(prev);
        setSaveState("未保存");
    }

    function redo() {
        const [next, ...rest] = redoStack;
        if (!next) return;
        setUndoStack((s) => [canvas, ...s]);
        setRedoStack(rest);
        setCanvas(next);
        setSaveState("未保存");
    }

    function removeSelected() {
        if (selectedIds.size === 0) return;
        commit({ ...canvas, nodes: canvas.nodes.filter((n) => !selectedIds.has(n.id)), edges: canvas.edges.filter((e) => !selectedIds.has(e.from.node) && !selectedIds.has(e.to.node)) });
        setSelectedIds(new Set());
    }

    function exportCanvas() {
        const b = new Blob([JSON.stringify(createCanvasExport(canvas), null, 2)], { type: "application/json" });
        const u = URL.createObjectURL(b);
        const a = document.createElement("a");
        a.href = u; a.download = (canvas.title || "canvas") + ".json";
        a.click();
        URL.revokeObjectURL(u);
    }

    function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (!f) return;
        const r = new FileReader();
        r.onload = () => {
            try { commit({ ...canvas, ...normalizeCanvasImport(JSON.parse(String(r.result))), id: canvas.id, updatedAt: new Date().toISOString() } as InfiniteCanvas); }
            catch (ex) { console.error("Import failed:", ex); }
        };
        r.readAsText(f);
    }

    useEffect(() => {
        const t = window.setInterval(() => { setCanvas((cur) => { saveLocalCanvas(cur); return cur; }); setSaveState("自动保存"); }, 5000);
        return () => window.clearInterval(t);
    }, []);
    const edgeData = useMemo(() => {
        return canvas.edges.map((edge) => {
            const f = nodeMap.get(edge.from.node);
            const t = nodeMap.get(edge.to.node);
            if (!f || !t) return null;
            const a = portPos(f, "out"), b = portPos(t, "in");
            const d = bezierPath(a.x, a.y, b.x, b.y);
            const sel = selectedIds.has(f.id) || selectedIds.has(t.id);
            const hov = hoveredEdge === edge.id;
            return { edge, d, sel, hov };
        }).filter(Boolean) as Array<{ edge: CanvasEdge; d: string; sel: boolean; hov: boolean }>;
    }, [canvas.edges, nodeMap, selectedIds, hoveredEdge]);

    const tempLinkPath = useMemo(() => {
        const conn = connDragRef.current;
        if (!conn) return null;
        const f = nodeMap.get(conn.fromId);
        const board = boardRef.current;
        if (!f || !board) return null;
        const r = board.getBoundingClientRect();
        const we = screenToWorld(conn.cx + r.left, conn.cy + r.top, r, canvas.viewport);
        const s = portPos(f, "out");
        return bezierPath(s.x, s.y, we.x, we.y);
    }, [connDragRef.current?.cx, connDragRef.current?.cy, nodeMap]);

    return (
        <div className="ic-editor">
            <div className="ic-topbar">
                <div className="ic-topbar-left">
                    <a href="/extension/infinite-canvas/canvas-list" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, borderRadius: 12, border: "1px solid var(--line)", background: "var(--card-solid)", color: "var(--muted)", cursor: "pointer", textDecoration: "none", flex: "0 0 auto" }}>
                        <ArrowLeft size={16} />
                    </a>
                    <div className="ic-topbar-title">
                        <strong>{canvas.title}</strong>
                        <span>{canvas.kind === "smart" ? "智能画布" : "经典画布"} / {saveState}</span>
                    </div>
                </div>
                <div className="ic-actions">
                    <button type="button" onClick={() => setShowPanel((p) => !p)} title="参数面板" className={"tool-btn" + (showPanel ? " is-active" : "")}>
                        <PanelRight size={16} />
                    </button>
                    <button type="button" onClick={undo} title="撤销" className="tool-btn"><Undo2 size={16} /><span>撤销</span></button>
                    <button type="button" onClick={redo} title="重做" className="tool-btn"><Redo2 size={16} /><span>重做</span></button>
                    <button type="button" onClick={saveCanvas} title="保存" className="tool-btn is-active"><Save size={16} /><span>保存</span></button>
                    <button type="button" onClick={removeSelected} title="删除" className="tool-btn"><Trash2 size={16} /></button>
                    <button type="button" onClick={exportCanvas} title="导出" className="tool-btn"><Download size={16} /><span>导出</span></button>
                    <label className="tool-btn" title="导入" style={{ cursor: "pointer" }}>
                        <Upload size={16} /><span>导入</span>
                        <input type="file" accept="application/json" onChange={handleImport} style={{ display: "none" }} />
                    </label>
                </div>
            </div>

            <div className="ic-left-toolbar">
                {nodeTypes.map((type) => {
                    const Icon = nodeIcons[type];
                    return (
                        <button key={type} type="button" onClick={() => addNode(type)} className={activeNodeType === type ? "is-active" : ""} title={nodeLabels[type]}>
                            <Icon size={18} />
                            <span>{nodeLabels[type].slice(0, 4)}</span>
                        </button>
                    );
                })}
            </div>

            <div className="ic-board" ref={boardRef}
                onPointerDown={handleBoardPointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onWheel={handleWheel}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragActive(false); }}
                onDrop={(e) => {
                    e.preventDefault(); setDragActive(false);
                    const f = e.dataTransfer.files?.[0];
                    if (f?.type.startsWith("image/")) {
                        const pt = screenToWorld(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect(), canvas.viewport);
                        const img = createNode("image", pt.x - 130, pt.y - 50);
                        commit({ ...canvas, nodes: [...canvas.nodes, { ...img, data: { ...img.data, url: URL.createObjectURL(f) } }] });
                    }
                }}
            >
                <div className="ic-stage" style={{ transform: "translate(" + canvas.viewport.x + "px, " + canvas.viewport.y + "px) scale(" + canvas.viewport.scale + ")" }}>
                    <svg className="ic-edges">
                        {edgeData.map((ed) => (
                            <path key={"hit-" + ed.edge.id} d={ed.d} className="link-hit" data-edge-id={ed.edge.id}
                                onClick={(e) => { e.stopPropagation(); deleteEdge(ed.edge.id); }}
                                onMouseEnter={() => setHoveredEdge(ed.edge.id)}
                                onMouseLeave={() => setHoveredEdge(null)}
                            />
                        ))}
                        {edgeData.map((ed) => (
                            <path key={ed.edge.id} d={ed.d} className={"link" + (ed.sel || ed.hov ? " link-active" : "")} data-edge-id={ed.edge.id} />
                        ))}
                        {edgeData.filter((ed) => ed.hov).map((ed) => (
                            <foreignObject key={"del-" + ed.edge.id} x={(ed.edge.from.node + ed.edge.to.node).length * 0} y={0} width={1} height={1} style={{ overflow: "visible" }}>
                                <button className={"link-delete visible" + (ed.hov ? " hover" : "")} onClick={(e) => { e.stopPropagation(); deleteEdge(ed.edge.id); }} style={{ position: "absolute" }}>
                                    ×
                                </button>
                            </foreignObject>
                        ))}
                    </svg>

                    {canvas.nodes.map((node) => (
                        <NodeCard
                            key={node.id}
                            node={node}
                            selected={selectedIds.has(node.id)}
                            connectMode={connDragRef.current !== null}
                            connectingFrom={connDragRef.current?.fromId === node.id}
                            onPointerDown={(e) => handleNodePointerDown(node, e)}
                            onConnectStart={(e) => handleConnectStart(node.id, e)}
                            onConnectEnd={() => handleConnectEnd(node.id)}
                            onDataChange={(key, value) => {
                                setCanvas((cur) => ({ ...cur, nodes: cur.nodes.map((n) => n.id === node.id ? { ...n, data: { ...n.data, [key]: value } } : n) }));
                                setSaveState("未保存");
                            }}
                            smartMode={smartMode}
                            groupColor={smartMode && groups ? groups.find((g: any) => g.nodeIds.includes(node.id))?.color : undefined}
                        />
                    ))}
                </div>

                <div className={"ic-drop-overlay" + (dragActive ? " active" : "")}>
                    <span>拖放图片到画布</span>
                </div>

                <div className="ic-minimap">
                    <div className="ic-minimap-content">
                        {canvas.nodes.length === 0 && <div className="ic-minimap-empty">空画布</div>}
                        {canvas.nodes.map((node) => (
                            <div key={"mm-" + node.id} className={"ic-minimap-node" + (selectedIds.has(node.id) ? " selected" : "")}
                                style={{ left: Math.max(0, Math.min(node.x / 30, 168)) + "px", top: Math.max(0, Math.min(node.y / 30, 100)) + "px", width: Math.max(2, Math.min(node.w / 30, 168)) + "px", height: Math.max(2, Math.min(node.h / 30, 100)) + "px" }}
                            />
                        ))}
                        <div className="ic-minimap-viewport"
                            style={{ left: Math.abs(canvas.viewport.x) / 30 + "px", top: Math.abs(canvas.viewport.y) / 30 + "px", width: Math.min(window.innerWidth / 30, 168) + "px", height: Math.min(window.innerHeight / 30, 100) + "px" }}
                        />
                    </div>
                </div>
            </div>

            {selectedNode && showPanel && (
                <div style={{ position: "absolute", right: 12, top: 76, width: 280, background: "var(--panel)", border: "1px solid var(--line)", borderRadius: 16, padding: 14, boxShadow: "0 10px 28px rgb(15 23 42 / 12%)", zIndex: 100, maxHeight: "calc(100vh - 100px)", overflow: "auto", backdropFilter: "blur(16px)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                        <strong style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}><Settings2 size={15} /> {selectedNode.title}</strong>
                        <button onClick={() => setSelectedIds(new Set())} style={{ border: 0, background: "none", cursor: "pointer", color: "var(--muted)", fontSize: 16, lineHeight: 1 }}>×</button>
                    </div>
                    <div style={{ display: "grid", gap: 10 }}>
                        <div><label style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>类型</label><div style={{ fontSize: 12, fontWeight: 600 }}>{selectedNode.type}</div></div>
                    </div>
                </div>
            )}
        </div>
    );
}
