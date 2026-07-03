export function resolveCorsOrigin(allowedOrigins: string | undefined, requestOrigin?: string) {
    const configuredOrigins = allowedOrigins?.trim();

    if (!configuredOrigins || configuredOrigins === "*") {
        return true;
    }

    const origins = configuredOrigins
        .split(",")
        .map((origin) => origin.trim())
        .filter(Boolean);

    if (requestOrigin && origins.includes(requestOrigin)) {
        return requestOrigin;
    }

    return false;
}

