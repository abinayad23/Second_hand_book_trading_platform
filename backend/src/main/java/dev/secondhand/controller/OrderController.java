package dev.secondhand.controller;

import com.stripe.model.PaymentIntent;
import dev.secondhand.model.Order;
import dev.secondhand.model.OrderItem;
import dev.secondhand.repo.OrderItemRepository;
import dev.secondhand.repo.OrderRepository;
import dev.secondhand.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final StripeService stripeService;

    public OrderController(OrderRepository orderRepository, OrderItemRepository orderItemRepository, StripeService stripeService) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.stripeService = stripeService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> body) {
        try {
            Long buyerId = Long.valueOf(String.valueOf(body.get("buyerId")));
            Double total = Double.valueOf(String.valueOf(body.get("total")));
            List<Map<String, Object>> items = (List<Map<String, Object>>) body.getOrDefault("items", List.of());

            Order o = new Order();
            o.setBuyerId(buyerId);
            o.setTotalAmount(total);
            o.setStatus("CREATED");
            o.setPaymentProvider("stripe");
            o = orderRepository.save(o);

            List<OrderItem> created = new ArrayList<>();
            for (Map<String,Object> it : items) {
                OrderItem oi = new OrderItem();
                oi.setOrderId(o.getId());
                oi.setBookId(Long.valueOf(String.valueOf(it.get("bookId"))));
                oi.setPrice(Double.valueOf(String.valueOf(it.get("price"))));
                oi.setQty(Integer.valueOf(String.valueOf(it.getOrDefault("qty",1))));
                orderItemRepository.save(oi);
                created.add(oi);
            }

            // Create Stripe PaymentIntent (amount in cents)
            long amountCents = Math.round(total * 100);
            PaymentIntent pi = stripeService.createPaymentIntent(amountCents, "inr");
            return ResponseEntity.ok(Map.of("order", o, "items", created, "clientSecret", pi.getClientSecret()));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("message","error creating order"));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> history(@RequestParam Long buyerId) {
        List<Order> list = orderRepository.findByBuyerId(buyerId);
        return ResponseEntity.ok(list);
    }
}