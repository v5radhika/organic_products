package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.ProductDto;
import com.venkatesha.organic.dto.ProductRequest;
import com.venkatesha.organic.entity.Category;
import com.venkatesha.organic.entity.Product;
import com.venkatesha.organic.repository.CategoryRepository;
import com.venkatesha.organic.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ProductService productService;

    private Product sampleProduct;

    @BeforeEach
    void setUp() {
        Category category = Category.builder().id(1L).name("Ghee").build();
        sampleProduct = Product.builder()
                .id(10L)
                .name("Organic Ghee")
                .description("A2 Cow Ghee")
                .price(new BigDecimal("500.00"))
                .stockQuantity(20)
                .category(category)
                .organic(true)
                .active(true)
                .build();
    }

    @Test
    void createProduct_Success() {
        ProductRequest request = ProductRequest.builder()
                .name("Organic Ghee")
                .description("A2 Cow Ghee")
                .price(new BigDecimal("500.00"))
                .stockQuantity(20)
                .categoryId(1L)
                .organic(true)
                .active(true)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleProduct.getCategory()));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        ProductDto dto = productService.createProduct(request);

        assertNotNull(dto);
        assertEquals("Organic Ghee", dto.getName());
        assertEquals(new BigDecimal("500.00"), dto.getPrice());
        verify(productRepository, times(1)).save(any(Product.class));
        verify(notificationService, times(1)).createAndSendNotification(any(), anyString(), anyString(), any(), eq(false));
    }

    @Test
    void updateStock_Success() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        ProductDto dto = productService.updateStock(10L, 50);

        assertNotNull(dto);
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updatePrice_Success() {
        when(productRepository.findById(10L)).thenReturn(Optional.of(sampleProduct));
        when(productRepository.save(any(Product.class))).thenReturn(sampleProduct);

        ProductDto dto = productService.updatePrice(10L, new BigDecimal("550.00"));

        assertNotNull(dto);
        verify(notificationService, times(1)).createAndSendNotification(any(), anyString(), anyString(), any(), eq(false));
    }
}
