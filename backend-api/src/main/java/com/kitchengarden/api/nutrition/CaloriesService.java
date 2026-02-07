package com.kitchengarden.api.nutrition;

import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class CaloriesService {

    // calories per unit (approx). You can replace with DB table or external nutrition API.


    private final FatSecretService fatSecretService;

    public CaloriesService(FatSecretService fatSecretService) {
        this.fatSecretService = fatSecretService;
    }
    private static final Map<String, Integer> CAL_PER_UNIT = Map.of(
        "banana", 105,
        "apple", 95,
        "orange", 62,
        "tomato", 22,
        "potato", 161,
        "onion", 44
    );

    public CaloriesEstimate estimate(String productName, int quantity) {
        String key = productName == null ? "" : productName.trim().toLowerCase();
        Integer perUnit = CAL_PER_UNIT.get(key);
        if (perUnit == null) {
            // default fallback
            perUnit = 50;
        }
        int center = perUnit * Math.max(quantity, 0);
        // show a range +-5%
        int low = (int) Math.round(center * 0.95);
        int high = (int) Math.round(center * 1.05);
        return new CaloriesEstimate(low, high, "kcal");
    }

    public record CaloriesEstimate(int low, int high, String unit) {}
}
