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

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private static final Logger log = LoggerFactory.getLogger(CartService.class);

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductService productService;

    @Transactional
    public CartDto getCartByUserId(Long userId) {
        Cart cart = getOrCreateCart(userId);
        return mapToDto(cart);
    }

    @Transactional
    public CartDto addToCart(Long userId, AddToCartRequest request) {
        log.info("Adding product ID: {} (qty: {}) to cart for user ID: {}", request.getProductId(), request.getQuantity(), userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with ID: " + request.getProductId()));

        if (!product.getActive()) {
            throw new BadRequestException("Product is currently inactive and cannot be added to cart");
        }

        if (product.getStockQuantity() < request.getQuantity()) {
            throw new BadRequestException("Insufficient stock available! Current stock: " + product.getStockQuantity());
        }

        Cart cart = getOrCreateCart(userId);

        Optional<CartItem> existingItemOpt = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItemOpt.isPresent()) {
            CartItem existingItem = existingItemOpt.get();
            int newQty = existingItem.getQuantity() + request.getQuantity();
            if (product.getStockQuantity() < newQty) {
                throw new BadRequestException("Cannot add more. Insufficient stock available!");
            }
            existingItem.setQuantity(newQty);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cart.getItems().add(newItem);
        }

        Cart updatedCart = cartRepository.save(cart);
        return mapToDto(updatedCart);
    }

    @Transactional
    public CartDto updateCartItemQuantity(Long userId, Long cartItemId, Integer newQuantity) {
        log.info("Updating cart item ID: {} to quantity: {} for user ID: {}", cartItemId, newQuantity, userId);
        Cart cart = getOrCreateCart(userId);

        CartItem cartItem = cart.getItems().stream()
                .filter(item -> item.getId().equals(cartItemId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with ID: " + cartItemId));

        if (cartItem.getProduct().getStockQuantity() < newQuantity) {
            throw new BadRequestException("Insufficient stock available! Current stock: " + cartItem.getProduct().getStockQuantity());
        }

        cartItem.setQuantity(newQuantity);
        Cart updatedCart = cartRepository.save(cart);
        return mapToDto(updatedCart);
    }

    @Transactional
    public CartDto removeCartItem(Long userId, Long cartItemId) {
        log.info("Removing cart item ID: {} for user ID: {}", cartItemId, userId);
        Cart cart = getOrCreateCart(userId);

        cart.getItems().removeIf(item -> item.getId().equals(cartItemId));
        Cart updatedCart = cartRepository.save(cart);
        return mapToDto(updatedCart);
    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getOrCreateCart(userId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    private Cart getOrCreateCart(Long userId) {
        return cartRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + userId));
                    Cart newCart = Cart.builder().user(user).build();
                    return cartRepository.save(newCart);
                });
    }

    public CartDto mapToDto(Cart cart) {
        return CartDto.builder()
                .id(cart.getId())
                .items(cart.getItems().stream().map(this::mapItemToDto).collect(Collectors.toList()))
                .totalAmount(cart.getTotalAmount())
                .build();
    }

    private CartItemDto mapItemToDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .product(productService.mapToDto(item.getProduct()))
                .quantity(item.getQuantity())
                .unitPrice(item.getProduct().getPrice())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
