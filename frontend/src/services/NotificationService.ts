import { Client, Message } from "@stomp/stompjs";
import SockJS from "sockjs-client";

class NotificationService {
  private client: Client | null = null;
  private isConnected = false;

  connect(userId: number, token: string, onMessageReceived: (msg: any) => void) {
    if (this.isConnected) {
      console.log("WebSocket already connected.");
      return;
    }

    this.client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8082/ws"),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP]", str),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    this.client.onConnect = () => {
      this.isConnected = true;
      console.log("Connected to WebSocket");

      this.client?.subscribe(`/topic/notifications/${userId}`, (message: Message) => {
        try {
          const body = JSON.parse(message.body);

          // 🔥 Force unread always true for new incoming notifications
          body.unread = true;

          console.log("📩 Incoming notif:", body);
          onMessageReceived(body);
        } catch (e) {
          console.error("Failed to parse WebSocket message:", e);
        }
      });
    };

    this.client.activate();
  }

  disconnect() {
    // ❗ Do NOT disconnect automatically — leave it optional
    // this should only be called when user LOGS OUT
    if (this.client) {
      this.client.deactivate();
      this.isConnected = false;
      console.log("Disconnected from WebSocket");
    }
  }
}

export default new NotificationService();
