package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.*;
import com.venkatesha.organic.entity.*;
import com.venkatesha.organic.exception.BadRequestException;
import com.venkatesha.organic.exception.ResourceNotFoundException;
import com.venkatesha.organic.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Logger log = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final ProductService productService;

    @Transactional
    public OrderDto createOrder(Long userId, CreateOrderRequest request) {
        log.info("Creating new order for customer user ID: {}", userId);

        User customer = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new BadRequestException("Shopping cart is empty!"));

        if (cart.getItems().isEmpty()) {
            throw new BadRequestException("Cannot place order with an empty shopping cart!");
        }

        // Validate stock for all cart items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (!product.getActive()) {
                throw new BadRequestException("Product '" + product.getName() + "' is no longer available.");
            }
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BadRequestException("Product '" + product.getName() + "' has insufficient stock! Available: " + product.getStockQuantity());
            }
        }

        Order order = Order.builder()
                .customer(customer)
                .status(OrderStatus.PENDING)
                .shippingAddress(request.getShippingAddress())
                .contactPhone(request.getContactPhone())
                .totalAmount(cart.getTotalAmount())
                .items(new ArrayList<>())
                .build();

        // Process cart items into order items and deduct stock
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            
            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .priceAtPurchase(product.getPrice())
                    .totalPrice(cartItem.getTotalPrice())
                    .build();

            order.getItems().add(orderItem);

            // Trigger low stock warning to owner if stock drops to <= 5
            if (product.getStockQuantity() <= 5) {
                notificationService.createAndSendNotification(
                        null,
                        "Low Stock Warning!",
                        "Stock for '" + product.getName() + "' is low! Remaining stock: " + product.getStockQuantity(),
                        NotificationType.LOW_STOCK,
                        true
                );
            }
        }

        Order savedOrder = orderRepository.save(order);

        // Clear cart
        cart.getItems().clear();
        cartRepository.save(cart);

        log.info("Order created successfully with ID: {} and Total: ₹{}", savedOrder.getId(), savedOrder.getTotalAmount());

        // Real-time WebSocket Notification to Owner (ORDER_PLACED)
        notificationService.createAndSendNotification(
                null, // Owner target
                "New Order Received! #" + savedOrder.getId(),
                "Customer '" + customer.getFullName() + "' placed a new order for ₹" + savedOrder.getTotalAmount(),
                NotificationType.ORDER_PLACED,
                true // Send to owner channel
        );

        return mapToDto(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getMyOrders(Long userId) {
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDto getOrderById(Long orderId, Long userId, boolean isOwner) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        if (!isOwner && !order.getCustomer().getId().equals(userId)) {
            throw new BadRequestException("You are not authorized to view this order.");
        }

        return mapToDto(order);
    }

    @Transactional(readOnly = true)
    public List<OrderDto> getAllOrdersForOwner() {
        return orderRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, OrderStatus newStatus) {
        log.info("Updating status of order ID: {} to {}", orderId, newStatus);
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with ID: " + orderId));

        order.setStatus(newStatus);
        Order updatedOrder = orderRepository.save(order);

        log.info("Order status updated successfully for order ID: {}", orderId);

        // Real-time WebSocket Notification to Customer (ORDER_STATUS_CHANGED)
        notificationService.createAndSendNotification(
                updatedOrder.getCustomer(),
                "Order Status Updated #" + updatedOrder.getId(),
                "Your order #" + updatedOrder.getId() + " status has been updated to '" + newStatus.name() + "'.",
                NotificationType.ORDER_STATUS_CHANGED,
                false // Send to customer channel
        );

        return mapToDto(updatedOrder);
    }

    public OrderDto mapToDto(Order order) {
        return OrderDto.builder()
                .id(order.getId())
                .customerId(order.getCustomer().getId())
                .customerName(order.getCustomer().getFullName())
                .customerEmail(order.getCustomer().getEmail())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .shippingAddress(order.getShippingAddress())
                .contactPhone(order.getContactPhone())
                .items(order.getItems().stream().map(this::mapItemToDto).collect(Collectors.toList()))
                .createdAt(order.getCreatedAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemDto mapItemToDto(OrderItem item) {
        return OrderItemDto.builder()
                .id(item.getId())
                .product(productService.mapToDto(item.getProduct()))
                .quantity(item.getQuantity())
                .priceAtPurchase(item.getPriceAtPurchase())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
