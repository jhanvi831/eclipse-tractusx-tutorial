package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.ContractDefinitionService;
import com.example.proxy_service.ClientService.PolicyService;
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
    public Mono<ResponseEntity<String>> createContractDefinition(@RequestBody String contractDefinition){
        return contractDefinitionService.createContract(contractDefinition);
    }

    @PostMapping("/allContracts")
    public Mono<ResponseEntity<String>> getAllContracts(){
        return contractDefinitionService.getAllContracts();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getContractsById(@PathVariable String id){
        return contractDefinitionService.getContractsById(id);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> deleteContractsById(@PathVariable String id){
        return contractDefinitionService.deleteContractsById(id);
    }

}
