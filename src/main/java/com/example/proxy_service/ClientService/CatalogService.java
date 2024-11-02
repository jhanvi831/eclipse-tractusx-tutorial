package com.example.proxy_service.ClientService;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class CatalogService {

    private String CONSUMER_MANAGEMENT_URL = "http://localhost/bob/management";
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
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching catalogs"));
    }

}
