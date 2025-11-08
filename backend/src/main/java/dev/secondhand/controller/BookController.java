package dev.secondhand.controller;

import dev.secondhand.model.Book;
import dev.secondhand.repo.BookRepository;
import dev.secondhand.service.FileStorageService;
import dev.secondhand.service.PriceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookRepository bookRepository;
    private final PriceService priceService;
    private final FileStorageService fileStorageService;

    public BookController(BookRepository bookRepository, PriceService priceService, FileStorageService fileStorageService) {
        this.bookRepository = bookRepository;
        this.priceService = priceService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Map<String, Object> body) {
        try {
            Book b = new Book();
            b.setSellerId(((Number)body.getOrDefault("sellerId", 0)).longValue());
            b.setTitle((String) body.get("title"));
            b.setAuthor((String) body.get("author"));
            b.setIsbn((String) body.get("isbn"));
            b.setOriginalPrice(Double.parseDouble(String.valueOf(body.getOrDefault("originalPrice", "0"))));
            b.setQuality(Book.Quality.valueOf(((String)body.getOrDefault("quality","GOOD")).replace('-', '_')));
            b.setCategory(Book.Category.valueOf(((String)body.getOrDefault("category","BUY") )));
            double computed = priceService.computePrice(b.getOriginalPrice(), b.getQuality());
            b.setPrice(computed);
            b.setDescription((String) body.getOrDefault("description",""));
            Book saved = bookRepository.save(b);
            return ResponseEntity.ok(saved);
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("message","invalid payload"));
        }
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestParam(required = false) String category) {
        if (category != null) {
            try {
                Book.Category c = Book.Category.valueOf(category.toUpperCase());
                List<Book> list = bookRepository.findByCategory(c);
                return ResponseEntity.ok(list);
            } catch (Exception ex) {
                return ResponseEntity.badRequest().body(Map.of("message","invalid category"));
            }
        }
        return ResponseEntity.ok(bookRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable Long id) {
        return bookRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/images")
    public ResponseEntity<?> uploadImages(@PathVariable Long id, @RequestParam("files") MultipartFile[] files) {
        var bookOpt = bookRepository.findById(id);
        if (bookOpt.isEmpty()) return ResponseEntity.notFound().build();
        List<String> urls = new ArrayList<>();
        for (MultipartFile f : files) {
            try {
                String url = fileStorageService.store(f);
                urls.add(url);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        // Note: persistence of image urls to DB table not implemented yet; frontend can use returned urls.
        return ResponseEntity.ok(Map.of("urls", urls));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        if (!bookRepository.existsById(id)) return ResponseEntity.notFound().build();
        bookRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message","deleted"));
    }
}