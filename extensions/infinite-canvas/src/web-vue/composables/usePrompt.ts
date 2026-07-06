import { ref } from "vue";

import type { PromptItem } from "../../web/types/canvas";

const items = ref<PromptItem[]>([
    {
        id: "prompt_storyboard",
        title: "分镜画面提示词",
        prompt: "电影感构图，明确主体，干净背景，高质量细节",
        tags: ["storyboard", "image"],
    },
]);

export function usePrompt() {
    function addItem(title = "新提示词") {
        items.value.push({
            id: `prompt_${Date.now()}`,
            title,
            prompt: "",
            tags: [],
        });
    }

    return { items, addItem };
}
