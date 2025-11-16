import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9092/api", // backend base URL
});

// Request interceptor to add JWT token
API.interceptors.request.use(
  (config) => {
    // Try to get token from sessionStorage (Zustand persist format)
    // Using sessionStorage for tab isolation
    const authStorage = sessionStorage.getItem("auth-storage");
    if (authStorage) {
      try {
        const parsed = JSON.parse(authStorage);
        // Zustand persist stores as { state: { user, token } }
        const token = parsed?.state?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          // Only log for debugging - remove in production
          if (config.url?.includes("/users") || config.url?.includes("/messages")) {
            console.log("🔑 Token added to request:", config.url);
          }
        } else {
          console.warn("⚠️ No token in auth-storage for:", config.url);
        }
      } catch (e) {
        console.error("❌ Error parsing auth-storage:", e);
      }
    } else {
      // Only warn for protected endpoints
      if (!config.url?.includes("/login") && 
          !config.url?.includes("/register") && 
          !config.url?.includes("/initiate") &&
          !config.url?.includes("/verify") &&
          !config.url?.includes("/send-otp")) {
        console.warn("⚠️ No auth-storage found for protected endpoint:", config.url);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
API.interceptors.response.use(
  response => response,
  error => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.response?.data?.error || error.message;
    
    console.error("API Error:", {
      url: error.config?.url,
      status,
      message,
      data: error.response?.data
    });
    
    if (status === 401) {
      console.log("🔄 401 Unauthorized - Redirecting to login");
      sessionStorage.removeItem("auth-storage");
      window.location.href = "/login";
    } else if (status === 403) {
      console.error("🚫 403 Forbidden - Token may be invalid or expired");
      // Don't redirect on 403, let the component handle it
    }
    
    throw error;
  }
);

export default API;
