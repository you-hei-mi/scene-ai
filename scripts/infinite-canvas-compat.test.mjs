import assert from "node:assert/strict";
import test from "node:test";

import {
    createCanvasExport,
    normalizeCanvasImport,
} from "../extensions/infinite-canvas/src/web/lib/canvas-compat.js";

test("normalizes legacy canvas json into extension canvas shape", () => {
    const legacy = {
        id: "legacy-1",
        title: "Legacy Canvas",
        kind: "smart",
        nodes: [{ id: "n1", type: "prompt", x: 10, y: 20, data: { prompt: "cat" } }],
        edges: [{ id: "e1", from: { node: "n1", port: "out" }, to: { node: "n2", port: "in" } }],
        viewport: { x: 1, y: 2, scale: 0.8 },
    };

    const normalized = normalizeCanvasImport(legacy);

    assert.equal(normalized.title, "Legacy Canvas");
    assert.equal(normalized.kind, "smart");
    assert.deepEqual(normalized.viewport, { x: 1, y: 2, scale: 0.8 });
    assert.equal(normalized.nodes[0].type, "prompt");
    assert.equal(normalized.nodes[0].w, 320);
    assert.equal(normalized.nodes[0].h, 220);
    assert.equal(normalized.edges[0].from.node, "n1");
});

test("exports canvas with original compatible nodes edges viewport settings", () => {
    const exported = createCanvasExport({
        id: "canvas-1",
        title: "Storyboard",
        kind: "classic",
        nodes: [{ id: "n1", type: "output", x: 30, y: 40, w: 260, h: 160, data: {} }],
        edges: [],
        viewport: { x: -20, y: 12, scale: 1.25 },
        settings: { theme: "light" },
    });

    assert.equal(exported.schema, "infinite-canvas");
    assert.equal(exported.version, 1);
    assert.equal(exported.canvas.title, "Storyboard");
    assert.deepEqual(Object.keys(exported.canvas).sort(), [
        "edges",
        "id",
        "kind",
        "nodes",
        "settings",
        "title",
        "viewport",
    ]);
});
