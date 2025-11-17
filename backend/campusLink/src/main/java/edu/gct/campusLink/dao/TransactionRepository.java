package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Transaction;
import edu.gct.campusLink.bean.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBuyer(User buyer);
    List<Transaction> findBySeller(User seller);

}
