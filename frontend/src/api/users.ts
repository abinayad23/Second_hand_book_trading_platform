import API from "./api";
import { User } from "@/types";

export const usersApi = {
  getUserById: async (id: number): Promise<User> => {
    const response = await API.get<User>(`/users/${id}`);
    return response.data;
  },

  getAllUsers: async (): Promise<User[]> => {
    const response = await API.get<User[]>("/users");
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await API.delete(`/users/${id}`);
  },
};

