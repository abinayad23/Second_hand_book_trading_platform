package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserIdAndBookId(Long userId, Long bookId);
    void deleteByUserIdAndBookId(Long userId, Long bookId);
}
