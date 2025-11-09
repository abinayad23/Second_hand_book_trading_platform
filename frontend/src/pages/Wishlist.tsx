import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface WishlistItem {
  id: number;
  book: {
    id: number;
    title: string;
    author?: string;
    quality?: string;
    generatedPrice: number;
    bookImage?: string;
  };
}

interface CartItem {
  id: number;
  book: { id: number };
}

const Wishlist = () => {
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loadingBookId, setLoadingBookId] = useState<number | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchWishlist();
      fetchCart();
    }
  }, [user?.id]);

  // ✅ Fetch Wishlist
  const fetchWishlist = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/api/wishlist`, {
        params: { userId: user.id },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch Cart
  const fetchCart = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/api/cart`, {
        params: { userId: user.id },
      });
      setCartItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ❤️ Remove from Wishlist
  const removeFromWishlist = async (bookId: number) => {
    try {
      await axios.delete(`http://localhost:8082/api/wishlist/remove`, {
        params: { userId: user.id, bookId },
      });
      setWishlist((prev) => prev.filter((item) => item.book.id !== bookId));
      toast.success("Book removed from wishlist!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from wishlist!");
    }
  };

  // 🛒 Add to Cart
  const addToCart = async (bookId: number) => {
    setLoadingBookId(bookId);
    try {
      await axios.post(`http://localhost:8082/api/cart/add`, null, {
        params: { userId: user.id, bookId },
      });
      toast.success("Book added to cart!");
      fetchCart();
    } catch (err: any) {
      if (err.response?.data?.message?.includes("exists")) {
        toast.error("Book already in cart!");
      } else {
        toast.error("Failed to add to cart!");
      }
    } finally {
      setLoadingBookId(null);
    }
  };

  // ❌ Remove from Cart
  const removeFromCart = async (bookId: number) => {
    setLoadingBookId(bookId);
    try {
      await axios.delete(`http://localhost:8082/api/cart/remove`, {
        params: { userId: user.id, bookId },
      });
      toast.success("Book removed from cart!");
      fetchCart();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove from cart!");
    } finally {
      setLoadingBookId(null);
    }
  };

  // 🧠 Helper: check if in cart
  const isInCart = (bookId: number) =>
    cartItems.some((item) => item.book.id === bookId);

  if (!user)
    return (
      <div className="text-center mt-20 text-gray-600">
        Please login to view your wishlist.
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-20 pb-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6 text-center">My Wishlist</h1>

          {wishlist.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">
              No books in your wishlist yet.
            </p>
          ) : (
            <div className="grid md:grid-cols-3 gap-6">
              {wishlist.map((item) => {
                const book = item.book;
                const inCart = isInCart(book.id);

                return (
                  <Card key={item.id} className="shadow-lg">
                    <CardHeader>
                      <CardTitle>{book.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <img
                        src={
                          book.bookImage
                            ? `http://localhost:8082${book.bookImage}`
                            : "https://via.placeholder.com/300x400?text=No+Image"
                        }
                        alt={book.title}
                        className="rounded-lg mb-3 w-full h-64 object-cover"
                      />
                      <p className="text-sm mb-2 text-muted-foreground">
                        by {book.author || "Unknown Author"}
                      </p>
                      <p className="text-sm mb-2">
                        Quality: {book.quality || "N/A"}
                      </p>
                      <p className="font-semibold mb-4">
                        {book.generatedPrice === 0 ? (
                          <span className="text-green-600 font-bold">FREE</span>
                        ) : (
                          <>₹ {book.generatedPrice}</>
                        )}
                      </p>

                      <div className="flex gap-3">
                        {inCart ? (
                          <Button
                            variant="secondary"
                            onClick={() => removeFromCart(book.id)}
                            disabled={loadingBookId === book.id}
                          >
                            {loadingBookId === book.id
                              ? "Removing..."
                              : "Remove from Cart"}
                          </Button>
                        ) : (
                          <Button
                            variant="default"
                            onClick={() => addToCart(book.id)}
                            disabled={loadingBookId === book.id}
                          >
                            {loadingBookId === book.id
                              ? "Adding..."
                              : "Add to Cart"}
                          </Button>
                        )}

                        <Button
                          variant="destructive"
                          onClick={() => removeFromWishlist(book.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Wishlist;
