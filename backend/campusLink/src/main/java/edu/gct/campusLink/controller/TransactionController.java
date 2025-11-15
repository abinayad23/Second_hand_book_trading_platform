package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.*;
import edu.gct.campusLink.bean.TransactionStatus;
import edu.gct.campusLink.service.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    // ✅ Create transactions grouped by seller
    @PostMapping("/create")
    public List<Transaction> createTransactions(@RequestParam Long buyerId) {
        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionService.createTransactions(buyer);
    }

    @Transactional// ✅ Complete transaction (generate orders)
    @PutMapping("/{transactionId}/complete")
    public Transaction completeTransaction(@PathVariable Long transactionId) {
        return transactionService.completeTransaction(transactionId);
    }

    // ✅ Cancel transaction
    @PutMapping("/{transactionId}/cancel")
    public Transaction cancelTransaction(@PathVariable Long transactionId) {
        return transactionService.cancelTransaction(transactionId);
    }

    // ✅ Get buyer transactions
    @GetMapping("/buyer/{buyerId}")
    public List<Transaction> getBuyerTransactions(@PathVariable Long buyerId) {
        User buyer = userService.getUserById(buyerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionService.getTransactionsByBuyer(buyer);
    }

    @GetMapping("/{id}")
    public Transaction getTransactionById(@PathVariable Long id) {
        return transactionService.getTransactionById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));
    }


    // ✅ Get seller transactions
    @GetMapping("/seller/{sellerId}")
    public List<Transaction> getSellerTransactions(@PathVariable Long sellerId) {
        User seller = userService.getUserById(sellerId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return transactionService.getTransactionsBySeller(seller);
    }
}
