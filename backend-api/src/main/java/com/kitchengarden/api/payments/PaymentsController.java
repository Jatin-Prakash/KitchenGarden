package com.kitchengarden.api.payments;

import com.kitchengarden.api.order.Order;
import com.kitchengarden.api.order.OrderRepository;
import com.kitchengarden.api.security.AuthUtil;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RestController
@RequestMapping("/payments")
public class PaymentsController {

    private final OrderRepository orderRepository;
    private final AuthUtil authUtil;

    @Value("${stripe.secret-key}")
    private String stripeSecretKey;

    @Value("${app.checkout.success-url}")
    private String successUrl;

    @Value("${app.checkout.cancel-url}")
    private String cancelUrl;

    public PaymentsController(OrderRepository orderRepository, AuthUtil authUtil) {
        this.orderRepository = orderRepository;
        this.authUtil = authUtil;
    }

    @PostMapping(value = "/checkout-session", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public CheckoutResponse createCheckoutSession(Authentication auth, @Valid @RequestBody CheckoutRequest req) throws Exception {
        if (stripeSecretKey == null || stripeSecretKey.isBlank()) {
            throw new IllegalStateException("Missing STRIPE_SECRET_KEY");
        }
        Stripe.apiKey = stripeSecretKey;

        String buyerUserId = authUtil.requireUserId(auth);

        long amountTotal = 0;
        SessionCreateParams.Builder params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .setSuccessUrl(successUrl + "?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl(cancelUrl);

        if (req.getItems() != null) {
            for (CheckoutRequest.LineItem item : req.getItems()) {
                if (item == null) continue;
                amountTotal += item.getUnitAmount() * item.getQuantity();

                params.addLineItem(
                    SessionCreateParams.LineItem.builder()
                        .setQuantity((long) item.getQuantity())
                        .setPriceData(
                            SessionCreateParams.LineItem.PriceData.builder()
                                .setCurrency(Objects.requireNonNullElse(req.getCurrency(), "inr"))
                                .setUnitAmount(item.getUnitAmount())
                                .setProductData(
                                    SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                        .setName(item.getName())
                                        .build()
                                )
                                .build()
                        )
                        .build()
                );
            }
        }

        Order order = new Order(buyerUserId, Objects.requireNonNullElse(req.getCurrency(), "inr"), amountTotal);
        order = orderRepository.save(order);

        // attach order id as metadata (handy for webhook)
        params.putMetadata("orderId", String.valueOf(order.getId()));
        params.putMetadata("buyerPhoneNumber", req.getBuyerPhoneNumber());

        Session session = Session.create(params.build());

        order.setStripeCheckoutSessionId(session.getId());
        orderRepository.save(order);

        return new CheckoutResponse(session.getUrl(), order.getId());
    }

    // Webhook endpoint placeholder (optional). Add STRIPE_WEBHOOK_SECRET and verify signature before production use.
    @PostMapping("/webhook")
    public String webhook(@RequestBody String payload, @RequestHeader(value = "Stripe-Signature", required = false) String sig) {
        // TODO: Verify signature, mark order as PAID based on session/payment_intent event.
        return "ok";
    }
}
