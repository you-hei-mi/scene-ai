import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

async function loadUrlHelpers() {
    const sourcePath = path.resolve("packages/client/src/pages/apps/extension-frame-url.ts");
    const source = await readFile(sourcePath, "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
        },
    }).outputText;

    const tempDir = await mkdtemp(path.join(tmpdir(), "extension-frame-url-"));
    const compiledPath = path.join(tempDir, "extension-frame-url.cjs");
    await writeFile(compiledPath, compiled, "utf8");

    const module = { exports: {} };
    vm.runInNewContext(compiled, { exports: module.exports, module }, { filename: compiledPath });
    await rm(tempDir, { recursive: true, force: true });
    return module.exports;
}

test("development extension iframe uses configured extension dev server", async () => {
    const { resolveExtensionBaseUrl } = await loadUrlHelpers();

    const result = resolveExtensionBaseUrl({
        identifier: "simple-blog",
        isDev: true,
        apiBaseUrl: "http://localhost:4090",
        extensionDevBaseUrls: "simple-blog=http://localhost:5173",
        currentOrigin: "http://localhost:4091",
    });

    assert.equal(result, "http://localhost:5173");
});

test("development extension iframe falls back to api base url when no extension dev server is configured", async () => {
    const { resolveExtensionBaseUrl } = await loadUrlHelpers();

    const result = resolveExtensionBaseUrl({
        identifier: "simple-blog",
        isDev: true,
        apiBaseUrl: "http://localhost:4090",
        extensionDevBaseUrls: "",
        currentOrigin: "http://localhost:4091",
    });

    assert.equal(result, "http://localhost:4090");
});

test("production extension iframe uses current origin", async () => {
    const { resolveExtensionBaseUrl } = await loadUrlHelpers();

    const result = resolveExtensionBaseUrl({
        identifier: "simple-blog",
        isDev: false,
        apiBaseUrl: "http://localhost:4090",
        extensionDevBaseUrls: "simple-blog=http://localhost:5173",
        currentOrigin: "https://example.com",
    });

    assert.equal(result, "https://example.com");
});
