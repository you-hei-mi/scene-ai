import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const routesSource = await readFile("extensions/simple-blog/src/web/routes.tsx", "utf8");

test("simple-blog avoids eager loading editor-heavy routes on the public index page", () => {
    assert.match(routesSource, /lazy\s*\(/);

    for (const importPath of [
        "./pages/article/[id]",
        "./pages/console/article/add",
        "./pages/console/article/edit",
        "./pages/console/article/list",
        "./pages/console/column/list",
    ]) {
        assert.doesNotMatch(
            routesSource,
            new RegExp(
                `import\\s+\\w+\\s+from\\s+["']${importPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}["']`,
            ),
            `${importPath} should be lazy-loaded instead of statically imported`,
        );
    }
});
