package com.venkatesha.organic.controller;

import com.venkatesha.organic.dto.*;
import com.venkatesha.organic.entity.User;
import com.venkatesha.organic.service.NotificationService;
import com.venkatesha.organic.service.OrderService;
import com.venkatesha.organic.service.OwnerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/owner")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('ROLE_OWNER')")
@Tag(name = "Owner Dashboard & Management", description = "Dashboard metrics, customer list, order management APIs for Owner")
public class OwnerManagementController {

    private final OwnerService ownerService;
    private final OrderService orderService;
    private final NotificationService notificationService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get overall business dashboard metrics and sales statistics")
    public ResponseEntity<ApiResponse<OwnerDashboardDto>> getDashboard() {
        OwnerDashboardDto dashboard = ownerService.getDashboardSummary();
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics fetched", dashboard));
    }

    @GetMapping("/customers")
    @Operation(summary = "Get list of all registered customers")
    public ResponseEntity<ApiResponse<List<User>>> getCustomers() {
        List<User> customers = ownerService.getAllCustomers();
        return ResponseEntity.ok(ApiResponse.success("Customers list fetched", customers));
    }

    @GetMapping("/orders")
    @Operation(summary = "Get all store orders for owner processing")
    public ResponseEntity<ApiResponse<List<OrderDto>>> getOrders() {
        List<OrderDto> orders = orderService.getAllOrdersForOwner();
        return ResponseEntity.ok(ApiResponse.success("All store orders fetched", orders));
    }

    @PutMapping("/orders/{id}/status")
    @Operation(summary = "Update status of an order and notify customer in real-time")
    public ResponseEntity<ApiResponse<OrderDto>> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateOrderStatusRequest request
    ) {
        OrderDto updated = orderService.updateOrderStatus(id, request.getStatus());
        return ResponseEntity.ok(ApiResponse.success("Order status updated successfully", updated));
    }

    @GetMapping("/notifications")
    @Operation(summary = "Get notification history for owner")
    public ResponseEntity<ApiResponse<List<NotificationDto>>> getOwnerNotifications() {
        List<NotificationDto> notifications = notificationService.getOwnerNotifications();
        return ResponseEntity.ok(ApiResponse.success("Owner notifications fetched", notifications));
    }
}
