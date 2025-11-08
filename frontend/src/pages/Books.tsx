import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ✅ Match backend Book entity
interface User {
  id: number;
  name?: string;
  email?: string;
}

interface Book {
  id: number;
  title: string;
  author?: string;
  edition?: string;
  price: number;
  available: boolean;
  imagePath?: string;
  owner?: User;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");

  // ✅ Fetch available books from backend
  useEffect(() => {
    axios
      .get<Book[]>("http://localhost:8082/api/books")
      .then((res) => setBooks(res.data))
      .catch((err) => console.error("Error fetching books:", err));
  }, []);

  // ✅ Handle search (calls backend)
  const handleSearch = async () => {
    try {
      if (searchQuery.trim() === "") {
        const res = await axios.get<Book[]>("http://localhost:8080/api/books");
        setBooks(res.data);
      } else {
        const res = await axios.get<Book[]>(
          `http://localhost:8080/api/books/search?q=${encodeURIComponent(searchQuery)}`
        );
        setBooks(res.data);
      }
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

  // ✅ Filter (sell / donate based on price)
  const filteredBooks = books.filter((book) => {
    const matchesType =
      filterType === "all" ||
      (filterType === "sell" && book.price > 0) ||
      (filterType === "donate" && book.price === 0);
    return matchesType;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="container py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Browse Books</h1>
          <p className="text-muted-foreground">Find your next textbook or sell yours</p>
        </div>

        {/* 🔍 Search and Filters */}
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
              <SelectItem value="sell">For Sale</SelectItem>
              <SelectItem value="donate">Donate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 📚 Books Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <Card
              key={book.id}
              className="group hover:shadow-medium transition-all overflow-hidden"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                <img
  src={
    book.imagePath
      ? `http://localhost:8082${book.imagePath}`
      : "https://via.placeholder.com/300x400?text=No+Image"
  }
  alt={book.title}
/>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Badge
                  className="absolute top-2 left-2"
                  variant={book.price === 0 ? "secondary" : "default"}
                >
                  {book.price === 0 ? "Free" : "For Sale"}
                </Badge>
              </div>

              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg line-clamp-1 mb-1">{book.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {book.author || "Unknown Author"}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  {book.price === 0 ? (
                    <span className="text-lg font-bold text-green-600">FREE</span>
                  ) : (
                    <span className="text-xl font-bold text-amber-500">₹{book.price}</span>
                  )}
                </div>
                <Badge variant="outline" className="mb-2">
                  {book.edition ? `${book.edition} Edition` : "Standard"}
                </Badge>
                <p className="text-xs text-muted-foreground">
                  {book.owner ? `by ${book.owner.name || "Unknown"}` : "by Unknown"}
                </p>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full bg-amber-500">
                  <Link to={`/book/${book.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No books found matching your criteria.</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Books;
