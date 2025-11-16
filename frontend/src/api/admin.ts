import API from "./api";
import { Book, User } from "@/types";

export const adminApi = {
  getAllUsers: async (): Promise<User[]> => {
    const response = await API.get<User[]>("/admin/users");
    return response.data;
  },

  getAllBooks: async (): Promise<Book[]> => {
    const response = await API.get<Book[]>("/admin/books");
    return response.data;
  },

  deleteReview: async (reviewId: number): Promise<void> => {
    await API.delete(`/admin/reviews/${reviewId}`);
  },

  updateUserRole: async (userId: number, role: string): Promise<User> => {
    const response = await API.put<User>(`/admin/users/${userId}/role`, null, {
      params: { role },
    });
    return response.data;
  },

  toggleUserVerification: async (userId: number): Promise<User> => {
    const response = await API.put<User>(`/admin/users/${userId}/verify`);
    return response.data;
  },

  deleteUser: async (userId: number): Promise<void> => {
    await API.delete(`/admin/users/${userId}`);
  },
};

