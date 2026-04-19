import { CONFIG } from "./configuration";

const buildUrl = (path, params) => {
    const url = new URL(`${CONFIG.API_GATEWAY}${path}`);

    if (params && typeof params === "object") {
        Object.entries(params).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            url.searchParams.set(key, String(value));
        });
    }

    return url.toString();
};

const isFormData = (value) =>
    typeof FormData !== "undefined" && value instanceof FormData;

const normalizeBodyOptions = (body, options = {}) => {
    if (body === undefined) return options;

    if (isFormData(body)) {
        // Let the browser set the multipart boundary; avoid forcing Content-Type.
        const nextHeaders = { ...(options.headers || {}) };
        delete nextHeaders["Content-Type"];
        delete nextHeaders["content-type"];

        return {
            ...options,
            headers: nextHeaders,
            body,
        };
    }

    if (typeof body === "string") {
        return {
            ...options,
            body,
        };
    }

    return {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        body: JSON.stringify(body),
    };
};

const parseResponse = async (response) => {
    const contentType = response.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
        const error = new Error(
            typeof data === "object" && data?.message
                ? data.message
                : "Request failed",
        );

        error.response = {
            status: response.status,
            data,
        };

        throw error;
    }

    return {
        status: response.status,
        data,
    };
};

const request = async (path, options = {}) => {
    const { params, ...fetchOptions } = options;

    const response = await fetch(buildUrl(path, params), {
        ...fetchOptions,
        headers: {
            ...(fetchOptions.headers || {}),
        },
    });

    return parseResponse(response);
};

const httpClient = {
    get: (path, options = {}) =>
        request(path, {
            method: "GET",
            ...options,
        }),
    post: (path, body, options = {}) =>
        request(path, {
            method: "POST",
            ...normalizeBodyOptions(body, options),
        }),
    put: (path, body, options = {}) =>
        request(path, {
            method: "PUT",
            ...normalizeBodyOptions(body, options),
        }),
};

export default httpClient;
