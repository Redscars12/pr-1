import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://events-api-cmwi.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && token !== "undefined") {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/Auth/refresh-token`, {
  refreshToken: refreshToken
});

          const { accessToken, refreshToken: newRefreshToken } = response.data;
          
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const registerUser = (data) => api.post("/Auth/register", data);
export const loginUser = (data) => api.post("/Auth/login", data);

export const getEvents = () => api.get("/Event");
export const getEventById = (id) => api.get(`/Event/${id}`);
export const createEvent = (data) => api.post("/Event", data);
export const updateEvent = (id, data) => api.put(`/Event/${id}`, data);
export const deleteEvent = (id) => api.delete(`/Event/${id}`);
export const registerForEvent = (id) => api.post(`/Event/register/${id}`);

export const getCategories = () => api.get("/Category");
export const createCategory = (data) => api.post("/Category", data);
