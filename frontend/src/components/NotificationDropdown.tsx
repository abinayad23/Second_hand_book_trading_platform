import { useEffect, useState, useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken } from "@/utils/jwtHelper";
import NotificationService from "@/services/NotificationService";
import NotificationCard, { NotificationDTO } from "./NotificationCard";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  userId: number;
  onUnreadChange?: (count: number) => void;
}

const NotificationDropdown = ({ userId, onUnreadChange }: Props) => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const token = getToken() || "";
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!userId) return;
    try {
      const res = await axios.get<NotificationDTO[]>(
        `http://localhost:8082/api/notifications/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.post(
        `http://localhost:8082/api/notifications/${userId}/mark-all-read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true, unread: false })));
    } catch (err) {
      console.error(err);
    }
  };

  const handleIncomingNotification = (notification: NotificationDTO) => {
    notification.isRead = false;
    notification.unread = true;
    setNotifications(prev => [notification, ...prev]);
    // Notify full-page listener
    window.dispatchEvent(new CustomEvent("notification:new", { detail: notification }));
  };

  useEffect(() => {
    fetchNotifications();
    NotificationService.connect(userId, token, handleIncomingNotification);

    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userId]);

  // Update parent about unread count
  useEffect(() => {
    const count = notifications.filter(n => n.isRead === false || n.unread).length;
    onUnreadChange?.(count);
  }, [notifications, onUnreadChange]);

  const unreadCount = notifications.filter(n => n.isRead === false || n.unread).length;
  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="icon" onClick={() => setOpen(!open)} className="relative">
        <Bell className={`h-5 w-5 ${open ? "stroke-yellow-500 fill-yellow-500" : "stroke-yellow-500"}`} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs min-w-[1rem] h-4 flex items-center justify-center px-1">
            {displayCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-2xl z-50 max-h-96 overflow-y-auto border border-gray-200"
          >
            <div className="flex justify-between items-center p-3 border-b border-gray-200">
              <span className="font-semibold text-slate-700 text-sm">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-800 transition">
                  Mark all read
                </button>
              )}
            </div>

            <div className="space-y-2 p-2">
              {notifications.length === 0 ? (
                <p className="p-4 text-gray-500 text-sm text-center">No notifications</p>
              ) : (
                notifications.slice(0, 6).map(n => (
                  <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
                    <NotificationCard notification={n} compact />
                  </motion.div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="text-center mt-2 p-2 border-t border-gray-200">
                <button
                  onClick={() => { setOpen(false); navigate("/notifications"); }}
                  className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition"
                >
                  View all
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
