package com.kitchengarden.api.nutrition;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class FatSecretService {

    private static final String API_KEY = "e06f9f66146b41f38567b9f7f27b4804";
    private static final String SHARED_SECRET = "07833a070a95429e9da94dc941fc2c6d";

    public String getAccessToken() throws Exception {
        try (CloseableHttpClient client = HttpClients.createDefault()) {
            HttpPost post = new HttpPost("https://platform.fatsecret.com/rest/server.api");

            // Encode API Key and Secret
            String credentials = Base64.getEncoder().encodeToString((API_KEY + ":" + SHARED_SECRET).getBytes(StandardCharsets.UTF_8));
            post.setHeader("Authorization", "Basic " + credentials);
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");

            // Set grant type
            post.setEntity(new StringEntity("grant_type=client_credentials"));

            try (CloseableHttpResponse response = client.execute(post)) {
                String json = new String(response.getEntity().getContent().readAllBytes(), StandardCharsets.UTF_8);
                JsonObject jsonObject = JsonParser.parseString(json).getAsJsonObject();
                return jsonObject.get("access_token").getAsString();
            }
        }
    }
}