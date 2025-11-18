import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { getToken, getUserFromToken } from "@/utils/jwtHelper";
import axios from "axios";
import NotificationCard, { NotificationDTO } from "@/components/NotificationCard";
import { Button } from "@/components/ui/button";
import { CheckCheck } from "lucide-react";

/**
 * This page listens for 'notification:new' window events (dispatched by dropdown)
 * so full-page updates in real-time when WS pushes a new notification.
 */

const Notifications = () => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [allRead, setAllRead] = useState(false);
  const user = getUserFromToken();

  const token = getToken();

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await axios.get<NotificationDTO[]>(
        `http://localhost:8082/api/notifications/${user.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data || []);
      setAllRead((res.data || []).every(n => isUnread(n) === false));
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await axios.post(
        `http://localhost:8082/api/notifications/${user.id}/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, unread: false })));
      setAllRead(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark single notification as read (button in full-page card)
  const markSingleAsRead = async (id: number) => {
    try {
      await axios.post(
        `http://localhost:8082/api/notifications/mark-read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true, unread: false } : n)));
    } catch (err) {
      console.error(err);
    }
  };

  // helper: robust check for unread (supports both isRead and unread fields)
  const isUnread = (n: NotificationDTO) => {
    if (typeof (n as any).isRead === "boolean") return (n as any).isRead === false;
    return (n as any).unread === true;
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time notifications dispatched by the dropdown
    const onNew = (e: any) => {
      const incoming: NotificationDTO = e.detail;
      if (!incoming) return;
      // Normalize: ensure it's treated unread
      (incoming as any).isRead = false;
      (incoming as any).unread = true;
      setNotifications(prev => [incoming, ...prev]);
      setAllRead(false);
    };
    window.addEventListener("notification:new", onNew);

    return () => {
      window.removeEventListener("notification:new", onNew);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Update allRead state whenever notifications change
    const anyUnread = notifications.some(isUnread);
    setAllRead(!anyUnread);
  }, [notifications]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-20 container max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-indigo-700">Notifications</h1>

          <Button
            variant="outline"
            onClick={markAllAsRead}
            disabled={allRead}
            className={`rounded-2xl shadow-md border-indigo-500 text-indigo-600 transition ${
              allRead ? "opacity-40 cursor-not-allowed" : "hover:bg-indigo-50 hover:border-indigo-600"
            }`}
          >
            <CheckCheck className="h-4 w-4 mr-2" /> Mark all as read
          </Button>
        </div>

        <motion.div layout className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* pass onMarkRead so individual items can be marked from full page */}
                <NotificationCard notification={n} onMarkRead={() => markSingleAsRead(n.id)} />
              </motion.div>
            ))
          ) : (
            <div className="text-center p-16 bg-white rounded-2xl shadow-lg border border-gray-200">
              <p className="text-gray-500 text-lg font-medium">You're all caught up! No notifications.</p>
            </div>
          )}
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Notifications;
