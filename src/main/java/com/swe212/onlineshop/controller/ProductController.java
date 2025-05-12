package com.swe212.onlineshop.controller;

import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.dtos.request.AddProductRequest;
import com.swe212.onlineshop.dtos.request.UpdateProductRequest;
import com.swe212.onlineshop.entity.Product;
import com.swe212.onlineshop.repository.ProductRepository;
import com.swe212.onlineshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getAllProducts() {
        List<ProductDto> productDtoList = productService.getAllProducts();
        return ResponseEntity
                .ok(productDtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable(value = "id") Long id) {
        ProductDto productDto = productService.getProductById(id);
        return ResponseEntity
                .ok(productDto);
    }

    @DeleteMapping("/deleteById/{id}")
    public ResponseEntity<String> deleteProductById(@PathVariable(value = "id") Long id) {
        String message = productService.deleteProductById(id);
        return ResponseEntity
                .ok(message);
    }

    @PostMapping("/add")
    public ResponseEntity<String> addProduct(
            @RequestPart(value = "addProductRequest") AddProductRequest addProductRequest,
            @RequestPart(value = "file",required = false) MultipartFile file) {

        String message = productService.addProduct(addProductRequest, file);

        return ResponseEntity.ok(message);
    }

    @PutMapping(value = "/updateById/{id}", consumes = "multipart/form-data")
    public ResponseEntity<String> updateProductById(
            @PathVariable(value = "id") Long productId,
            @RequestPart(value = "updateProductRequest",required = false) UpdateProductRequest updateProductRequest,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {

        String message = productService.updateProductById(productId, updateProductRequest, file);

        return ResponseEntity.ok(message);
    }

    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getProductImage(@PathVariable Long id) {

        Product product = productService.getProductForImageById(id);

        return ResponseEntity
                .ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(product.getImageBytes());


    }
}
