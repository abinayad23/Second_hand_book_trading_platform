package edu.gct.campusLink.controller;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Review;
//import edu.gct.campusLink.bean.Transaction;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.service.AdminService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000", "http://localhost:5174"}, allowCredentials = "true")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return adminService.getAllUsers();
    }

    @GetMapping("/books")
    public List<Book> getAllBooks() {
        return adminService.getAllBooks();
    }

    //@GetMapping("/reviews")
    //public List<Review> getAllReviews() {
    //    return adminService.getAllReviews();
    //}

    @DeleteMapping("/reviews/{reviewId}")
    public void deleteReview(@PathVariable Long reviewId) {
        adminService.deleteReview(reviewId);
    }

    @PutMapping("/users/{userId}/role")
    public User updateUserRole(@PathVariable Long userId, @RequestParam String role) {
        return adminService.updateUserRole(userId, role);
    }

    @PutMapping("/users/{userId}/verify")
    public User toggleUserVerification(@PathVariable Long userId) {
        return adminService.toggleUserVerification(userId);
    }

    @DeleteMapping("/users/{userId}")
    public void deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
    }
}