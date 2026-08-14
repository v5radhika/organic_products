package com.venkatesha.organic.config;

import com.venkatesha.organic.entity.*;
import com.venkatesha.organic.repository.*;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            log.info("Initializing default users and products...");

            // 1. Create Default Owner
            User owner = User.builder()
                    .fullName("Venkatesha Owner")
                    .email("owner@venkatesha.com")
                    .password(passwordEncoder.encode("owner123"))
                    .role(Role.ROLE_OWNER)
                    .phone("+91 9876543210")
                    .address("108 Organic Way, Mysore, Karnataka, India")
                    .build();
            userRepository.save(owner);
            log.info("Default OWNER created: owner@venkatesha.com");

            // 2. Create Default Customer
            User customer = User.builder()
                    .fullName("Ramesh Kumar")
                    .email("customer@venkatesha.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.ROLE_CUSTOMER)
                    .phone("+91 9123456789")
                    .address("42 Green Valley Apt, Bangalore, India")
                    .build();
            userRepository.save(customer);
            log.info("Default CUSTOMER created: customer@venkatesha.com");

            // 3. Create Categories
            Category c1 = Category.builder()
                    .name("Organic Ghee & Oils")
                    .description("Traditional A2 Bilona Cow Ghee and cold-pressed unrefined organic oils.")
                    .imageUrl("https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=600&q=80")
                    .build();
            Category c2 = Category.builder()
                    .name("Farm Fresh Vegetables")
                    .description("Freshly harvested organic vegetables without chemical fertilizers or pesticides.")
                    .imageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80")
                    .build();
            Category c3 = Category.builder()
                    .name("Organic Grains & Pulses")
                    .description("Hand-picked unpolished pulses, heritage rice varieties, and whole grains.")
                    .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80")
                    .build();
            Category c4 = Category.builder()
                    .name("Spices & Herbs")
                    .description("Aromatic stone-ground spices and organic herbs rich in essential oils.")
                    .imageUrl("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80")
                    .build();

            categoryRepository.saveAll(List.of(c1, c2, c3, c4));
            log.info("Categories initialized");

            // 4. Create Sample Organic Products
            Product p1 = Product.builder()
                    .name("Pure A2 Desi Cow Bilona Ghee (500ml)")
                    .description("Hand-churned traditional A2 Bilona Ghee from Gir cows. Pure, aromatic, and packed with health benefits.")
                    .price(new BigDecimal("650.00"))
                    .stockQuantity(25)
                    .category(c1)
                    .imageUrl("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p2 = Product.builder()
                    .name("Cold Pressed Wood Pressed Groundnut Oil (1L)")
                    .description("100% pure cold-pressed groundnut oil extracted using wooden Chekku. Rich in natural antioxidants.")
                    .price(new BigDecimal("280.00"))
                    .stockQuantity(4) // Low stock threshold test
                    .category(c1)
                    .imageUrl("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p3 = Product.builder()
                    .name("Organic Wild Forest Honey (500g)")
                    .description("Unprocessed raw forest honey collected sustainably from pristine mountain forests.")
                    .price(new BigDecimal("420.00"))
                    .stockQuantity(18)
                    .category(c4)
                    .imageUrl("https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p4 = Product.builder()
                    .name("Heritage Organic Sona Masoori Rice (5kg)")
                    .description("Single-origin unpolished Sona Masoori rice harvested naturally with zero chemicals.")
                    .price(new BigDecimal("450.00"))
                    .stockQuantity(30)
                    .category(c3)
                    .imageUrl("https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p5 = Product.builder()
                    .name("Stone Ground Turmeric Powder (250g)")
                    .description("High curcumin content organic turmeric powder ground traditionally to preserve essential oils.")
                    .price(new BigDecimal("120.00"))
                    .stockQuantity(3) // Low stock
                    .category(c4)
                    .imageUrl("https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5));
            log.info("Sample organic products initialized");
        }
    }
}
