package edu.gct.campusLink.service;

import edu.gct.campusLink.bean.Book;
import edu.gct.campusLink.bean.Notification;
import edu.gct.campusLink.bean.User;
import edu.gct.campusLink.bean.Wishlist;
import edu.gct.campusLink.dao.BookRepository;
import edu.gct.campusLink.dao.NotificationRepository;
import edu.gct.campusLink.dao.WishlistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final WishlistRepository wishlistRepository;
    private final NotificationRepository notificationRepository;
    private final BookRepository bookRepository;

    public NotificationServiceImpl(WishlistRepository wishlistRepository,
                                   NotificationRepository notificationRepository,
                                   BookRepository bookRepository) {
        this.wishlistRepository = wishlistRepository;
        this.notificationRepository = notificationRepository;
        this.bookRepository = bookRepository;
    }

    @Override
    public void notifyUsersForBookAvailability(Long bookId) {
        Book book = bookRepository.findById(bookId).orElseThrow();
        List<Wishlist> wishlists = wishlistRepository.findAll();

        for (Wishlist wishlist : wishlists) {
            if (wishlist.getBook().getId().equals(bookId)) {
                User user = wishlist.getUser();
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setMessage("Book '" + book.getTitle() + "' is now available.");
                notificationRepository.save(notification);
            }
        }
    }

    @Override
    public List<Notification> getAllNotifications(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    @Override
    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow();
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }
}
