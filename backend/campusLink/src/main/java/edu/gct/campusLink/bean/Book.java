package edu.gct.campusLink.bean;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String title;

    private String author;
    private String edition;
    private String quality;

    @Column(name = "original_price")
    private double originalPrice;

    @Column(name = "generated_price")
    private double generatedPrice;

    @Column(length = 1000)
    private String description;

    // sale, exchange, or donate
    private String type;

    @Column(name = "book_added_time")
    private LocalDateTime bookAddedTime = LocalDateTime.now();

    private boolean isAvailable = true;

    @Column(name = "book_image")
    private String bookImage;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;

    // --- Getters and Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getEdition() {
        return edition;
    }

    public void setEdition(String edition) {
        this.edition = edition;
    }

    public String getQuality() {
        return quality;
    }

    public void setQuality(String quality) {
        this.quality = quality;
    }

    public double getOriginalPrice() {
        return originalPrice;
    }

    public void setOriginalPrice(double originalPrice) {
        this.originalPrice = originalPrice;
    }

    public double getGeneratedPrice() {
        return generatedPrice;
    }

    public void setGeneratedPrice(double generatedPrice) {
        this.generatedPrice = generatedPrice;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LocalDateTime getBookAddedTime() {
        return bookAddedTime;
    }

    public void setBookAddedTime(LocalDateTime bookAddedTime) {
        this.bookAddedTime = bookAddedTime;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public String getBookImage() {
        return bookImage;
    }

    public void setBookImage(String bookImage) {
        this.bookImage = bookImage;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    @Override
    public String toString() {
        return "Book{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", edition='" + edition + '\'' +
                ", quality='" + quality + '\'' +
                ", originalPrice=" + originalPrice +
                ", generatedPrice=" + generatedPrice +
                ", description='" + description + '\'' +
                ", type='" + type + '\'' +
                ", bookAddedTime=" + bookAddedTime +
                ", isAvailable=" + isAvailable +
                ", bookImage='" + bookImage + '\'' +
                ", owner=" + (owner != null ? owner.getId() : null) +
                '}';
    }
}
