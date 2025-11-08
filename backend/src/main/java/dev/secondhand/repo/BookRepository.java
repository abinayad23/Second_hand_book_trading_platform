package dev.secondhand.repo;

import dev.secondhand.model.Book;
import dev.secondhand.model.Book.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByCategory(Category category);
}