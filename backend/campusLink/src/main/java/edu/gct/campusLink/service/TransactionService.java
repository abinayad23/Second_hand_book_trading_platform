package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.*;
import edu.gct.campusLink.dao.*;
import edu.gct.campusLink.bean.TransactionStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    private static final Logger logger = LoggerFactory.getLogger(TransactionService.class);

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderService orderService;

    // NEW: inject wishlist repo to find wishlisters
    @Autowired
    private WishlistRepository wishlistRepository;

    // NEW: inject notification service to create + push notifications
    @Autowired
    private NotificationService notificationService;

    // ============================
    // Group cart items by seller and create transactions
    // ============================
    public List<Transaction> createTransactions(User buyer) {
        List<CartItem> cartItems = cartRepository.findByUser(buyer);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Group books by seller
        Map<User, List<CartItem>> groupedBySeller = cartItems.stream()
                .collect(Collectors.groupingBy(item -> item.getBook().getOwner()));

        List<Transaction> transactions = new ArrayList<>();

        for (Map.Entry<User, List<CartItem>> entry : groupedBySeller.entrySet()) {
            User seller = entry.getKey();
            List<Book> books = entry.getValue().stream()
                    .map(CartItem::getBook)
                    .collect(Collectors.toList());

            double totalPrice = books.stream()
                    .mapToDouble(Book::getGeneratedPrice)
                    .sum();

            Transaction transaction = new Transaction();
            transaction.setBuyer(buyer);
            transaction.setSeller(seller);
            transaction.setBooks(books);
            transaction.setTotalPrice(totalPrice);
            transaction.setTime(LocalDateTime.now());
            transaction.setStatus(TransactionStatus.PENDING);

            Transaction saved = transactionRepository.save(transaction);
            transactions.add(saved);

            // NOTIFY: transaction initiated for each book -> inform wishlisters
            for (Book book : books) {
                try {
                    // find wishlisters for this book
                    List<Wishlist> wishers = wishlistRepository.findByBookId(book.getId());
                    if (wishers != null && !wishers.isEmpty()) {
                        String title = "Transaction Started";
                        String msg = "A transaction has been started for \"" + book.getTitle() + "\". It may become unavailable.";
                        for (Wishlist w : wishers) {
                            try {
                                Long wishUserId = w.getUser() != null ? w.getUser().getId() : null;
                                if (wishUserId != null) {
                                    notificationService.createNotification(
                                            wishUserId,
                                            title,
                                            msg,
                                            "WISHLIST_TRANSACTION_STARTED",
                                            book.getId()
                                    );
                                }
                            } catch (Exception ex) {
                                logger.warn("Failed to notify wishlist user for transaction start (user/book): {} / {}",
                                        w.getUser() != null ? w.getUser().getId() : "null", book.getId(), ex);
                            }
                        }
                    }
                } catch (Exception e) {
                    logger.error("Error while notifying wishlisters for transaction creation for book id: " + book.getId(), e);
                }
            }
        }

        return transactions;
    }

    // ============================
    // Complete transaction → remove from cart + create order + mark books unavailable
    // ============================
    public Transaction completeTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(TransactionStatus.COMPLETED);
        Transaction savedTxn = transactionRepository.save(transaction);

        // Create order for this transaction
        orderService.createOrder(
                transaction.getBuyer(),
                transaction.getSeller(),
                transaction.getBooks(),
                transaction.getTotalPrice()
        );

        // Remove these books from the cart and mark unavailable
        for (Book book : transaction.getBooks()) {
            try {
                cartRepository.deleteByBook(book);
            } catch (Exception ex) {
                logger.warn("Failed to delete cart entries for book id: " + book.getId(), ex);
            }

            try {
                book.setAvailable(false);
                bookRepository.save(book);
            } catch (Exception ex) {
                logger.error("Failed to set book unavailable for id: " + book.getId(), ex);
            }

            // NOTIFY: book sold / no longer available -> inform wishlisters
            try {
                List<Wishlist> wishers = wishlistRepository.findByBookId(book.getId());
                if (wishers != null && !wishers.isEmpty()) {
                    String title = "Book Sold";
                    String msg = "The book \"" + book.getTitle() + "\" has been sold and is no longer available.";
                    for (Wishlist w : wishers) {
                        try {
                            Long wishUserId = w.getUser() != null ? w.getUser().getId() : null;
                            if (wishUserId != null) {
                                notificationService.createNotification(
                                        wishUserId,
                                        title,
                                        msg,
                                        "WISHLIST_SOLD",
                                        book.getId()
                                );
                            }
                        } catch (Exception ex) {
                            logger.warn("Failed to notify wishlist user for sold book (user/book): {} / {}",
                                    w.getUser() != null ? w.getUser().getId() : "null", book.getId(), ex);
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("Error while notifying wishlisters for transaction completion for book id: " + book.getId(), e);
            }
        }

        return savedTxn;
    }

    // ============================
    // Cancel transaction -> mark as cancelled and restore availability for books + notify wishlisters
    // ============================
    public Transaction cancelTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(TransactionStatus.CANCELLED);
        Transaction saved = transactionRepository.save(transaction);

        // Restore book availability and notify wishlisters
        for (Book book : transaction.getBooks()) {
            try {
                book.setAvailable(true);
                bookRepository.save(book);
            } catch (Exception ex) {
                logger.error("Failed to mark book available during transaction cancel for book id: " + book.getId(), ex);
            }

            // NOTIFY: book available again
            try {
                List<Wishlist> wishers = wishlistRepository.findByBookId(book.getId());
                if (wishers != null && !wishers.isEmpty()) {
                    String title = "Book Available";
                    String msg = "The book \"" + book.getTitle() + "\" is available again.";
                    for (Wishlist w : wishers) {
                        try {
                            Long wishUserId = w.getUser() != null ? w.getUser().getId() : null;
                            if (wishUserId != null) {
                                notificationService.createNotification(
                                        wishUserId,
                                        title,
                                        msg,
                                        "WISHLIST_AVAILABLE",
                                        book.getId()
                                );
                            }
                        } catch (Exception ex) {
                            logger.warn("Failed to notify wishlist user for available book (user/book): {} / {}",
                                    w.getUser() != null ? w.getUser().getId() : "null", book.getId(), ex);
                        }
                    }
                }
            } catch (Exception e) {
                logger.error("Error while notifying wishlisters for transaction cancellation for book id: " + book.getId(), e);
            }
        }

        return saved;
    }

    // Fetch transactions
    public List<Transaction> getTransactionsByBuyer(User buyer) {
        return transactionRepository.findByBuyer(buyer);
    }

    public List<Transaction> getTransactionsBySeller(User seller) {
        return transactionRepository.findBySeller(seller);
    }

    public Optional<Transaction> getTransactionById(Long id) {
        return transactionRepository.findById(id);
    }
}
