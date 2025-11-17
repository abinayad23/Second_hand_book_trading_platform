package edu.gct.campusLink.dto;

import edu.gct.campusLink.bean.Book;

public class BookDTO {
    private Long id;
    private String title;
    private String type;
    private Double generatedPrice;
    private String bookImage;

    public BookDTO() {}

    public BookDTO(Book book) {
        this.id = book.getId();
        this.title = book.getTitle();
        this.type = book.getType();
        this.generatedPrice = book.getGeneratedPrice();
        this.bookImage = book.getBookImage();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getBookImage() {
        return bookImage;
    }

    public void setBookImage(String bookImage) {
        this.bookImage = bookImage;
    }

    public Double getGeneratedPrice() { return generatedPrice; }
    public void setGeneratedPrice(Double generatedPrice) { this.generatedPrice = generatedPrice; }
}
