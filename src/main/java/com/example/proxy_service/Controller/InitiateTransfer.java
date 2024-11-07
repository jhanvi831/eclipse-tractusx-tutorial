package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.InitiateTransferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("api/v1/transfers")
public class InitiateTransfer {

    @Autowired
    private InitiateTransferService initiateTransferService;

    @PostMapping
    public Mono<ResponseEntity<String>> initiateContractNegotiation(@RequestBody String contractNegotiation) {
        return initiateTransferService.initiateTransfer(contractNegotiation);
    }

    @PostMapping("/allTransfers")
    public Mono<ResponseEntity<String>> getAllTransfers() {
        return initiateTransferService.getAllTransfers();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getTransfersById(@PathVariable String id) {
        return initiateTransferService.getTransfersById(id);
    }

    // ALICE

    @PostMapping("/alice")
    public Mono<ResponseEntity<String>> aliceinitiateContractNegotiation(@RequestBody String contractNegotiation) {
        return initiateTransferService.aliceinitiateTransfer(contractNegotiation);
    }

    @PostMapping("alice/allTransfers")
    public Mono<ResponseEntity<String>> alicegetAllTransfers() {
        return initiateTransferService.alicegetAllTransfers();
    }

    @GetMapping("alice/{id}")
    public Mono<ResponseEntity<String>> alicegetTransfersById(@PathVariable String id) {
        return initiateTransferService.alicegetTransfersById(id);
    }
}
