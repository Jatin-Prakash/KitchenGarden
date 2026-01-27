package com.kitchengarden.api.payments;

import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payments")
public class StripePaymentController {

    @PostMapping("/checkout-session")
    public Map<String, String> checkout(@RequestBody Map<String, Object> req)
            throws Exception {

        Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");

        Session session = Session.create(
                SessionCreateParams.builder()
                        .setMode(SessionCreateParams.Mode.PAYMENT)
                        .setSuccessUrl("http://localhost:3000/success")
                        .setCancelUrl("http://localhost:3000/cancel")
                        .build()
        );

        return Map.of("url", session.getUrl());
    }
}

