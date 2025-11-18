import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BookOpen, Heart, MessageCircle } from "lucide-react";

export interface NotificationDTO {
  id: number;
  title?: string;
  message: string;
  type?: string;
  isRead?: boolean;
  unread?: boolean;
  timestamp?: string;
}

interface Props {
  notification: NotificationDTO;
  onClick?: () => void;
  compact?: boolean;
  onMarkRead?: () => void; // optional callback to mark single item as read
}

const NotificationCard = ({ notification, onClick, compact = false, onMarkRead }: Props) => {
  const getIcon = (type?: string) => {
    switch (type) {
      case "match":
      case "ORDER":
        return <BookOpen className="h-5 w-5 text-indigo-500" />;
      case "message":
      case "MESSAGE":
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case "wishlist":
      case "WISHLIST":
        return <Heart className="h-5 w-5 text-pink-500" />;
      default:
        return <Bell className="h-5 w-5 text-yellow-500" />;
    }
  };

  const isUnread = () => {
    if (typeof notification.isRead === "boolean") return notification.isRead === false;
    return notification.unread === true;
  };

  const bgColor = isUnread() ? "bg-blue-50" : "bg-white";
  const borderColor = isUnread() ? "border-l-4 border-blue-400" : "border border-gray-100";

  return (
    <Card
      className={`flex flex-col gap-3 ${compact ? "p-2" : "p-4"} cursor-pointer transition-all duration-200 hover:shadow-lg ${bgColor} ${borderColor}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex gap-3 items-center">
          <div className={`p-2 rounded-full ${isUnread() ? "bg-blue-100" : "bg-green-100"}`}>
            {getIcon(notification.type)}
          </div>

          <div>
            <p className={`text-sm ${isUnread() ? "font-semibold text-slate-900" : "text-gray-700"}`}>
              {notification.title ? `${notification.title} — ` : ""}{notification.message}
            </p>
            {!compact && notification.timestamp && (
              <p className="text-xs text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Single-item mark as read button */}
        {!compact && isUnread() && onMarkRead && (
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => { e.stopPropagation(); onMarkRead(); }}
            className="self-start ml-auto text-xs"
          >
            Mark as read
          </Button>
        )}
      </div>

      {/* NEW badge */}
      {isUnread() && (
        <Badge className={`rounded-full px-2 py-0.5 text-xs ${compact ? "text-[10px]" : "text-xs"} bg-sky-100 text-sky-600 mt-1`}>
          NEW
        </Badge>
      )}
    </Card>
  );
};

export default NotificationCard;
