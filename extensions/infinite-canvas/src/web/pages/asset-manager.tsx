import { Image, Plus, Tags } from "lucide-react";
import { useState } from "react";

import type { AssetItem } from "../types/canvas";

export default function AssetManagerPage() {
    const [items, setItems] = useState<AssetItem[]>([
        { id: "asset_sample", name: "示例参考图", kind: "image", tags: ["sample"] },
    ]);

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>资产库</h1>
                    <p>V1 提供素材索引、标签和画布复用入口；上传文件后续接入系统 storage。</p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setItems((current) => [
                            ...current,
                            { id: `asset_${Date.now()}`, name: "新素材", kind: "image", tags: [] },
                        ])
                    }
                >
                    <Plus size={16} /> 新素材
                </button>
            </div>
            <div className="ic-grid">
                {items.map((item) => (
                    <article key={item.id} className="ic-card">
                        <Image size={22} />
                        <strong>{item.name}</strong>
                        <span>{item.kind}</span>
                        <small><Tags size={13} /> {item.tags.join(", ") || "未打标"}</small>
                    </article>
                ))}
            </div>
        </main>
    );
}
