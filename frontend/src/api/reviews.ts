import API from "./api";
import { Review } from "@/types";

export const reviewsApi = {
  addReview: async (
    reviewerId: number,
    bookId: number,
    rating: number,
    comment: string
  ): Promise<Review> => {
    const response = await API.post<Review>(
      `/reviews/add?reviewerId=${reviewerId}&bookId=${bookId}&rating=${rating}&comment=${encodeURIComponent(comment)}`
    );
    return response.data;
  },

  addSellerReview: async (
    reviewerId: number,
    sellerId: number,
    rating: number,
    comment: string
  ): Promise<Review> => {
    const response = await API.post<Review>(
      `/reviews/seller/add?reviewerId=${reviewerId}&sellerId=${sellerId}&rating=${rating}&comment=${encodeURIComponent(comment)}`
    );
    return response.data;
  },

  getReviewsByBook: async (bookId: number): Promise<Review[]> => {
    const response = await API.get<Review[]>(`/reviews/book/${bookId}`);
    return response.data || [];
  },

  getReviewsByUser: async (userId: number): Promise<Review[]> => {
    const response = await API.get<Review[]>(`/reviews/user/${userId}`);
    return response.data || [];
  },

  getReviewsBySeller: async (sellerId: number): Promise<Review[]> => {
    const response = await API.get<Review[]>(`/reviews/seller/${sellerId}`);
    return response.data || [];
  },
};

