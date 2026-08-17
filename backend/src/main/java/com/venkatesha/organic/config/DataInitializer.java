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
            log.info("Initializing default users, categories, and organic products...");

            // 1. Default Owner Account
            User owner = User.builder()
                    .fullName("Venkatesha Owner")
                    .email("owner@venkatesha.com")
                    .password(passwordEncoder.encode("owner123"))
                    .role(Role.ROLE_OWNER)
                    .phone("+91 9876543210")
                    .address("108 Organic Way, Mysore, Karnataka, India")
                    .build();
            userRepository.save(owner);

            // 2. Default Customer Account
            User customer = User.builder()
                    .fullName("Ramesh Kumar")
                    .email("customer@venkatesha.com")
                    .password(passwordEncoder.encode("customer123"))
                    .role(Role.ROLE_CUSTOMER)
                    .phone("+91 9123456789")
                    .address("42 Green Valley Apt, Bangalore, India")
                    .build();
            userRepository.save(customer);

            // 3. Categories
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
                    .name("Heritage Rice & Grains")
                    .description("Ancient Black rice, Red rice, Bamboo rice, and unpolished heritage grains.")
                    .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80")
                    .build();
            Category c4 = Category.builder()
                    .name("Traditional Pickles")
                    .description("Authentic homemade pickles made with cold-pressed mustard oil and natural sun-cured spices.")
                    .imageUrl("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80")
                    .build();
            Category c5 = Category.builder()
                    .name("Natural Spices & Honey")
                    .description("High curcumin stone-ground spices and raw wild forest honey.")
                    .imageUrl("https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80")
                    .build();

            categoryRepository.saveAll(List.of(c1, c2, c3, c4, c5));

            // 4. Sample Organic Products
            Product p1 = Product.builder()
                    .name("Pure A2 Desi Cow Bilona Ghee (500ml)")
                    .description("Hand-churned traditional A2 Bilona Ghee from Gir cows. Aromatic, medicinal, and 100% pure.")
                    .price(new BigDecimal("650.00"))
                    .stockQuantity(25)
                    .category(c1)
                    .imageUrl("https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p2 = Product.builder()
                    .name("Ancient Black Rice - Karuppu Kavuni (1kg)")
                    .description("Nutrient-rich ancient Black Rice packed with powerful anthocyanin antioxidants, iron, and fiber.")
                    .price(new BigDecimal("220.00"))
                    .stockQuantity(35)
                    .category(c3)
                    .imageUrl("https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p3 = Product.builder()
                    .name("Organic Heritage Red Rice - Rajamudi (1kg)")
                    .description("Traditional unpolished Red Rice with natural bran. Low glycemic index and rich in minerals.")
                    .price(new BigDecimal("140.00"))
                    .stockQuantity(40)
                    .category(c3)
                    .imageUrl("https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p4 = Product.builder()
                    .name("Authentic Avakaya Mango Pickle (500g)")
                    .description("Traditional Andhra style raw mango pickle prepared with cold-pressed sesame oil and Guntur chilli.")
                    .price(new BigDecimal("240.00"))
                    .stockQuantity(20)
                    .category(c4)
                    .imageUrl("https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p5 = Product.builder()
                    .name("Spicy Country Garlic Pickle (250g)")
                    .description("Homemade whole garlic clove pickle infused with stone-ground spices and organic mustard oil.")
                    .price(new BigDecimal("180.00"))
                    .stockQuantity(4) // Low stock threshold test
                    .category(c4)
                    .imageUrl("https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p6 = Product.builder()
                    .name("Farm Fresh Organic Country Tomatoes (1kg)")
                    .description("Sun-ripened native heirloom tomatoes freshly plucked from Venkatesha Organic Farms.")
                    .price(new BigDecimal("45.00"))
                    .stockQuantity(50)
                    .category(c2)
                    .imageUrl("https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p7 = Product.builder()
                    .name("Organic Native Spinach - Palak (250g)")
                    .description("Fresh chemical-free leafy spinach harvested early morning for maximum crispness.")
                    .price(new BigDecimal("30.00"))
                    .stockQuantity(30)
                    .category(c2)
                    .imageUrl("https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p8 = Product.builder()
                    .name("Cold Pressed Wood Pressed Groundnut Oil (1L)")
                    .description("100% unrefined groundnut oil extracted in wooden Chekku. Rich in natural aroma and vitamin E.")
                    .price(new BigDecimal("280.00"))
                    .stockQuantity(15)
                    .category(c1)
                    .imageUrl("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            Product p9 = Product.builder()
                    .name("Organic Wild Forest Honey (500g)")
                    .description("Unprocessed raw forest honey collected sustainably from wild hives in mountain forests.")
                    .price(new BigDecimal("420.00"))
                    .stockQuantity(18)
                    .category(c5)
                    .imageUrl("https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&w=800&q=80")
                    .organic(true)
                    .active(true)
                    .build();

            productRepository.saveAll(List.of(p1, p2, p3, p4, p5, p6, p7, p8, p9));
            log.info("Rich organic products (Vegetables, Pickles, Black & Red Rice, Ghee) initialized");
        }
    }
}
