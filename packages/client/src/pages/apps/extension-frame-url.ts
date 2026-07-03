export type ResolveExtensionBaseUrlOptions = {
  identifier: string;
  isDev: boolean;
  apiBaseUrl?: string;
  extensionDevBaseUrls?: string;
  currentOrigin: string;
};

function parseExtensionDevBaseUrls(value?: string) {
  const map = new Map<string, string>();

  for (const item of value?.split(",") ?? []) {
    const [rawIdentifier, ...rawUrlParts] = item.split("=");
    const identifier = rawIdentifier?.trim();
    const url = rawUrlParts.join("=").trim().replace(/\/+$/u, "");

    if (identifier && url) {
      map.set(identifier, url);
    }
  }

  return map;
}

export function resolveExtensionBaseUrl({
  identifier,
  isDev,
  apiBaseUrl,
  extensionDevBaseUrls,
  currentOrigin,
}: ResolveExtensionBaseUrlOptions) {
  if (!isDev) {
    return currentOrigin.replace(/\/+$/u, "");
  }

  const configuredUrl = parseExtensionDevBaseUrls(extensionDevBaseUrls).get(identifier);
  if (configuredUrl) {
    return configuredUrl;
  }

  return (apiBaseUrl || "http://localhost:4090").replace(/\/+$/u, "");
}
