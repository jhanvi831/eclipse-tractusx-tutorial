package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ContractDefinitionService {

    @Value("${provider-url}")
    private String PROVIDER_MANAGEMENT_URL;

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    private String CONTRACT_DEFINITION_URL = "/v2/contractdefinitions";

    private final WebClient webClient;

    public ContractDefinitionService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createContract(String asset) {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getAllContracts() {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getContractsById(String id) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> deleteContractsById(String id) {
        return webClient
                .delete()
                .uri(PROVIDER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL + "/{id}", id)
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

    public Mono<ResponseEntity<String>> bobcreateContract(String asset) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobgetAllContracts() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobgetContractsById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobdeleteContractsById(String id) {
        return webClient
                .delete()
                .uri(CONSUMER_MANAGEMENT_URL + CONTRACT_DEFINITION_URL + "/{id}", id)
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
