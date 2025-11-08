package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import java.util.List;

public interface BookService {

    // Add a new book (with or without image)
    Book addBook(Book book);

    // Update an existing book
    Book updateBook(Long id, Book book);

    // Delete a book by ID
    void deleteBook(Long id);

    // Get book by ID
    Book getBookById(Long id);

    // Get all available books
    List<Book> getAllAvailableBooks();

    // Search available books by keyword (title, author, edition, quality, type, etc.)
    List<Book> searchAvailableBooks(String query);

    // Get all books uploaded by a specific user
    List<Book> getBooksByUser(Long userId);

    // Filter books by type (sale / exchange / donate)
    List<Book> getBooksByType(String type);

    // Get recently added books (sorted by bookAddedTime)
    List<Book> getRecentBooks();
}
