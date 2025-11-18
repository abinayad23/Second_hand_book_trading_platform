// src/pages/ReviewList.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { getToken } from "@/utils/jwtHelper";

interface ReviewDTO {
  id: number;
  rating: number;
  comment: string;
  reviewer?: {
    id: number;
    username: string;
  };
}

interface ReviewListProps {
  sellerId: number;
}

const ReviewList = ({ sellerId }: ReviewListProps) => {
  const [reviews, setReviews] = useState<ReviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      console.log("Fetching reviews with token:", token);

      const res = await axios.get(
        `http://localhost:8082/api/reviews/seller/${sellerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setReviews(res.data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setError("⚠ Failed to load reviews. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [sellerId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Seller Reviews</h1>

      {/* Loading */}
      {loading && <p className="text-gray-600">Loading reviews...</p>}

      {/* Error */}
      {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

      {/* Empty */}
      {!loading && !error && reviews.length === 0 && (
        <p className="text-gray-500">No reviews found for this seller.</p>
      )}

      {/* Review List */}
      {!loading &&
        !error &&
        reviews.map((review) => (
          <Card key={review.id} className="mb-4 shadow">
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="font-semibold">
                  {review.reviewer?.username || "Anonymous"}
                </p>

                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) =>
                    i < review.rating ? (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-yellow-400"
                      />
                    ) : (
                      <Star key={i} className="h-5 w-5 text-gray-300" />
                    )
                  )}
                </div>
              </div>

              <p className="mt-3 text-gray-700">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default ReviewList;
