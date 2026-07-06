import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import packageJson from "./package.json";

/**
 * Simple Blog 扩展 Vite 配置（Vue3 版本）
 *
 * 支持 Vue 3 单文件组件、Tailwind CSS 和构建优化。
 */
export default defineConfig({
    plugins: [vue(), tailwindcss()],
    base: `/extension/${packageJson.name}`,
    envDir: "./../../",
    server: {
        open: true,
    },
    build: {
        outDir: ".output/public",
        sourcemap: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("lucide-vue-next")) return "lucide";
                    if (id.includes("vue")) return "vue-vendor";
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": "/src",
        },
    },
});
