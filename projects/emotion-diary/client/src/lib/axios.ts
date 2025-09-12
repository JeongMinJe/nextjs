import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://emotiondiary-gilt.vercel.app/api" // Production
    : "http://localhost:4000/api", // Development
  timeout: 10000,
});

export default apiClient;
