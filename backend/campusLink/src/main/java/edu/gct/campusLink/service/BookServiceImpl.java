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

    @Override
    public Book addBook(Book book) {
        Book savedBook = bookRepository.save(book);
        if (savedBook.isAvailable()) {
            notificationService.notifyUsersForBookAvailability(savedBook.getId());
        }
        return savedBook;
    }

    @Override
    public Book updateBook(Long id, Book updatedBook) {
        Book book = bookRepository.findById(id).orElseThrow();

        boolean wasUnavailable = !book.isAvailable();
        boolean nowAvailable = updatedBook.isAvailable();

        book.setTitle(updatedBook.getTitle());
        book.setAuthor(updatedBook.getAuthor());
        book.setEdition(updatedBook.getEdition());
        book.setPrice(updatedBook.getPrice());
        book.setAvailable(nowAvailable);
        book.setImagePath(updatedBook.getImagePath());

        Book savedBook = bookRepository.save(book);

        if (wasUnavailable && nowAvailable) {
            notificationService.notifyUsersForBookAvailability(savedBook.getId());
        }

        return savedBook;
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElseThrow();
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

}
