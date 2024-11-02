package com.example.proxy_service.ClientService;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class InitiateTransferService {

    private String CONSUMER_MANAGEMENT_URL = "http://localhost/bob/management";
    private String TRANSFER = "/v2/transferprocesses";

    private final WebClient webClient;

    public InitiateTransferService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> initiateTransfer(String asset){
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + TRANSFER)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .doOnError(error -> System.err.println(error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error Occured while initiating transfer"));

    }

    public Mono<ResponseEntity<String>> getAllTransfers() {
        return webClient
                .post()
                .uri(CONSUMER_MANAGEMENT_URL + TRANSFER + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching all transfers"));
    }

    public Mono<ResponseEntity<String>> getTransfersById(String id) {
        return webClient
                .get()
                .uri(CONSUMER_MANAGEMENT_URL + TRANSFER + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching contract with id"));
    }
}
