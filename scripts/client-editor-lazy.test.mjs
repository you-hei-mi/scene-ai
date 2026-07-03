import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";

const routerSource = await readFile("packages/client/src/router/index.tsx", "utf8");
const settingsProviderSource = await readFile(
    "packages/client/src/components/settings-dialog/settings-dialog-provider.tsx",
    "utf8",
);
const aboutSettingSource = await readFile(
    "packages/client/src/components/settings-dialog/settings-items/about-setting.tsx",
    "utf8",
);

test("client router lazy-loads routes that pull the rich text editor stack", () => {
    assert.match(routerSource, /lazy\s*\(/);
    assert.doesNotMatch(
        routerSource,
        /import\s+PublishChatPage\s+from\s+["']@\/pages\/agents\/site-chat["']/,
    );
    assert.doesNotMatch(
        routerSource,
        /import\s+AgentChatPage\s+from\s+["']@\/pages\/agents\/detail\/chat["']/,
    );
    assert.doesNotMatch(
        routerSource,
        /import\s+AgentConfigurationPage\s+from\s+["']@\/pages\/agents\/detail\/configuration["']/,
    );
    assert.doesNotMatch(routerSource, /import\s+ChatPage\s+from\s+["']\.\.\/pages\/chat["']/);
    assert.doesNotMatch(
        routerSource,
        /import\s+ConsoleLayout\s+from\s+["']\.\.\/layouts\/console["']/,
    );
});

test("settings dialog defers agreement content renderer until it is needed", () => {
    assert.doesNotMatch(
        settingsProviderSource,
        /import\s+\{\s*AboutSetting\s*\}\s+from\s+["']\.\/settings-items\/about-setting["']/,
    );
    assert.doesNotMatch(
        aboutSettingSource,
        /import\s+\{\s*AgreementDialog,\s*type\s+AgreementType\s*\}\s+from\s+["']@\/components\/agreement-dialog["']/,
    );
    assert.match(aboutSettingSource, /lazy\s*\(/);
});
