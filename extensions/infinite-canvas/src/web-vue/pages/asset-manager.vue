<script setup lang="ts">
import { ref } from "vue";
import { Image, Plus, Tags } from "lucide-vue-next";

import type { AssetItem } from "../../web/types/canvas";

const items = ref<AssetItem[]>([
    { id: "asset_sample", name: "示例参考图", kind: "image", tags: ["sample"] },
]);

function addItem() {
    items.value.push({
        id: `asset_${Date.now()}`,
        name: "新素材",
        kind: "image",
        tags: [],
    });
}
</script>

<template>
    <main class="ic-page">
        <div class="ic-page-head">
            <div>
                <h1>资产库</h1>
                <p>V1 提供素材索引、标签和画布复用入口；上传文件后续接入系统 storage。</p>
            </div>
            <button type="button" @click="addItem">
                <Plus size="16" /> 新素材
            </button>
        </div>
        <div class="ic-grid">
            <article v-for="item in items" :key="item.id" class="ic-card">
                <Image size="22" />
                <strong>{{ item.name }}</strong>
                <span>{{ item.kind }}</span>
                <small><Tags size="13" /> {{ item.tags.join(", ") || "未打标" }}</small>
            </article>
        </div>
    </main>
</template>
