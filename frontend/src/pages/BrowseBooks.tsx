import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { booksApi } from "@/api/books";
import { Book } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Search } from "lucide-react";
import { toast } from "sonner";

const BrowseBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getAllBooks();
      // Filter available books, with fallback to mock data if API fails
      const availableBooks = data.filter(
        (book) => book.isAvailable !== false && book.available !== false
      );
      setBooks(availableBooks.length > 0 ? availableBooks : getMockBooks());
    } catch (error) {
      console.warn("API failed, using mock data:", error);
      // Use mock data if API fails
      setBooks(getMockBooks());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockBooks = (): Book[] => [
    {
      id: 1,
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      price: 45,
      condition: "Good",
      edition: "3rd Edition",
      isAvailable: true,
      postedByUser: "John Doe",
      owner: { id: 1, name: "John Doe", email: "john@example.com", username: "johndoe", role: "STUDENT" },
    },
    {
      id: 2,
      title: "Database Systems",
      author: "Ramez Elmasri",
      price: 50,
      condition: "Excellent",
      edition: "6th Edition",
      isAvailable: true,
      postedByUser: "Jane Smith",
      owner: { id: 2, name: "Jane Smith", email: "jane@example.com", username: "janesmith", role: "STUDENT" },
    },
    {
      id: 3,
      title: "Operating System Concepts",
      author: "Abraham Silberschatz",
      price: 55,
      condition: "Fair",
      edition: "10th Edition",
      isAvailable: true,
      postedByUser: "Bob Wilson",
      owner: { id: 3, name: "Bob Wilson", email: "bob@example.com", username: "bobwilson", role: "STUDENT" },
    },
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      fetchBooks();
      return;
    }
    setLoading(true);
    try {
      const data = await booksApi.searchBooks(searchQuery);
      const filtered = data.filter(
        (book) => book.isAvailable !== false && book.available !== false
      );
      setBooks(filtered.length > 0 ? filtered : getMockBooks().filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    } catch (error) {
      console.warn("Search API failed, using local filter:", error);
      const allBooks = getMockBooks();
      setBooks(
        allBooks.filter(
          (book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Browse Books</h1>
        <p className="text-muted-foreground">
          Find your next textbook from fellow students
        </p>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search by title, author, or ISBN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch}>
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </div>

      {books.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">No books found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {book.imagePath ? (
                    <img
                      src={book.imagePath}
                      alt={book.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {book.author || "Unknown Author"}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-bold text-primary">
                      ${book.price || book.generatedPrice || "N/A"}
                    </span>
                    <Badge variant="secondary">
                      {book.condition || book.edition || "N/A"}
                    </Badge>
                  </div>
                  {(book.owner || book.postedByUser) && (
                    <p className="text-xs text-muted-foreground">
                      Posted by {book.owner?.name || book.postedByUser || "Unknown"}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseBooks;

