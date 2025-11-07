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
}