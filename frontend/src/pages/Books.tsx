import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Heart, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface User {
  id: number;
  name?: string;
  email?: string;
}

interface Book {
  id: number;
  title: string;
  author?: string;
  quality?: string;
  type?: string;
  originalPrice: number;
  generatedPrice?: number;
  description?: string;
  available: boolean;
  bookImage?: string;
  owner?: User;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [wishlistIds, setWishlistIds] = useState<number[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [loadingIds, setLoadingIds] = useState<{ [id: number]: boolean }>(
    {}
  ); // per-item loading flag

  // get logged-in user
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));
  }, []);

  // fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get<Book[]>("http://localhost:8082/api/books");
        setBooks(res.data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  // fetch wishlist & cart for current user
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchLists = async () => {
      try {
        const [wishlistRes, cartRes] = await Promise.all([
          axios.get("http://localhost:8082/api/wishlist", {
            params: { userId: currentUser.id },
          }),
          axios.get("http://localhost:8082/api/cart", {
            params: { userId: currentUser.id },
          }),
        ]);

        setWishlistIds(wishlistRes.data.map((it: any) => it.book.id));
        setCartIds(cartRes.data.map((it: any) => it.book.id));
      } catch (err) {
        console.error("Failed to fetch wishlist/cart:", err);
      }
    };

    fetchLists();
  }, [currentUser?.id]);

  // search handler
  const handleSearch = async () => {
    try {
      const res = await axios.get<Book[]>(
        searchQuery.trim()
          ? `http://localhost:8082/api/books/search?q=${encodeURIComponent(
              searchQuery
            )}`
          : "http://localhost:8082/api/books"
      );
      setBooks(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // helper to set per-item loading
  const setItemLoading = (bookId: number, value: boolean) =>
    setLoadingIds((p) => ({ ...p, [bookId]: value }));

  // toggle wishlist: if in wishlist -> remove, else add
  const toggleWishlist = async (book: Book) => {
    if (!currentUser?.id) {
      alert("Please log in first.");
      return;
    }
    if (book.owner?.id === currentUser.id) {
      alert("You cannot add your own book to wishlist.");
      return;
    }

    const bookId = book.id;
    setItemLoading(bookId, true);

    try {
      if (wishlistIds.includes(bookId)) {
        // remove
        await axios.delete("http://localhost:8082/api/wishlist/remove", {
          params: { userId: currentUser.id, bookId },
        });
        setWishlistIds((prev) => prev.filter((id) => id !== bookId));
      } else {
        // add
        await axios.post("http://localhost:8082/api/wishlist/add", null, {
          params: { userId: currentUser.id, bookId },
        });
        setWishlistIds((prev) => [...prev, bookId]);
      }
    } catch (err: any) {
      console.error("Wishlist toggle error:", err);
      const msg = err?.response?.data?.message || "Failed to update wishlist.";
      alert(msg);
    } finally {
      setItemLoading(bookId, false);
    }
  };

  // toggle cart: if in cart -> remove, else add
  const toggleCart = async (book: Book) => {
    if (!currentUser?.id) {
      alert("Please log in first.");
      return;
    }
    if (book.owner?.id === currentUser.id) {
      alert("You cannot add your own book to cart.");
      return;
    }

    const bookId = book.id;
    setItemLoading(bookId, true);

    try {
      if (cartIds.includes(bookId)) {
        // remove
        await axios.delete("http://localhost:8082/api/cart/remove", {
          params: { userId: currentUser.id, bookId },
        });
        setCartIds((prev) => prev.filter((id) => id !== bookId));
      } else {
        // add
        await axios.post("http://localhost:8082/api/cart/add", null, {
          params: { userId: currentUser.id, bookId },
        });
        setCartIds((prev) => [...prev, bookId]);
      }
    } catch (err: any) {
      console.error("Cart toggle error:", err);
      const msg = err?.response?.data?.message || "Failed to update cart.";
      alert(msg);
    } finally {
      setItemLoading(bookId, false);
    }
  };

  // filtered books
  const filteredBooks = books.filter((book) => {
    const matchesType =
      filterType === "all" ||
      (filterType === "sale" && book.type?.toLowerCase() === "sale") ||
      (filterType === "exchange" && book.type?.toLowerCase() === "exchange") ||
      (filterType === "donate" && book.type?.toLowerCase() === "donate");
    return matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            Explore books available for sale, exchange, or donation
          </p>
        </div>

{/* Search + Filter */}
<div className="flex flex-col md:flex-row gap-4 mb-8">
  {/* 🔍 Search Bar */}
  <div className="relative flex-1">
    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
    <Input
      placeholder="Search by title or author..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      className="pl-10 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 
                 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 rounded-lg transition"
    />
  </div>

  {/* 🔘 Search Button */}
  <Button
    onClick={handleSearch}
    className="bg-amber-500 text-white hover:bg-amber-600 rounded-lg"
  >
    Search
  </Button>

  {/* 🧩 Filter Dropdown */}
  <Select value={filterType} onValueChange={setFilterType}>
    <SelectTrigger
      className="w-full md:w-48 border border-gray-300 bg-white text-gray-900 rounded-lg 
                 hover:bg-amber-50 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 
                 transition data-[state=open]:bg-amber-100 data-[state=open]:border-amber-500"
    >
      <Filter className="h-4 w-4 mr-2 text-amber-500" />
      <SelectValue placeholder="Filter by type" />
    </SelectTrigger>

    <SelectContent className="bg-white text-gray-900 shadow-lg rounded-lg border border-gray-200">
      <SelectItem value="all" className="hover:bg-amber-100 cursor-pointer">
        All Types
      </SelectItem>
      <SelectItem value="sale" className="hover:bg-amber-100 cursor-pointer">
        For Sale
      </SelectItem>
      <SelectItem value="exchange" className="hover:bg-amber-100 cursor-pointer">
        Exchange
      </SelectItem>
      <SelectItem value="donate" className="hover:bg-amber-100 cursor-pointer">
        Donate
      </SelectItem>
    </SelectContent>
  </Select>
</div>



        {/* Books List */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => {
            const isInWishlist = wishlistIds.includes(book.id);
            const isInCart = cartIds.includes(book.id);
            const isLoading = !!loadingIds[book.id];

            return (
              <Card
                key={book.id}
                className="group hover:shadow-lg overflow-hidden relative"
              >
                {/* Book Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={
                      book.bookImage
                        ? `http://localhost:8082${book.bookImage}`
                        : "https://via.placeholder.com/300x400?text=No+Image"
                    }
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Wishlist + Cart Buttons */}
                  {currentUser?.id !== book.owner?.id && (
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <Button
                        size="icon"
                        onClick={() => toggleWishlist(book)}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        className={`rounded-full shadow-md border border-gray-200 transition-colors ${
                          isInWishlist
                            ? "bg-amber-500 text-white hover:bg-amber-600"
                            : "bg-white hover:bg-amber-100 text-amber-500"
                        } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist ? "fill-white" : ""}`} />
                      </Button>

                      <Button
                        size="icon"
                        onClick={() => toggleCart(book)}
                        aria-label={isInCart ? "Remove from cart" : "Add to cart"}
                        className={`rounded-full shadow-md border border-gray-200 transition-colors ${
                          isInCart
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-white hover:bg-green-100 text-green-600"
                        } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                      >
                        <ShoppingCart className={`h-5 w-5 ${isInCart ? "fill-white" : ""}`} />
                      </Button>
                    </div>
                  )}

                  {/* Type Badge */}
                  <Badge
                    className="absolute top-3 left-3 capitalize text-white font-medium px-3 py-1 rounded-full shadow-md"
                    style={{
                      backgroundColor:
                        book.type?.toLowerCase() === "donate"
                          ? "#16a34a"
                          : book.type?.toLowerCase() === "exchange"
                          ? "#3b82f6"
                          : "#f59e0b",
                    }}
                  >
                    {book.type || "Sale"}
                  </Badge>
                </div>

                {/* Book Info */}
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {book.author || "Unknown Author"}
                  </p>

                  <div className="flex items-baseline gap-2 mb-2">
                    {book.generatedPrice === 0 ? (
                      <span className="text-lg font-bold text-green-600">FREE</span>
                    ) : (
                      <>
                        <span className="text-xl font-bold text-amber-500">
                          ₹{book.generatedPrice}
                        </span>
                        {book.originalPrice && book.generatedPrice !== 0 && (
                          <span className="text-xs text-muted-foreground line-through">
                            (Est. ₹{book.originalPrice})
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <Badge variant="outline">{book.quality || "N/A"}</Badge>
                    <p className="text-xs text-muted-foreground">
                      Seller: {book.owner?.name || "Unknown"}
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    asChild
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Link to={`/books/${book.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No books found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Books;
