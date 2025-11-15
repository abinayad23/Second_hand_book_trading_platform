package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.CartItem;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.bean.Book;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndBook(User user, Book book);

    List<CartItem> findByUserId(Long userId);

    void deleteByUserIdAndBookId(Long userId, Long bookId);

    Optional<Object> findByUserIdAndBookId(Long userId, Long bookId);

    void deleteByBook(Book book);
}
