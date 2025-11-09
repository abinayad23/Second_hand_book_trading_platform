package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.CartItem;
import edu.gct.campusLink.service.CartService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;
    public CartController(CartService cartService){ this.cartService = cartService; }

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
}
