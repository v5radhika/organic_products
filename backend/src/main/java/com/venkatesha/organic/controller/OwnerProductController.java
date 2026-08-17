package com.venkatesha.organic.controller;

import com.venkatesha.organic.dto.*;
import com.venkatesha.organic.entity.Product;
import com.venkatesha.organic.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner/products")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_OWNER')")
@Tag(name = "Owner Products Management", description = "CRUD and stock/price update endpoints restricted to business Owner")
public class OwnerProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Get all products (active and inactive) for owner management")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> products = productService.getAllProductsForOwner();
        return ResponseEntity.ok(ApiResponse.success("Owner products fetched", products));
    }

    @PostMapping
    @Operation(summary = "Add a new organic product")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody ProductRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Organic product created successfully", created));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update full product details")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        ProductDto updated = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deactivate/delete a product")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteOrDeactivateProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deactivated successfully", null));
    }


    @PatchMapping("/{id}/stock")
    @Operation(summary = "Update product stock quantity")
    public ResponseEntity<ApiResponse<ProductDto>> updateStock(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStockRequest request
    ) {
        ProductDto updated = productService.updateStock(id, request.getStockQuantity());
        return ResponseEntity.ok(ApiResponse.success("Stock updated successfully", updated));
    }

    @PatchMapping("/{id}/price")
    @Operation(summary = "Update product price")
    public ResponseEntity<ApiResponse<ProductDto>> updatePrice(
            @PathVariable Long id,
            @Valid @RequestBody UpdatePriceRequest request
    ) {
        ProductDto updated = productService.updatePrice(id, request.getPrice());
        return ResponseEntity.ok(ApiResponse.success("Price updated successfully", updated));
    }
}
