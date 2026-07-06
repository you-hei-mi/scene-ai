import { ref } from "vue";

import type { AssetItem } from "../../web/types/canvas";

const items = ref<AssetItem[]>([
    { id: "asset_sample", name: "示例参考图", kind: "image", tags: ["sample"] },
]);

export function useAsset() {
    function addItem(name = "新素材", kind: AssetItem["kind"] = "image") {
        items.value.push({
            id: `asset_${Date.now()}`,
            name,
            kind,
            tags: [],
        });
    }

    return { items, addItem };
}
