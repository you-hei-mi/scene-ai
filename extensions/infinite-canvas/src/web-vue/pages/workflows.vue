<script setup lang="ts">
import { ref } from "vue";
import { FileJson, Plus, Workflow } from "lucide-vue-next";

type WorkflowPreset = {
    id: string;
    name: string;
    kind: "canvas" | "comfyui" | "runninghub";
    updatedAt: string;
};

const workflows = ref<WorkflowPreset[]>([
    { id: "wf_canvas", name: "画布导出模板", kind: "canvas", updatedAt: new Date().toISOString() },
    { id: "wf_comfy", name: "ComfyUI 工作流占位", kind: "comfyui", updatedAt: new Date().toISOString() },
]);

function addWorkflow() {
    workflows.value.push({
        id: `wf_${Date.now()}`,
        name: "新工作流",
        kind: "canvas",
        updatedAt: new Date().toISOString(),
    });
}
</script>

<template>
    <main class="ic-page">
        <div class="ic-page-head">
            <div>
                <h1>Workflow 管理</h1>
                <p>管理 Canvas、ComfyUI、RunningHub 工作流预设，兼容原项目 `workflows/*.json`。</p>
            </div>
            <button type="button" @click="addWorkflow">
                <Plus size="16" /> 新工作流
            </button>
        </div>
        <div class="ic-grid">
            <article v-for="workflow in workflows" :key="workflow.id" class="ic-card">
                <component :is="workflow.kind === 'canvas' ? Workflow : FileJson" size="22" />
                <strong>{{ workflow.name }}</strong>
                <span>{{ workflow.kind }}</span>
                <small>{{ new Date(workflow.updatedAt).toLocaleString() }}</small>
            </article>
        </div>
    </main>
</template>
