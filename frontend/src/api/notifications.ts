import API from "./api";
import { Notification } from "@/types";

export const notificationsApi = {
  getAllNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await API.get<Notification[]>(`/notifications/user/${userId}`);
    return response.data;
  },

  getUnreadNotifications: async (userId: number): Promise<Notification[]> => {
    const response = await API.get<Notification[]>(`/notifications/unread?userId=${userId}`);
    return response.data;
  },

  markAsRead: async (notificationId: number): Promise<void> => {
    await API.put(`/notifications/read/${notificationId}`);
  },

  markAllAsRead: async (userId: number): Promise<void> => {
    await API.put(`/notifications/read-all?userId=${userId}`);
  },
};

