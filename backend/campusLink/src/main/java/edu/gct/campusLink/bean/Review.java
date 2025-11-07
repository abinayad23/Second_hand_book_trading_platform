package edu.gct.campusLink.bean;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String comment;
    private LocalDateTime timestamp = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "reviewer_id")
    @JsonIgnore
    private User reviewer;

    @ManyToOne
    @JoinColumn(name = "book_id")
    @JsonIgnore
    private Book book;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }
}