package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.User;
import java.util.Optional;
import java.util.List;

public interface UserService {
    User register(User user);
    Optional<User> getUserById(Long id);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
    List<User> getAllUsers();
}
