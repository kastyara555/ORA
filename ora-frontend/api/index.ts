import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { deleteCookie, getCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";

const DEFAULT_BASE_URL = "http://127.0.0.1:3003";

export const BASE_URL = process.env.BASE_URL ?? DEFAULT_BASE_URL;

export const BASE_API_URL = BASE_URL.concat("/api");

export const BASE_ASSETS_URL = BASE_URL.concat("/assets");

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 2000,
});

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  config.headers.Authorization = getCookie(AUTH_COOKIE_NAME);

  return config;
});

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: any) => {
    if (error.response.status === 401) {

      deleteCookie(AUTH_COOKIE_NAME);
      window.history.pushState(window.history.state, "", "/login");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
