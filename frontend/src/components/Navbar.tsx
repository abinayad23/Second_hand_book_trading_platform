import { Link, useNavigate } from "react-router-dom";
import { BookOpen, User, MessageSquare, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { notificationsApi } from "@/api/notifications";

const Navbar = () => {
  const { user, token, isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Compute isAuthenticated from user and token
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated && user?.id) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30 seconds
      return () => clearInterval(interval);
    }
  }, [authenticated, user]);

  const fetchUnreadCount = async () => {
    if (!user?.id) return;
    try {
      const notifications = await notificationsApi.getUnreadNotifications(user.id);
      setUnreadCount(notifications.length);
    } catch (error) {
      // Silently fail
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6 text-primary" />
          <span>CampusLink</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link
            to="/books"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Browse Books
          </Link>
          {authenticated && user && (
            <>
              {user.role === "STUDENT" && (
                <>
                  <Link
                    to="/student/dashboard"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    My Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Post Book
                  </Link>
                  <Link
                    to="/chat"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Messages
                  </Link>
                </>
              )}
              {user.role === "ADMIN" && (
                <Link
                  to="/admin/dashboard"
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  Admin Dashboard
                </Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {authenticated && user && token ? (
            <>
              <Button variant="ghost" size="icon" asChild className="relative">
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </Badge>
                  )}
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/chat">
                  <MessageSquare className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <div className="flex items-center gap-2 ml-2">
                <span className="text-sm text-muted-foreground hidden sm:inline">
                  {user.name || user.email || "User"}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
