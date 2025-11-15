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
  );

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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="container max-w-7xl mx-auto px-4 py-10 flex-1">
        {/* Centered Title */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900">Browse Books</h1>
          <p className="mt-2 text-gray-600 max-w-2xl mx-auto">
            Explore books available for sale, exchange, or donation — find the best deals from students near you.
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative w-full md:flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-12 h-12 bg-white border border-gray-300 rounded-lg shadow-sm"
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="h-12 px-6 bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow"
          >
            Search
          </Button>

          {/* Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="h-12 w-full md:w-48 bg-white border border-gray-300 rounded-lg shadow-sm flex items-center">
              <Filter className="h-4 w-4 ml-3 mr-2 text-gray-500" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>

            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
              <SelectItem value="donate">Donate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book) => {
            const isInWishlist = wishlistIds.includes(book.id);
            const isInCart = cartIds.includes(book.id);
            const isLoading = !!loadingIds[book.id];

            return (
              <Card
                key={book.id}
                className="rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-all border border-gray-200"
              >
                {/* Book Image */}
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

                  {/* Wishlist + Cart Buttons */}
                  {currentUser?.id !== book.owner?.id && (
                    <div className="absolute top-3 right-3 flex flex-col gap-3">
                      <Button
                        size="icon"
                        onClick={() => toggleWishlist(book)}
                        aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                        className={`rounded-full h-10 w-10 shadow-md border bg-white transition-colors ${
                          isInWishlist
                            ? "bg-amber-500 text-white hover:bg-amber-600"
                            : "text-amber-600 hover:bg-amber-50"
                        } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                        disabled={isLoading}
                      >
                        <Heart className={`h-5 w-5 ${isInWishlist ? "fill-white" : ""}`} />
                      </Button>

                      <Button
                        size="icon"
                        onClick={() => toggleCart(book)}
                        aria-label={isInCart ? "Remove from cart" : "Add to cart"}
                        className={`rounded-full h-10 w-10 shadow-md border bg-white transition-colors ${
                          isInCart
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "text-green-600 hover:bg-green-50"
                        } ${isLoading ? "opacity-70 pointer-events-none" : ""}`}
                        disabled={isLoading}
                      >
                        <ShoppingCart className={`h-5 w-5 ${isInCart ? "fill-white" : ""}`} />
                      </Button>
                    </div>
                  )}

                  {/* Type Badge */}
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
                    {book.type || "Sale"}
                  </Badge>
                </div>

                {/* Book Info */}
                <CardContent className="pt-4 px-5 pb-3">
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
                        {book.originalPrice && book.generatedPrice !== 0 && (
                          <span className="text-xs text-gray-400 line-through">
                            (Est. ₹{book.originalPrice})
                          </span>
                        )}
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

        {filteredBooks.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No books found matching your criteria.
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Books;
