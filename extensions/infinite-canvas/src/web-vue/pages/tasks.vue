<script setup lang="ts">
import { ref } from "vue";
import { CircleAlert, CircleCheck, Clock, ListChecks, Plus } from "lucide-vue-next";

type TaskItem = {
    id: string;
    kind: "image" | "video" | "llm" | "workflow";
    status: "queued" | "running" | "done" | "failed";
    title: string;
};

const statusIcon: Record<TaskItem["status"], any> = {
    queued: Clock,
    running: ListChecks,
    done: CircleCheck,
    failed: CircleAlert,
};

const tasks = ref<TaskItem[]>([
    { id: "task_image", kind: "image", status: "queued", title: "图片生成任务占位" },
    { id: "task_llm", kind: "llm", status: "done", title: "LLM 节点文本输出" },
]);

function addTask() {
    tasks.value.push({
        id: `task_${Date.now()}`,
        kind: "workflow",
        status: "queued",
        title: "新任务",
    });
}
</script>

<template>
    <main class="ic-page">
        <div class="ic-page-head">
            <div>
                <h1>任务队列</h1>
                <p>统一展示图片、视频、LLM、Workflow 节点的任务状态和失败原因。</p>
            </div>
            <button type="button" @click="addTask">
                <Plus size="16" /> 模拟任务
            </button>
        </div>
        <div class="ic-table">
            <div v-for="task in tasks" :key="task.id" class="ic-row">
                <div>
                    <strong>
                        <component :is="statusIcon[task.status]" size="16" />
                        {{ task.title }}
                    </strong>
                    <small>{{ task.kind }}</small>
                </div>
                <span :class="['ic-pill', task.status === 'done' ? 'is-on' : '']">
                    {{ task.status }}
                </span>
            </div>
        </div>
    </main>
</template>
