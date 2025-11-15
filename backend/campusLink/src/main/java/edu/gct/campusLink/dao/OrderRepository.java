package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Order;
import edu.gct.campusLink.bean.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find all orders placed by a given buyer.
     */
    List<Order> findByBuyer(User buyer);

    /**
     * Find all orders sold by a given seller.
     */
    List<Order> findBySeller(User seller);
}
