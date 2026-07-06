<script setup lang="ts">
import { ref } from "vue";
import { MessageSquare, Plus, Tags } from "lucide-vue-next";

import type { PromptItem } from "../../web/types/canvas";

const items = ref<PromptItem[]>([
    {
        id: "prompt_storyboard",
        title: "分镜画面提示词",
        prompt: "电影感构图，明确主体，干净背景，高质量细节",
        tags: ["storyboard", "image"],
    },
]);

function addItem() {
    items.value.push({
        id: `prompt_${Date.now()}`,
        title: "新提示词",
        prompt: "",
        tags: [],
    });
}
</script>

<template>
    <main class="ic-page">
        <div class="ic-page-head">
            <div>
                <h1>提示词库</h1>
                <p>沉淀可复用的正向提示词、负向提示词、参数模板和标签。</p>
            </div>
            <button type="button" @click="addItem">
                <Plus size="16" /> 新提示词
            </button>
        </div>
        <div class="ic-table">
            <div v-for="item in items" :key="item.id" class="ic-row">
                <div>
                    <strong><MessageSquare size="16" /> {{ item.title }}</strong>
                    <small>{{ item.prompt || "待填写提示词内容" }}</small>
                </div>
                <span class="ic-pill"><Tags size="14" /> {{ item.tags.join(", ") || "未打标" }}</span>
            </div>
        </div>
    </main>
</template>
