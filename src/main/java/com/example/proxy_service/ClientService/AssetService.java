package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class AssetService {

    @Value("${provider-url}")
    private String PROVIDER_MANAGEMENT_URL;

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    private String ASSET_URL = "/v3/assets";

    private final WebClient webClient;

    public AssetService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createAsset(String asset) {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + ASSET_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .doOnError(error -> System.err.println(error.getMessage()))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                });

    }

    public Mono<ResponseEntity<String>> getAllAssets() {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + ASSET_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> getAssetById(String id) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + ASSET_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> deleteAssetById(String id) {
        return webClient
                .delete()
                .uri(PROVIDER_MANAGEMENT_URL + ASSET_URL + "/{id}", id)
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

    public Mono<ResponseEntity<String>> bobcreateAsset(String asset) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + ASSET_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .doOnError(error -> System.err.println(error.getMessage()))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                });

    }

    public Mono<ResponseEntity<String>> bobgetAllAssets() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + ASSET_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> bobgetAssetById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + ASSET_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> bobdeleteAssetById(String id) {
        return webClient
                .delete()
                .uri(CONSUMER_MANAGEMENT_URL + ASSET_URL + "/{id}", id)
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
