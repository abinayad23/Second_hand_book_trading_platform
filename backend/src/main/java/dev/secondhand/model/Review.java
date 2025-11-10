package dev.secondhand.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(name="book_id") private Long bookId;
    @Column(name="reviewer_id") private Long reviewerId;
    @Column(name="seller_id") private Long sellerId;
    private Integer rating;
    @Column(columnDefinition = "TEXT") private String comment;
    @Column(name="created_at") private LocalDateTime createdAt = LocalDateTime.now();
    // getters/setters
    public Long getId(){return id;} public void setId(Long id){this.id=id;}
    public Long getBookId(){return bookId;} public void setBookId(Long bookId){this.bookId=bookId;}
    public Long getReviewerId(){return reviewerId;} public void setReviewerId(Long reviewerId){this.reviewerId=reviewerId;}
    public Long getSellerId(){return sellerId;} public void setSellerId(Long sellerId){this.sellerId=sellerId;}
    public Integer getRating(){return rating;} public void setRating(Integer rating){this.rating=rating;}
    public String getComment(){return comment;} public void setComment(String comment){this.comment=comment;}
    public java.time.LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(java.time.LocalDateTime createdAt){this.createdAt=createdAt;}
}