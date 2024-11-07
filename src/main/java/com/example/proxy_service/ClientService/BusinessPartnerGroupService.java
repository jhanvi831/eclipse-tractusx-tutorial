package com.example.proxy_service.ClientService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class BusinessPartnerGroupService {

    @Value("${provider-url}")
    private String PROVIDER_MANAGEMENT_URL;

    @Value("${consumer-url}")
    private String CONSUMER_MANAGEMENT_URL;

    private String BUSINESS_PARTNER_GROUPS = "/business-partner-groups";

    private final WebClient webClient;

    public BusinessPartnerGroupService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createBusinessPartner(String bpg) {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + BUSINESS_PARTNER_GROUPS)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(bpg)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> getBusinessPartnerGroups(String policyBpn) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + BUSINESS_PARTNER_GROUPS + "/{policyBpn}", policyBpn)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> updateBusinessPartnerGroup(String updateBpg) {
        return webClient
                .put()
                .uri(PROVIDER_MANAGEMENT_URL + BUSINESS_PARTNER_GROUPS)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(updateBpg)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));
    }

    public Mono<ResponseEntity<String>> bobcreateBusinessPartner(String bpg) {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + BUSINESS_PARTNER_GROUPS)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(bpg)
                .retrieve()
                .toEntity(String.class)
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));

    }

    public Mono<ResponseEntity<String>> bobgetBusinessPartnerGroups(String policyBpn) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + BUSINESS_PARTNER_GROUPS + "/{policyBpn}", policyBpn)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println("Error occured: " + error.getMessage()));
    }

    public Mono<ResponseEntity<String>> bobupdateBusinessPartnerGroup(String updateBpg) {
        return webClient
                .put()
                .uri(CONSUMER_MANAGEMENT_URL + BUSINESS_PARTNER_GROUPS)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(updateBpg)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .onErrorResume(WebClientResponseException.class, ex -> {
                    return Mono.just(ResponseEntity.status(ex.getStatusCode()).body(ex.getMessage()));
                })
                .doOnError(error -> System.err.println(error.getMessage()));
    }
}
