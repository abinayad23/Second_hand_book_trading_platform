package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.bean.Wishlist;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.UserRepository;
import edu.gct.campusLink.dao.WishlistRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public WishlistServiceImpl(WishlistRepository wishlistRepository,
                               UserRepository userRepository,
                               BookRepository bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public Wishlist addToWishlist(Long userId, Long bookId) {
        // Check if the book exists
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // Check if the user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // ❌ Prevent user from adding their own book
        if (book.getOwner() != null && book.getOwner().getId().equals(userId)) {
            throw new RuntimeException("You cannot add your own book to your wishlist");
        }

        // ✅ Prevent duplicate wishlist entries
        if (wishlistRepository.existsByUserIdAndBookId(userId, bookId)) {
            throw new RuntimeException("Book already in wishlist");
        }

        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        wishlist.setBook(book);
        wishlist.setAddedTime(LocalDateTime.now());

        return wishlistRepository.save(wishlist);
    }

    @Override
    @Transactional
    public void removeFromWishlist(Long userId, Long bookId) {
        wishlistRepository.deleteByUserIdAndBookId(userId, bookId);
    }

    @Override
    public List<Wishlist> getWishlistByUser(Long userId) {
        return wishlistRepository.findByUserId(userId);
    }
}
