package com.kitchengarden.api.discount;

import jakarta.persistence.*;

@Entity
public class DiscountCampaign {
    @Id
    @GeneratedValue
    public Long id;

    public String name;
    @Enumerated(EnumType.STRING)
    public DiscountType type;
    public double value;
    public double minCartValue;
    public double maxDiscount;
    public int priority;

    public DiscountCampaign() {}
}

