package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Order;
import edu.gct.campusLink.bean.OrderStatus;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dto.OrderDTO;
import edu.gct.campusLink.service.OrderService;
import edu.gct.campusLink.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    /**
     * Create a new order.
     */
    @PostMapping("/create")
    public OrderDTO createOrder(@RequestParam Long buyerId,
                                @RequestParam Long sellerId,
                                @RequestBody List<Long> bookIds,
                                @RequestParam double totalPrice) {

        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("Buyer not found"));
        User seller = userService.getUserById(sellerId)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Book> books = new ArrayList<>();
        for (Long id : bookIds) {
            Book book = bookRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Book not found"));
            books.add(book);
        }

        Order order = orderService.createOrder(buyer, seller, books, totalPrice);
        return new OrderDTO(order);
    }

    /**
     * Update order status.
     */
    @PutMapping("/{orderId}/status")
    public OrderDTO updateStatus(@PathVariable Long orderId,
                                 @RequestParam OrderStatus status) {
        return new OrderDTO(orderService.updateOrderStatus(orderId, status));
    }

    /**
     * Get all orders for a buyer.
     */
    @GetMapping("/buyer/{buyerId}")
    public List<OrderDTO> getBuyerOrders(@PathVariable Long buyerId) {
        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderService.getOrdersByBuyer(buyer).stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Get all orders for a seller.
     */
    @GetMapping("/seller/{sellerId}")
    public List<OrderDTO> getSellerOrders(@PathVariable Long sellerId) {
        User seller = userService.getUserById(sellerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderService.getOrdersBySeller(seller).stream()
                .map(OrderDTO::new)
                .collect(Collectors.toList());
    }

    /**
     * Mark an order as delivered.
     */
    @PutMapping("/{orderId}/deliver")
    public OrderDTO markDelivered(@PathVariable Long orderId) {
        return new OrderDTO(orderService.markAsDelivered(orderId));
    }

}
