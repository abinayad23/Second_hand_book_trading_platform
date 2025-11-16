import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/api/auth";
import { LoginRequest, SignupRequest, User } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuth = () => {
  const { user, token, login, logout, updateUser, isAuthenticated } =
    useAuthStore();
  const navigate = useNavigate();
  
  // Compute isAuthenticated
  const authenticated = isAuthenticated();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      
      // Store token immediately in sessionStorage so API interceptor can use it
      const tempAuthState = {
        state: {
          user: null,
          token: response.token,
          isAuthenticated: true,
        },
      };
      sessionStorage.setItem("auth-storage", JSON.stringify(tempAuthState));
      
      // Wait a bit for token to be stored, then fetch full user data
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Now fetch full user data with the token in the header
      try {
        const userData = await authApi.getCurrentUserByEmail(credentials.email);
        // Store full user data with token
        login(userData, response.token);
        toast.success("Login successful!");
        navigate(
          userData.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"
        );
      } catch (userFetchError: any) {
        // If fetching user fails, try to get user by ID or create minimal user
        console.warn("Could not fetch full user data:", userFetchError);
        
        // Try to get user by making another call after a delay
        try {
          await new Promise(resolve => setTimeout(resolve, 200));
          const userData = await authApi.getCurrentUserByEmail(credentials.email);
          login(userData, response.token);
          toast.success("Login successful!");
          navigate(
            userData.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"
          );
        } catch (retryError) {
          // If still fails, create minimal user object from login response
          const minimalUser: User = {
            id: 0,
            email: credentials.email,
            username: response.username || credentials.email,
            role: response.role || "STUDENT",
            name: "",
            department: "",
            phone: "",
            location: "",
            profileImagePath: "",
            registerNumber: "",
            isFirstYear: false,
            dateOfBirth: null,
            isVerified: true,
            rating: 0,
            createdAt: new Date().toISOString(),
          };
          login(minimalUser, response.token);
          toast.success("Login successful!");
          navigate(
            response.role === "ADMIN" ? "/admin/dashboard" : "/student/dashboard"
          );
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || error.response?.data || "Login failed");
      throw error;
    }
  };

  const handleSignup = async (data: SignupRequest) => {
    try {
      await authApi.signup(data);
      toast.success("Registration initiated! Please verify OTP.");
    } catch (error: any) {
      toast.error(error.response?.data || "Signup failed");
      throw error;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return {
    user,
    token,
    isAuthenticated: authenticated,
    login: handleLogin,
    signup: handleSignup,
    logout: handleLogout,
    updateUser,
    isAdmin: user?.role === "ADMIN",
    isStudent: user?.role === "STUDENT",
  };
};

