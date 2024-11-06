package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CatalogService {

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    private String CATALOG_REQUEST = "/v2/catalog/request";

    private final WebClient webClient;

    public CatalogService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> getCatalog(String catalogRequest) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + CATALOG_REQUEST)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(catalogRequest)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

}
