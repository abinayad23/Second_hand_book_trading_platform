import API from "./api";
import { LoginRequest, LoginResponse, SignupRequest, User } from "@/types";

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await API.post<LoginResponse>("/users/login", credentials);
    return response.data;
  },

  signup: async (data: SignupRequest): Promise<string> => {
    const response = await API.post<string>("/users/initiate", data);
    return response.data;
  },

  verifyOtp: async (data: SignupRequest, otp: string): Promise<User> => {
    const response = await API.post<User>(`/users/verify?otp=${otp}`, data);
    return response.data;
  },

  getCurrentUser: async (id: number): Promise<User> => {
    const response = await API.get<User>(`/users/${id}`);
    return response.data;
  },

  getCurrentUserByEmail: async (email: string): Promise<User> => {
    const response = await API.get<User>(`/users/email/${encodeURIComponent(email)}`);
    return response.data;
  },

  updateProfile: async (id: number, updates: Partial<User>): Promise<User> => {
    const response = await API.put<User>(`/users/${id}/edit`, updates);
    return response.data;
  },
};

