<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

import { createLocalCanvas, getLocalCanvas } from "../../web/stores/local-canvas-store";

const route = useRoute();
const router = useRouter();

const id = computed(() => route.params.id as string);
const canvas = computed(() => (id.value ? getLocalCanvas(id.value) : undefined));

// 若画布不存在，创建一个新的经典画布作为降级
const fallback = computed(() => {
    if (!canvas.value) {
        return createLocalCanvas("classic", "未命名画布");
    }
    return null;
});
</script>

<template>
    <!-- 未找到画布时的降级提示 -->
    <main v-if="!canvas" class="ic-page">
        <p class="ic-muted">未找到画布，已创建一个新的经典画布。</p>
        <a class="ic-primary-link" @click.prevent="router.push(`/canvas/${fallback?.id}`)">
            打开新画布
        </a>
    </main>

    <!-- 画布编辑页（简化占位版） -->
    <div v-else class="ic-editor">
        <div class="ic-topbar">
            <div>
                <strong>{{ canvas.title }}</strong>
                <span>
                    {{ canvas.kind === "smart" ? "智能画布" : "经典画布" }} / 已保存
                </span>
            </div>
            <div class="ic-actions">
                <button type="button" title="保存">保存</button>
                <button type="button" title="导出">导出</button>
            </div>
        </div>
        <div class="ic-toolbar">
            <span>节点工具栏占位</span>
        </div>
        <div class="ic-board">
            <div class="ic-stage">
                <!-- 画布区域占位 -->
                <div
                    style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        height: 100%;
                        color: var(--ic-muted);
                    "
                >
                    画布编辑区域占位（{{ canvas.nodes.length }} 个节点，{{ canvas.edges.length }} 条边）
                </div>
            </div>
        </div>
    </div>
</template>
