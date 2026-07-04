import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { CanvasEditor } from "../components/canvas/canvas-editor";
import { createLocalCanvas, getLocalCanvas } from "../stores/local-canvas-store";

export default function CanvasPage() {
    const { id } = useParams();
    const canvas = id ? getLocalCanvas(id) : undefined;

    if (!canvas) {
        const fallback = createLocalCanvas("classic", "未命名画布");
        return (
            <main className="ic-page">
                <p className="ic-muted">未找到画布，已创建一个新的经典画布。</p>
                <Link className="ic-primary-link" to={`/canvas/${fallback.id}`}>打开新画布</Link>
            </main>
        );
    }

    return <CanvasEditor initialCanvas={canvas} />;
}
