import { ref, computed } from "vue";

import { createPluginHttpClients } from "@buildingai/services";

import type { InfiniteCanvas } from "../../web/types/canvas";
import {
    listLocalCanvases,
    createLocalCanvas,
    getLocalCanvas,
    saveLocalCanvas,
    trashLocalCanvas,
    restoreLocalCanvas,
    importLocalCanvas,
} from "../../web/stores/local-canvas-store";

const { apiHttpClient } = createPluginHttpClients();

// 本地状态
const canvases = ref<InfiniteCanvas[]>(listLocalCanvases());
const loading = ref(false);
const error = ref<string | null>(null);

// 刷新画布列表
function refresh() {
    canvases.value = listLocalCanvases();
}

// 搜索过滤
function useFilteredCanvases(keyword: string, includeDeleted = false) {
    return computed(() =>
        listLocalCanvases(includeDeleted).filter((canvas) =>
            canvas.title.toLowerCase().includes(keyword.toLowerCase()),
        ),
    );
}

export function useCanvas() {
    return {
        canvases,
        loading,
        error,
        refresh,
        useFilteredCanvases,
        createLocalCanvas,
        getLocalCanvas,
        saveLocalCanvas,
        trashLocalCanvas,
        restoreLocalCanvas,
        importLocalCanvas,
        apiHttpClient,
    };
}
