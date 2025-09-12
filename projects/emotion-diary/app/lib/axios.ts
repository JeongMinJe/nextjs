import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api", // Next.js API Routes
  timeout: 10000,
});

export default apiClient;
