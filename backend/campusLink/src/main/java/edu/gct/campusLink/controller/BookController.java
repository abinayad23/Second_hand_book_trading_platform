package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.service.BookService;
import edu.gct.campusLink.service.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;
    private final UserService userService;

    @Value("${upload.path}")
    private String uploadPath;

    public BookController(BookService bookService, UserService userService) {
        this.bookService = bookService;
        this.userService = userService;
    }

    // --- Upload book with all details and image ---
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public Book addBookWithImage(
            @RequestParam String title,
            @RequestParam String author,
            @RequestParam(required = false) String edition,
            @RequestParam(required = false) String quality,
            @RequestParam double originalPrice,
            @RequestParam(required = false) Double generatedPrice,
            @RequestParam(required = false) String description,
            @RequestParam String type, // sale, exchange, donate
            @RequestParam Long userId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {

        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setEdition(edition);
        book.setQuality(quality);
        book.setOriginalPrice(originalPrice);
        book.setGeneratedPrice(generatedPrice != null ? generatedPrice : 0.0);
        book.setDescription(description);
        book.setType(type);
        book.setBookAddedTime(LocalDateTime.now());
        book.setAvailable(true);

        // Fetch and assign user
        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        book.setOwner(user);

        // Handle image upload
        if (image != null && !image.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File dest = new File(uploadPath + File.separator + filename);
            dest.getParentFile().mkdirs();
            image.transferTo(dest);
            book.setBookImage("/uploads/" + filename);
        }

        return bookService.addBook(book);
    }

    // --- Update book details ---
    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(id, book);
    }

    // --- Delete a book ---
    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    // --- Get book by ID ---
    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    // --- Get all available books ---
    @GetMapping
    public List<Book> getAvailableBooks() {
        return bookService.getAllAvailableBooks();
    }

    // --- Search books by query ---
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String q) {
        return bookService.searchAvailableBooks(q);
    }

    // --- Get books added by a specific user ---
    @GetMapping("/user/{userId}")
    public List<Book> getBooksByUser(@PathVariable Long userId) {
        return bookService.getBooksByUser(userId);
    }
}
