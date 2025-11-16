import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

interface ChatMessageType {
  sender: string;
  content: string;
  timestamp?: string;
}

const ChatMessage: React.FC = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const [messages, setMessages] = useState<ChatMessageType[]>(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  // Wait for hydration from localStorage
  React.useEffect(() => {
    // Give Zustand time to hydrate from localStorage
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Re-check authentication when user/token changes
  React.useEffect(() => {
    if (user || token) {
      setMounted(true);
    }
  }, [user, token]);

  const authenticated = isAuthenticated();
  const username = user?.name || user?.username || user?.email || "Guest";

  // Debug logging (remove in production)
  React.useEffect(() => {
    if (mounted) {
      console.log("ChatMessage - Auth State:", {
        hasUser: !!user,
        hasToken: !!token,
        authenticated,
        userEmail: user?.email,
      });
    }
  }, [mounted, user, token, authenticated]);

  /** Save messages in localStorage */
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  /** Send message */
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg: ChatMessageType = {
      sender: username,
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  // Show loading while checking auth state (but only briefly)
  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Check authentication - be more lenient, check if user or token exists
  // Sometimes token might be in sessionStorage but not yet in store
  const hasAuth = authenticated || (user && token) || (user && sessionStorage.getItem("auth-storage"));
  
  if (!hasAuth || !user) {
    // Double check sessionStorage directly as fallback
    try {
      const stored = sessionStorage.getItem("auth-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user && parsed?.state?.token) {
          // State exists but not hydrated yet, show loading
          return (
            <div className="flex items-center justify-center h-96">
              <div className="text-center text-muted-foreground">Loading chat...</div>
            </div>
          );
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
    
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Please login to use chat</h3>
          <p className="text-muted-foreground">You need to be logged in to send messages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-muted/30 rounded-lg">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender === username ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  msg.sender === username
                    ? "bg-primary text-primary-foreground"
                    : "bg-background border"
                }`}
              >
                <div className="text-xs font-semibold mb-1 opacity-80">
                  {msg.sender}
                </div>
                <div>{msg.content}</div>
                {msg.timestamp && (
                  <div className="text-xs opacity-60 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={sendMessage}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatMessage;