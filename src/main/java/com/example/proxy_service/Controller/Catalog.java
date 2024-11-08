package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.CatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/v1/catalog")
public class Catalog {

    @Autowired
    private CatalogService catalogService;

    @PostMapping
    public Mono<ResponseEntity<String>> getCatalog(@RequestBody String catalogRequest) {
        return catalogService.getCatalog(catalogRequest);
    }

    @PostMapping("/alice")
    public Mono<ResponseEntity<String>> alicegetCatalog(@RequestBody String catalogRequest) {
        return catalogService.alicegetCatalog(catalogRequest);
    }

}
