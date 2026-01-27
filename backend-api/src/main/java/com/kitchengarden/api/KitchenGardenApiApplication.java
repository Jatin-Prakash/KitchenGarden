package com.kitchengarden.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
public class KitchenGardenApiApplication {
    public static void main(String[] args) {
        SpringApplication.run(KitchenGardenApiApplication.class, args);
    }
}
