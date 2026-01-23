package com.kitchengarden.api.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {
    public String requireUserId(Authentication authentication) {
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new IllegalStateException("Missing or invalid JWT");
        }
        // Supabase uses 'sub' as user id
        return jwt.getSubject();
    }
}
