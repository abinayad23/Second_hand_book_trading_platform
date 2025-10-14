package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.service.BookService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService service;

    public BookController(BookService service) {
        this.service = service;
    }

    @PostMapping("/add")
    public Book addBook(@ModelAttribute Book book, @RequestParam(required = false) MultipartFile image) {
        return service.create(book, image);
    }

    @GetMapping("/list")
    public List<Book> listAvailable() {
        return service.listAvailable();
    }

    @GetMapping("/search")
    public List<Book> search(@RequestParam String q) {
        return service.search(q);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}