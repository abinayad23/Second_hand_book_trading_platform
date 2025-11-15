package edu.gct.campusLink.dto;

import edu.gct.campusLink.bean.Order;
import edu.gct.campusLink.bean.OrderStatus;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderDTO {
    private Long id;
    private Double totalPrice;
    private LocalDateTime orderTime;
    private OrderStatus status;
    private String buyerName;
    private String sellerName;
    private List<BookDTO> books;

    public OrderDTO() {}

    public OrderDTO(Order order) {
        this.id = order.getId();
        this.totalPrice = order.getTotalPrice();
        this.orderTime = order.getOrderTime();
        this.status = order.getStatus();
        this.buyerName = order.getBuyer() != null ? order.getBuyer().getName() : null;
        this.sellerName = order.getSeller() != null ? order.getSeller().getName() : null;
        this.books = order.getBooks() != null
                ? order.getBooks().stream().map(BookDTO::new).collect(Collectors.toList())
                : List.of();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(Double totalPrice) { this.totalPrice = totalPrice; }

    public LocalDateTime getOrderTime() { return orderTime; }
    public void setOrderTime(LocalDateTime orderTime) { this.orderTime = orderTime; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public String getBuyerName() { return buyerName; }
    public void setBuyerName(String buyerName) { this.buyerName = buyerName; }

    public String getSellerName() { return sellerName; }
    public void setSellerName(String sellerName) { this.sellerName = sellerName; }

    public List<BookDTO> getBooks() { return books; }
    public void setBooks(List<BookDTO> books) { this.books = books; }
}
