import { Layers, Play, Plus, Trash2, Square } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { CanvasEditor } from "../components/canvas/canvas-editor";
import { getCanvasApi, saveCanvasApi, createCanvasApi } from "../stores/canvas-store";
import type { InfiniteCanvas } from "../types/canvas";

interface NodeGroup {
    id: string;
    name: string;
    color: string;
    nodeIds: string[];
    order: number;
}

const GROUP_COLORS = ["#2563eb", "#059669", "#dc2626", "#d97706", "#7c3aed", "#db2777", "#0891b2", "#ca8a04"];

export default function SmartCanvasPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [canvas, setCanvas] = useState<InfiniteCanvas | null>(null);
    const [loading, setLoading] = useState(true);
    const [groups, setGroups] = useState<NodeGroup[]>([]);
    const [cascadeEnabled, setCascadeEnabled] = useState(false);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);

    useEffect(() => {
        if (!id) { setLoading(false); return; }
        getCanvasApi(id).then((c) => {
            if (c) {
                setCanvas(c);
                const savedGroups = (c.settings?.groups || []) as NodeGroup[];
                setGroups(savedGroups);
            }
            setLoading(false);
        });
    }, [id]);

    function saveGroups(newGroups: NodeGroup[]) {
        if (!canvas) return;
        const updated = { ...canvas, settings: { ...canvas.settings, groups: newGroups } };
        setGroups(newGroups);
        setCanvas(updated);
        saveCanvasApi(updated).catch(() => {});
    }

    function addGroup() {
        const newGroup: NodeGroup = {
            id: "sg_" + Date.now(),
            name: "分组 " + (groups.length + 1),
            color: GROUP_COLORS[groups.length % GROUP_COLORS.length],
            nodeIds: [],
            order: groups.length,
        };
        saveGroups([...groups, newGroup]);
    }

    function removeGroup(groupId: string) {
        saveGroups(groups.filter((g) => g.id !== groupId));
        if (selectedGroupId === groupId) setSelectedGroupId(null);
    }

    function renameGroup(groupId: string, name: string) {
        saveGroups(groups.map((g) => (g.id === groupId ? { ...g, name } : g)));
    }

    if (loading) return <main className="ic-page"><p className="ic-muted">加载智能画布中...</p></main>;
    if (!canvas) {
        createCanvasApi("smart", "智能画布").then((c) => navigate("/smart-canvas/" + c.id));
        return <main className="ic-page"><p className="ic-muted">创建智能画布中...</p></main>;
    }

    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <CanvasEditor initialCanvas={canvas} smartMode={true} groups={groups} />
            </div>
            <div style={{ width: 280, borderLeft: "1px solid var(--ic-border)", background: "var(--ic-panel)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: 14, borderBottom: "1px solid var(--ic-border)" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <strong><Layers size={16} /> 分组管理</strong>
                        <button onClick={addGroup} style={{ height: 30, padding: "0 10px", border: "1px solid var(--ic-border)", borderRadius: 6, background: "white", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                            <Plus size={14} /> 新建分组
                        </button>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, cursor: "pointer" }}>
                        <input type="checkbox" checked={cascadeEnabled} onChange={(e) => setCascadeEnabled(e.target.checked)} />
                        级联执行模式
                    </label>
                </div>
                <div style={{ flex: 1, overflow: "auto", padding: "8px" }}>
                    {groups.length === 0 && (
                        <p className="ic-muted" style={{ textAlign: "center", padding: 20 }}>暂无分组，点击"新建分组"创建。</p>
                    )}
                    {groups.map((group) => (
                        <div key={group.id}
                            onClick={() => setSelectedGroupId(selectedGroupId === group.id ? null : group.id)}
                            style={{
                                marginBottom: 8, borderRadius: 8, border: "1px solid " + (selectedGroupId === group.id ? group.color : "var(--ic-border)"),
                                overflow: "hidden", cursor: "pointer", transition: "border-color 0.15s",
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", background: group.color + "15" }}>
                                <Square size={14} color={group.color} fill={group.color} />
                                <input
                                    value={group.name}
                                    onChange={(e) => renameGroup(group.id, e.target.value)}
                                    onClick={(e) => e.stopPropagation()}
                                    style={{ flex: 1, border: 0, background: "transparent", fontWeight: 600, fontSize: 13, outline: "none", minWidth: 0 }}
                                />
                                <span style={{ fontSize: 11, color: "var(--ic-muted)" }}>{group.nodeIds.length}</span>
                                <button onClick={(e) => { e.stopPropagation(); removeGroup(group.id); }}
                                    style={{ border: 0, background: "none", cursor: "pointer", color: "var(--ic-muted)", padding: 0, display: "flex" }}>
                                    <Trash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {cascadeEnabled && groups.length > 0 && (
                    <div style={{ padding: 12, borderTop: "1px solid var(--ic-border)" }}>
                        <button
                            style={{ width: "100%", height: 36, background: "var(--ic-primary)", color: "white", border: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, cursor: "pointer" }}
                        >
                            <Play size={16} /> 执行级联
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
