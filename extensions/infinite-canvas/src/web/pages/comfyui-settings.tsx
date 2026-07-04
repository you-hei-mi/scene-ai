import { PlugZap, Plus, Workflow } from "lucide-react";

export default function ComfyuiSettingsPage() {
    return (
        <main className="ic-page">
            <div className="ic-page-head">
                <div>
                    <h1>ComfyUI 设置</h1>
                    <p>管理本地 ComfyUI 实例和 workflow 预设。V1 保留配置入口，真实运行在 V2 接入。</p>
                </div>
                <button type="button"><Plus size={16} /> 新实例</button>
            </div>
            <div className="ic-grid">
                <article className="ic-card">
                    <PlugZap size={22} />
                    <strong>本地实例</strong>
                    <span>http://127.0.0.1:8188</span>
                    <small>未检测连接</small>
                </article>
                <article className="ic-card">
                    <Workflow size={22} />
                    <strong>Workflow 预设</strong>
                    <span>支持导入原项目 workflows/*.json</span>
                    <small>后续接入运行和历史查询</small>
                </article>
            </div>
        </main>
    );
}
