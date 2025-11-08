package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.dao.BookRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final NotificationService notificationService;

    public BookServiceImpl(BookRepository bookRepository,
                           NotificationService notificationService) {
        this.bookRepository = bookRepository;
        this.notificationService = notificationService;
    }

    // --- Add new book ---
    @Override
    public Book addBook(Book book) {
        Book savedBook = bookRepository.save(book);
        if (savedBook.isAvailable()) {
            notificationService.notifyUsersForBookAvailability(savedBook.getId());
        }
        return savedBook;
    }

    // --- Update book details ---
    @Override
    public Book updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));

        boolean wasUnavailable = !book.isAvailable();
        boolean nowAvailable = updatedBook.isAvailable();

        // Update all fields
        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setEdition(updatedBook.getEdition());
        book.setQuality(updatedBook.getQuality());
        book.setOriginalPrice(updatedBook.getOriginalPrice());
        book.setGeneratedPrice(updatedBook.getGeneratedPrice());
        book.setDescription(updatedBook.getDescription());
        book.setType(updatedBook.getType());
        book.setAvailable(nowAvailable);
        book.setBookImage(updatedBook.getBookImage());

        Book savedBook = bookRepository.save(book);

        if (wasUnavailable && nowAvailable) {
            notificationService.notifyUsersForBookAvailability(savedBook.getId());
        }

        return savedBook;
    }

    // --- Delete book ---
    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    // --- Get book by ID ---
    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found with id: " + id));
    }

    // --- Get all available books ---
    @Override
    public List<Book> getAllAvailableBooks() {
        return bookRepository.findByIsAvailableTrue();
    }

    // --- Search books ---
    @Override
    public List<Book> searchAvailableBooks(String query) {
        return bookRepository.searchAvailable(query);
    }

    // --- Get books added by a user ---
    @Override
    public List<Book> getBooksByUser(Long userId) {
        return bookRepository.findByOwnerId(userId);
    }

    // --- Get books by type (sale, exchange, donate) ---
    @Override
    public List<Book> getBooksByType(String type) {
        return bookRepository.findByType(type);
    }

    // --- Get recently added available books ---
    @Override
    public List<Book> getRecentBooks() {
        return bookRepository.findRecentBooks();
    }
}
