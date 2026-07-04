import { MessageSquare, Plus, Tags } from "lucide-react";
import { useState } from "react";

import type { PromptItem } from "../types/canvas";

export default function PromptLibraryPage() {
    const [items, setItems] = useState<PromptItem[]>([
        {
            id: "prompt_storyboard",
            title: "分镜画面提示词",
            prompt: "电影感构图，明确主体，干净背景，高质量细节",
            tags: ["storyboard", "image"],
        },
    ]);

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>提示词库</h1>
                    <p>沉淀可复用的正向提示词、负向提示词、参数模板和标签。</p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setItems((current) => [
                            ...current,
                            {
                                id: `prompt_${Date.now()}`,
                                title: "新提示词",
                                prompt: "",
                                tags: [],
                            },
                        ])
                    }
                >
                    <Plus size={16} /> 新提示词
                </button>
            </div>
            <div className="ic-table">
                {items.map((item) => (
                    <div key={item.id} className="ic-row">
                        <div>
                            <strong><MessageSquare size={16} /> {item.title}</strong>
                            <small>{item.prompt || "待填写提示词内容"}</small>
                        </div>
                        <span className="ic-pill"><Tags size={14} /> {item.tags.join(", ") || "未打标"}</span>
                    </div>
                ))}
            </div>
        </main>
    );
}
