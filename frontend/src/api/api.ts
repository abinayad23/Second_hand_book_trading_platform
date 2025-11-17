import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8082/api", // backend base URL
});

API.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
);

export default API;
