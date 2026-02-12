import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST INTERCEPTOR
api.interceptors.request.use((config) => {
  const rawData = localStorage.getItem("authData");
// console.log("rawData:",   rawData);
  // If rawData is null, just return the config without adding the header
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  }
  if (!rawData) {
    return config;
  }

  const authData = JSON.parse(rawData);
  const token = authData?.token;
  // console.log("accesss token:",token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response: res } = error;

    if (res && res.status === 401) {
      // 1. Clear local storage
      localStorage.removeItem("authData");

      // 2. Redirect to login
      // Using window.location is a "fail-safe" outside of components
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;
