package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.CartItem;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.UserRepository;
import edu.gct.campusLink.service.CartService;
import edu.gct.campusLink.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;
    private final JwtService jwtService;

    public CartController(CartService cartService,
                          UserRepository userRepository,
                          JwtService jwtService) {
        this.cartService = cartService;
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    // Utility: validate userId with token
    private boolean isAuthorized(Long userId, HttpServletRequest req) {
        String header = req.getHeader("Authorization");
        if (header == null || !header.startsWith("Bearer ")) return false;

        String token = header.substring(7);
        Long tokenUserId = jwtService.extractId(token);
        String role = jwtService.extractRole(token);

        return Objects.equals(userId, tokenUserId) || "ADMIN".equals(role);
    }

    @GetMapping
    public List<CartItem> getCart(@RequestParam Long userId, HttpServletRequest req) {
        if (!isAuthorized(userId, req)) {
            throw new RuntimeException("Access denied");
        }
        return cartService.getCartByUser(userId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long userId,
                              @RequestParam Long bookId,
                              HttpServletRequest req) {

        if (!isAuthorized(userId, req)) {
            throw new RuntimeException("Access denied");
        }
        return cartService.addToCart(userId, bookId);
    }

    @DeleteMapping("/remove")
    public void removeFromCart(@RequestParam Long userId,
                               @RequestParam Long bookId,
                               HttpServletRequest req) {

        if (!isAuthorized(userId, req)) {
            throw new RuntimeException("Access denied");
        }
        cartService.removeFromCart(userId, bookId);
    }

    @PostMapping("/clear")
    public void clearCart(@RequestParam Long userId, HttpServletRequest req) {
        if (!isAuthorized(userId, req)) {
            throw new RuntimeException("Access denied");
        }
        cartService.clearCart(userId);
    }

    @GetMapping("/user/{userId}/grouped")
    public List<Map<String, Object>> getCartGroupedBySeller(@PathVariable Long userId, HttpServletRequest req) {

        if (!isAuthorized(userId, req)) {
            throw new RuntimeException("Access denied");
        }

        User user = userRepository.findById(userId).orElseThrow();
        Map<User, List<CartItem>> grouped = cartService.getCartGroupsBySeller(user);

        List<Map<String, Object>> response = new ArrayList<>();

        grouped.forEach((seller, items) -> {
            Map<String, Object> group = new HashMap<>();
            group.put("seller", seller);
            group.put("cartItems", items);
            group.put("totalPrice", cartService.calculateTotalBySeller(items));
            response.add(group);
        });

        return response;
    }
}
