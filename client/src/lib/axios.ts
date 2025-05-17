import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "https://video-call-real-time-production.up.railway.app/api"
    : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
