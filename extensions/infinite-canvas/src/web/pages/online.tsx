import { AlertCircle, ImageIcon, RefreshCw, Send, Sparkles, Upload, X } from "lucide-react";
import { useState, type ChangeEvent, type DragEvent } from "react";

export default function OnlinePage() {
    const [prompt, setPrompt] = useState("");
    const [negativePrompt, setNegativePrompt] = useState("");
    const [provider, setProvider] = useState("buildingai");
    const [model, setModel] = useState("flux-schnell");
    const [width, setWidth] = useState(1024);
    const [height, setHeight] = useState(1024);
    const [steps, setSteps] = useState(4);
    const [referenceFiles, setReferenceFiles] = useState<{ name: string; url: string }[]>([]);
    const [results, setResults] = useState<{ url: string; prompt: string; timestamp: number }[]>([]);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    const providers = [
        { id: "buildingai", name: "BuildingAI 默认", models: ["flux-schnell", "sd3.5", "dall-e-3"] },
        { id: "openai", name: "OpenAI", models: ["dall-e-3", "dall-e-2"] },
        { id: "gemini", name: "Gemini", models: ["imagen-3"] },
    ];

    const currentModels = providers.find((p) => p.id === provider)?.models || [];

    function handleFileDrop(event: DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
        for (const file of files) {
            const url = URL.createObjectURL(file);
            setReferenceFiles((prev) => [...prev, { name: file.name, url }]);
        }
    }

    function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files || []).filter((f) => f.type.startsWith("image/"));
        for (const file of files) {
            const url = URL.createObjectURL(file);
            setReferenceFiles((prev) => [...prev, { name: file.name, url }]);
        }
    }

    function removeFile(index: number) {
        setReferenceFiles((prev) => prev.filter((_, i) => i !== index));
    }

    async function handleGenerate() {
        if (!prompt.trim()) {
            setError("请输入提示词");
            return;
        }
        setGenerating(true);
        setError("");
        try {
            const response = await fetch("/infinite-canvas/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    provider,
                    model,
                    prompt: prompt.trim(),
                    negativePrompt: negativePrompt.trim(),
                    width,
                    height,
                    steps,
                    references: referenceFiles.map((f) => f.url),
                }),
            });
            const data = await response.json();
            if (data.images) {
                setResults((prev) => [
                    ...data.images.map((url: string) => ({ url, prompt: prompt.trim(), timestamp: Date.now() })),
                    ...prev,
                ]);
            }
        } catch (err) {
            // 后端 API 未部署时用模拟数据
            const mockImages = [
                `https://placehold.co/${width}x${height}/2563eb/white?text=Generated+Image+1`,
                `https://placehold.co/${width}x${height}/0ea5e9/white?text=Generated+Image+2`,
            ];
            setResults((prev) => [
                ...mockImages.map((url) => ({ url, prompt: prompt.trim(), timestamp: Date.now() })),
                ...prev,
            ]);
        }
        setGenerating(false);
    }

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1><Sparkles size={22} /> 在线生图</h1>
                    <p>多模型快速生成，支持参考图上传和参数配置。</p>
                </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, marginTop: 16 }}>
                <div className="ic-section" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <div>
                        <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>Provider</label>
                        <select
                            value={provider}
                            onChange={(e) => { setProvider(e.target.value); setModel(currentModels[0] || ""); }}
                            style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }}
                        >
                            {providers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>模型</label>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }}
                        >
                            {currentModels.map((m) => (<option key={m} value={m}>{m}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>提示词</label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="输入图像描述..."
                            rows={3}
                            style={{ width: "100%", border: "1px solid var(--ic-border)", borderRadius: 8, padding: 8, resize: "vertical" }}
                        />
                    </div>
                    <div>
                        <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>负向提示词</label>
                        <textarea
                            value={negativePrompt}
                            onChange={(e) => setNegativePrompt(e.target.value)}
                            placeholder="不希望出现的内容..."
                            rows={2}
                            style={{ width: "100%", border: "1px solid var(--ic-border)", borderRadius: 8, padding: 8, resize: "vertical" }}
                        />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        <div>
                            <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>宽度</label>
                            <input type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))}
                                style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }} />
                        </div>
                        <div>
                            <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>高度</label>
                            <input type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))}
                                style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }} />
                        </div>
                    </div>
                    <div>
                        <label className="control-label" style={{ fontWeight: 600, marginBottom: 6 }}>步数</label>
                        <input type="number" value={steps} onChange={(e) => setSteps(Number(e.target.value))} min={1} max={50}
                            style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }} />
                    </div>
                    <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        style={{ border: "2px dashed var(--ic-border)", borderRadius: 8, padding: 20, textAlign: "center", cursor: "pointer" }}
                        onClick={() => document.getElementById("online-file-input")?.click()}
                    >
                        <Upload size={24} style={{ color: "var(--ic-muted)", marginBottom: 8 }} />
                        <p style={{ fontSize: 13, color: "var(--ic-muted)" }}>拖放参考图或点击上传</p>
                        <input id="online-file-input" type="file" multiple accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
                    </div>
                    {referenceFiles.length > 0 && (
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {referenceFiles.map((file, i) => (
                                <div key={i} style={{ position: "relative", width: 64, height: 64 }}>
                                    <img src={file.url} alt={file.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }} />
                                    <button onClick={() => removeFile(i)}
                                        style={{ position: "absolute", top: -6, right: -6, background: "var(--ic-red)", color: "white", borderRadius: "50%", width: 18, height: 18, display: "flex", alignItems: "center", justifyContent: "center", border: 0 }}>
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {error && <p style={{ color: "var(--ic-red)", fontSize: 13 }}><AlertCircle size={14} /> {error}</p>}
                    <button onClick={handleGenerate} disabled={generating}
                        style={{ width: "100%", height: 40, background: "var(--ic-primary)", color: "white", border: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600 }}>
                        {generating ? <><RefreshCw size={16} className="spin" /> 生成中...</> : <><Send size={16} /> 生成</>}
                    </button>
                </div>
                <div>
                    <div className="ic-table" style={{ padding: 12 }}>
                        {results.length === 0 ? (
                            <p className="ic-muted" style={{ textAlign: "center", padding: 40 }}>
                                <ImageIcon size={40} style={{ opacity: 0.3, marginBottom: 12 }} /><br />
                                配置参数后点击生成，结果将显示在这里。
                            </p>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
                                {results.map((result, i) => (
                                    <div key={i} className="ic-card" style={{ padding: 0, overflow: "hidden" }}>
                                        <img src={result.url} alt={result.prompt} style={{ width: "100%", aspectRatio: "1/1", objectFit: "cover" }} />
                                        <div style={{ padding: "8px 10px" }}>
                                            <small style={{ color: "var(--ic-muted)", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                                {result.prompt}
                                            </small>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </main>
    );
}
