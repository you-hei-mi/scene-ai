import { KeyRound, Plus, ShieldCheck, Loader2, Wifi, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";
import { studioApi } from "../services/studio";

interface ProviderState {
    id: string; name: string; protocol: string; enabled: boolean;
    baseUrl?: string; apiKey?: string; testResult?: string; testOk?: boolean;
}

const DEFAULT_PROVIDERS: ProviderState[] = [
    { id: "buildingai", name: "BuildingAI 默认模型库", protocol: "system", enabled: true },
    { id: "openai-compatible", name: "OpenAI Compatible", protocol: "openai", enabled: false },
    { id: "runninghub", name: "RunningHub", protocol: "runninghub", enabled: false },
    { id: "gemini", name: "Gemini", protocol: "gemini", enabled: false },
    { id: "volcengine", name: "Volcengine Ark", protocol: "volcengine", enabled: false },
];

export default function ApiSettingsPage() {
    const [providers, setProviders] = useState<ProviderState[]>(() => {
        try { return JSON.parse(localStorage.getItem("ic_providers") || "null") || DEFAULT_PROVIDERS; }
        catch { return DEFAULT_PROVIDERS; }
    });
    const [testingId, setTestingId] = useState<string | null>(null);

    useEffect(() => {
        studioApi.listProviders().then((data: any) => {
            if (Array.isArray(data) && data.length > 0) {
                setProviders(data.map((p: any) => ({
                    id: p.id || p.name, name: p.name, protocol: p.protocol || "openai",
                    enabled: p.enabled !== false, baseUrl: p.baseUrl, apiKey: "",
                })));
            }
        }).catch(() => { /* use localStorage default */ });
    }, []);

    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>Provider 设置</h1>
                    <p>优先复用当前系统模型库；外部协议在后续阶段补齐真实连通测试。</p>
                </div>
                <button
                    type="button"
                    onClick={() =>
                        setProviders((items) => [
                            ...items,
                            { id: `provider_${Date.now()}`, name: "新 Provider", protocol: "openai", enabled: false },
                        ])
                    }
                >
                    <Plus size={16} /> 新增
                </button>
            </div>
            <div className="ic-table">
                {providers.map((provider) => (
                    <div key={provider.id} className="ic-row">
                        <div>
                            <strong><KeyRound size={16} /> {provider.name}</strong>
                            <small>{provider.protocol}</small>
                        </div>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <button type="button" style={{ height: 32, padding: "0 10px", border: "1px solid var(--ic-border)", borderRadius: 6, background: "white", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12 }}
                                onClick={async () => {
                                    setTestingId(provider.id);
                                    try {
                                        const result = await (await fetch("/infinite-canvas/api/providers/test-connection", {
                                            method: "POST", headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ provider: provider.name, baseUrl: provider.baseUrl, protocol: provider.protocol }),
                                        })).json();
                                        setProviders((items) => items.map((p) => p.id === provider.id ? { ...p, testResult: result.message, testOk: result.ok } : p));
                                    } catch {
                                        setProviders((items) => items.map((p) => p.id === provider.id ? { ...p, testResult: "请求失败", testOk: false } : p));
                                    }
                                    setTestingId(null);
                                }}
                                disabled={testingId === provider.id}>
                                {testingId === provider.id ? <Loader2 size={13} className="spin" /> : <Wifi size={13} />} 测试连接
                            </button>
                            <span className={`ic-pill ${provider.enabled ? "is-on" : ""}`}>
                                <ShieldCheck size={14} /> {provider.enabled ? "已启用" : "未配置"}
                            </span>
                        </div>
                        {provider.testResult && (
                            <div style={{ fontSize: 12, color: provider.testOk ? "var(--ic-green)" : "var(--ic-red)", marginTop: 4 }}>{provider.testResult}</div>
                        )}
                    </div>
                ))}
            </div>
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </main>
    );
}
