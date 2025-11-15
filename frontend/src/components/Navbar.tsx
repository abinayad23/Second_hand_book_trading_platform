import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  User,
  Heart,
  Bell,
  ShoppingCart,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // ✅ Protected navigation handler
  const handleProtectedNavigation = (path: string) => {
    if (!user) {
      // Not logged in → go to login first
      navigate("/login");
    } else {
      // Logged in → go to requested path
      navigate(path);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6 text-amber-500" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text">
            BookSwap
          </span>
        </Link>

        {/* Navigation links (always visible) */}
        <div className="hidden md:flex items-center gap-6">
          <Button
            variant="link"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => handleProtectedNavigation("/books")}
          >
            Browse Books
          </Button>
          <Button
            variant="link"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => handleProtectedNavigation("/sell")}
          >
            List a Book
          </Button>
          <Button
            variant="link"
            className="text-sm font-medium hover:text-primary transition-colors"
            onClick={() => handleProtectedNavigation("/donate")}
          >
            Donate
          </Button>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/wishlist">
                  <Heart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/notifications">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/orders">
                  <Package className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link to="/profile">
                  <User className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                onClick={handleLogout}
                className="ml-2 bg-amber-400 text-white hover:bg-amber-500"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button
              asChild
              className="ml-2 bg-amber-400 text-white hover:bg-amber-500"
            >
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
