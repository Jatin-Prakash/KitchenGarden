package com.kitchengarden.api.security;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    @Value("${security.cognito.jwks-url}")
    private String jwksUrl;



//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        http
//                // 1. Enforce HTTPS
//                .requiresChannel(ch -> ch.anyRequest().requiresSecure())
//
//                // 2. Disable CSRF only on /webhook (Stripe needs POST webhooks)
//                .csrf(csrf -> csrf.ignoringRequestMatchers("/webhook"))
//
//                // 3. Permit all other requests (no Basic Auth)
//                .authorizeHttpRequests(auth -> auth
//                        .anyRequest().permitAll()
//                );
//
//        return http.build();
//    }

//    @Bean
//    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//        CognitoLogoutHandler cognitoLogoutHandler = new CognitoLogoutHandler();
//
//        http.csrf(Customizer.withDefaults())
//                .authorizeHttpRequests(authz -> authz
//                        .requestMatchers("/").permitAll()
//                        .anyRequest()
//                        .authenticated())
//                .oauth2Login(Customizer.withDefaults())
//                .logout(logout -> logout.logoutSuccessHandler(cognitoLogoutHandler));
//        return http.build();
//    }


    @Bean
    @Order(1)
    public SecurityFilterChain publicFilterChain(HttpSecurity http) throws Exception {

        http
                .securityMatcher(
                        "/gui", "/gui/**",
                        "/graphiql/**",
                        "/graphql",
                        "/graphql/**",
                        "/stripe/webhook","/error"
                )
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                );

        return http.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain apiFilterChain(HttpSecurity http) throws Exception {

        http
                .securityMatcher("/**")
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt());

        return http.build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withJwkSetUri(jwksUrl).build();
    }

}
