import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getUserFromToken, DecodedUser } from "@/utils/jwtHelper";
import { BookOpen, User, Heart, ShoppingCart, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import NotificationDropdown from "./NotificationDropdown";

const Navbar = () => {
  const [user, setUser] = useState<DecodedUser | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const decodedUser = getUserFromToken();
    setUser(decodedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    // Optional: disconnect NotificationService here if you want
    navigate("/login");
  };

  const handleProtected = (path: string) => {
    if (!user) return navigate("/login");
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path;

  const displayCount = unreadCount > 99 ? "99+" : String(unreadCount);

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl">
          <BookOpen className="h-6 w-6 text-orange-500" />
          <span className="bg-gradient-to-r from-orange-500 to-blue-500 text-transparent bg-clip-text">
            BookSwap
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Button variant="link" className="text-sm font-medium text-rose-700 hover:text-rose-900" onClick={() => handleProtected("/")}>Home</Button>
          <Button variant="link" className="text-sm font-medium text-indigo-700 hover:text-indigo-900" onClick={() => handleProtected("/books")}>Browse Books</Button>
          <Button variant="link" className="text-sm font-medium text-emerald-700 hover:text-emerald-900" onClick={() => handleProtected("/upload")}>List a Book</Button>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/wishlist">
                  <Heart className={`h-5 w-5 ${isActive("/wishlist") ? "stroke-red-600 fill-red-600" : "stroke-red-500"}`} />
                </Link>
              </Button>

              {/* Notification Bell with live unread count */}
              <div className="relative">
                <NotificationDropdown userId={user.id} onUnreadChange={setUnreadCount} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full bg-red-500 text-white text-xs min-w-[1rem] h-4 flex items-center justify-center px-1">
                    {displayCount}
                  </span>
                )}
              </div>

              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart">
                  <ShoppingCart className={`h-5 w-5 ${isActive("/cart") ? "stroke-blue-600 fill-blue-600" : "stroke-blue-500"}`} />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link to="/orders">
                  <Package className={`h-5 w-5 ${isActive("/orders") ? "stroke-green-600 fill-green-600" : "stroke-green-500"}`} />
                </Link>
              </Button>

              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className={`h-5 w-5 ${isActive("/profile") ? "stroke-purple-600 fill-purple-600" : "stroke-purple-500"}`} />
                </Link>
              </Button>

              <Button onClick={handleLogout} className="ml-2 bg-orange-500 text-white hover:bg-orange-600">
                Logout
              </Button>
            </>
          ) : (
            <Button asChild className="ml-2 bg-orange-500 text-white hover:bg-orange-600">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
