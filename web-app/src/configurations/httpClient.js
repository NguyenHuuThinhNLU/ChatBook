import { CONFIG } from "./configuration";

const defaultHeaders = {
    "Content-Type": "application/json",
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
    const response = await fetch(`${CONFIG.API_GATEWAY}${path}`, {
        ...options,
        headers: {
            ...defaultHeaders,
            ...(options.headers || {}),
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
            body: JSON.stringify(body),
            ...options,
        }),
};

export default httpClient;
