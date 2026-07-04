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
