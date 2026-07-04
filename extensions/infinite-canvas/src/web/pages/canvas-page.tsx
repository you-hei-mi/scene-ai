import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { CanvasEditor } from "../components/canvas/canvas-editor";
import { getCanvasApi, createCanvasApi } from "../stores/canvas-store";
import type { InfiniteCanvas } from "../types/canvas";

export default function CanvasPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [canvas, setCanvas] = useState<InfiniteCanvas | undefined | null>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) { setLoading(false); setCanvas(null); return; }
        getCanvasApi(id).then((c) => { setCanvas(c); setLoading(false); });
    }, [id]);

    if (loading) return <main className="ic-page"><p className="ic-muted">加载画布中...</p></main>;
    if (!canvas) {
        createCanvasApi("classic", "未命名画布").then((c) => navigate(`/canvas/${c.id}`));
        return <main className="ic-page"><p className="ic-muted">创建新画布中...</p></main>;
    }

    return <CanvasEditor initialCanvas={canvas} />;
}
