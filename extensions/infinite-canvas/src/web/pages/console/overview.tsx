import { useEffect, useState } from "react";
import { apiHttpClient } from "../../services/base";

interface StatsData {
    canvases: { total: number; active: number };
    tasks: { total: number; running: number; done: number; failed: number; queued: number };
    providers: number;
    workflows: number;
    assets?: number;
    prompts?: number;
    timestamp?: string;
}

const STAT_COLORS: Record<string, string> = {
    active: "#2563eb", total: "#64748b", done: "#15803d",
    running: "#d97706", failed: "#dc2626", queued: "#7c3aed",
};

export default function ConsoleOverviewPage() {
    const [stats, setStats] = useState<StatsData | null>(null);

    useEffect(() => {
        async function load() {
            try {
                const data = await apiHttpClient.get<StatsData>("/consoleapi/studio/stats");
                setStats(data);
            } catch { /* backend not available */ }
        }
        load();
        const timer = setInterval(load, 15000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="ic-console">
            <h1>Infinite Canvas 管理</h1>
            <p>管理画布、资产、提示词、Provider、Workflow 和任务状态。</p>
            {stats && (
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                    <div className="ic-card" style={{ borderLeft: "4px solid " + STAT_COLORS.active }}>
                        <strong style={{ fontSize: 24, color: STAT_COLORS.active }}>{stats.canvases.active}</strong>
                        <span>活跃画布</span>
                    </div>
                    <div className="ic-card" style={{ borderLeft: "4px solid " + STAT_COLORS.total }}>
                        <strong style={{ fontSize: 24 }}>{stats.canvases.total}</strong>
                        <span>画布总数</span>
                    </div>
                    <div className="ic-card" style={{ borderLeft: "4px solid " + STAT_COLORS.done }}>
                        <strong style={{ fontSize: 24, color: STAT_COLORS.done }}>{stats.tasks.done}</strong>
                        <span>已完成任务</span>
                    </div>
                    <div className="ic-card" style={{ borderLeft: "4px solid " + STAT_COLORS.running }}>
                        <strong style={{ fontSize: 24, color: STAT_COLORS.running }}>{stats.tasks.running}</strong>
                        <span>运行中的任务</span>
                    </div>
                    <div className="ic-card" style={{ borderLeft: "4px solid " + STAT_COLORS.failed }}>
                        <strong style={{ fontSize: 24, color: STAT_COLORS.failed }}>{stats.tasks.failed}</strong>
                        <span>失败任务</span>
                    </div>
                    <div className="ic-card">
                        <strong style={{ fontSize: 24 }}>{stats.providers}</strong>
                        <span>Provider 数</span>
                    </div>
                    <div className="ic-card">
                        <strong style={{ fontSize: 24 }}>{stats.workflows}</strong>
                        <span>工作流数</span>
                    </div>
                    <div className="ic-card">
                        <strong style={{ fontSize: 24 }}>{stats.canvases.total - stats.canvases.active}</strong>
                        <span>回收站</span>
                    </div>
                </div>
            )}
            {stats?.timestamp && (
                <p className="ic-muted" style={{ marginTop: 16 }}>
                    最近更新: {new Date(stats.timestamp).toLocaleString()}
                </p>
            )}
        </div>
    );
}
