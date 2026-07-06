<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import {
    Database,
    Image,
    KeyRound,
    LayoutGrid,
    ListChecks,
    MessageSquare,
    Workflow,
} from "lucide-vue-next";

import { listLocalCanvases } from "../../web/stores/local-canvas-store";

const router = useRouter();

// 快捷入口列表
const entries = [
    { title: "画布管理", path: "/canvas-list", icon: LayoutGrid, text: "创建、搜索、导入导出和回收画布" },
    { title: "资产库", path: "/asset-manager", icon: Image, text: "素材分类、标签和画布复用" },
    { title: "提示词库", path: "/prompt-library", icon: MessageSquare, text: "多库、多分类和模板沉淀" },
    { title: "Provider 设置", path: "/api-settings", icon: KeyRound, text: "模型供应商和任务能力配置" },
    { title: "ComfyUI", path: "/comfyui-settings", icon: Workflow, text: "本地实例和工作流管理入口" },
    { title: "任务队列", path: "/tasks", icon: ListChecks, text: "图片、视频、LLM 与工作流状态" },
];

// 最近画布
const recentCanvases = computed(() => listLocalCanvases().slice(0, 4));

// 统计数量
const stats = computed(() => {
    const all = listLocalCanvases(true);
    return {
        canvasCount: all.filter((c) => !c.deletedAt).length,
        assetCount: 0, // V1 暂无持久化资产，占位
        taskCount: 0, // V1 暂无持久化任务，占位
    };
});
</script>

<template>
    <main class="ic-page">
        <!-- 欢迎区 -->
        <section class="ic-hero">
            <div>
                <h1>Infinite Canvas</h1>
                <p>多模型聚合、节点式无限画布、资产与提示词沉淀的一体化创作工作台。</p>
            </div>
            <a class="ic-primary-link" @click.prevent="router.push('/canvas-list')">进入画布</a>
        </section>

        <!-- 统计卡片 -->
        <section class="ic-grid" style="margin-top: 16px">
            <article class="ic-card">
                <LayoutGrid size="22" />
                <strong>画布数量</strong>
                <span>{{ stats.canvasCount }}</span>
            </article>
            <article class="ic-card">
                <Image size="22" />
                <strong>资产数量</strong>
                <span>{{ stats.assetCount }}</span>
            </article>
            <article class="ic-card">
                <ListChecks size="22" />
                <strong>任务数量</strong>
                <span>{{ stats.taskCount }}</span>
            </article>
        </section>

        <!-- 快捷入口 -->
        <section class="ic-grid" style="margin-top: 16px">
            <a
                v-for="entry in entries"
                :key="entry.path"
                class="ic-card"
                @click.prevent="router.push(entry.path)"
            >
                <component :is="entry.icon" size="22" />
                <strong>{{ entry.title }}</strong>
                <span>{{ entry.text }}</span>
            </a>
        </section>

        <!-- 最近画布 -->
        <section class="ic-section">
            <div class="ic-section-title">
                <Database size="18" />
                <h2>最近画布</h2>
            </div>
            <div class="ic-list">
                <template v-if="recentCanvases.length === 0">
                    <p class="ic-muted">暂无画布，先创建一个经典画布或智能画布。</p>
                </template>
                <template v-else>
                    <a
                        v-for="canvas in recentCanvases"
                        :key="canvas.id"
                        @click.prevent="
                            router.push(
                                `/${canvas.kind === 'smart' ? 'smart-canvas' : 'canvas'}/${canvas.id}`,
                            )
                        "
                    >
                        <span>{{ canvas.title }}</span>
                        <small>{{ new Date(canvas.updatedAt).toLocaleString() }}</small>
                    </a>
                </template>
            </div>
        </section>
    </main>
</template>
