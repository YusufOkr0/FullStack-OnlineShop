package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.OrderDto;
import com.swe212.onlineshop.dtos.request.CreateOrderRequest;
import com.swe212.onlineshop.repository.OrderRepository;
import com.swe212.onlineshop.service.OrderService;
import com.swe212.onlineshop.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final ReportService reportService;

    @GetMapping
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        List<OrderDto> orderDtos = orderService.getAllOrders();
        return ResponseEntity
                .ok(orderDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long id) {
        OrderDto orderDto = orderService.getOrderById(id);
        return ResponseEntity
                .ok(orderDto);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteOrderById(@PathVariable Long id) {
        String message = orderService.deleteOrderById(id);
        return ResponseEntity
                .ok(message);
    }


    @PostMapping("/buy")
    public ResponseEntity<String> createOrder(@RequestBody CreateOrderRequest createOrderRequest){
        String message = orderService.createOrder(createOrderRequest);
        return ResponseEntity
                .ok()
                .body(message);

    }


    @GetMapping("/{id}/receipt")
    public ResponseEntity<byte[]> getOrderReceipt(@PathVariable Long id) throws Exception {

        byte[] pdf = reportService.generateReceiptByOrderId(id);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=order_receipt.pdf")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdf);
    }
}
