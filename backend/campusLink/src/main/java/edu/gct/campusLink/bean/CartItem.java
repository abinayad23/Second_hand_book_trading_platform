package edu.gct.campusLink.bean;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user who added item to cart
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // book added
    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    public LocalDateTime getAddedTime() {
        return addedTime;
    }

    public void setAddedTime(LocalDateTime addedTime) {
        this.addedTime = addedTime;
    }

    private LocalDateTime addedTime = LocalDateTime.now(); // keep quantity in case you want

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
}
