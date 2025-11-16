import API from "./api";
import { Message } from "@/types";

export const messagesApi = {
  sendMessage: async (
    senderId: number,
    receiverId: number,
    content: string
  ): Promise<Message> => {
    const response = await API.post<Message>(
      `/messages/send?senderId=${senderId}&receiverId=${receiverId}&content=${encodeURIComponent(content)}`
    );
    return response.data;
  },

  getConversation: async (
    user1Id: number,
    user2Id: number
  ): Promise<Message[]> => {
    const response = await API.get<Message[]>(
      `/messages/conversation?user1Id=${user1Id}&user2Id=${user2Id}`
    );
    return response.data;
  },
};

