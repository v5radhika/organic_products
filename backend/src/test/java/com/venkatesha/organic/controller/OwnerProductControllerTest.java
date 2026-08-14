package com.venkatesha.organic.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.venkatesha.organic.dto.ProductDto;
import com.venkatesha.organic.dto.ProductRequest;
import com.venkatesha.organic.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class OwnerProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ProductService productService;

    @Test
    @WithMockUser(authorities = "ROLE_OWNER")
    void createProduct_AsOwner_Success() throws Exception {
        ProductRequest request = ProductRequest.builder()
                .name("Organic Ghee")
                .price(new BigDecimal("500.00"))
                .stockQuantity(10)
                .organic(true)
                .active(true)
                .build();

        ProductDto dto = ProductDto.builder()
                .id(1L)
                .name("Organic Ghee")
                .price(new BigDecimal("500.00"))
                .stockQuantity(10)
                .organic(true)
                .active(true)
                .build();

        when(productService.createProduct(any(ProductRequest.class))).thenReturn(dto);

        mockMvc.perform(post("/api/v1/owner/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Organic Ghee"));
    }

    @Test
    @WithMockUser(authorities = "ROLE_CUSTOMER")
    void createProduct_AsCustomer_Forbidden403() throws Exception {
        ProductRequest request = ProductRequest.builder()
                .name("Organic Ghee")
                .price(new BigDecimal("500.00"))
                .stockQuantity(10)
                .build();

        mockMvc.perform(post("/api/v1/owner/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
