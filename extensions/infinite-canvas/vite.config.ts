import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import packageJson from "./package.json";

export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: `/extension/${packageJson.name}`,
    envDir: "./../../",
    server: {
        open: true,
        proxy: {
            "/infinite-canvas/api": {
                target: "http://127.0.0.1:4090",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/infinite-canvas\/api/, "/extension/infinite-canvas"),
            },
            "/infinite-canvas/actions": {
                target: "http://127.0.0.1:4090",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/infinite-canvas\/actions/, "/extension/infinite-canvas/actions"),
            },
        },
    },
    build: {
        outDir: ".output/public",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("lucide-react")) return "lucide";
                },
            },
        },
    },
});
