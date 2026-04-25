import axios from "axios";
import { tokenStorage } from "../utils/storage";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL,
  timeout: 15000,
});

api.interceptors.request.use(
  (config) => {
    const token = tokenStorage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let injectedStore;

export const injectStore = (store) => {
  injectedStore = store;
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStorage.clearAuth();
      if (injectedStore) {
        injectedStore.dispatch({ type: "auth/logout" });
      }
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
