package dev.secondhand.controller;

import dev.secondhand.model.Order;
import dev.secondhand.repo.OrderRepository;
import dev.secondhand.service.ReceiptService;
import dev.secondhand.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/webhooks")
public class StripeWebhookController {
    private final OrderRepository orderRepo;
    private final ReceiptService receiptService;
    private final NotificationService notificationService;

    public StripeWebhookController(OrderRepository orderRepo, ReceiptService receiptService, NotificationService notificationService) {
        this.orderRepo = orderRepo;
        this.receiptService = receiptService;
        this.notificationService = notificationService;
    }

    @PostMapping("/stripe")
    public ResponseEntity<?> handle(@RequestBody Map<String, Object> payload) {
        try {
            String type = (String) payload.get("type");
            Map<String,Object> data = (Map<String,Object>) payload.get("data");
            Map<String,Object> obj = (Map<String,Object>) data.get("object");
            if ("payment_intent.succeeded".equals(type)) {
                String piId = (String) obj.get("id");
                Map<String,Object> metadata = (Map<String,Object>) obj.get("metadata");
                Long orderId = metadata != null && metadata.get("orderId") != null ? Long.valueOf(String.valueOf(metadata.get("orderId"))) : null;
                if (orderId != null) {
                    Order ord = orderRepo.findById(orderId).orElse(null);
                    if (ord != null) {
                        ord.setStatus("PAID");
                        ord.setPaymentReference(piId);
                        String receiptUrl = receiptService.generateReceiptPdf(ord.getId(), "Buyer", ord.getTotalAmount());
                        ord.setReceiptUrl(receiptUrl);
                        orderRepo.save(ord);
                        notificationService.create(ord.getBuyerId(), "order_paid", "Your order #" + ord.getId() + " was paid.", null, "Order paid");
                    }
                }
            }
            return ResponseEntity.ok(Map.of("received", true));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", ex.getMessage()));
        }
    }
}