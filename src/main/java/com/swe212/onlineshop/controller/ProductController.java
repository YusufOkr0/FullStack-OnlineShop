package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> productDtoList = productService.getAllProducts();
        return ResponseEntity.ok(productDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable(value = "id") Long id) {
        ProductDto productDto = productService.getProductById(id);
        return ResponseEntity.ok(productDto);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteProductById(@PathVariable(value = "id") Long id) {
        String message = productService.deleteProductById(id);
        return ResponseEntity.ok(message);
    }
}
