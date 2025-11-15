package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.CartItem;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.UserRepository;
import edu.gct.campusLink.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    private final UserRepository userRepository;
    public CartController(CartService cartService, UserRepository userRepository){ this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<CartItem> getCart(@RequestParam Long userId){
        return cartService.getCartByUser(userId);
    }

    @PostMapping("/add")
    public CartItem addToCart(@RequestParam Long userId, @RequestParam Long bookId){
        return cartService.addToCart(userId, bookId);
    }

    @DeleteMapping("/remove")
    public void removeFromCart(@RequestParam Long userId, @RequestParam Long bookId){
        cartService.removeFromCart(userId, bookId);
    }

    @PostMapping("/clear")
    public void clearCart(@RequestParam Long userId){
        cartService.clearCart(userId);
    }

    @GetMapping("/user/{userId}/grouped")
    public List<Map<String, Object>> getCartGroupedBySeller(@PathVariable Long userId) {
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