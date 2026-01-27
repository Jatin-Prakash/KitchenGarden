package com.kitchengarden.api.order;

import com.kitchengarden.api.discount.DiscountCampaign;
import com.kitchengarden.api.discount.DiscountType;
import org.springframework.stereotype.Service;

@Service
public class OrderQuoteService {

    public double applyBestDiscount(double cartTotal, DiscountCampaign c) {
        double discount = c.type == DiscountType.PERCENT
                ? cartTotal * (c.value / 100)
                : c.value;

        return Math.min(discount, c.maxDiscount);
    }
}

