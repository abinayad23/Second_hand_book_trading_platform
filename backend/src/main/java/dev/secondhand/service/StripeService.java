package dev.secondhand.service;

import com.stripe.Stripe;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;

@Service
public class StripeService {
    @Value("${stripe.secret-key:}")
    private String stripeSecret;

    @PostConstruct
    public void init() {
        if (stripeSecret != null && !stripeSecret.isEmpty()) {
            Stripe.apiKey = stripeSecret;
        }
    }

    public PaymentIntent createPaymentIntent(long amount, String currency) throws Exception {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amount)
                .setCurrency(currency)
                .build();
        return PaymentIntent.create(params);
    }
}