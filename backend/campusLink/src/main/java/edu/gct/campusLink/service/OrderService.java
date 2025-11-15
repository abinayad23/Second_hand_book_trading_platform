package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.*;
import edu.gct.campusLink.dao.*;
import edu.gct.campusLink.bean.OrderStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;
import java.time.LocalDateTime;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CartRepository cartRepository;

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

        // Mark books unavailable
        for (Book book : books) {
            book.setAvailable(false);
            bookRepository.save(book);
            cartRepository.deleteByBook(book);
        }

        return savedOrder;
    }

    public List<Order> getOrdersByBuyer(User buyer) {
        return orderRepository.findByBuyer(buyer);
    }

    public List<Order> getOrdersBySeller(User seller) {
        return orderRepository.findBySeller(seller);
    }

    public Order updateOrderStatus(Long orderId, OrderStatus status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }
    public Order markAsDelivered(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(OrderStatus.DELIVERED);
        return orderRepository.save(order);
    }
}
