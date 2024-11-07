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

    // BOB

    @PostMapping("/bob")
    public Mono<ResponseEntity<String>> bobcreatePolicy(@RequestBody String Policy) {
        return policyService.bobcreatePolicy(Policy);
    }

    @PostMapping("/bob/allPolicies")
    public Mono<ResponseEntity<String>> bobgetAllPolicies() {
        return policyService.bobgetAllPolicies();
    }

    @GetMapping("/bob/{id}")
    public Mono<ResponseEntity<String>> bobgetPolicyById(@PathVariable String id) {
        return policyService.bobgetPolicyById(id);
    }

    @DeleteMapping("/bob/{id}")
    public Mono<ResponseEntity<String>> bobdeletePolicyById(@PathVariable String id) {
        return policyService.bobdeletePolicyById(id);
    }

}
