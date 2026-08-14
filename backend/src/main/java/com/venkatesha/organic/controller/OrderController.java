package com.venkatesha.organic.controller;

import com.venkatesha.organic.dto.ApiResponse;
import com.venkatesha.organic.dto.CreateOrderRequest;
import com.venkatesha.organic.dto.OrderDto;
import com.venkatesha.organic.security.CustomUserDetails;
import com.venkatesha.organic.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
@Tag(name = "Customer Orders", description = "Order placement and customer order history endpoints")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a new order from current cart")
    public ResponseEntity<ApiResponse<OrderDto>> createOrder(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateOrderRequest request
    ) {
        OrderDto order = orderService.createOrder(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/my")
    @Operation(summary = "Get order history for logged-in customer")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getMyOrders(@AuthenticationPrincipal CustomUserDetails userDetails) {
        List<OrderDto> orders = orderService.getMyOrders(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.success("Order history fetched", orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get details of a specific order")
    public ResponseEntity<ApiResponse<OrderDto>> getOrderById(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long id
    ) {
        OrderDto order = orderService.getOrderById(id, userDetails.getId(), false);
        return ResponseEntity.ok(ApiResponse.success("Order details fetched", order));
    }
}
