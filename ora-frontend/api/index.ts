import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { deleteCookie, getCookie } from "@/utils/cookie";
import { AUTH_COOKIE_NAME } from "@/consts";

const DEFAULT_BASE_URL_BACK = "http://127.0.0.1:3003";
const DEFAULT_BASE_URL_FRONT = "http://127.0.0.1:3000";

export const BASE_URL_BACK = process.env.BASE_URL_BACK ?? DEFAULT_BASE_URL_BACK;
export const BASE_URL_FRONT = process.env.BASE_URL_FRONT ?? DEFAULT_BASE_URL_FRONT;

export const BASE_API_URL = BASE_URL_BACK.concat("/api");

export const BASE_ASSETS_URL = BASE_URL_FRONT.concat("/assets");

export const BASE_STATIC_URL = BASE_URL_BACK;

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
