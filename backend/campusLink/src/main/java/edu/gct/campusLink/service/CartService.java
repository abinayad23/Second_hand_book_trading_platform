package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.CartItem;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.CartRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    public CartService(CartRepository cartRepository, UserRepository userRepository, BookRepository bookRepository) {
        this.cartRepository = cartRepository;
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
    }

    public List<CartItem> getCartByUser(Long userId) {
        return cartRepository.findByUserId(userId);
    }

    @Transactional
    public CartItem addToCart(Long userId, Long bookId) {

        if (cartRepository.findByUserIdAndBookId(userId, bookId).isPresent()) {
            throw new RuntimeException("Book already exists in cart!");
        }
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId).orElseThrow(() -> new RuntimeException("Book not found"));

        if (book.getOwner() != null && book.getOwner().getId().equals(userId)) {
            throw new RuntimeException("Cannot add your own book to cart");
        }

        // don't add if already in cart — increment quantity if you want
            CartItem item = new CartItem();
            item.setUser(user);
            item.setBook(book);

            return cartRepository.save(item);

    }

    @Transactional
    public void removeFromCart(Long userId, Long bookId) {
        cartRepository.deleteByUserIdAndBookId(userId, bookId);
    }

    @Transactional
    public void clearCart(Long userId) {
        var items = cartRepository.findByUserId(userId);
        cartRepository.deleteAll(items);
    }
}
