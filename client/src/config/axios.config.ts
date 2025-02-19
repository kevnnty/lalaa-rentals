import { API_URL } from "@/lib/api";
import { store } from "@/lib/store";
import axios, { AxiosError, AxiosResponse } from "axios";

const axiosClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 600000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = store.getState().auth.accessToken;
    if (accessToken) config.headers["Authorization"] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (res: AxiosResponse) => {
    return res;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
