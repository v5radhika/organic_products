package com.venkatesha.organic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.venkatesha.organic.dto.AuthRequest;
import com.venkatesha.organic.dto.JwtResponse;
import com.venkatesha.organic.dto.RegisterRequest;
import com.venkatesha.organic.entity.Role;
import com.venkatesha.organic.security.JwtUtils;
import com.venkatesha.organic.service.AuthService;
import com.venkatesha.organic.security.CustomUserDetailsService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void register_Returns201() throws Exception {
        RegisterRequest registerRequest = new RegisterRequest("Test User", "test@organic.com", "password123", "9876543210", "Address", Role.ROLE_CUSTOMER);
        JwtResponse jwtResponse = JwtResponse.builder().token("jwt_token_sample").email("test@organic.com").role("ROLE_CUSTOMER").build();

        when(authService.register(any(RegisterRequest.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("jwt_token_sample"));
    }

    @Test
    void login_Returns200() throws Exception {
        AuthRequest authRequest = new AuthRequest("test@organic.com", "password123");
        JwtResponse jwtResponse = JwtResponse.builder().token("jwt_token_sample").email("test@organic.com").role("ROLE_CUSTOMER").build();

        when(authService.login(any(AuthRequest.class))).thenReturn(jwtResponse);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(authRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token").value("jwt_token_sample"));
    }
}
