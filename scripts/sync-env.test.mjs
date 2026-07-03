import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const scriptPath = path.resolve("scripts/sync-env.mjs");

test("sync-env preserves deployment-specific variables by default", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "sync-env-"));

    try {
        writeFileSync(
            path.join(dir, "package.json"),
            JSON.stringify({ version: "26.1.1" }),
            "utf-8",
        );
        writeFileSync(path.join(dir, ".env.example"), "APP_NAME=BuildingAI\n", "utf-8");
        writeFileSync(
            path.join(dir, ".env"),
            "APP_NAME=Production\nDEPLOY_SECRET=keep-me\n",
            "utf-8",
        );
        writeFileSync(path.join(dir, "sync-env.mjs"), readFileSync(scriptPath, "utf-8"), "utf-8");
        const chalkDir = path.join(dir, "node_modules", "chalk");
        mkdirSync(chalkDir, { recursive: true });
        writeFileSync(
            path.join(chalkDir, "package.json"),
            JSON.stringify({ type: "module" }),
            "utf-8",
        );
        writeFileSync(
            path.join(chalkDir, "index.js"),
            `export default new Proxy({}, { get: () => (value) => String(value) });\n`,
            "utf-8",
        );

        const result = spawnSync(process.execPath, ["sync-env.mjs"], {
            cwd: dir,
            encoding: "utf-8",
        });

        assert.equal(result.status, 0, result.stderr || result.stdout);
        const envContent = readFileSync(path.join(dir, ".env"), "utf-8");
        assert.match(envContent, /^APP_NAME=Production$/m);
        assert.match(envContent, /^DEPLOY_SECRET=keep-me$/m);
    } finally {
        rmSync(dir, { recursive: true, force: true });
    }
});
