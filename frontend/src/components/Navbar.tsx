import { Link } from "react-router-dom";
import { BookOpen, User, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen className="h-6 w-6 text-amber-500" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text ">
            BookSwap
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/books" className="text-sm font-medium hover:text-primary transition-colors">
            Browse Books
          </Link>
          <Link to="/sell" className="text-sm font-medium hover:text-primary transition-colors">
            List a Book
          </Link>
          <Link to="/donate" className="text-sm font-medium hover:text-primary transition-colors">
            Donate
          </Link>
        </div>

        <div className="flex items-center gap-2">
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
            <Link to="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <Button asChild className="ml-2 bg-amber-400">
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
