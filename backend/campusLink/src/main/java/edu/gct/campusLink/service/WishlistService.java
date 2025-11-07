package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Wishlist;
import java.util.List;

public interface WishlistService {
    Wishlist addToWishlist(Long userId, Long bookId);
    void removeFromWishlist(Long userId, Long bookId);
    List<Wishlist> getWishlistByUser(Long userId);
}
