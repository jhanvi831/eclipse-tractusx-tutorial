package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.ContractDefinitionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/v1/contract-definitions")
public class ContractDefinition {

    @Autowired
    private ContractDefinitionService contractDefinitionService;

    @PostMapping
    public Mono<ResponseEntity<String>> createContractDefinition(@RequestBody String contractDefinition) {
        return contractDefinitionService.createContract(contractDefinition);
    }

    @PostMapping("/allContracts")
    public Mono<ResponseEntity<String>> getAllContracts() {
        return contractDefinitionService.getAllContracts();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getContractsById(@PathVariable String id) {
        return contractDefinitionService.getContractsById(id);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> deleteContractsById(@PathVariable String id) {
        return contractDefinitionService.deleteContractsById(id);
    }

    // BOB

    @PostMapping("/bob")
    public Mono<ResponseEntity<String>> bobcreateContractDefinition(@RequestBody String contractDefinition) {
        return contractDefinitionService.bobcreateContract(contractDefinition);
    }

    @PostMapping("/bob/allContracts")
    public Mono<ResponseEntity<String>> bobgetAllContracts() {
        return contractDefinitionService.bobgetAllContracts();
    }

    @GetMapping("/bob/{id}")
    public Mono<ResponseEntity<String>> bobgetContractsById(@PathVariable String id) {
        return contractDefinitionService.bobgetContractsById(id);
    }

    @DeleteMapping("/bob/{id}")
    public Mono<ResponseEntity<String>> bobdeleteContractsById(@PathVariable String id) {
        return contractDefinitionService.bobdeleteContractsById(id);
    }

}
