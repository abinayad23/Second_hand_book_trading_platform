import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { booksApi } from "@/api/books";
import { Book } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, BookOpen } from "lucide-react";

const StudentDashboard = () => {
  const { user } = useAuth();
  const [myBooks, setMyBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchMyBooks();
    } else {
      // If user is not loaded yet, wait a bit, otherwise set loading to false
      const timer = setTimeout(() => {
        if (!user?.id) {
          setLoading(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const fetchMyBooks = async () => {
    setLoading(true);
    try {
      const allBooks = await booksApi.getAllBooks();
      const filtered = allBooks.filter((book) => book.owner?.id === user?.id);
      setMyBooks(filtered);
    } catch (error: any) {
      console.error("Failed to fetch books:", error);
      // Set empty array on error so page still renders
      setMyBooks([]);
      toast.error("Failed to fetch your books. Showing empty list.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBook = async (bookId: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await booksApi.deleteBook(bookId);
      toast.success("Book deleted successfully");
      fetchMyBooks();
    } catch (error) {
      toast.error("Failed to delete book");
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Student Dashboard</h1>
          <p className="text-muted-foreground">Welcome, {user?.name}</p>
        </div>
        <Link to="/upload">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Post New Book
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            My Posted Books
          </CardTitle>
          <CardDescription>
            Manage your book listings ({myBooks.length} total)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {myBooks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                You haven't posted any books yet.
              </p>
              <Link to="/upload">
                <Button>Post Your First Book</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {myBooks.map((book) => (
                <Card key={book.id}>
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
                    <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {book.author}
                    </p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold">${book.price}</span>
                      <Badge
                        variant={book.isAvailable ? "default" : "secondary"}
                      >
                        {book.isAvailable ? "Available" : "Sold"}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/books/${book.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBook(book.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;

