package com.venkatesha.organic.controller;

import com.venkatesha.organic.dto.*;
import com.venkatesha.organic.security.CustomUserDetails;
import com.venkatesha.organic.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
@Tag(name = "Customer Shopping Cart", description = "Shopping cart management endpoints for customers")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "View current customer's shopping cart")
    public ResponseEntity<ApiResponse<CartDto>> getCart(@AuthenticationPrincipal CustomUserDetails userDetails) {
        CartDto cart = cartService.getCartByUserId(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Cart fetched successfully", cart));
    }

    @PostMapping
    @Operation(summary = "Add an organic product to cart")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody AddToCartRequest request
    ) {
        CartDto cart = cartService.addToCart(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Product added to cart", cart));
    }

    @PutMapping("/items/{id}")
    @Operation(summary = "Update quantity of a item in cart")
    public ResponseEntity<ApiResponse<CartDto>> updateCartItemQuantity(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id,
            @Valid @RequestBody UpdateCartItemRequest request
    ) {
        CartDto cart = cartService.updateCartItemQuantity(userDetails.getId(), id, request.getQuantity());
        return ResponseEntity.ok(ApiResponse.success("Cart item quantity updated", cart));
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove an item from cart")
    public ResponseEntity<ApiResponse<CartDto>> removeCartItem(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        CartDto cart = cartService.removeCartItem(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Item removed from cart", cart));
    }
}
