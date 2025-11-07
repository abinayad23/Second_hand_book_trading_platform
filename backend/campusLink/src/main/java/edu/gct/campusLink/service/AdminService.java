package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Review;
//import edu.gct.campusLink.bean.Transaction;
import edu.gct.campusLink.bean.User;

import java.util.List;

public interface AdminService {
    List<User> getAllUsers();
    List<Book> getAllBooks();
    List<Review> getAllReviews();
    //List<Transaction> getAllTransactions();
    void deleteReview(Long reviewId);
}