import { ENV, ROUTES } from "@/constants";
import axios from "axios";
import Cookies from "js-cookie";

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const axiosInstance = axios.create({
  baseURL: ENV.API_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      Cookies.get("refreshToken")
    ) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${ENV.API_URL}/auth/refresh`, {
          refreshToken: Cookies.get("refreshToken"),
        });

        const { accessToken, refreshToken } = res.data;

        Cookies.set("accessToken", accessToken, { path: "/" });
        Cookies.set("refreshToken", refreshToken, { path: "/" });

        onRefreshed(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("user");
        if (typeof window !== "undefined") {
          window.location.href = ROUTES.AUTH_LOGIN;
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
