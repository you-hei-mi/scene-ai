import { Bot, MessageSquare, Send, Trash2, User, Plus } from "lucide-react";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";

import { listConversations, createConversation, saveConversation, deleteConversationApi } from "../stores/conversation-store";
import { apiHttpClient } from "../services/base";
import { studioApi } from "../services/studio";

export interface ChatMessage {
    role: "user" | "assistant" | "system";
    content: string;
    timestamp: number;
}

export interface Conversation {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number | string;
    provider?: string;
}

export default function GptChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [provider, setProvider] = useState("buildingai");
    const [model, setModel] = useState("gpt-4o-mini");
    const [generating, setGenerating] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const providers = [
        { id: "buildingai", name: "BuildingAI 默认", models: ["gpt-4o-mini", "gpt-4o", "claude-3.5-sonnet"] },
        { id: "openai", name: "OpenAI", models: ["gpt-4o", "gpt-4o-mini", "o3-mini"] },
        { id: "gemini", name: "Gemini", models: ["gemini-2.0-flash", "gemini-2.0-pro"] },
    ];

    useEffect(() => { listConversations().then(setConversations); }, []);

    const activeConv = conversations.find((c) => c.id === activeConvId);
    const currentModels = providers.find((p) => p.id === provider)?.models || [];

    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeConv?.messages]);

    async function saveConversations(convs: Conversation[]) {
        setConversations(convs);
        try { await apiHttpClient.put("/conversations", { conversations: convs }); }
        catch { localStorage.setItem("ic_gpt_conversations", JSON.stringify(convs)); }
    }

    async function newConversation() {
        const conv = await createConversation("新对话", provider);
        setConversations((prev) => [conv, ...prev]);
        setActiveConvId(conv.id);
    }

    async function deleteConversation(id: string) {
        await deleteConversationApi(id);
        setConversations((prev) => prev.filter((c) => c.id !== id));
        if (activeConvId === id) setActiveConvId(null);
    }

    async function sendMessage() {
        if (!input.trim() || generating || !activeConvId) return;
        const userMsg: ChatMessage = { role: "user", content: input.trim(), timestamp: Date.now() };
        const updated = conversations.map((c) =>
            c.id === activeConvId ? { ...c, messages: [...c.messages, userMsg], title: c.messages.length <= 1 ? input.trim().slice(0, 30) : c.title } : c,
        );
        saveConversations(updated);
        setInput("");
        setGenerating(true);

        try {
            const data = await apiHttpClient.post<{ message: string }>("/actions/chat", {
                provider,
                model,
                messages: updated.find((c) => c.id === activeConvId)?.messages || [],
            });
            if (data.message) {
                const assistantMsg: ChatMessage = { role: "assistant", content: data.message, timestamp: Date.now() };
                const updatedConvs = conversations.map((c) =>
                    c.id === activeConvId ? { ...c, messages: [...c.messages, assistantMsg] } : c,
                );
                saveConversations(updatedConvs);
            }
        } catch {
            // 后端 API 未部署时返回模拟回应
            const mockResponse = "【模拟回复】您发送的消息是：「" + input.trim() + "」\n\n请配置 BUILDINGAI_API_KEY 环境变量以获得真实 AI 回复。";
            const assistantMsg: ChatMessage = { role: "assistant", content: mockResponse, timestamp: Date.now() };
            const updatedConvs = conversations.map((c) =>
                c.id === activeConvId ? { ...c, messages: [...c.messages, assistantMsg] } : c,
            );
            saveConversations(updatedConvs);
        }
        setGenerating(false);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); }
    }

    return (
        <main className="ic-page" style={{ height: "100vh", padding: 0, display: "flex" }}>
            <div style={{ width: 280, borderRight: "1px solid var(--ic-border)", background: "var(--ic-panel)", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div style={{ padding: 14 }}>
                    <button onClick={newConversation}
                        style={{ width: "100%", height: 36, background: "var(--ic-primary)", color: "white", border: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontWeight: 600, cursor: "pointer" }}>
                        <Plus size={16} /> 新对话
                    </button>
                </div>
                <div style={{ display: "grid", gap: 4, padding: "0 8px", overflow: "auto", flex: 1 }}>
                    {conversations.filter((c) => c.id !== activeConvId && c.messages.length > 1).map((conv) => (
                        <div key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            style={{ padding: "8px 10px", borderRadius: 8, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "transparent", transition: "background 0.15s" }}
                            onMouseEnter={(e) => e.currentTarget.style.background = "var(--ic-panel-strong)"}
                            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
                            <span style={{ fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{conv.title}</span>
                            <button onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                                style={{ border: 0, background: "none", cursor: "pointer", color: "var(--ic-muted)", padding: 0, display: "flex" }}>
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <div style={{ padding: 12, borderTop: "1px solid var(--ic-border)" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <select value={provider} onChange={(e) => { setProvider(e.target.value); setModel(currentModels[0] || ""); }}
                            style={{ flex: 1, height: 32, border: "1px solid var(--ic-border)", borderRadius: 6, padding: "0 6px", fontSize: 12 }}>
                            {providers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                        </select>
                        <select value={model} onChange={(e) => setModel(e.target.value)}
                            style={{ flex: 1, height: 32, border: "1px solid var(--ic-border)", borderRadius: 6, padding: "0 6px", fontSize: 12 }}>
                            {currentModels.map((m) => (<option key={m} value={m}>{m}</option>))}
                        </select>
                    </div>
                </div>
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", background: "var(--ic-bg)", overflow: "hidden" }}>
                {!activeConv ? (
                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
                        <Bot size={48} style={{ color: "var(--ic-muted)", opacity: 0.3 }} />
                        <p className="ic-muted">选择或创建一个对话开始聊天</p>
                        <button onClick={newConversation}
                            style={{ height: 38, background: "var(--ic-primary)", color: "white", border: 0, borderRadius: 8, padding: "0 20px", fontWeight: 600, cursor: "pointer" }}>
                            <Plus size={16} /> 新对话
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ flex: 1, overflow: "auto", padding: "16px 20px" }}>
                            {activeConv.messages.filter((m) => m.role !== "system").map((msg, i) => (
                                <div key={i} style={{ display: "flex", gap: 10, marginBottom: 16, flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: msg.role === "user" ? "var(--ic-primary)" : "var(--ic-panel-strong)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                        {msg.role === "user" ? <User size={16} color="white" /> : <Bot size={16} />}
                                    </div>
                                    <div style={{ maxWidth: "70%", padding: "10px 14px", borderRadius: 12, background: msg.role === "user" ? "var(--ic-primary)" : "var(--ic-panel)", color: msg.role === "user" ? "white" : "var(--ic-text)", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div style={{ padding: "12px 20px", borderTop: "1px solid var(--ic-border)", background: "var(--ic-panel)", display: "flex", gap: 8 }}>
                            <textarea
                                value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
                                placeholder="输入消息，Enter 发送，Shift+Enter 换行"
                                rows={2}
                                style={{ flex: 1, border: "1px solid var(--ic-border)", borderRadius: 10, padding: "8px 12px", resize: "none", outline: "none", fontSize: 14 }}
                            />
                            <button onClick={sendMessage} disabled={generating || !input.trim()}
                                style={{ alignSelf: "flex-end", height: 38, width: 38, background: "var(--ic-primary)", color: "white", border: 0, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", opacity: generating || !input.trim() ? 0.5 : 1 }}>
                                <Send size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </main>
    );
}
