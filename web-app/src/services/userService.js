import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const register = async (payload) => {
    return await httpClient.post(API.REGISTER, payload);
};

export const getMyInfo = async () => {
  return await httpClient.get(API.MY_INFO, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
};

export const updateProfile = async (profileData) => {
    return await httpClient.put(API.UPDATE_PROFILE, profileData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
};

export const updateAvatar = async (formData) => {
    return await httpClient.put(API.UPDATE_AVATAR, formData, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
        },
    });
};


export const searchUsers = async (keyword) => {
    return await httpClient.get(`${API.SEARCH_USER}?keyword=${keyword}`, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
        },
    });
};