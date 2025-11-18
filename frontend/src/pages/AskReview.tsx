// src/pages/AskReview.tsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { getToken, getUserFromToken } from "@/utils/jwtHelper";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const AskReview = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, sellerId } = location.state || {};

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    console.log("=== AskReview Loaded ===");

    console.log("Order ID from state:", orderId);
    console.log("Seller ID from state:", sellerId);

    if (!orderId || !sellerId) {
      console.error("Missing orderId or sellerId → Redirecting...");
      navigate("/orders");
    }

    const user = getUserFromToken();
    console.log("Decoded User:", user);

    if (user) {
      console.log("Reviewer ID:", user.id);
    } else {
      console.log("⚠ No user found in token");
    }
  }, [orderId, sellerId, navigate]);

  const handleSubmit = async () => {
    const token = getToken();
    const user = getUserFromToken();

    const reviewerId = user?.id;

    console.log("⭐ Submitting Review:");
    console.log("Reviewer:", reviewerId);
    console.log("Seller:", sellerId);
    console.log("Rating:", rating);
    console.log("Comment:", comment);

    if (!reviewerId || !sellerId) {
      console.error("Missing reviewerId or sellerId. Stopping submission.");
      return;
    }

    const url = `http://localhost:8082/api/reviews/seller/add?sellerId=${sellerId}&reviewerId=${reviewerId}&rating=${rating}&comment=${comment}`;
    console.log("POST URL:", url);

    try {
      await axios.post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Review added successfully!");
      navigate("/orders");
    } catch (error) {
      console.error("Review submit failed:", error);
      alert("Failed to add review");
    }
  };

  return (
    <div className="w-full flex flex-col items-center mt-10 mb-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="w-[420px] shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
          {/* Gradient Header */}
          <div className="h-3 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400"></div>

          <CardContent className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">
              Write a Review
            </h2>

            <p className="mb-4 text-gray-600 text-center">
              Reviewing Order: <span className="font-semibold">{orderId}</span>
            </p>

            {/* Star Rating */}
            <label className="font-semibold text-gray-700">Rating</label>
            <div className="flex gap-2 my-2">
              {[1, 2, 3, 4, 5].map((r) => (
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  key={r}
                >
                  <span
                    onClick={() => setRating(r)}
                    className={`cursor-pointer text-3xl ${
                      rating >= r ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Comment Box */}
            <label className="font-semibold text-gray-700">Comment</label>
            <textarea
              className="border p-3 rounded-xl w-full mt-2 mb-5 focus:ring-2 focus:ring-purple-400 outline-none transition"
              rows={4}
              placeholder="Share your experience..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>

            {/* Submit Button */}
            <Button
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:opacity-90 transition"
              onClick={handleSubmit}
            >
              Submit Review
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default AskReview;
