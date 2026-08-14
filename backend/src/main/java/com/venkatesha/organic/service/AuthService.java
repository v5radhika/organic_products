package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.AuthRequest;
import com.venkatesha.organic.dto.JwtResponse;
import com.venkatesha.organic.dto.RegisterRequest;
import com.venkatesha.organic.entity.NotificationType;
import com.venkatesha.organic.entity.Role;
import com.venkatesha.organic.entity.User;
import com.venkatesha.organic.exception.BadRequestException;
import com.venkatesha.organic.repository.UserRepository;
import com.venkatesha.organic.security.CustomUserDetails;
import com.venkatesha.organic.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final NotificationService notificationService;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        log.info("Attempting to register user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed. Email already exists: {}", request.getEmail());
            throw new BadRequestException("Email address is already in use!");
        }

        Role assignedRole = (request.getRole() != null) ? request.getRole() : Role.ROLE_CUSTOMER;

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(assignedRole)
                .phone(request.getPhone())
                .address(request.getAddress())
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with ID: {} and Role: {}", savedUser.getId(), savedUser.getRole());

        // Trigger real-time notification to owner if a customer registered
        if (savedUser.getRole() == Role.ROLE_CUSTOMER) {
            notificationService.createAndSendNotification(
                    null, // Sent to owner
                    "New Customer Registered",
                    "A new customer '" + savedUser.getFullName() + "' (" + savedUser.getEmail() + ") has registered.",
                    NotificationType.CUSTOMER_REGISTERED,
                    true // Owner recipient
            );
        }

        // Auto authenticate after registration
        return login(new AuthRequest(request.getEmail(), request.getPassword()));
    }

    public JwtResponse login(AuthRequest request) {
        log.info("Attempting login for email: {}", request.getEmail());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        String roleStr = userDetails.getAuthorities().iterator().next().getAuthority();

        log.info("User logged in successfully: {} with role: {}", userDetails.getEmail(), roleStr);

        return JwtResponse.builder()
                .token(jwt)
                .type("Bearer")
                .id(userDetails.getId())
                .fullName(userDetails.getFullName())
                .email(userDetails.getEmail())
                .role(roleStr)
                .build();
    }
}
