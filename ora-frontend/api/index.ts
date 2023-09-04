import axios from "axios";

const DEFAULT_BASE_URL = "http://localhost:3003/api";

export const BASE_URL = process.env.BASE_URL ?? DEFAULT_BASE_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 2000,
});
