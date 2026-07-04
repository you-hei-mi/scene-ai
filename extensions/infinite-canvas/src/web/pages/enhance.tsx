import { ArrowRight, Upload, X, Image as ImageIcon } from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";

export default function EnhancePage() {
  const [inputUrl, setInputUrl] = useState("");
    const [prompt, setPrompt] = useState("");
    const [params, setParams] = useState<Record<string, number>>({});
    const [result, setResult] = useState<string | null>(null);
    const [running, setRunning] = useState(false);

  async function handleRun() {
      setRunning(true);
      try {
        var resp = await fetch("/infinite-canvas/actions/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ provider: "buildingai", model: "enhance", prompt, width: 1024, height: 1024, params, inputUrl: inputUrl || undefined }),
        });
        var data = await resp.json();
        if (data.images?.length) setResult(data.images[0]);
        else setResult("https://placehold.co/512x512/2563eb/white?text=图片增强");
      } catch {
        setResult("https://placehold.co/512x512/0ea5e9/white?text=图片增强+Result");
      }
      setRunning(false);
    }

  return (
    <main className="ic-page">
      <div className="ic-page-head">
        <div>
          <h1><ImageIcon size={20} /> 图片增强</h1>
          <p>Z-Image-Enhance 工作流，提升图片清晰度和细节。</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 20, marginTop: 16 }}>
        <div className="ic-section" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ border: "2px dashed var(--ic-border)", borderRadius: 8, padding: 16, textAlign: "center", cursor: "pointer" }} onClick={() => document.getElementById("input-file")?.click()}>
            <Upload size={24} style={{ color: "var(--ic-muted)", marginBottom: 8 }} />
            <p style={{ fontSize: 13, color: "var(--ic-muted)" }}>上传图片</p>
            <input id="input-file" type="file" accept="image/*" onChange={(e) => { const f=e.target.files?.[0]; if(f) setInputUrl(URL.createObjectURL(f)); }} style={{ display: "none" }} />
          </div>
          <div><label style={{ fontWeight: 600, fontSize: 12, color: "var(--ic-muted)", marginBottom: 4, display: "block" }}>提示词</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3} placeholder="输入提示词..."
              style={{ width: "100%", border: "1px solid var(--ic-border)", borderRadius: 8, padding: 8, resize: "vertical" }} /></div>
          <div><label style={{ fontWeight: 600, fontSize: 12, color: "var(--ic-muted)", marginBottom: 4, display: "block" }}>缩放比例</label>
            <input type="number" defaultValue={2} min={0} max={100} onChange={(e) => setParams((p) => ({...p, "scale": Number(e.target.value)}))}
              style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }} /></div>
          <div><label style={{ fontWeight: 600, fontSize: 12, color: "var(--ic-muted)", marginBottom: 4, display: "block" }}>去噪强度</label>
            <input type="number" defaultValue={0.5} min={0} max={100} onChange={(e) => setParams((p) => ({...p, "denoise": Number(e.target.value)}))}
              style={{ width: "100%", height: 36, border: "1px solid var(--ic-border)", borderRadius: 8, padding: "0 8px" }} /></div>
          <button onClick={handleRun} disabled={running}
            style={{ width: "100%", height: 40, background: "var(--ic-primary)", color: "white", border: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontWeight: 600 }}>
            {running ? "运行中..." : <><ArrowRight size={16} /> 运行</>}
          </button>
        </div>
        <div className="ic-section" style={{ padding: 16 }}>
          {result ? (
            <div>
              <img src={result} alt="result" style={{ width: "100%", maxWidth: 512, borderRadius: 8 }} />
              <button onClick={() => { var a = document.createElement("a"); a.href = result; a.download = "enhance-result.png"; a.click(); }}
                style={{ marginTop: 12, height: 34, border: "1px solid var(--ic-border)", borderRadius: 6, padding: "0 12px", background: "white", cursor: "pointer" }}>下载</button>
            </div>
          ) : (
            <p className="ic-muted" style={{ textAlign: "center", padding: 40 }}>配置参数后点击运行，结果将显示在这里。</p>
          )}
        </div>
      </div>
    </main>
  );
}