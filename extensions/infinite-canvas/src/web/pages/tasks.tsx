import { CircleAlert, CircleCheck, Clock, ListChecks, Plus } from "lucide-react";
import { useState } from "react";

type TaskItem = {
    id: string;
    kind: "image" | "video" | "llm" | "workflow";
    status: "queued" | "running" | "done" | "failed";
    title: string;
};

const statusIcon = {
    queued: Clock,
    running: ListChecks,
    done: CircleCheck,
    failed: CircleAlert,
};

export default function TaskPage() {
    const [tasks, setTasks] = useState<TaskItem[]>([
        { id: "task_image", kind: "image", status: "queued", title: "图片生成任务占位" },
        { id: "task_llm", kind: "llm", status: "done", title: "LLM 节点文本输出" },
    ]);

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>任务队列</h1>
                    <p>统一展示图片、视频、LLM、Workflow 节点的任务状态和失败原因。</p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setTasks((current) => [
                            ...current,
                            {
                                id: `task_${Date.now()}`,
                                kind: "workflow",
                                status: "queued",
                                title: "新任务",
                            },
                        ])
                    }
                >
                    <Plus size={16} /> 模拟任务
                </button>
            </div>
            <div className="ic-table">
                {tasks.map((task) => {
                    const Icon = statusIcon[task.status];
                    return (
                        <div key={task.id} className="ic-row">
                            <div>
                                <strong><Icon size={16} /> {task.title}</strong>
                                <small>{task.kind}</small>
                            </div>
                            <span className={`ic-pill ${task.status === "done" ? "is-on" : ""}`}>{task.status}</span>
                        </div>
                    );
                })}
            </div>
        </main>
    );
}
