import { getToken, removeToken, setToken } from "./localStorageService";
import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";

export const login = async (username, password) => {
    const response = await httpClient.post(API.LOGIN, {
        username,
        password,
    });

    const token = response.data?.result?.token;

    if (token) {
        setToken(token);
    }

    return response;
};

export const logout = async () => {
    const token = getToken();

    if (token) {
        await httpClient.post(API.LOGOUT, { token });
    }

    removeToken();
};

export const isAuthenticated = () => {
    return Boolean(getToken());
};
