package com.venkatesha.organic.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OwnerDashboardDto {
    private BigDecimal totalSales;
    private long totalOrders;
    private long pendingOrders;
    private long totalCustomers;
    private long totalProducts;
    private long lowStockProductsCount;
    private List<ProductDto> lowStockProducts;
    private List<OrderDto> recentOrders;
}
