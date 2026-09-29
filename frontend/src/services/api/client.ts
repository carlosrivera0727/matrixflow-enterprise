import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:8000/api/v1";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      window.localStorage.getItem(
        "matrixflow_token",
      );

    console.log(
      "API REQUEST:",
      config.method?.toUpperCase(),
      config.url,
    );

    console.log(
      "TOKEN EXISTE:",
      Boolean(token),
    );

    if (token) {
      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default apiClient;