import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.SSR
    ? `http://localhost:${process.env.NODE_PORT || 6100}/api`
    : "/api",
  timeout: 10000,
  withCredentials: true,
});

export default instance;
