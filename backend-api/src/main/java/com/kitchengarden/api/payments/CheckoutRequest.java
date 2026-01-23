package com.kitchengarden.api.payments;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class CheckoutRequest {

    @NotBlank
    private String currency;

    @NotBlank
    private String buyerPhoneNumber; // for delivery contact reference (stored as text; real app should store in Supabase user profile)

    private List<LineItem> items;

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getBuyerPhoneNumber() { return buyerPhoneNumber; }
    public void setBuyerPhoneNumber(String buyerPhoneNumber) { this.buyerPhoneNumber = buyerPhoneNumber; }
    public List<LineItem> getItems() { return items; }
    public void setItems(List<LineItem> items) { this.items = items; }

    public static class LineItem {
        @NotBlank
        private String name;

        @Min(1)
        private int quantity;

        @Min(1)
        private long unitAmount; // smallest unit (paise)

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public long getUnitAmount() { return unitAmount; }
        public void setUnitAmount(long unitAmount) { this.unitAmount = unitAmount; }
    }
}
