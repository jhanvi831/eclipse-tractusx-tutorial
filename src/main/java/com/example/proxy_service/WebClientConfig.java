package com.example.proxy_service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Value("${api-key}")
    private String apiKey;

    @Bean
    public WebClient webClient(WebClient.Builder builder) {
        return builder
                .defaultHeader("x-api-key", apiKey)
                .build();
    }
}
