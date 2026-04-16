import httpClient from "../configurations/httpClient";
import { API } from "../configurations/configuration";
import { getToken } from "./localStorageService";

export const getMyposts = async (page) => {
 return await httpClient.get(API.MY_POST, {
    header: {
        Authorization: `Bearer ${getToken()}`,
    },
    params: {
        page: page,
        size: 10,
    },
 });
};


export const createPost = async (content) => {
    return await httpClient.post(API.CREATE_POST, 
        {content: content},
        {
            header: {
                Authorization: `Bearer ${getToken()}`,
                "Content-Type": "application/json",
            },
        }
    );
};