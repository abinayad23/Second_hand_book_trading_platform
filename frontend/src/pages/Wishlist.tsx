// src/pages/Wishlist.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios, { AxiosHeaders } from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";
import { getUserFromToken } from "@/utils/jwtHelper";

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

interface User {
  id: number;
  name?: string;
}

interface Book {
  id: number;
  title: string;
  author?: string;
  quality?: string;
  type?: string;
  originalPrice: number;
  generatedPrice?: number;
  available: boolean;
  bookImage?: string;
  owner?: User;
}

const Wishlist = () => {
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [loadingIds, setLoadingIds] = useState<{ [key: number]: boolean }>({});
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (userFromToken?.id) {
      setCurrentUser({
        id: userFromToken.id,
        name: userFromToken.username,
      });
    }
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchData = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          axiosInstance.get("http://localhost:8082/api/wishlist", {
            params: { userId: currentUser.id },
          }),
          axiosInstance.get("http://localhost:8082/api/cart", {
            params: { userId: currentUser.id },
          }),
        ]);

        setWishlist(wishlistRes.data.map((it: any) => it.book));
        setCartIds(cartRes.data.map((it: any) => it.book.id));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [currentUser?.id]);

  const setItemLoading = (id: number, val: boolean) => {
    setLoadingIds((prev) => ({ ...prev, [id]: val }));
  };

  const removeFromWishlist = async (bookId: number) => {
    if (!currentUser?.id) return;

    setItemLoading(bookId, true);
    try {
      await axiosInstance.delete("http://localhost:8082/api/wishlist/remove", {
        params: { userId: currentUser.id, bookId },
      });
      setWishlist((prev) => prev.filter((b) => b.id !== bookId));
    } catch (err) {
      console.error(err);
    } finally {
      setItemLoading(bookId, false);
    }
  };

  const toggleCart = async (book: Book) => {
    if (!currentUser?.id) return;

    const bookId = book.id;
    setItemLoading(bookId, true);

    try {
      if (cartIds.includes(bookId)) {
        await axiosInstance.delete("http://localhost:8082/api/cart/remove", {
          params: { userId: currentUser.id, bookId },
        });
        setCartIds((prev) => prev.filter((id) => id !== bookId));
      } else {
        await axiosInstance.post("http://localhost:8082/api/cart/add", null, {
          params: { userId: currentUser.id, bookId },
        });
        setCartIds((prev) => [...prev, bookId]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setItemLoading(bookId, false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 py-10 flex-1">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900">Your Wishlist</h1>
          <p className="mt-2 text-gray-600">
            All books you have added to your wishlist appear here.
          </p>
        </div>

        {/* FIXED GRID ALIGNMENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {wishlist.map((book) => {
            const isInCart = cartIds.includes(book.id);
            const isLoading = !!loadingIds[book.id];

            return (
              <Card
                key={book.id}
                className="flex flex-col h-full rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all border border-gray-200"
              >
                {/* Image Section */}
                <div className="relative aspect-[3/4] bg-gray-100">
                  <img
                    src={
                      book.bookImage
                        ? `http://localhost:8082${book.bookImage}`
                        : "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Wishlist Remove Button */}
                  <Button
                    size="icon"
                    onClick={() => removeFromWishlist(book.id)}
                    aria-label="Remove from wishlist"
                    className={`absolute top-3 right-3 rounded-full h-10 w-10 shadow-md border bg-amber-500 text-white hover:bg-amber-600 transition-colors ${
                      isLoading ? "opacity-60 pointer-events-none" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <Heart className="h-5 w-5 fill-white" />
                  </Button>

                  {/* Cart Button */}
                  <Button
                    size="icon"
                    onClick={() => toggleCart(book)}
                    aria-label="Toggle cart"
                    className={`absolute top-16 right-3 rounded-full h-10 w-10 shadow-md border bg-white transition-colors ${
                      isInCart
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "text-green-600 hover:bg-green-50"
                    } ${isLoading ? "opacity-60 pointer-events-none" : ""}`}
                  >
                    <ShoppingCart
                      className={`h-5 w-5 ${isInCart ? "fill-white" : ""}`}
                    />
                  </Button>

                  {/* Book Type Badge */}
                  <Badge
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-white shadow-md"
                    style={{
                      backgroundColor:
                        book.type?.toLowerCase() === "donate"
                          ? "#16a34a"
                          : book.type?.toLowerCase() === "exchange"
                          ? "#3b82f6"
                          : "#f59e0b",
                    }}
                  >
                    {book.type?.toUpperCase() || "Sale"}
                  </Badge>
                </div>

                {/* Content */}
                <CardContent className="flex-1 pt-4 px-5 pb-3">
                  <h3 className="font-semibold text-lg line-clamp-1 text-gray-900 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {book.author || "Unknown Author"}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    {book.generatedPrice === 0 ? (
                      <span className="text-lg font-bold text-green-600">FREE</span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-amber-600">
                          ₹{book.generatedPrice}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          (₹{book.originalPrice})
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline" className="text-gray-700">
                      {book.quality || "N/A"}
                    </Badge>
                    <p className="text-xs text-gray-500">
                      Seller: {book.owner?.name || "Unknown"}
                    </p>
                  </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-5 pt-0">
                  <Button
                    asChild
                    className="w-full h-12 text-white bg-amber-500 hover:bg-amber-600 rounded-lg"
                  >
                    <Link to={`/books/${book.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {wishlist.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            Your wishlist is empty.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Wishlist;
