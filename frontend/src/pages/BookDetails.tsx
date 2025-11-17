// src/pages/BookDetails.tsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios, { AxiosHeaders } from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  IndianRupee,
  BookOpen,
  User,
  Mail,
  Building2,
  Heart,
  HeartOff,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { getUserFromToken } from "@/utils/jwtHelper";

interface Owner {
  id: number;
  name: string;
  email: string;
  department?: string;
}

interface Book {
  id: number;
  title: string;
  author?: string;
  edition?: string;
  description?: string;
  type?: string;
  quality?: string;
  bookImage?: string;
  originalPrice: number;
  generatedPrice?: number;
  available: boolean;
  bookAddedTime?: string;
  owner?: Owner;
}

// 🔹 Axios instance with JWT interceptor
const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    if (!config.headers) {
      config.headers = new AxiosHeaders();
    }
    (config.headers as AxiosHeaders).set("Authorization", `Bearer ${token}`);
  }
  return config;
});

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);

  const user = getUserFromToken();

  useEffect(() => {
    if (id) fetchBookData();
  }, [id, user?.email]);

  // 🔹 Fetch Book + Wishlist + Cart Status
  const fetchBookData = async () => {
    try {
      setLoading(true);

      const bookRes = await axiosInstance.get<Book>(
        `http://localhost:8082/api/books/${id}`
      );
      setBook(bookRes.data);

      if (user?.email) {
        // Wishlist check
        const wishlistRes = await axiosInstance.get(`http://localhost:8082/api/wishlist`, {
          params: { userEmail: user.email },
        });
        setInWishlist(wishlistRes.data.some((w: any) => w.book.id === Number(id)));

        // Cart check
        const cartRes = await axiosInstance.get(`http://localhost:8082/api/cart`, {
          params: { userEmail: user.email },
        });
        setInCart(cartRes.data.some((c: any) => c.book.id === Number(id)));
      }
    } catch (err) {
      console.error("Error fetching book or status:", err);
    } finally {
      setLoading(false);
    }
  };

  // ❤️ Toggle Wishlist
  const handleWishlistToggle = async () => {
    if (!user) return toast.error("Please log in to manage wishlist.");
    if (book?.owner?.email === user.email)
      return toast.error("You cannot add your own book to wishlist.");

    setLoadingAction(true);
    try {
      if (inWishlist) {
        await axiosInstance.delete(`http://localhost:8082/api/wishlist/remove`, {
          params: { userEmail: user.email, bookId: id },
        });
        toast.success("Removed from wishlist!");
        setInWishlist(false);
      } else {
        await axiosInstance.post(
          `http://localhost:8082/api/wishlist/add`,
          {},
          { params: { userEmail: user.email, bookId: id } }
        );
        toast.success("Added to wishlist!");
        setInWishlist(true);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating wishlist!");
    } finally {
      setLoadingAction(false);
    }
  };

  // 🛒 Toggle Cart (Add/Remove)
  const handleCartToggle = async () => {
    if (!user) return toast.error("Please log in to manage cart.");
    if (book?.owner?.email === user.email)
      return toast.error("You cannot buy your own book.");

    setLoadingAction(true);
    try {
      if (inCart) {
        await axiosInstance.delete(`http://localhost:8082/api/cart/remove`, {
          params: { userEmail: user.email, bookId: id },
        });
        toast.success("Removed from cart!");
        setInCart(false);
      } else {
        await axiosInstance.post(`http://localhost:8082/api/cart/add`, null, {
          params: { userEmail: user.email, bookId: id },
        });
        toast.success("Book added to cart!");
        setInCart(true);
      }
    } catch (err: any) {
      if (err.response?.data?.message?.includes("exists")) {
        toast.error("Book already in cart!");
        setInCart(true);
      } else {
        console.error(err);
        toast.error("Error updating cart!");
      }
    } finally {
      setLoadingAction(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading book details...</p>
      </div>
    );

  if (!book)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Book not found.</p>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-10 flex-1">
        {/* 🔙 Back Button */}
        <Button variant="outline" className="mb-6" asChild>
          <Link to="/books">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </Button>

        {/* 📘 Book Details */}
        <Card className="p-6 md:p-10 flex flex-col md:flex-row gap-10 shadow-md">
          {/* Left: Book Image */}
          <div className="flex-shrink-0 w-full md:w-1/3">
            <img
              src={
                book.bookImage
                  ? `http://localhost:8082${book.bookImage}`
                  : "https://via.placeholder.com/400x500?text=No+Image"
              }
              alt={book.title}
              className="w-full h-auto rounded-xl border"
            />
            {!book.available && (
              <Badge variant="destructive" className="mt-4">
                Not Available
              </Badge>
            )}
          </div>

          {/* Right: Book Info */}
          <CardContent className="flex-1 space-y-6">
            <h1 className="text-3xl font-bold">{book.title}</h1>
            <p className="text-muted-foreground">Author: {book.author || "Unknown"}</p>

            <div className="flex items-center gap-2 text-amber-500 font-bold text-2xl">
              {book.generatedPrice === 0 ? (
                <span className="text-green-600 text-2xl">FREE</span>
              ) : (
                <>
                  <IndianRupee className="h-5 w-5" /> {book.generatedPrice}
                </>
              )}
            </div>

            {book.generatedPrice !== 0 && (
              <p className="text-sm text-muted-foreground">
                Estimated value: ₹{book.originalPrice.toFixed(2)}
              </p>
            )}

            {book.description && (
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-amber-500" /> Description
                </h3>
                <p className="text-muted-foreground">{book.description}</p>
              </div>
            )}

            {/* 👤 Seller Info */}
            {book.owner && (
              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Seller Information</h3>
                <p>
                  <User className="inline-block mr-2 h-4 w-4" />
                  {book.owner.name}
                </p>
                <p>
                  <Mail className="inline-block mr-2 h-4 w-4" />
                  {book.owner.email}
                </p>
                {book.owner.department && (
                  <p>
                    <Building2 className="inline-block mr-2 h-4 w-4" />
                    {book.owner.department}
                  </p>
                )}
              </div>
            )}

            {/* ❤️ Wishlist & Cart Buttons */}
            {book.owner?.email !== user?.email && (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant={inWishlist ? "destructive" : "outline"}
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-2"
                  disabled={loadingAction}
                >
                  {inWishlist ? (
                    <>
                      <HeartOff className="h-4 w-4" /> Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4" /> Add to Wishlist
                    </>
                  )}
                </Button>

                <Button
                  variant={inCart ? "secondary" : "default"}
                  onClick={handleCartToggle}
                  className="flex items-center gap-2"
                  disabled={loadingAction}
                >
                  {loadingAction ? (
                    "Processing..."
                  ) : inCart ? (
                    <>
                      <Trash2 className="h-4 w-4" /> Remove from Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
