type RequestOptions = RequestInit & {
    params?: Record<string, string | number | boolean | undefined>;
};

function withParams(path: string, params?: RequestOptions["params"]) {
    if (!params) return path;
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.set(key, String(value));
    });
    const suffix = query.toString();
    return suffix ? `${path}?${suffix}` : path;
}

async function request<T>(path: string, options: RequestOptions = {}) {
    const response = await fetch(withParams(path, options.params), {
        ...options,
        headers: {
            "content-type": "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
    }
    return response.json() as Promise<T>;
}

export const apiHttpClient = {
    get<T>(path: string, options?: RequestOptions) {
        return request<T>(path, { ...options, method: "GET" });
    },
    post<T>(path: string, body?: unknown, options?: RequestOptions) {
        return request<T>(path, { ...options, method: "POST", body: JSON.stringify(body ?? {}) });
    },
    put<T>(path: string, body?: unknown, options?: RequestOptions) {
        return request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body ?? {}) });
    },
    delete<T>(path: string, options?: RequestOptions) {
        return request<T>(path, { ...options, method: "DELETE" });
    },
};

export const consoleHttpClient = apiHttpClient;
