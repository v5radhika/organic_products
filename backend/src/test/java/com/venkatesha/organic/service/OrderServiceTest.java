package com.venkatesha.organic.service;

import com.venkatesha.organic.dto.CreateOrderRequest;
import com.venkatesha.organic.dto.OrderDto;
import com.venkatesha.organic.entity.*;
import com.venkatesha.organic.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CartRepository cartRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private NotificationService notificationService;

    @Mock
    private ProductService productService;

    @InjectMocks
    private OrderService orderService;

    private User customer;
    private Product product;
    private Cart cart;

    @BeforeEach
    void setUp() {
        customer = User.builder().id(1L).fullName("Customer One").email("cust@organic.com").build();
        product = Product.builder().id(2L).name("Organic Honey").price(new BigDecimal("300.00")).stockQuantity(10).active(true).build();

        CartItem cartItem = CartItem.builder().id(100L).product(product).quantity(2).build();
        cart = Cart.builder().id(50L).user(customer).items(new ArrayList<>()).build();
        cart.getItems().add(cartItem);
        cartItem.setCart(cart);
    }

    @Test
    void createOrder_Success() {
        CreateOrderRequest request = new CreateOrderRequest("123 Street", "9876543210");

        when(userRepository.findById(1L)).thenReturn(Optional.of(customer));
        when(cartRepository.findByUserId(1L)).thenReturn(Optional.of(cart));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> {
            Order o = invocation.getArgument(0);
            o.setId(99L);
            return o;
        });

        OrderDto orderDto = orderService.createOrder(1L, request);

        assertNotNull(orderDto);
        assertEquals(99L, orderDto.getId());
        assertEquals(new BigDecimal("600.00"), orderDto.getTotalAmount());
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(notificationService, times(1)).createAndSendNotification(eq(null), anyString(), anyString(), eq(NotificationType.ORDER_PLACED), eq(true));
    }

    @Test
    void updateOrderStatus_Success() {
        Order order = Order.builder()
                .id(99L)
                .customer(customer)
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("600.00"))
                .items(new ArrayList<>())
                .build();

        when(orderRepository.findById(99L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderDto dto = orderService.updateOrderStatus(99L, OrderStatus.CONFIRMED);

        assertNotNull(dto);
        assertEquals(OrderStatus.CONFIRMED, dto.getStatus());
        verify(notificationService, times(1)).createAndSendNotification(eq(customer), anyString(), anyString(), eq(NotificationType.ORDER_STATUS_CHANGED), eq(false));
    }
}
