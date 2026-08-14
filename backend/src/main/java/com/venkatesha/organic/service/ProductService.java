package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.*;
import com.venkatesha.organic.entity.Category;
import com.venkatesha.organic.entity.NotificationType;
import com.venkatesha.organic.entity.Product;
import com.venkatesha.organic.exception.ResourceNotFoundException;
import com.venkatesha.organic.repository.CategoryRepository;
import com.venkatesha.organic.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private static final Logger log = LoggerFactory.getLogger(ProductService.class);
    private static final int LOW_STOCK_THRESHOLD = 5;

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final NotificationService notificationService;

    @Transactional(readOnly = true)
    public Page<ProductDto> getActiveProducts(Long categoryId, String query, int page, int size, String sortBy, String sortDir) {
        Sort sort = sortDir.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.searchProducts(categoryId, query, pageable).map(this::mapToDto);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));
        return mapToDto(product);
    }

    @Transactional(readOnly = true)
    public List<CategoryDto> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapCategoryToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProductsForOwner() {
        return productRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto createProduct(ProductRequest request) {
        log.info("Creating new product: {}", request.getName());

        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
        }

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stockQuantity(request.getStockQuantity())
                .category(category)
                .imageUrl(request.getImageUrl())
                .organic(request.getOrganic() != null ? request.getOrganic() : true)
                .active(request.getActive() != null ? request.getActive() : true)
                .build();

        Product saved = productRepository.save(product);
        log.info("Product created with ID: {}", saved.getId());

        // Notify customers via WebSocket about new product
        notificationService.createAndSendNotification(
                null,
                "New Organic Product Available!",
                "Fresh arrival: '" + saved.getName() + "' is now in stock for ₹" + saved.getPrice(),
                NotificationType.NEW_PRODUCT,
                false // Public/Customer broadcast
        );

        // Check if created with low stock
        checkAndNotifyLowStock(saved);

        return mapToDto(saved);
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductRequest request) {
        log.info("Updating product ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        BigDecimal oldPrice = product.getPrice();

        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with ID: " + request.getCategoryId()));
            product.setCategory(category);
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStockQuantity(request.getStockQuantity());
        product.setImageUrl(request.getImageUrl());
        if (request.getOrganic() != null) product.setOrganic(request.getOrganic());
        if (request.getActive() != null) product.setActive(request.getActive());

        Product updated = productRepository.save(product);
        log.info("Product ID: {} updated successfully", id);

        // Notify price change if price changed
        if (oldPrice != null && oldPrice.compareTo(updated.getPrice()) != 0) {
            notifyPriceChange(updated, oldPrice);
        }

        checkAndNotifyLowStock(updated);

        return mapToDto(updated);
    }

    @Transactional
    public ProductDto updateStock(Long id, Integer stockQuantity) {
        log.info("Updating stock for product ID: {} to {}", id, stockQuantity);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setStockQuantity(stockQuantity);
        Product updated = productRepository.save(product);

        checkAndNotifyLowStock(updated);

        return mapToDto(updated);
    }

    @Transactional
    public ProductDto updatePrice(Long id, BigDecimal newPrice) {
        log.info("Updating price for product ID: {} to {}", id, newPrice);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        BigDecimal oldPrice = product.getPrice();
        product.setPrice(newPrice);
        Product updated = productRepository.save(product);

        notifyPriceChange(updated, oldPrice);

        return mapToDto(updated);
    }

    @Transactional
    public void deleteOrDeactivateProduct(Long id) {
        log.info("Deactivating product ID: {}", id);
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + id));

        product.setActive(false);
        productRepository.save(product);

        // Notify customers product is unavailable
        notificationService.createAndSendNotification(
                null,
                "Product Unavailable",
                "Product '" + product.getName() + "' is currently unavailable.",
                NotificationType.SYSTEM,
                false
        );
    }

    private void notifyPriceChange(Product product, BigDecimal oldPrice) {
        notificationService.createAndSendNotification(
                null,
                "Price Updated!",
                "Price for '" + product.getName() + "' changed from ₹" + oldPrice + " to ₹" + product.getPrice(),
                NotificationType.PRICE_CHANGED,
                false
        );
    }

    private void checkAndNotifyLowStock(Product product) {
        if (product.getStockQuantity() <= LOW_STOCK_THRESHOLD) {
            notificationService.createAndSendNotification(
                    null,
                    "Low Stock Alert!",
                    "Warning: Product '" + product.getName() + "' is low on stock! Remaining: " + product.getStockQuantity(),
                    NotificationType.LOW_STOCK,
                    true // Owner notification
            );
        }
    }

    public ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .category(product.getCategory() != null ? mapCategoryToDto(product.getCategory()) : null)
                .imageUrl(product.getImageUrl())
                .organic(product.getOrganic())
                .active(product.getActive())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }

    public CategoryDto mapCategoryToDto(Category category) {
        return CategoryDto.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .imageUrl(category.getImageUrl())
                .build();
    }
}
