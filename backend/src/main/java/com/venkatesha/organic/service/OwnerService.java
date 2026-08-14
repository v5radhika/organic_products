package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.OrderDto;
import com.venkatesha.organic.dto.OwnerDashboardDto;
import com.venkatesha.organic.dto.ProductDto;
import com.venkatesha.organic.dto.RegisterRequest;
import com.venkatesha.organic.entity.Role;
import com.venkatesha.organic.entity.User;
import com.venkatesha.organic.repository.OrderRepository;
import com.venkatesha.organic.repository.ProductRepository;
import com.venkatesha.organic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OwnerService {

    private static final Logger log = LoggerFactory.getLogger(OwnerService.class);
    private static final int LOW_STOCK_THRESHOLD = 5;

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final ProductService productService;
    private final OrderService orderService;

    @Transactional(readOnly = true)
    public OwnerDashboardDto getDashboardSummary() {
        log.info("Fetching Owner Dashboard metrics summary");

        BigDecimal totalSales = orderRepository.calculateTotalSales();
        if (totalSales == null) {
            totalSales = BigDecimal.ZERO;
        }

        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countPendingOrders();
        long totalCustomers = userRepository.countByRole(Role.ROLE_CUSTOMER);
        long totalProducts = productRepository.count();
        long lowStockCount = productRepository.countLowStockProducts(LOW_STOCK_THRESHOLD);

        List<ProductDto> lowStockProducts = productRepository.findLowStockProducts(LOW_STOCK_THRESHOLD)
                .stream()
                .map(productService::mapToDto)
                .collect(Collectors.toList());

        List<OrderDto> recentOrders = orderRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .limit(5)
                .map(orderService::mapToDto)
                .collect(Collectors.toList());

        return OwnerDashboardDto.builder()
                .totalSales(totalSales)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .totalCustomers(totalCustomers)
                .totalProducts(totalProducts)
                .lowStockProductsCount(lowStockCount)
                .lowStockProducts(lowStockProducts)
                .recentOrders(recentOrders)
                .build();
    }

    @Transactional(readOnly = true)
    public List<User> getAllCustomers() {
        return userRepository.findByRole(Role.ROLE_CUSTOMER);
    }
}
