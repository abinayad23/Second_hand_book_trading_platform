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
import { Search, Filter, Heart } from "lucide-react";
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
  owner?: User; // seller info
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ✅ Fetch available books
  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:8082/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // ✅ Handle search
  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        const res = await axios.get<Book[]>("http://localhost:8082/api/books");
        setBooks(res.data);
      } else {
        const res = await axios.get<Book[]>(
          `http://localhost:8082/api/books/search?q=${encodeURIComponent(searchQuery)}`
        );
        setBooks(res.data);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // ✅ Filter books by type
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
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">
            Explore books available for sale, exchange, or donation
          </p>
        </div>

        {/* 🔍 Search + Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch} className="bg-amber-500 text-white">
            Search
          </Button>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sale">For Sale</SelectItem>
              <SelectItem value="exchange">Exchange</SelectItem>
              <SelectItem value="donate">Donate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 📚 Book Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="group hover:shadow-lg transition-all overflow-hidden"
            >
              {/* 🖼️ Book Image */}
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
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge
                  className="absolute top-2 left-2 capitalize"
                  variant={
                    book.type?.toLowerCase() === "donate"
                      ? "secondary"
                      : book.type?.toLowerCase() === "exchange"
                      ? "outline"
                      : "default"
                  }
                >
                  {book.type || "Sale"}
                </Badge>
              </div>

              {/* 📘 Book Info */}
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg line-clamp-1 mb-1">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {book.author || "Unknown Author"}
                </p>

                {/* 💰 Price */}
                <div className="flex items-baseline gap-2 mb-2">
                  {book.generatedPrice === 0 ? (
                    <span className="text-lg font-bold text-green-600">
                      FREE
                    </span>
                  ) : (
                    <span className="text-xl font-bold text-amber-500">
                      ₹{book.generatedPrice}
                    </span>
                  )}
                  {book.originalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      (Est. ₹{book.originalPrice})
                    </span>
                  )}
                </div>

                {/* ⭐ Quality + Seller */}
                <div className="flex items-center justify-between mt-2">
                  <Badge variant="outline">{book.quality || "N/A"}</Badge>
                  <p className="text-xs text-muted-foreground">
                    Seller: {book.owner?.name || "Unknown"}
                  </p>
                </div>
              </CardContent>

              {/* 🔗 View Details */}
              <CardFooter>
                <Button asChild className="w-full bg-amber-500">
                  <Link to={`/books/${book.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* 🚫 Empty State */}
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
