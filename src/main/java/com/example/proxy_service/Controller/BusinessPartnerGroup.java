package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.BusinessPartnerGroupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/v1")
public class BusinessPartnerGroup {

    @Autowired
    private BusinessPartnerGroupService businessPartnerGroupService;

    @PostMapping("/business-partner-groups")
    public Mono<ResponseEntity<String>> createBusinessPartnerGroup(@RequestBody String bpg) {
        return businessPartnerGroupService.createBusinessPartner(bpg);

    }

    @GetMapping("/business-partner-groups/{policyBpn}")
    public Mono<ResponseEntity<String>> getBusinessPartnerGroups(@PathVariable String policyBpn) {
        return businessPartnerGroupService.getBusinessPartnerGroups(policyBpn);
    }

    @PutMapping("/business-partner-groups")
    public Mono<ResponseEntity<String>> updateBusinessPartnerGroups(@RequestBody String updateBpg) {
        return businessPartnerGroupService.updateBusinessPartnerGroup(updateBpg);
    }

    // BOB

    @PostMapping("/bob/business-partner-groups")
    public Mono<ResponseEntity<String>> bobcreateBusinessPartnerGroup(@RequestBody String bpg) {
        return businessPartnerGroupService.bobcreateBusinessPartner(bpg);

    }

    @GetMapping("/bob/business-partner-groups/{policyBpn}")
    public Mono<ResponseEntity<String>> bobgetBusinessPartnerGroups(@PathVariable String policyBpn) {
        return businessPartnerGroupService.bobgetBusinessPartnerGroups(policyBpn);
    }

    @PutMapping("/bob/business-partner-groups")
    public Mono<ResponseEntity<String>> bobupdateBusinessPartnerGroups(@RequestBody String updateBpg) {
        return businessPartnerGroupService.bobupdateBusinessPartnerGroup(updateBpg);
    }

}
