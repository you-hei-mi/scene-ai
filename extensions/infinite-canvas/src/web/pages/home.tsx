import { Database, Image, KeyRound, LayoutGrid, ListChecks, MessageSquare, Workflow } from "lucide-react";
import { Link } from "react-router-dom";

import { listLocalCanvases } from "../stores/local-canvas-store";

export default function HomePage() {
    const canvases = listLocalCanvases().slice(0, 4);
    const entries = [
        { title: "画布管理", path: "/canvas-list", icon: LayoutGrid, text: "创建、搜索、导入导出和回收画布" },
        { title: "资产库", path: "/asset-manager", icon: Image, text: "素材分类、标签和画布复用" },
        { title: "提示词库", path: "/prompt-library", icon: MessageSquare, text: "多库、多分类和模板沉淀" },
        { title: "Provider 设置", path: "/api-settings", icon: KeyRound, text: "模型供应商和任务能力配置" },
        { title: "ComfyUI", path: "/comfyui-settings", icon: Workflow, text: "本地实例和工作流管理入口" },
        { title: "任务队列", path: "/tasks", icon: ListChecks, text: "图片、视频、LLM 与工作流状态" },
    ];

    return (
        <main className="ic-page">
            <section className="ic-hero">
                <div>
                    <h1>Infinite Canvas</h1>
                    <p>多模型聚合、节点式无限画布、资产与提示词沉淀的一体化创作工作台。</p>
                </div>
                <Link className="ic-primary-link" to="/canvas-list">进入画布</Link>
            </section>
            <section className="ic-grid">
                {entries.map((entry) => {
                    const Icon = entry.icon;
                    return (
                        <Link key={entry.path} className="ic-card" to={entry.path}>
                            <Icon size={22} />
                            <strong>{entry.title}</strong>
                            <span>{entry.text}</span>
                        </Link>
                    );
                })}
            </section>
            <section className="ic-section">
                <div className="ic-section-title">
                    <Database size={18} />
                    <h2>最近画布</h2>
                </div>
                <div className="ic-list">
                    {canvases.length === 0 ? (
                        <p className="ic-muted">暂无画布，先创建一个经典画布或智能画布。</p>
                    ) : (
                        canvases.map((canvas) => (
                            <Link key={canvas.id} to={`/${canvas.kind === "smart" ? "smart-canvas" : "canvas"}/${canvas.id}`}>
                                <span>{canvas.title}</span>
                                <small>{new Date(canvas.updatedAt).toLocaleString()}</small>
                            </Link>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
}
