package com.example.proxy_service.ClientService;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class ContractDefinitionService {

    private String PROVIDER_MANAGEMENT_URL = "http://localhost/alice/management/v2/contractdefinitions";

    private final WebClient webClient;

    public ContractDefinitionService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createContract(String asset){
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(asset)
                .retrieve()
                .toEntity(String.class)
                .doOnError(error -> System.err.println(error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error Occured while adding contract"));

    }

    public Mono<ResponseEntity<String>> getAllContracts() {
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + "/request")
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching all contracts"));
    }

    public Mono<ResponseEntity<String>> getContractsById(String id) {
        return webClient
                .get()
                .uri(PROVIDER_MANAGEMENT_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching contract with id"));
    }

    public Mono<ResponseEntity<String>> deleteContractsById(String id) {
        return webClient
                .delete()
                .uri(PROVIDER_MANAGEMENT_URL + "/{id}", id)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while deleting contract"));
    }
}
