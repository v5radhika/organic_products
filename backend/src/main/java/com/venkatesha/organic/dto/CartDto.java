package com.venkatesha.organic.dto;

import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartDto {
    private Long id;
    @Builder.Default
    private List<CartItemDto> items = new ArrayList<>();
    private BigDecimal totalAmount;
}
