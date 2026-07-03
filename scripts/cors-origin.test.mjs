import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

async function loadCorsHelpers() {
    const sourcePath = path.resolve("packages/api/src/common/utils/cors-origin.ts");
    const source = await readFile(sourcePath, "utf8");
    const compiled = ts.transpileModule(source, {
        compilerOptions: {
            module: ts.ModuleKind.CommonJS,
            target: ts.ScriptTarget.ES2022,
        },
    }).outputText;

    const tempDir = await mkdtemp(path.join(tmpdir(), "cors-origin-"));
    const compiledPath = path.join(tempDir, "cors-origin.cjs");
    await writeFile(compiledPath, compiled, "utf8");

    const module = { exports: {} };
    vm.runInNewContext(compiled, { exports: module.exports, module }, { filename: compiledPath });
    await rm(tempDir, { recursive: true, force: true });
    return module.exports;
}

test("allows the matching origin from a comma-separated CORS origin list", async () => {
    const { resolveCorsOrigin } = await loadCorsHelpers();
    const origin = resolveCorsOrigin(
        "http://localhost:4091,http://localhost:5173",
        "http://localhost:5173",
    );

    assert.equal(origin, "http://localhost:5173");
});

test("rejects origins not present in the CORS origin list", async () => {
    const { resolveCorsOrigin } = await loadCorsHelpers();
    const origin = resolveCorsOrigin(
        "http://localhost:4091,http://localhost:5173",
        "http://localhost:3000",
    );

    assert.equal(origin, false);
});

test("keeps wildcard CORS origin behavior", async () => {
    const { resolveCorsOrigin } = await loadCorsHelpers();
    const origin = resolveCorsOrigin("*", "http://localhost:5173");

    assert.equal(origin, true);
});
