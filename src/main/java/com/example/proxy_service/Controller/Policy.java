package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.PolicyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/v1/policy")
public class Policy {

    @Autowired
    private PolicyService policyService;

    @PostMapping
    public Mono<ResponseEntity<String>> createPolicy(@RequestBody String Policy) {
        return policyService.createPolicy(Policy);
    }

    @PostMapping("/allPolicies")
    public Mono<ResponseEntity<String>> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getPolicyById(@PathVariable String id) {
        return policyService.getPolicyById(id);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> deletePolicyById(@PathVariable String id) {
        return policyService.deletePolicyById(id);
    }

}
