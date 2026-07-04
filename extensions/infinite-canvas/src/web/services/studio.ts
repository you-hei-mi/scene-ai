import { apiHttpClient } from "./base";
import type { InfiniteCanvas } from "../types/canvas";

export const studioApi = {
    listCanvases() {
        return apiHttpClient.get<InfiniteCanvas[]>("/canvases");
    },
    createCanvas(payload: Partial<InfiniteCanvas>) {
        return apiHttpClient.post<InfiniteCanvas>("/canvases", payload);
    },
    getCanvas(id: string) {
        return apiHttpClient.get<InfiniteCanvas>(`/canvases/${id}`);
    },
    saveCanvas(id: string, payload: Partial<InfiniteCanvas>) {
        return apiHttpClient.put<InfiniteCanvas>(`/canvases/${id}`, payload);
    },
};
