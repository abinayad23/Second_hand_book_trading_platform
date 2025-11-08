package dev.secondhand.service;

import dev.secondhand.model.Book;
import org.springframework.stereotype.Service;

@Service
public class PriceService {
    public double computePrice(double originalPrice, Book.Quality quality) {
        double pct;
        switch (quality) {
            case NEW_LIKE: pct = 0.9; break;
            case VERY_GOOD: pct = 0.75; break;
            case GOOD: pct = 0.6; break;
            case FAIR: pct = 0.45; break;
            case POOR: pct = 0.3; break;
            default: pct = 0.5;
        }
        double price = originalPrice * pct;
        // Round to 2 decimals
        return Math.round(price * 100.0) / 100.0;
    }
}