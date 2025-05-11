package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.response.OrderDto;
import com.swe212.onlineshop.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orderDtos = orderService.getAllOrders();
        return ResponseEntity.ok(orderDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto orderDto = orderService.getOrderById(id);
        return ResponseEntity.ok(orderDto);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Long id) {
        String message = orderService.deleteOrderById(id);
        return ResponseEntity.ok(message);
    }
}
