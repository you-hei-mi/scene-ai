import { Box, Bot, Clapperboard, Image, MessageSquare, Play, Repeat, Send, Sparkles, Workflow } from "lucide-react";
import { type PointerEvent, useRef, useEffect } from "react";
import type { CanvasNode } from "../../types/canvas";

const iconMap: Record<string, any> = {
    image: Image,
    prompt: MessageSquare,
    generator: Sparkles,
    video: Clapperboard,
    loop: Repeat,
    llm: Bot,
    output: Send,
    comfy: Workflow,
    rh: Play,
    ltxDirector: Box,
};

export function NodeCard({
    node,
    selected,
    connectMode,
    connectingFrom,
    onPointerDown,
    onConnectStart,
    onConnectEnd,
    onDataChange,
    smartMode,
    groupColor,
}: {
    node: CanvasNode;
    selected: boolean;
    connectMode?: boolean;
    connectingFrom?: boolean;
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
    onConnectStart: (event: PointerEvent<HTMLButtonElement>) => void;
    onConnectEnd: () => void;
    onDataChange?: (key: string, value: unknown) => void;
    smartMode?: boolean;
    groupColor?: string;
}) {
    const Icon = iconMap[node.type] || Box;
    const nodeRef = useRef<HTMLDivElement>(null);
    const classes = [
        "ic-node",
        selected ? "is-selected" : "",
        connectMode ? "ic-port-highlight" : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            ref={nodeRef}
            data-node-id={node.id}
            style={{
                transform: `translate(${node.x}px, ${node.y}px)`,
                width: node.w,
                height: node.h,
                borderColor: smartMode && groupColor ? groupColor : undefined,
            }}
            onPointerDown={onPointerDown}
        >
            {/* Input Port */}
            <button
                className="ic-port ic-port-in"
                type="button"
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onConnectEnd();
                }}
                title="连接输入"
                aria-label="连接输入"
            />

            {/* Node Header */}
            <div className="ic-node-header">
                <span className="ic-node-icon">
                    <Icon size={16} />
                </span>
                <strong>{node.title}</strong>
                {node.status !== "idle" && (
                    <span className={`ic-node-status is-${node.status}`}>{node.status}</span>
                )}
            </div>

            {/* Node Body */}
            <div className="ic-node-body">
                {node.type === "image" && node.data.url ? (
                    <img
                        src={String(node.data.url)}
                        alt="preview"
                        style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12, background: "var(--soft)" }}
                    />
                ) : node.type === "image" && node.data.outputUrl ? (
                    <img
                        src={String(node.data.outputUrl)}
                        alt="output"
                        style={{ width: "100%", maxHeight: 260, objectFit: "contain", borderRadius: 12 }}
                    />
                ) : node.type === "video" && node.data.url ? (
                    <video
                        src={String(node.data.url)}
                        controls
                        style={{ width: "100%", maxHeight: 260, borderRadius: 12 }}
                    />
                ) : node.type === "prompt" ? (
                    <textarea
                        placeholder="输入提示词..."
                        defaultValue={String(node.data.prompt || "")}
                        onChange={(e) => onDataChange?.("prompt", e.target.value)}
                        rows={4}
                    />
                ) : node.type === "generator" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <select
                            defaultValue={String(node.data.model || "flux-schnell")}
                            onChange={(e) => onDataChange?.("model", e.target.value)}
                            style={{
                                width: "100%",
                                height: 32,
                                borderRadius: 8,
                                border: "1px solid var(--line)",
                                padding: "0 8px",
                                fontSize: 12,
                                background: "var(--card-solid)",
                            }}
                        >
                            <option value="flux-schnell">Flux Schnell</option>
                            <option value="flux-pro">Flux Pro</option>
                            <option value="sd3.5">SD 3.5</option>
                            <option value="dall-e-3">DALL-E 3</option>
                        </select>
                        <textarea
                            placeholder="输入提示词..."
                            defaultValue={String(node.data.prompt || "")}
                            onChange={(e) => onDataChange?.("prompt", e.target.value)}
                            rows={3}
                            style={{
                                width: "100%",
                                borderRadius: 8,
                                border: "1px solid var(--line)",
                                padding: 8,
                                fontSize: 12,
                                resize: "vertical",
                                background: "var(--soft)",
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => {}}
                            style={{
                                height: 34,
                                borderRadius: 999,
                                background: "var(--strong)",
                                color: "var(--strong-text)",
                                border: "none",
                                fontSize: 11,
                                fontWeight: 800,
                                cursor: "pointer",
                                letterSpacing: ".08em",
                            }}
                        >
                            生成
                        </button>
                    </div>
                ) : node.type === "llm" ? (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        <textarea
                            placeholder="输入提示词..."
                            defaultValue={String(node.data.prompt || "")}
                            onChange={(e) => onDataChange?.("prompt", e.target.value)}
                            rows={3}
                            style={{
                                width: "100%",
                                borderRadius: 8,
                                border: "1px solid var(--line)",
                                padding: 8,
                                fontSize: 12,
                                resize: "vertical",
                                background: "var(--soft)",
                            }}
                        />
                    </div>
                ) : (
                    <div className="ic-node-placeholder">
                        <span>{node.type === "loop" ? "循环" : node.type === "comfy" ? "ComfyUI" : node.type === "rh" ? "RunningHub" : node.type === "ltxDirector" ? "LTX Director" : node.type === "output" ? "输出" : node.title}</span>
                        <small>
                            {node.type === "loop" ? "设置循环次数并连接上游节点" :
                             node.type === "comfy" ? "选择 ComfyUI 工作流" :
                             node.type === "rh" ? "配置 RunningHub 工作流" :
                             node.type === "ltxDirector" ? "配置 LTX Director 时间线" :
                             node.type === "output" ? "连接上游生成器输出" :
                             "连接上游节点后可编排生成任务"}
                        </small>
                    </div>
                )}
            </div>

            {/* Output Port */}
            <button
                className="ic-port ic-port-out"
                type="button"
                onPointerDown={(e) => {
                    e.stopPropagation();
                    onConnectStart(e);
                }}
                title="连接输出"
                aria-label="连接输出"
            />
        </div>
    );
}

