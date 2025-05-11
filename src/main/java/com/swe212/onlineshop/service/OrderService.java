package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.CustomerDto;
import com.swe212.onlineshop.dtos.OrderDto;
import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.entity.Order;
import com.swe212.onlineshop.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
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
}
