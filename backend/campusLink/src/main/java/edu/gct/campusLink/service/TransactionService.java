package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.*;
import edu.gct.campusLink.dao.*;
import edu.gct.campusLink.bean.TransactionStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

//import java.lang.ScopedValue;
import java.util.*;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderService orderService;

    // ✅ Group cart items by seller and create transactions
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

            transactions.add(transactionRepository.save(transaction));
        }

        return transactions;
    }

    // ✅ Complete transaction → remove from cart + create order
    public Transaction completeTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        transaction.setStatus(TransactionStatus.COMPLETED);
        transactionRepository.save(transaction);

        // Create order for this transaction
        orderService.createOrder(
                transaction.getBuyer(),
                transaction.getSeller(),
                transaction.getBooks(),
                transaction.getTotalPrice()
        );

        // Remove these books from the cart
        for (Book book : transaction.getBooks()) {
            cartRepository.deleteByBook(book);
            book.setAvailable(false);
            bookRepository.save(book);
        }

        return transaction;
    }

    // ✅ Cancel transaction
    public Transaction cancelTransaction(Long id) {
        Transaction transaction = transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
        transaction.setStatus(TransactionStatus.CANCELLED);
        return transactionRepository.save(transaction);
    }

    // ✅ Fetch transactions
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
