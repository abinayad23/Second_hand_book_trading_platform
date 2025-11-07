package edu.gct.campusLink.service;

import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.ReviewRepository;
import edu.gct.campusLink.dao.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final ReviewRepository reviewRepository;

    public DashboardServiceImpl(UserRepository userRepository,
                                BookRepository bookRepository,
                                ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.bookRepository = bookRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    public Map<String, Long> getSummaryStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalBooks", bookRepository.count());
        stats.put("totalReviews", reviewRepository.count());
        return stats;
    }

    @Override
    public Map<String, Long> getWeeklyActivity() {
        Map<String, Long> activity = new HashMap<>();
        LocalDate today = LocalDate.now();
        for (int i = 6; i >= 0; i--) {
            LocalDate day = today.minusDays(i);
            activity.put(day.toString(), 0L); // Replace with actual counts if you add date filters
        }
        return activity;
    }
}