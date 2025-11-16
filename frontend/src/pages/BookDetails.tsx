import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { booksApi } from "@/api/books";
import { reviewsApi } from "@/api/reviews";
import { Book, Review } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, User, DollarSign } from "lucide-react";
import { toast } from "sonner";
import ReviewList from "@/components/ReviewList";
import ReviewForm from "@/components/ReviewForm";
import { useAuth } from "@/hooks/useAuth";

const BookDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchBookDetails();
    }
  }, [id]);

  const fetchBookDetails = async () => {
    try {
      const [bookData, reviewsData] = await Promise.all([
        booksApi.getBookById(Number(id)),
        reviewsApi.getReviewsByBook(Number(id)),
      ]);
      setBook(bookData);
      setReviews(reviewsData);
    } catch (error) {
      toast.error("Failed to fetch book details");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAdded = () => {
    fetchBookDetails();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Book not found</div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {book.imagePath ? (
            <img
                src={book.imagePath}
              alt={book.title}
                className="w-full h-full object-cover"
            />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="h-24 w-24 text-muted-foreground" />
              </div>
            )}
          </div>
          </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
            <p className="text-lg text-muted-foreground mb-4">
              by {book.author || "Unknown Author"}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <Badge variant="secondary">{book.edition || "N/A"}</Badge>
              <Badge variant={book.isAvailable ? "default" : "destructive"}>
                {book.isAvailable ? "Available" : "Sold"}
              </Badge>
            </div>
            </div>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-5 w-5" />
                <span className="text-3xl font-bold">
                  ${book.price || book.generatedPrice || "N/A"}
                </span>
              </div>
            {book.owner && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Seller</p>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">{book.owner.name}</span>
                  </div>
                  <Link to={`/seller/${book.owner.id}`}>
                    <Button variant="outline" className="w-full mt-4">
                      View Seller Profile
                    </Button>
                  </Link>
              </div>
            )}
            </CardContent>
          </Card>

          {averageRating > 0 && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              </CardContent>
            </Card>
                  )}
        </div>
              </div>

      <div className="space-y-6">
        {user && user.id !== book.owner?.id && (
          <Card>
            <CardHeader>
              <CardTitle>Write a Review</CardTitle>
              <CardDescription>
                Share your experience with this book
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ReviewForm
                bookId={book.id}
                reviewerId={user.id}
                onReviewAdded={handleReviewAdded}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
            <CardDescription>
              What others are saying about this book
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ReviewList reviews={reviews} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookDetails;
