package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.CustomerDto;
import com.swe212.onlineshop.dtos.OrderDto;
import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.dtos.request.CreateOrderRequest;
import com.swe212.onlineshop.entity.Customer;
import com.swe212.onlineshop.entity.Order;
import com.swe212.onlineshop.entity.OrderStatus;
import com.swe212.onlineshop.entity.Product;
import com.swe212.onlineshop.exception.CustomerNotFoundException;
import com.swe212.onlineshop.exception.ProductNotFoundException;
import com.swe212.onlineshop.repository.CustomerRepository;
import com.swe212.onlineshop.repository.OrderRepository;
import com.swe212.onlineshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final CustomerRepository customerRepository;
    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public List<OrderDto> getAllOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(order -> {
                    OrderDto orderDto = modelMapper.map(order, OrderDto.class);
                    ProductDto productDto = modelMapper.map(order.getProduct(), ProductDto.class);
                    CustomerDto customerDto = modelMapper.map(order.getCustomer(), CustomerDto.class);

                    customerDto.setOrders(null);
                    orderDto.setProduct(productDto);
                    orderDto.setCustomer(customerDto);

                    return orderDto;
                })
                .toList();
    }

    public OrderDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sipariş bulunamadı: " + id));
        OrderDto orderDto = modelMapper.map(order, OrderDto.class);
        ProductDto productDto = modelMapper.map(order.getProduct(), ProductDto.class);
        CustomerDto customerDto = modelMapper.map(order.getCustomer(), CustomerDto.class);
        customerDto.setOrders(null);
        orderDto.setProduct(productDto);
        orderDto.setCustomer(customerDto);

        return orderDto;
    }


    public String deleteOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Sipariş bulunamadı: " + id));

        orderRepository.delete(order);
        return String.format("Order with id %s deleted successfully.", id);
    }


    public String createOrder(CreateOrderRequest createOrderRequest){
        Long productId = createOrderRequest.getProductId();
        Long customerId = createOrderRequest.getCustomerId();

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ProductNotFoundException(String.format("Product with the id: %d not found.", productId)));

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException(String.format("User with the id %d not found: ", customerId)));

        Order order = Order.builder()
                .date(LocalDateTime.now())
                .city(customer.getAddress())
                .status(OrderStatus.SHIPPED)
                .customer(customer)
                .product(product)
                .build();

        orderRepository.save(order);

        return "Order created successfully!";
    }



    @Scheduled(cron = "0 0 * * * *")
    private void updateOrderStatuses() {
        LocalDateTime timestamp = LocalDateTime.now().minusDays(1);
        List<Order> orders = orderRepository.findByStatusAndDateBefore(
                OrderStatus.SHIPPED,
                timestamp
        );

        for (Order order : orders) {
            order.setStatus(OrderStatus.DELIVERED);
            orderRepository.save(order);
        }
    }
}
