package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.bean.AuthRequest;

import java.util.List;
import java.util.Optional;

public interface UserService {
    String initiateRegistration(AuthRequest request);
    User completeRegistration(AuthRequest request, String otp);
    Optional<User> getUserById(Long id);
    Optional<User> getUserByEmail(String email);
    User updateUser(Long id, User updatedUser);
    void deleteUser(Long id);
    List<User> getAllUsers();
}