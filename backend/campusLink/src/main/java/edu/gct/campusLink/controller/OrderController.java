package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.*;
import edu.gct.campusLink.bean.OrderStatus;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @Autowired
    private BookRepository bookRepository;

    @PostMapping("/create")
    public Order createOrder(@RequestParam Long buyerId,
                             @RequestParam Long sellerId,
                             @RequestBody List<Long> bookIds,
                             @RequestParam double totalPrice) {

        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        User seller = userService.getUserById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Book> books = new ArrayList<>();
        for (Long id : bookIds) {
            Book book = bookRepository.findById(id).orElseThrow(() -> new RuntimeException("Book not found"));            books.add(book);
        }

        return orderService.createOrder(buyer, seller, books, totalPrice);
    }

    @PutMapping("/{orderId}/status")
    public Order updateStatus(@PathVariable Long orderId, @RequestParam OrderStatus status) {
        return orderService.updateOrderStatus(orderId, status);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Order> getBuyerOrders(@PathVariable Long buyerId) {
        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderService.getOrdersByBuyer(buyer);
    }

    @GetMapping("/seller/{sellerId}")
    public List<Order> getSellerOrders(@PathVariable Long sellerId) {
        User seller = userService.getUserById(sellerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderService.getOrdersBySeller(seller);
    }
    @PutMapping("/{orderId}/deliver")
    public Order markDelivered(@PathVariable Long orderId) {
        return orderService.markAsDelivered(orderId);
    }
}
