package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Order;
import edu.gct.campusLink.bean.OrderStatus;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.CartRepository;
import edu.gct.campusLink.dao.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CartRepository cartRepository;

    /**
     * Create a new order for a buyer and seller with a list of books.
     * Marks books unavailable and removes them from carts.
     */
    public Order createOrder(User buyer, User seller, List<Book> books, double totalPrice) {
        Order order = new Order();
        order.setBuyer(buyer);
        order.setSeller(seller);
        order.setBooks(new ArrayList<>(books));
        order.setTotalPrice(totalPrice);
        order.setOrderTime(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING_DELIVERY);

        // Save order
        Order savedOrder = orderRepository.save(order);

        // Mark books unavailable and remove from carts
        for (Book book : books) {
            book.setAvailable(false);
            bookRepository.save(book);
            cartRepository.deleteByBook(book);
        }

        return savedOrder;
    }

    /**
     * Get all orders placed by a buyer.
     */
    public List<Order> getOrdersByBuyer(User buyer) {
        return orderRepository.findByBuyer(buyer);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }
    /**
     * Get all orders sold by a seller.
     */
    public List<Order> getOrdersBySeller(User seller) {
        return orderRepository.findBySeller(seller);
    }

    /**
     * Update the status of an order.
     */
    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    /**
     * Mark an order as delivered.
     */
    public Order markAsDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.DELIVERED);
        return orderRepository.save(order);
    }
}
