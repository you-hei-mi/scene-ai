import { ref } from "vue";

type TaskItem = {
    id: string;
    kind: "image" | "video" | "llm" | "workflow";
    status: "queued" | "running" | "done" | "failed";
    title: string;
};

const tasks = ref<TaskItem[]>([
    { id: "task_image", kind: "image", status: "queued", title: "图片生成任务占位" },
    { id: "task_llm", kind: "llm", status: "done", title: "LLM 节点文本输出" },
]);

export function useTask() {
    function addTask(kind: TaskItem["kind"] = "workflow", title = "新任务") {
        tasks.value.push({
            id: `task_${Date.now()}`,
            kind,
            status: "queued",
            title,
        });
    }

    return { tasks, addTask };
}
