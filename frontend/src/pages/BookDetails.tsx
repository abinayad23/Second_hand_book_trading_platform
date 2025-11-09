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
  Tag,
  Mail,
  Phone,
  Building2,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Owner {
  id: number;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  role?: string;
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

  useEffect(() => {
    if (id) {
      axios
        .get<Book>(`http://localhost:8082/api/books/${id}`)
        .then((res) => {
          setBook(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching book details:", err);
          setLoading(false);
        });
    }
  }, [id]);

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
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-2">
                Author :
                 {" "+ book.author || "Unknown Author"}
              </p>
            </div>

            {/* 💰 Price */}
            <div className="flex items-center gap-4">
              {book.generatedPrice === 0 ? (
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  Free
                </Badge>
              ) : (
                <div className="flex items-center gap-1 text-amber-500 font-bold text-2xl">
                  <IndianRupee className="h-5 w-5" />
                  {book.generatedPrice}
                </div>
              )}
              {book.originalPrice && (
                <p className="text-sm text-muted-foreground">
                  Estimated value :<span className="text-sm text-muted-foreground line-through">₹{book.originalPrice.toFixed(2)}</span>
                </p>
              )}
            </div>

            {/* 📖 Description */}
            {book.description && (
              <div>
                <h3 className="font-semibold text-lg mb-1 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-amber-500" />
                  Description
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                  {book.description}
                </p>
              </div>
            )}

            {/* 🏷️ Book Info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Edition</p>
                <p className="font-medium">{book.edition || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Type</p>
                <p className="font-medium capitalize">{book.type || "N/A"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Quality</p>
                <p className="font-medium">{book.quality || "N/A"}</p>
              </div>
            </div>

            {/* 📅 Added Time */}
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {book.bookAddedTime
                ? new Date(book.bookAddedTime).toLocaleString()
                : "Unknown time"}
            </div>

            {/* 👤 Seller Info */}
            {book.owner && (
              <div className="border-t pt-4">
                <h3 className="font-semibold text-lg mb-3">Seller Information</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{book.owner.name}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{book.owner.email}</span>
                  </p>
        
                  {book.owner.department && (
                    <p className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{book.owner.department}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* 🛒 CTA */}
            <div className="pt-4">
              <Button
                className={`w-full md:w-auto ${
                  book.generatedPrice === 0
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-amber-500 hover:bg-amber-600"
                }`}
              >
                {book.generatedPrice === 0 ? "Request Donation" : "Buy Now"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default BookDetails;
