package com.venkatesha.organic.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProductDto {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stockQuantity;
    private CategoryDto category;
    private String imageUrl;
    private Boolean organic;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
