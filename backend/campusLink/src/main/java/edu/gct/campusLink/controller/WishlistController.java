package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Wishlist;
import edu.gct.campusLink.service.WishlistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @PostMapping("/add")
    public Wishlist addToWishlist(@RequestParam Long userId, @RequestParam Long bookId) {
        return wishlistService.addToWishlist(userId, bookId);
    }

    @DeleteMapping("/remove")
    public void removeFromWishlist(@RequestParam Long userId, @RequestParam Long bookId) {
        wishlistService.removeFromWishlist(userId, bookId);
    }

    @GetMapping
    public List<Wishlist> getWishlist(@RequestParam Long userId) {
        return wishlistService.getWishlistByUser(userId);
    }
}
