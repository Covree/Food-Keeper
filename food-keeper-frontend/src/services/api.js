import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: BASE_URL,
});

// Anexa o token JWT em toda requisição autenticada
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("fk_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normaliza erros da API (ApiError do back-end) e trata 401 globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("fk_token");
      localStorage.removeItem("fk_user");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }

    const backendMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string" ? error.response.data : null);

    return Promise.reject({
      status: error.response?.status,
      message: backendMessage || "Não foi possível completar a operação. Tente novamente.",
      raw: error,
    });
  }
);
