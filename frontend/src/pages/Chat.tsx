import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { messagesApi } from "@/api/messages";
import { usersApi } from "@/api/users";
import { Message, User, Conversation } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const Chat = () => {
  const { user, token, isAuthenticated } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [mounted, setMounted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // Wait for state hydration
  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Re-check when user/token changes
  useEffect(() => {
    if (user || token) {
      setMounted(true);
    }
  }, [user, token]);

  useEffect(() => {
    if (!mounted) return;
    
    const authenticated = isAuthenticated; // isAuthenticated is already a boolean from useAuth()
    const hasUser = user && (user.id || user.email);
    
    if (hasUser && authenticated) {
      fetchUsers();
    } else {
      // Wait a bit more for state to hydrate
      const timer = setTimeout(() => {
        // Re-check after delay - useAuth hook will re-compute
        const recheckUser = user && (user.id || user.email);
        if (recheckUser && isAuthenticated) {
          fetchUsers();
        } else {
          setLoading(false);
        }
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, token, mounted, isAuthenticated]);

  useEffect(() => {
    if (selectedUser && user?.id) {
      fetchConversation();
      const interval = setInterval(fetchConversation, 3000); // Poll every 3 seconds
      return () => clearInterval(interval);
    }
  }, [selectedUser, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Debug: Check if token exists
      const authStorage = sessionStorage.getItem("auth-storage");
      if (!authStorage) {
        console.error("❌ No auth-storage found in sessionStorage");
        toast.error("Please login to access chat");
        setLoading(false);
        return;
      }
      
      const parsed = JSON.parse(authStorage);
      const token = parsed?.state?.token;
      if (!token) {
        console.error("❌ No token found in auth-storage");
        toast.error("Please login to access chat");
        setLoading(false);
        return;
      }
      
      console.log("🔑 Token found, fetching users...");
      const users = await usersApi.getAllUsers();
      const otherUsers = users.filter((u) => u.id !== user?.id);
      setAllUsers(otherUsers);
      
      // Create conversations from users
      const convs: Conversation[] = otherUsers.map((u) => ({
        otherUser: u,
      }));
      setConversations(convs);
      console.log("✅ Users fetched successfully:", otherUsers.length);
    } catch (error: any) {
      console.error("❌ Failed to fetch users:", error);
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message;
      
      // Debug info
      console.error("Error details:", {
        status,
        message,
        url: error.config?.url,
        headers: error.config?.headers,
      });
      
      // Set empty arrays on error so page still renders
      setAllUsers([]);
      setConversations([]);
      
      if (status === 403) {
        toast.error("Access denied. Please login again. Check console for details.");
        // Suggest checking user verification
        console.error("💡 Tip: Make sure your user account is verified (isVerified = true)");
      } else if (status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error(`Failed to fetch users: ${message || "Please try again later."}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchConversation = async () => {
    if (!selectedUser || !user?.id) return;
    try {
      const msgs = await messagesApi.getConversation(user.id, selectedUser.id);
      setMessages(msgs || []);
    } catch (error: any) {
      console.error("Failed to fetch conversation:", error);
      // Set empty array on error so chat still renders
      setMessages([]);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !user?.id || sending) return;

    setSending(true);
    try {
      await messagesApi.sendMessage(user.id, selectedUser.id, newMessage);
      setNewMessage("");
      await fetchConversation();
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getConversationWithUser = (userId: number) => {
    return conversations.find((c) => c.otherUser.id === userId);
  };

  // Show loading while checking auth state
  if (!mounted || (loading && !user)) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading chat...</div>
      </div>
    );
  }

  // Check authentication - be more lenient
  const authenticated = isAuthenticated; // isAuthenticated is already a boolean from useAuth()
  const hasUser = user && (user.id || user.email);
  const hasAuth = authenticated && hasUser && token;

  if (!hasAuth) {
    // Double check sessionStorage as fallback
    try {
      const stored = sessionStorage.getItem("auth-storage");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.state?.user && parsed?.state?.token) {
          // State exists but not hydrated yet, show loading
          return (
            <div className="container mx-auto p-6">
              <div className="text-center">Loading chat...</div>
            </div>
          );
        }
      }
    } catch (e) {
      // Ignore parse errors
    }

    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Please login to use chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 h-[calc(100vh-8rem)]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
        {/* Conversations List */}
        <Card className="md:col-span-1 flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-full">
              <div className="space-y-1">
                {conversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <p>No conversations yet</p>
                    <p className="text-sm mt-2">Start chatting with other users!</p>
                  </div>
                ) : (
                  conversations.map((conversation) => {
                    const userName = conversation.otherUser.name || conversation.otherUser.email || "Unknown User";
                    return (
                      <button
                        key={conversation.otherUser.id}
                        onClick={() => setSelectedUser(conversation.otherUser)}
                        className={`w-full p-4 flex items-center gap-3 hover:bg-muted transition-colors ${
                          selectedUser?.id === conversation.otherUser.id
                            ? "bg-muted"
                            : ""
                        }`}
                      >
                        <Avatar>
                          <AvatarFallback>
                            {getInitials(userName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">
                            {userName}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Window */}
        <Card className="md:col-span-2 flex flex-col">
          {selectedUser ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(selectedUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedUser.name || selectedUser.email}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender?.id === user?.id;
                      return (
                        <div
                          key={message.id}
                          className={`flex ${
                            isOwn ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            {message.timestamp && (
                              <p
                                className={`text-xs mt-1 ${
                                  isOwn
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {format(
                                  new Date(message.timestamp),
                                  "HH:mm"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={sending}
                    />
                    <Button type="submit" disabled={sending || !newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Chat;

