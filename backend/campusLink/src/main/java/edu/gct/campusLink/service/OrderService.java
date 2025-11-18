package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Order;
import edu.gct.campusLink.bean.OrderStatus;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.CartRepository;
import edu.gct.campusLink.dao.OrderRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final BookRepository bookRepository;
    private final CartRepository cartRepository;
    private final NotificationService notificationService;

    public OrderService(OrderRepository orderRepository,
                        BookRepository bookRepository,
                        CartRepository cartRepository,
                        NotificationService notificationService) {

        this.orderRepository = orderRepository;
        this.bookRepository = bookRepository;
        this.cartRepository = cartRepository;
        this.notificationService = notificationService;
    }

    // -------------------- CREATE ORDER --------------------
    public Order createOrder(User buyer, User seller, List<Book> books, double totalPrice) {

        Order order = new Order();
        order.setBuyer(buyer);
        order.setSeller(seller);
        order.setBooks(new ArrayList<>(books));
        order.setTotalPrice(totalPrice);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING_DELIVERY);

        Order saved = orderRepository.save(order);

        // Mark books unavailable & remove from carts
        for (Book book : books) {
            book.setAvailable(false);
            bookRepository.save(book);
            cartRepository.deleteByBook(book);
        }

        return saved;
    }

    // -------------------- ORDERS BY BUYER --------------------
    public List<Order> getOrdersByBuyer(User buyer) {
        return orderRepository.findByBuyer(buyer);
    }

    public List<Order> getOrdersBySeller(User seller) {
        return orderRepository.findBySeller(seller);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    // -------------------- UPDATE STATUS + TRIGGER NOTIFICATION --------------------
    public Order updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        order.setStatus(status);
        Order saved = orderRepository.save(order);

        // Notify Buyer
        notificationService.createNotification(
                order.getBuyer().getId(),
                "Order Update",
                "Your order #" + order.getId() + " status changed to " + status,
                "ORDER",
                order.getId()
        );

        // Notify Seller
        notificationService.createNotification(
                order.getSeller().getId(),
                "Order Update",
                "Order #" + order.getId() + " status changed to " + status,
                "ORDER",
                order.getId()
        );

        return saved;
    }

    // -------------------- MARK AS DELIVERED --------------------
    public Order markAsDelivered(Long orderId) {
        return updateOrderStatus(orderId, OrderStatus.DELIVERED);
    }
}
