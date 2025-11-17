package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Review;
//import edu.gct.campusLink.bean.Transaction;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.ReviewRepository;
//import edu.gct.campusLink.dao.TransactionRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;
    //private final TransactionRepository transactionRepository;

    public AdminServiceImpl(UserRepository userRepository,
                            BookRepository bookRepository,
                            //TransactionRepository transactionRepository,
                            ReviewRepository reviewRepository
                            ) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
        //this.transactionRepository = transactionRepository;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    //@Override
    //public List<Transaction> getAllTransactions() {
    //    return transactionRepository.findAll();
    //}

    @Override
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }

    @Override
    public User updateUserRole(Long userId, String role) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setRole(role);
        return userRepository.save(user);
    }

    @Override
    public User toggleUserVerification(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        user.setIsVerified(!user.getIsVerified());
        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }
}