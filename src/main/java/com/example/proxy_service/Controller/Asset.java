package com.example.proxy_service.Controller;

import com.example.proxy_service.ClientService.AssetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("api/v1/asset")
public class Asset {

    @Autowired
    private AssetService assetService;

    @PostMapping
    public Mono<ResponseEntity<String>> createBusinessPartnerGroup(@RequestBody String asset) {
        return assetService.createAsset(asset);
    }

    @PostMapping("/allAssets")
    public Mono<ResponseEntity<String>> getAllAssets() {
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public Mono<ResponseEntity<String>> getAssetById(@PathVariable String id) {
        return assetService.getAssetById(id);
    }

    @DeleteMapping("/{id}")
    public Mono<ResponseEntity<String>> deleteAssetById(@PathVariable String id) {
        return assetService.deleteAssetById(id);
    }

    // BOB

    @PostMapping("/bob")
    public Mono<ResponseEntity<String>> bobcreateBusinessPartnerGroup(@RequestBody String asset) {
        return assetService.bobcreateAsset(asset);
    }

    @PostMapping("/bob/allAssets")
    public Mono<ResponseEntity<String>> bobgetAllAssets() {
        return assetService.bobgetAllAssets();
    }

    @GetMapping("/bob/{id}")
    public Mono<ResponseEntity<String>> bobgetAssetById(@PathVariable String id) {
        return assetService.bobgetAssetById(id);
    }

    @DeleteMapping("/bob/{id}")
    public Mono<ResponseEntity<String>> bobdeleteAssetById(@PathVariable String id) {
        return assetService.bobdeleteAssetById(id);
    }

}
