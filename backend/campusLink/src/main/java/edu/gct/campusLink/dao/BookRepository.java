package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findByIsAvailableTrue();

    @Query("SELECT b FROM Book b WHERE b.isAvailable = true AND " +
           "(LOWER(b.title) LIKE LOWER(CONCAT('%', :q, '%')) " +
           "OR LOWER(b.author) LIKE LOWER(CONCAT('%', :q, '%')))")
    List<Book> searchAvailable(String q);
}