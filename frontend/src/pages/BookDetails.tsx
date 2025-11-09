import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
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
  Calendar,
  Heart,
  HeartOff,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWishlist, setInWishlist] = useState(false);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // ✅ Fetch book + wishlist status
  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;

      try {
        // 1️⃣ Fetch book details
        const bookRes = await axios.get<Book>(`http://localhost:8082/api/books/${id}`);
        setBook(bookRes.data);

        // 2️⃣ Check if book is already in wishlist
        if (user) {
          const res = await axios.get(`http://localhost:8082/api/wishlist?userId=${user.id}`);
          const wishlistItems = res.data;
          const exists = wishlistItems.some((item: any) => item.book.id === Number(id));
          setInWishlist(exists);
        }
      } catch (error) {
        console.error("Error fetching book or wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, user]);

  // ✅ Handle wishlist add/remove
  const handleWishlistToggle = async () => {
    if (!user) {
      alert("Please log in to manage wishlist.");
      return;
    }

    if (book?.owner?.id === user.id) {
      alert("You cannot add your own book to wishlist.");
      return;
    }

    try {
      if (inWishlist) {
        // 🗑️ Remove from wishlist
        await axios.delete(`http://localhost:8082/api/wishlist/remove`, {
          params: { userId: user.id, bookId: id },
        });
        setInWishlist(false);
      } else {
        // ➕ Add to wishlist
        await axios.post(
          `http://localhost:8082/api/wishlist/add`,
          {},
          { params: { userId: user.id, bookId: id } }
        );
        setInWishlist(true);
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      alert("Something went wrong while updating wishlist.");
    }
  };

  // ✅ Loading & not found
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
              <IndianRupee className="h-5 w-5" /> {book.generatedPrice}
            </div>

            <p className="text-sm text-muted-foreground">
              Estimated value: ₹{book.originalPrice.toFixed(2)}
            </p>

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

            {/* ❤️ Wishlist Button */}
            {book.owner?.id !== user?.id && (
              <Button
                variant={inWishlist ? "destructive" : "outline"}
                onClick={handleWishlistToggle}
                className="flex items-center gap-2"
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
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
