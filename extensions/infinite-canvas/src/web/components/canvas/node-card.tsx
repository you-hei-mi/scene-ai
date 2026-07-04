import { Box, Bot, Clapperboard, Image, MessageSquare, Play, Repeat, Send, Sparkles, Workflow } from "lucide-react";
import type { PointerEvent } from "react";

import type { CanvasNode } from "../../types/canvas";

const iconMap = {
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
    onPointerDown,
    onConnect,
}: {
    node: CanvasNode;
    selected: boolean;
    onPointerDown: (event: PointerEvent<HTMLDivElement>) => void;
    onConnect: () => void;
}) {
    const Icon = iconMap[node.type] || Box;

    return (
        <div
            className={`ic-node ${selected ? "is-selected" : ""}`}
            style={{ transform: `translate(${node.x}px, ${node.y}px)`, width: node.w, height: node.h }}
            onPointerDown={onPointerDown}
        >
            <div className="ic-node-header">
                <span className="ic-node-icon">
                    <Icon size={16} />
                </span>
                <strong>{node.title}</strong>
                <span className={`ic-node-status is-${node.status}`}>{node.status}</span>
            </div>
            <div className="ic-node-body">
                {node.type === "prompt" ? (
                    <textarea placeholder="输入提示词..." defaultValue={String(node.data.prompt || "")} />
                ) : (
                    <div className="ic-node-placeholder">
                        <span>{node.type}</span>
                        <small>连接上游节点后可编排生成任务</small>
                    </div>
                )}
            </div>
            <button
                className="ic-port ic-port-out"
                type="button"
                onClick={(event) => {
                    event.stopPropagation();
                    onConnect();
                }}
            >
                +
            </button>
            <span className="ic-port ic-port-in" />
        </div>
    );
}
