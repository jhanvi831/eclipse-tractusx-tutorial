package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class PolicyService {

    @Value("${provider-url}")
    private String PROVIDER_MANAGEMENT_URL;

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    private String POLICY_URL = "/v2/policydefinitions";

    private final WebClient webClient;

    public PolicyService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createPolicy(String asset) {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + POLICY_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getAllPolicies() {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + POLICY_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getPolicyById(String id) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + POLICY_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> deletePolicyById(String id) {
        return webClient
                .delete()
                .uri(PROVIDER_MANAGEMENT_URL + POLICY_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    // BOB

    public Mono<ResponseEntity<String>> bobcreatePolicy(String asset) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + POLICY_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobgetAllPolicies() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + POLICY_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobgetPolicyById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + POLICY_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobdeletePolicyById(String id) {
        return webClient
                .delete()
                .uri(CONSUMER_MANAGEMENT_URL + POLICY_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }
}
