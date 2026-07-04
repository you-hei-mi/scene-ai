import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/api/**/*.ts", "!src/api/**/*.d.ts"],
    outDir: "build",
    format: ["cjs"],
    dts: false,
    bundle: false,
    sourcemap: process.env.NODE_ENV === "development",
    clean: true,
    splitting: false,
    treeshake: true,
    target: "es2023",
    tsconfig: "tsconfig.api.json",
    skipNodeModulesBundle: false,
});
