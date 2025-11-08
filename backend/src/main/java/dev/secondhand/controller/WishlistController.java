package dev.secondhand.controller;

import dev.secondhand.model.Wishlist;
import dev.secondhand.repo.WishlistRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {
    private final WishlistRepository wishlistRepository;

    public WishlistController(WishlistRepository wishlistRepository) {
        this.wishlistRepository = wishlistRepository;
    }

    @PostMapping("/{bookId}")
    public ResponseEntity<?> add(@PathVariable Long bookId, @RequestBody Map<String, Long> body) {
        Long userId = body.get("userId");
        Wishlist w = new Wishlist();
        w.setUserId(userId);
        w.setBookId(bookId);
        wishlistRepository.save(w);
        return ResponseEntity.ok(w);
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam Long userId) {
        List<Wishlist> list = wishlistRepository.findByUserId(userId);
        return ResponseEntity.ok(list);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> remove(@PathVariable Long id) {
        wishlistRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message","removed"));
    }
}