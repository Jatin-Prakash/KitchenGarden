package com.kitchengarden.api.order;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String buyerUserId; // Supabase sub

    @Column(nullable = false)
    private String currency = "inr";

    @Column(nullable = false)
    private long amountTotal; // in smallest currency unit (paise)

    @Column(nullable = true)
    private String stripeCheckoutSessionId;

    @Column(nullable = false)
    private String status = "CREATED"; // CREATED, PAID, CANCELED

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Order() {}

    public Order(String buyerUserId, String currency, long amountTotal) {
        this.buyerUserId = buyerUserId;
        this.currency = currency;
        this.amountTotal = amountTotal;
    }

    public Long getId() { return id; }
    public String getBuyerUserId() { return buyerUserId; }
    public void setBuyerUserId(String buyerUserId) { this.buyerUserId = buyerUserId; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public long getAmountTotal() { return amountTotal; }
    public void setAmountTotal(long amountTotal) { this.amountTotal = amountTotal; }
    public String getStripeCheckoutSessionId() { return stripeCheckoutSessionId; }
    public void setStripeCheckoutSessionId(String stripeCheckoutSessionId) { this.stripeCheckoutSessionId = stripeCheckoutSessionId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
