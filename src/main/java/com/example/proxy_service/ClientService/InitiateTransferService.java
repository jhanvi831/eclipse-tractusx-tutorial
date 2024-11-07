package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class InitiateTransferService {

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    @Value("${provider-url}")
    private String PROVIDER_MANAGEMENT_URL;

    private String TRANSFER = "/v2/transferprocesses";

    private final WebClient webClient;

    public InitiateTransferService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> initiateTransfer(String asset) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + TRANSFER)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getAllTransfers() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + TRANSFER + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> getTransfersById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + TRANSFER + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }


    // ALICE

    public Mono<ResponseEntity<String>> alicegetAllTransfers() {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + TRANSFER + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> alicegetTransfersById(String id) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + TRANSFER + "/{id}", id)
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
