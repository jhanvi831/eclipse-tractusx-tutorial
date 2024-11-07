package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.ContractNegotiationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/v1/contract-negotiations")
public class ContractNegotiation {

    @Autowired
    private ContractNegotiationService contractNegotiationService;

    @PostMapping
    public Mono<ResponseEntity<String>> initiateContractNegotiation(@RequestBody String contractNegotiation) {
        return contractNegotiationService.createContractNegotiation(contractNegotiation);
    }

    @PostMapping("/allNegotiations")
    public Mono<ResponseEntity<String>> getAllNegotiations() {
        return contractNegotiationService.getAllNegotiations();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getNegotiationById(@PathVariable String id) {
        return contractNegotiationService.getNegotiationById(id);
    }

    // ALICE

    @PostMapping("/alice")
    public Mono<ResponseEntity<String>> aliceinitiateContractNegotiation(@RequestBody String contractNegotiation) {
        return contractNegotiationService.alicecreateContractNegotiation(contractNegotiation);
    }

    @PostMapping("/alice/allNegotiations")
    public Mono<ResponseEntity<String>> alicegetAllNegotiations() {
        return contractNegotiationService.alicegetAllNegotiations();
    }

    @GetMapping("alice/{id}")
    public Mono<ResponseEntity<String>> alicegetNegotiationById(@PathVariable String id) {
        return contractNegotiationService.alicegetNegotiationById(id);
    }
}
