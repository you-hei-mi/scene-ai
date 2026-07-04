import { apiHttpClient } from "../services/base";

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

const STORAGE_KEY = "ic_conversations_v2";

function readLocal(): Conversation[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch { return []; }
}

function writeLocal(convs: Conversation[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
}

export async function listConversations(): Promise<Conversation[]> {
    try {
        const result: any = await apiHttpClient.get("/conversations");
        if (Array.isArray(result)) {
            writeLocal(result as Conversation[]);
            return result as Conversation[];
        }
    } catch {}
    return readLocal();
}

export async function createConversation(title = "新对话", provider = "buildingai"): Promise<Conversation> {
    const newConv: Partial<Conversation> = {
        id: "conv_" + Date.now(),
        title,
        messages: [{ role: "system", content: "你是一个有用的AI助手。", timestamp: Date.now() }],
        createdAt: Date.now(),
        provider,
    };
    try {
        const result: any = await apiHttpClient.post("/conversations", newConv);
        return result as Conversation;
    } catch {
        writeLocal([newConv as Conversation, ...readLocal()]);
        return newConv as Conversation;
    }
}

export async function saveConversation(conv: Conversation): Promise<Conversation> {
    try {
        const result: any = await apiHttpClient.put("/conversations/" + conv.id, conv);
        return result as Conversation;
    } catch {
        const next = readLocal().filter((c) => c.id !== conv.id);
        writeLocal([conv, ...next]);
        return conv;
    }
}

export async function deleteConversationApi(id: string): Promise<void> {
    try { await apiHttpClient.delete("/conversations/" + id); }
    catch { writeLocal(readLocal().filter((c) => c.id !== id)); }
}

