import { KeyRound, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function ApiSettingsPage() {
    const [providers, setProviders] = useState([
        { id: "buildingai", name: "BuildingAI 默认模型库", protocol: "system", enabled: true },
        { id: "openai-compatible", name: "OpenAI Compatible", protocol: "openai", enabled: false },
        { id: "runninghub", name: "RunningHub", protocol: "runninghub", enabled: false },
    ]);

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
                        <span className={`ic-pill ${provider.enabled ? "is-on" : ""}`}>
                            <ShieldCheck size={14} /> {provider.enabled ? "已启用" : "未配置"}
                        </span>
                    </div>
                ))}
            </div>
        </main>
    );
}
