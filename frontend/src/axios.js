import axios from "axios";

// Tworzymy instancję axios
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true // jeśli używasz cookies
});

// Interceptor dodający tokeny z localStorage
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("access-token");
  const client = localStorage.getItem("client");
  const authorization = localStorage.getItem("authorization");

  if (accessToken && client && authorization) {
    config.headers["access-token"] = accessToken;
    config.headers["client"] = client;
    config.headers["authorization"] = `Bearer ${authorization}`;
  }

  return config;
});

export default api;
