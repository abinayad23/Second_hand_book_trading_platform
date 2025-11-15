package edu.gct.campusLink.dao;

import edu.gct.campusLink.bean.Order;
import edu.gct.campusLink.bean.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByBuyer(User buyer);
    List<Order> findBySeller(User seller);
}
