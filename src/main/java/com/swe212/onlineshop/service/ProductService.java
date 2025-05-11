package com.swe212.onlineshop.service;

import com.swe212.onlineshop.dtos.ProductDto;
import com.swe212.onlineshop.dtos.request.AddProductRequest;
import com.swe212.onlineshop.dtos.request.UpdateProductRequest;
import com.swe212.onlineshop.entity.Product;
import com.swe212.onlineshop.exception.ProductNotFoundException;
import com.swe212.onlineshop.exception.TakenProductNameException;
import com.swe212.onlineshop.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ModelMapper modelMapper;

    public List<ProductDto> getAllProducts() {
        List<Product> products = productRepository.findAll();
        return products.stream()
                .map(product -> modelMapper.map(product, ProductDto.class))
                .toList();
    }

    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + id));
        return modelMapper.map(product, ProductDto.class);
    }

    public String deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Ürün bulunamadı: " + id));
        productRepository.delete(product);
        return String.format("Product with the id %s has been deleted successfully.", id);
    }

    public String addProduct(AddProductRequest addProductRequest) {
        boolean isProductExists = productRepository.existsByName(addProductRequest.getName());
        if(isProductExists){
            throw new TakenProductNameException(String.format("Product with the username: %s already exists.", addProductRequest.getName()));
        }

        Product newProduct = Product.builder()
                .name(addProductRequest.getName())
                .supplier(addProductRequest.getSupplier())
                .price(addProductRequest.getPrice())
                .imageUrl(addProductRequest.getImageUrl())
                .build();
        productRepository.save(newProduct);
        return String.format("Product with the username: %s has been added successfully.", addProductRequest.getName());
    }

    public String updateProductById(Long id, UpdateProductRequest updateProductRequest) {
        Product productToUpdate = productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(
                        String.format("Product with the id: %d not found.", id)));

        if (!productToUpdate.getName().equals(updateProductRequest.getName())
                && productRepository.existsByName(updateProductRequest.getName())) {
            throw new TakenProductNameException(
                    String.format("Product with the name: %s already exists.", updateProductRequest.getName()));
        }

        productToUpdate.setName(updateProductRequest.getName());
        productToUpdate.setPrice(updateProductRequest.getPrice());
        productToUpdate.setSupplier(updateProductRequest.getSupplier());

        if (updateProductRequest.getImageUrl() != null) {
            productToUpdate.setImageUrl(updateProductRequest.getImageUrl());
        }

        productRepository.save(productToUpdate);

        return String.format("Product with the name: %s has been updated successfully.", updateProductRequest.getName());
    }

}
