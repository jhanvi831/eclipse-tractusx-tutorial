package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;

@Service
public class ContractNegotiationService {

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    @Value("${provider-url}")
    private String PROVIDER_MANAGEMENT_URL;

    private String NEGOTIATION = "/v2/contractnegotiations";

    private final WebClient webClient;

    public ContractNegotiationService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createContractNegotiation(String contractNegotiation) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + NEGOTIATION)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(contractNegotiation)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));
    }

    public Mono<ResponseEntity<String>> getAllNegotiations() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + NEGOTIATION + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getNegotiationById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + NEGOTIATION + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }



    //ALICE

    public Mono<ResponseEntity<String>> alicegetAllNegotiations() {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + NEGOTIATION + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> alicegetNegotiationById(String id) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + NEGOTIATION + "/{id}", id)
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
