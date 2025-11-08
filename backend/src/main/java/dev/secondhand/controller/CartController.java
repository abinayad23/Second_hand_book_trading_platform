package dev.secondhand.controller;

import dev.secondhand.model.Cart;
import dev.secondhand.model.CartItem;
import dev.secondhand.repo.CartItemRepository;
import dev.secondhand.repo.CartRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;

    public CartController(CartRepository cartRepository, CartItemRepository cartItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(String.valueOf(body.get("userId")));
        Long bookId = Long.valueOf(String.valueOf(body.get("bookId")));
        Integer qty = Integer.valueOf(String.valueOf(body.getOrDefault("qty", 1)));
        Cart cart = cartRepository.findByUserId(userId).orElseGet(() -> {
            Cart c = new Cart(); c.setUserId(userId); return cartRepository.save(c);
        });
        CartItem item = new CartItem();
        item.setCartId(cart.getId());
        item.setBookId(bookId);
        item.setQty(qty);
        cartItemRepository.save(item);
        return ResponseEntity.ok(item);
    }

    @GetMapping
    public ResponseEntity<?> getCart(@RequestParam Long userId) {
        Cart cart = cartRepository.findByUserId(userId).orElse(null);
        if (cart == null) return ResponseEntity.ok(Map.of("items", List.of()));
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());
        return ResponseEntity.ok(Map.of("cart", cart, "items", items));
    }

    @PostMapping("/remove")
    public ResponseEntity<?> removeItem(@RequestBody Map<String, Long> body) {
        Long itemId = body.get("itemId");
        cartItemRepository.deleteById(itemId);
        return ResponseEntity.ok(Map.of("message","removed"));
    }
}