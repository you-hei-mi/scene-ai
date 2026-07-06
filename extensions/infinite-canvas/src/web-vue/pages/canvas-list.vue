<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Plus, RotateCcw, Search, Trash2, Upload } from "lucide-vue-next";

import { normalizeCanvasImport } from "../../web/lib/canvas-compat.js";
import {
    createLocalCanvas,
    importLocalCanvas,
    listLocalCanvases,
    restoreLocalCanvas,
    trashLocalCanvas,
} from "../../web/stores/local-canvas-store";
import type { CanvasKind } from "../../web/types/canvas";

const router = useRouter();

// 搜索关键词和回收站显示状态
const keyword = ref("");
const showTrash = ref(false);
const version = ref(0); // 用于触发重新计算

// 过滤后的画布列表
const canvases = computed(() => {
    // 依赖 version 以实现强制刷新
    void version.value;
    return listLocalCanvases(showTrash.value).filter((canvas) =>
        canvas.title.toLowerCase().includes(keyword.value.toLowerCase()),
    );
});

// 创建新画布
function create(kind: CanvasKind) {
    const canvas = createLocalCanvas(kind, kind === "smart" ? "智能画布" : "经典画布");
    router.push(`/${kind === "smart" ? "smart-canvas" : "canvas"}/${canvas.id}`);
}

// 导入文件
function importFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const normalized = normalizeCanvasImport(JSON.parse(String(reader.result)));
        const canvas = importLocalCanvas(normalized);
        router.push(`/${canvas.kind === "smart" ? "smart-canvas" : "canvas"}/${canvas.id}`);
    };
    reader.readAsText(file);
    input.value = ""; // 重置，允许重复导入同一文件
}

// 软删除
function handleTrash(id: string) {
    trashLocalCanvas(id);
    version.value++;
}

// 恢复
function handleRestore(id: string) {
    restoreLocalCanvas(id);
    version.value++;
}
</script>

<template>
    <main class="ic-page">
        <div class="ic-page-head">
            <div>
                <h1>画布管理</h1>
                <p>管理经典画布、智能画布和原项目兼容 JSON。</p>
            </div>
            <div class="ic-actions">
                <button type="button" @click="create('classic')">
                    <Plus size="16" /> 经典画布
                </button>
                <button type="button" @click="create('smart')">
                    <Plus size="16" /> 智能画布
                </button>
                <label class="ic-icon-button">
                    <Upload size="16" /> 导入
                    <input type="file" accept="application/json" @change="importFile" />
                </label>
            </div>
        </div>

        <div class="ic-filter">
            <Search size="16" />
            <input v-model="keyword" placeholder="搜索画布标题" />
            <button type="button" @click="showTrash = !showTrash">
                {{ showTrash ? "隐藏回收站" : "显示回收站" }}
            </button>
        </div>

        <div class="ic-table">
            <div
                v-for="canvas in canvases"
                :key="canvas.id"
                :class="['ic-row', canvas.deletedAt ? 'is-deleted' : '']"
            >
                <a
                    @click.prevent="
                        router.push(
                            `/${canvas.kind === 'smart' ? 'smart-canvas' : 'canvas'}/${canvas.id}`,
                        )
                    "
                >
                    <strong>{{ canvas.title }}</strong>
                    <small>{{ canvas.kind }} / {{ new Date(canvas.updatedAt).toLocaleString() }}</small>
                </a>
                <button
                    v-if="canvas.deletedAt"
                    type="button"
                    @click="handleRestore(canvas.id)"
                >
                    <RotateCcw size="16" /> 恢复
                </button>
                <button v-else type="button" @click="handleTrash(canvas.id)">
                    <Trash2 size="16" /> 删除
                </button>
            </div>
            <p v-if="canvases.length === 0" class="ic-muted">没有匹配的画布。</p>
        </div>
    </main>
</template>
