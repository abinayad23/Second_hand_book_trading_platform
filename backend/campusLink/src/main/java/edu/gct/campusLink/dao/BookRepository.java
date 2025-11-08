package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {

    // Get all available books
    List<Book> findByIsAvailableTrue();

    // Search books (by title, author, edition, quality, type, or description)
    @Query("""
        SELECT b FROM Book b
        WHERE b.isAvailable = true AND (
            LOWER(b.title) LIKE LOWER(CONCAT('%', :q, '%')) OR
            LOWER(b.author) LIKE LOWER(CONCAT('%', :q, '%')) OR
            LOWER(b.edition) LIKE LOWER(CONCAT('%', :q, '%')) OR
            LOWER(b.quality) LIKE LOWER(CONCAT('%', :q, '%')) OR
            LOWER(b.type) LIKE LOWER(CONCAT('%', :q, '%')) OR
            LOWER(b.description) LIKE LOWER(CONCAT('%', :q, '%'))
        )
    """)
    List<Book> searchAvailable(@Param("q") String q);

    // Get all books added by a specific user
    @Query("SELECT b FROM Book b WHERE b.owner.id = :ownerId")
    List<Book> findByOwnerId(@Param("ownerId") Long ownerId);

    // Filter by type (sale / exchange / donate)
    @Query("SELECT b FROM Book b WHERE b.isAvailable = true AND LOWER(b.type) = LOWER(:type)")
    List<Book> findByType(@Param("type") String type);

    // Find recently added books (optional, for dashboard or homepage)
    @Query("SELECT b FROM Book b WHERE b.isAvailable = true ORDER BY b.bookAddedTime DESC")
    List<Book> findRecentBooks();
}
