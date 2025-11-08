package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import java.util.List;

public interface BookService {
    Book addBook(Book book);
    Book updateBook(Long id, Book book);
    void deleteBook(Long id);
    Book getBookById(Long id);
    List<Book> getAllAvailableBooks();
    List<Book> searchAvailableBooks(String query);
    List<Book> getBooksByUser(Long userId);

}
