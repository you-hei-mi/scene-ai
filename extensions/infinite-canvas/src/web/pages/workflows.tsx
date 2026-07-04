import { FileJson, Plus, Workflow } from "lucide-react";
import { useState } from "react";

type WorkflowPreset = {
    id: string;
    name: string;
    kind: "canvas" | "comfyui" | "runninghub";
    updatedAt: string;
};

export default function WorkflowPage() {
    const [workflows, setWorkflows] = useState<WorkflowPreset[]>([
        { id: "wf_canvas", name: "画布导出模板", kind: "canvas", updatedAt: new Date().toISOString() },
        { id: "wf_comfy", name: "ComfyUI 工作流占位", kind: "comfyui", updatedAt: new Date().toISOString() },
    ]);

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>Workflow 管理</h1>
                    <p>管理 Canvas、ComfyUI、RunningHub 工作流预设，兼容原项目 `workflows/*.json`。</p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setWorkflows((current) => [
                            ...current,
                            {
                                id: `wf_${Date.now()}`,
                                name: "新工作流",
                                kind: "canvas",
                                updatedAt: new Date().toISOString(),
                            },
                        ])
                    }
                >
                    <Plus size={16} /> 新工作流
                </button>
            </div>
            <div className="ic-grid">
                {workflows.map((workflow) => (
                    <article key={workflow.id} className="ic-card">
                        {workflow.kind === "canvas" ? <Workflow size={22} /> : <FileJson size={22} />}
                        <strong>{workflow.name}</strong>
                        <span>{workflow.kind}</span>
                        <small>{new Date(workflow.updatedAt).toLocaleString()}</small>
                    </article>
                ))}
            </div>
        </main>
    );
}
