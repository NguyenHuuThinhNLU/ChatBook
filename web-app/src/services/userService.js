import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const register = async (payload) => {
    return await httpClient.post(API.REGISTER, payload);
};

export const getMyInfo = async () => {
    const token = getToken();
    const headers = token
        ? {
              Authorization: `Bearer ${token}`,
          }
        : undefined;

    return await httpClient.get(API.MY_INFO, headers ? { headers } : {});
};
