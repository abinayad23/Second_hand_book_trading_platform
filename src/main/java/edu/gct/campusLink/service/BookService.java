package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface BookService {
    Book create(Book book, MultipartFile image);
    Optional<Book> findById(Long id);
    Book update(Book book);
    void delete(Long id);
    List<Book> search(String q);
    List<Book> listAvailable();
}