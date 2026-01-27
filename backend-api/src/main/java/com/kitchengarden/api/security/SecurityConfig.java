package com.kitchengarden.api.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Value("${security.cognito.jwks-url}")
    private String jwksUrl;

    @Bean
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        // Allow GraphQL GUI & health without auth, require JWT for everything else.
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/actuator/health", "/graphiql", "/graphql/schema", "/graphql").permitAll()
                .requestMatchers("/payments/webhook").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(oauth -> oauth
                .jwt(jwt -> jwt.jwkSetUri(jwksUrl))
            );

        return http.build();
    }

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
}
