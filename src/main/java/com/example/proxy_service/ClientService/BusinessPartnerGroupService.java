package com.example.proxy_service.ClientService;


import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import org.springframework.web.reactive.function.client.WebClient;

@Service
public class BusinessPartnerGroupService {

    private String PROVIDER_MANAGEMENT_URL = "http://localhost/alice/management";

    private final WebClient webClient;

    public BusinessPartnerGroupService(WebClient webClient) {
        this.webClient = webClient;
    }

    public Mono<ResponseEntity<String>> createBusinessPartner(String bpg){
        return webClient
                .post()
                .uri(PROVIDER_MANAGEMENT_URL + "/business-partner-groups")
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
                .uri(PROVIDER_MANAGEMENT_URL + "/business-partner-groups/{policyBpn}", policyBpn)
                .accept(MediaType.APPLICATION_JSON)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println("Error occured: "+ error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while fetching business partner groups"));
    }

    public Mono<ResponseEntity<String>> updateBusinessPartnerGroup(String updateBpg) {
        return webClient
                .put()
                .uri(PROVIDER_MANAGEMENT_URL + "/business-partner-groups")
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(updateBpg)
                .retrieve()
                .bodyToMono(String.class)
                .map(body -> ResponseEntity.ok(body))
                .doOnError(error -> System.err.println(error.getMessage()))
                .onErrorReturn(ResponseEntity.status(500).body("Error occured while updating"));
    }
}
