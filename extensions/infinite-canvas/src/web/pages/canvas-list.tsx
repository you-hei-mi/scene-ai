import { Plus, RotateCcw, Search, Trash2, Upload } from "lucide-react";
import { useMemo, useState, type ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import { normalizeCanvasImport } from "../lib/canvas-compat.js";
import {
    createLocalCanvas,
    importLocalCanvas,
    listLocalCanvases,
    restoreLocalCanvas,
    trashLocalCanvas,
} from "../stores/local-canvas-store";
import type { CanvasKind } from "../types/canvas";

export default function CanvasListPage() {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [showTrash, setShowTrash] = useState(false);
    const [version, setVersion] = useState(0);
    const canvases = useMemo(
        () =>
            listLocalCanvases(showTrash).filter((canvas) =>
                canvas.title.toLowerCase().includes(keyword.toLowerCase()),
            ),
        [keyword, showTrash, version],
    );

    function create(kind: CanvasKind) {
        const canvas = createLocalCanvas(kind, kind === "smart" ? "智能画布" : "经典画布");
        navigate(`/${kind === "smart" ? "smart-canvas" : "canvas"}/${canvas.id}`);
    }

    function importFile(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const normalized = normalizeCanvasImport(JSON.parse(String(reader.result)));
            const canvas = importLocalCanvas(normalized);
            navigate(`/${canvas.kind === "smart" ? "smart-canvas" : "canvas"}/${canvas.id}`);
        };
        reader.readAsText(file);
    }

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>画布管理</h1>
                    <p>管理经典画布、智能画布和原项目兼容 JSON。</p>
                </div>
                <div className="ic-actions">
                    <button type="button" onClick={() => create("classic")}><Plus size={16} /> 经典画布</button>
                    <button type="button" onClick={() => create("smart")}><Plus size={16} /> 智能画布</button>
                    <label className="ic-icon-button">
                        <Upload size={16} /> 导入
                        <input type="file" accept="application/json" onChange={importFile} />
                    </label>
                </div>
            </div>
            <div className="ic-filter">
                <Search size={16} />
                <input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索画布标题" />
                <button type="button" onClick={() => setShowTrash((value) => !value)}>
                    {showTrash ? "隐藏回收站" : "显示回收站"}
                </button>
            </div>
            <div className="ic-table">
                {canvases.map((canvas) => (
                    <div key={canvas.id} className={`ic-row ${canvas.deletedAt ? "is-deleted" : ""}`}>
                        <Link to={`/${canvas.kind === "smart" ? "smart-canvas" : "canvas"}/${canvas.id}`}>
                            <strong>{canvas.title}</strong>
                            <small>{canvas.kind} / {new Date(canvas.updatedAt).toLocaleString()}</small>
                        </Link>
                        {canvas.deletedAt ? (
                            <button type="button" onClick={() => { restoreLocalCanvas(canvas.id); setVersion((v) => v + 1); }}>
                                <RotateCcw size={16} /> 恢复
                            </button>
                        ) : (
                            <button type="button" onClick={() => { trashLocalCanvas(canvas.id); setVersion((v) => v + 1); }}>
                                <Trash2 size={16} /> 删除
                            </button>
                        )}
                    </div>
                ))}
                {canvases.length === 0 && <p className="ic-muted">没有匹配的画布。</p>}
            </div>
        </main>
    );
}
