package com.kitchengarden.api.product;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String sellerUserId; // Supabase user id (sub)

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private double price;

    @Column(nullable = false)
    private int quantityAvailable;

    @Column(nullable = true)
    private String imageUrl;

    @Column(nullable = false)
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Product() {}

    public Product(String sellerUserId, String name, double price, int quantityAvailable, String imageUrl) {
        this.sellerUserId = sellerUserId;
        this.name = name;
        this.price = price;
        this.quantityAvailable = quantityAvailable;
        this.imageUrl = imageUrl;
    }

    public Long getId() { return id; }
    public String getSellerUserId() { return sellerUserId; }
    public void setSellerUserId(String sellerUserId) { this.sellerUserId = sellerUserId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public int getQuantityAvailable() { return quantityAvailable; }
    public void setQuantityAvailable(int quantityAvailable) { this.quantityAvailable = quantityAvailable; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
