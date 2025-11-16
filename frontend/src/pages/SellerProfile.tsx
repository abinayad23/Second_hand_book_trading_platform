import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { usersApi } from "@/api/users";
import { booksApi } from "@/api/books";
import { reviewsApi } from "@/api/reviews";
import { User, Book, Review } from "@/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Mail, Phone, MapPin, GraduationCap, Star } from "lucide-react";
import { toast } from "sonner";
import ReviewList from "@/components/ReviewList";
import SellerReviewForm from "@/components/SellerReviewForm";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const SellerProfile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [seller, setSeller] = useState<User | null>(null);
  const [sellerBooks, setSellerBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (id) {
      fetchSellerData();
    }
  }, [id]);

  const fetchSellerData = async () => {
    try {
      const [sellerData, allBooks, reviewsData] = await Promise.all([
        usersApi.getUserById(Number(id)),
        booksApi.getAllBooks(),
        reviewsApi.getReviewsBySeller(Number(id)), // Use getReviewsBySeller instead
      ]);
      setSeller(sellerData);
      setSellerBooks(allBooks.filter((book) => book.owner?.id === sellerData.id));
      setReviews(reviewsData || []);
    } catch (error) {
      console.error("Failed to fetch seller profile:", error);
      toast.error("Failed to fetch seller profile");
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

  if (!seller) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Seller not found</div>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : seller.rating || 0;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <Avatar className="h-24 w-24">
              <AvatarFallback className="text-2xl">
                {getInitials(seller.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{seller.name}</h1>
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">{seller.role}</Badge>
                  {seller.isVerified && (
                    <Badge variant="default">Verified</Badge>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {seller.department && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{seller.department}</span>
                  </div>
                )}
                {seller.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{seller.email}</span>
                  </div>
                )}
                {seller.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{seller.phone}</span>
                  </div>
                )}
                {seller.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{seller.location}</span>
                  </div>
                )}
              </div>

              {averageRating > 0 && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-bold">{averageRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">
                    ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Books by {seller.name}</CardTitle>
          <CardDescription>
            {sellerBooks.length} {sellerBooks.length === 1 ? "book" : "books"} listed
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sellerBooks.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No books listed yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {sellerBooks.map((book) => (
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
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-primary">
                          ${book.price}
                        </span>
                        <Badge
                          variant={book.isAvailable ? "default" : "secondary"}
                        >
                          {book.isAvailable ? "Available" : "Sold"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Reviews</CardTitle>
              <CardDescription>
                {reviews.length > 0
                  ? `Reviews for ${seller.name}`
                  : `No reviews yet for ${seller.name}`}
              </CardDescription>
            </div>
            {user && user.id !== seller.id && (
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(!showReviewForm)}
              >
                {showReviewForm ? "Cancel" : "Write Review"}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {showReviewForm && user && user.id !== seller.id && (
            <div className="mb-6 pb-6 border-b">
              <SellerReviewForm
                sellerId={seller.id}
                reviewerId={user.id}
                onReviewAdded={() => {
                  setShowReviewForm(false);
                  fetchSellerData();
                }}
              />
            </div>
          )}
          {reviews.length > 0 ? (
            <ReviewList reviews={reviews} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No reviews yet. Be the first to review this seller!
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerProfile;

