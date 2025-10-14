package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.User;
import java.util.Optional;

public interface UserService {
    User register(User user);
    Optional<User> findById(Long id);
    Optional<User> findByEmail(String email);
}