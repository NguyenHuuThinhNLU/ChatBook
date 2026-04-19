export const KEY_TOKEN = "accessToken";
export const KEY_USER = "currentUser";

export const setToken = (token) => {
    localStorage.setItem(KEY_TOKEN, token);
};

export const getToken = () => {
    return localStorage.getItem(KEY_TOKEN);
};

export const removeToken = () => {
    return localStorage.removeItem(KEY_TOKEN);
};

export const setStoredUser = (user) => {
    localStorage.setItem(KEY_USER, JSON.stringify(user));
};

export const getStoredUser = () => {
    const raw = localStorage.getItem(KEY_USER);

    if (!raw) {
        return null;
    }

    try {
        return JSON.parse(raw);
    } catch {
        localStorage.removeItem(KEY_USER);
        return null;
    }
};

export const removeStoredUser = () => {
    localStorage.removeItem(KEY_USER);
};
