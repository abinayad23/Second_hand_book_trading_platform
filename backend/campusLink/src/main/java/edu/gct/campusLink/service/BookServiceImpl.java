package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Wishlist;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final WishlistRepository wishlistRepository;
    private final NotificationService notificationService;

    public BookServiceImpl(BookRepository bookRepository,
                           WishlistRepository wishlistRepository,
                           NotificationService notificationService) {
        this.bookRepository = bookRepository;
        this.wishlistRepository = wishlistRepository;
        this.notificationService = notificationService;
    }

    @Override
    public Book addBook(Book book) {
        Book savedBook = bookRepository.save(book);

        // If book is available, notify wishlist users
        if (savedBook.isAvailable()) {
            sendWishlistNotifications(savedBook);
        }

        return savedBook;
    }

    @Override
    public Book updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found: " + id));

        boolean wasUnavailable = !book.isAvailable();
        boolean nowAvailable = updatedBook.isAvailable();

        // update fields
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

        Book saved = bookRepository.save(book);

        // If book becomes available now, notify wishlist users
        if (wasUnavailable && nowAvailable) {
            sendWishlistNotifications(saved);
        }

        return saved;
    }

    private void sendWishlistNotifications(Book book) {
        List<Wishlist> wishers = wishlistRepository.findByBookId(book.getId());

        for (Wishlist w : wishers) {
            notificationService.createNotification(
                    w.getUser().getId(),
                    "Book Available",
                    "A book from your wishlist is now available: " + book.getTitle(),
                    "WISHLIST",
                    book.getId()
            );
        }
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found: " + id));
    }

    @Override
    public List<Book> getAllAvailableBooks() {
        return bookRepository.findByIsAvailableTrue();
    }

    @Override
    public List<Book> searchAvailableBooks(String query) {
        return bookRepository.searchAvailable(query);
    }

    @Override
    public List<Book> getBooksByUser(Long userId) {
        return bookRepository.findByOwnerId(userId);
    }

    @Override
    public List<Book> getBooksByType(String type) {
        return bookRepository.findByType(type);
    }

    @Override
    public List<Book> getRecentBooks() {
        return bookRepository.findRecentBooks();
    }
}
