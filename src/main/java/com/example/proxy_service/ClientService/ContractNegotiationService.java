package com.example.proxy_service.ClientService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

@Service
public class ContractNegotiationService {

    private String CONSUMER_MANAGEMENT_URL = "http://localhost/bob/management";
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
                .doOnError(error -> System.err.println(error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error Occured while adding negotiation"));
    }

    public Mono<ResponseEntity<String>> getAllNegotiations() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + NEGOTIATION + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching all negotiations"));
    }

    public Mono<ResponseEntity<String>> getNegotiationById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + NEGOTIATION + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching negotiation with id"));
    }
}
