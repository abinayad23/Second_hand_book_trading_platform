package edu.gct.campusLink.service;

import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.ReviewRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public AnalyticsServiceImpl(UserRepository userRepository,
                                BookRepository bookRepository,
                                ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Map<String, Long> getPlatformStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBooks", bookRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        return stats;
    }

    @Override
    public Map<String, Long> getDailyActivity() {
        Map<String, Long> activity = new HashMap<>();
        activity.put("newUsersToday", 0L);
        activity.put("newBooksToday", 0L);
        activity.put("newReviewsToday", 0L);
        activity.put("newTransactionsToday", 0L);
        return activity;
    }
}