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

    // Upload book with image
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public Book addBookWithImage(
            @RequestParam String title,
            @RequestParam String author,
            @RequestParam String edition,
            @RequestParam double price,
            @RequestParam Long userId,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) throws IOException {

        Book book = new Book();
        book.setTitle(title);
        book.setAuthor(author);
        book.setEdition(edition);
        book.setPrice(price);
        book.setAvailable(true);

        User user = userService.getUserById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        book.setOwner(user);

        if (image != null && !image.isEmpty()) {
            String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            File dest = new File(uploadPath + File.separator + filename);
            dest.getParentFile().mkdirs();
            image.transferTo(dest);
            book.setImagePath("/uploads/" + filename);
        }

        return bookService.addBook(book);
    }



    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book book) {
        return bookService.updateBook(id, book);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    @GetMapping
    public List<Book> getAvailableBooks() {
        return bookService.getAllAvailableBooks();
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String q) {
        return bookService.searchAvailableBooks(q);
    }

    @GetMapping("/user/{userId}")
    public List<Book> getBooksByUser(@PathVariable Long userId) {
        return bookService.getBooksByUser(userId);
    }
}
